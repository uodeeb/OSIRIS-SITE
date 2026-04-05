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
  
  // Custom middleware to handle tRPC query parameter format
  app.use("/api/trpc", (req, res, next) => {
    // Log all tRPC requests for debugging
    console.log(`[tRPC Middleware] ${req.method} ${req.path}`);
    console.log(`[tRPC Middleware] Query:`, req.query);
    
    // If input is in query string (GET request), parse it
    if (req.query.input) {
      try {
        const decoded = Buffer.from(req.query.input as string, 'base64').toString('utf-8');
        console.log(`[tRPC Middleware] Decoded input:`, decoded);
        
        // Parse the superjson format: {"json":{...},"meta":{...}}
        const parsed = JSON.parse(decoded);
        console.log(`[tRPC Middleware] Parsed input:`, parsed);
        
        // For tRPC Express adapter, we need to handle the input differently
        // The adapter expects the input in the body for POST, but for GET requests
        // it might need special handling
        if (parsed.json) {
          // Set the actual input in the body for tRPC to use
          req.body = parsed.json;
          // Also keep it in query for tRPC's GET handling
          req.query.input = JSON.stringify(parsed.json);
        } else {
          req.body = parsed;
          req.query.input = JSON.stringify(parsed);
        }
      } catch (error) {
        console.error(`[tRPC Middleware] Failed to parse input:`, error);
        return res.status(400).json({ error: 'Invalid input format' });
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
