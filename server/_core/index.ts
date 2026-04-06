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

async function startServer() {
  const app = express();
  const server = createServer(app);
  const serverDir = path.dirname(fileURLToPath(import.meta.url));

  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    if (process.env.NODE_ENV !== "development") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    
    // Log all requests to /api/trpc for debugging
    if (req.path.startsWith('/api/trpc')) {
      console.log(`[Express] ${req.method} ${req.path} - Query:`, req.query);
      console.log(`[Express] Headers:`, req.headers);
    }
    
    next();
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  const generatedMusicPath = path.resolve(serverDir, "..", "..", "generated-assets", "music-tracks");
  const generatedVoicesPath = path.resolve(serverDir, "..", "..", "generated-assets", "voices");
  const legacyMusicPath = path.resolve(serverDir, "..", "..", "MUSIC-BG");
  const generatedVideoBgPath = path.resolve(serverDir, "..", "..", "generated-assets", "video-bg");
  const legacyVideoBgPath = path.resolve(serverDir, "..", "..", "video-bg");
  const scriptPath = path.resolve(serverDir, "..", "..", "script");

  app.use("/music", express.static(generatedMusicPath));
  app.use("/music", express.static(generatedVoicesPath));
  app.use("/video-bg", express.static(generatedVideoBgPath));
  if (process.env.NODE_ENV === "development") {
    app.use("/music", express.static(legacyMusicPath));
    app.use("/video-bg", express.static(legacyVideoBgPath));
  }
  app.use("/script", express.static(scriptPath));
  app.use(
    "/generated-assets",
    express.static(path.resolve(serverDir, "..", "..", "generated-assets"))
  );
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Custom middleware - handle tRPC GET request input parsing
  app.use("/api/trpc", (req, res, next) => {
    // For GET requests with input query param, decode base64 superjson
    if (req.method === 'GET' && req.query.input) {
      try {
        const inputStr = typeof req.query.input === 'string' 
          ? req.query.input 
          : Array.isArray(req.query.input) 
            ? req.query.input[0] 
            : '';
        
        // Type guard to ensure inputStr is a string
        const safeInputStr = typeof inputStr === 'string' ? inputStr : '';
        
        if (safeInputStr) {
          console.log('[tRPC Middleware] Raw input:', safeInputStr.substring(0, 50));
          // Decode base64
          const decoded = Buffer.from(safeInputStr, 'base64').toString('utf-8');
          console.log('[tRPC Middleware] Decoded:', decoded.substring(0, 50));
          const parsed = JSON.parse(decoded);
          console.log('[tRPC Middleware] Parsed:', JSON.stringify(parsed).substring(0, 50));
          
          // IMPORTANT: Modify req.url to replace base64 with decoded JSON
          // tRPC reads from the URL, not req.query
          const originalUrl = req.url || '';
          const newInput = encodeURIComponent(JSON.stringify(parsed));
          const newUrl = originalUrl.replace(
            `input=${encodeURIComponent(safeInputStr)}`,
            `input=${newInput}`
          );
          req.url = newUrl;
          
          // Also update req.query for consistency
          req.query.input = parsed;
          
          console.log('[tRPC Middleware] Modified URL:', req.url.substring(0, 100));
        }
      } catch (error) {
        console.error('[tRPC Middleware] Failed to parse input:', error);
      }
    }
    next();
  });
  
  // tRPC API with GET support for asset fetching
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      allowBatching: true,
      allowMethodOverride: true,
      onError: ({ error, path, type }) => {
        console.error(`[tRPC] ${type} ${path} - Error:`, error);
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          console.error('[tRPC] Internal Server Error Details:', error.cause);
        }
      },
    })
  );
  // development mode uses Vite, production mode uses static files
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
