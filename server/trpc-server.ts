/**
 * tRPC Server Setup for Vite Development
 * 
 * This file sets up the tRPC server middleware for the Vite development server
 * to handle API requests to /api/trpc/*
 */

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

// Create middleware once to avoid recreation on every request
let trpcMiddleware: ReturnType<typeof createExpressMiddleware> | null = null;

function getTrpcMiddleware() {
  if (!trpcMiddleware) {
    trpcMiddleware = createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ error, path, type }) => {
        console.error(`[tRPC] ${type} ${path} - Error:`, error);
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          console.error('[tRPC] Internal Server Error Details:', error.cause);
        }
      },
    });
  }
  return trpcMiddleware;
}

/**
 * Vite middleware to handle tRPC requests
 */
export function viteTrpcPlugin() {
  return async (req: any, res: any, next: any) => {
    if (req.url?.startsWith('/api/trpc')) {
      try {
        console.log('[tRPC] Handling request:', req.url);
        const middleware = getTrpcMiddleware();
        // Call the middleware with proper Express-like request/response objects
        await middleware(req, res, next);
        console.log('[tRPC] Request completed:', req.url);
      } catch (error) {
        console.error('[tRPC] Middleware error:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    } else {
      next();
    }
  };
}
