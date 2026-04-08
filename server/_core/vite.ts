import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  if (typeof (crypto as any).hash !== "function") {
    (crypto as any).hash = (
      algorithm: string,
      data: crypto.BinaryLike,
      outputEncoding?: crypto.BinaryToTextEncoding
    ) => crypto.createHash(algorithm).update(data).digest(outputEncoding as any);
  }

  const { createServer: createViteServer } = await import("vite");
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const coreDir = path.dirname(fileURLToPath(import.meta.url));
      const clientTemplate = path.resolve(
        coreDir,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const coreDir = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(coreDir, "../..", "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static assets from dist/public
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
