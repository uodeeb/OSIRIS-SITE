import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

// ─── Rate Limiter (simple in-memory, no external deps) ───────────────────────
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function rateLimitMiddleware(windowMs: number, maxRequests: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      rateLimitMap.set(ip, entry);
    }

    entry.count++;
    res.setHeader("X-RateLimit-Limit", String(maxRequests));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, maxRequests - entry.count)));
    res.setHeader("X-RateLimit-Reset", String(entry.resetAt));

    if (entry.count > maxRequests) {
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    next();
  };
}

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt + 60_000) rateLimitMap.delete(key);
  }
}, 5 * 60_000);

// ─── CORS Configuration ──────────────────────────────────────────────────────
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "https://osirisnovel.online",
  "http://localhost:3000",
  "http://localhost:5173",
];

function corsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// ─── Server Startup ──────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  const server = createServer(app);
  const serverDir = path.dirname(fileURLToPath(import.meta.url));
  const isProd = process.env.NODE_ENV === "production";

  // Security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    // HSTS in all non-development modes
    if (process.env.NODE_ENV !== "development") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });

  // CORS
  app.use(corsMiddleware);

  // Rate limiting: 100 req/15min for general API, stricter for OAuth
  app.use("/api/", rateLimitMiddleware(15 * 60 * 1000, 100));
  app.use("/api/oauth/", rateLimitMiddleware(60 * 1000, 10));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Health check endpoint (for Docker & monitoring)
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
  });

  // Static asset serving with dotfiles denied
  const generatedMusicPath = path.resolve(serverDir, "..", "..", "generated-assets", "music-tracks");
  const generatedVoicesPath = path.resolve(serverDir, "..", "..", "generated-assets", "voices");
  const legacyMusicPath = path.resolve(serverDir, "..", "..", "MUSIC-BG");
  const generatedVideoBgPath = path.resolve(serverDir, "..", "..", "generated-assets", "video-bg");
  const legacyVideoBgPath = path.resolve(serverDir, "..", "..", "video-bg");
  const scriptPath = path.resolve(serverDir, "..", "..", "script");

  const staticOpts = { dotfiles: "deny" as const, index: false };
  app.use("/music", express.static(generatedMusicPath, staticOpts));
  app.use("/music", express.static(generatedVoicesPath, staticOpts));
  app.use("/video-bg", express.static(generatedVideoBgPath, staticOpts));
  if (process.env.NODE_ENV === "development") {
    app.use("/music", express.static(legacyMusicPath, staticOpts));
    app.use("/video-bg", express.static(legacyVideoBgPath, staticOpts));
  }
  app.use("/script", express.static(scriptPath, staticOpts));
  app.use(
    "/generated-assets",
    express.static(path.resolve(serverDir, "..", "..", "generated-assets"), staticOpts)
  );

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // tRPC input parsing middleware (production-safe logging)
  app.use("/api/trpc", (req, res, next) => {
    if (req.method === "GET" && req.query.input) {
      try {
        const inputStr = typeof req.query.input === "string"
          ? req.query.input
          : Array.isArray(req.query.input)
            ? req.query.input[0]
            : "";

        if (typeof inputStr === "string" && inputStr) {
          // Only log in development
          if (!isProd) {
            console.log("[tRPC] Raw input:", inputStr.substring(0, 50));
          }
          const decoded = Buffer.from(inputStr, "base64").toString("utf-8");
          const parsed = JSON.parse(decoded);
          const newInput = encodeURIComponent(JSON.stringify(parsed));
          const originalUrl = req.url || "";
          const newUrl = originalUrl.replace(
            `input=${encodeURIComponent(inputStr)}`,
            `input=${newInput}`
          );
          req.url = newUrl;
          req.query.input = parsed;
        }
      } catch (error) {
        // Silently fail — malformed input should not break the request
        if (!isProd) console.error("[tRPC] Failed to parse input:", error);
      }
    }
    next();
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      allowBatching: true,
      allowMethodOverride: true,
      onError: ({ error, path, type }) => {
        // Sanitized error logging — never log stack traces or internal details in production
        if (isProd) {
          console.error(`[tRPC] ${type} ${path} - ${error.code}`);
        } else {
          console.error(`[tRPC] ${type} ${path} - Error:`, error.message);
        }
      },
    })
  );

  // Development vs production static serving
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
