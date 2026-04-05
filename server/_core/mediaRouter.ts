import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router, TRPCError } from "./trpc";
import { getDb } from "../db";
import { assets } from "../../drizzle/schema";

// Simple in-memory cache for asset metadata (server-cache-lru best practice)
// Using Map instead of lru-cache to avoid new dependency
const assetCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL
const MAX_CACHE_SIZE = 1000;

function getCachedAsset(key: string): any | null {
  const cached = assetCache.get(key);
  if (!cached) return null;
  
  // Check if expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    assetCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCachedAsset(key: string, data: any): void {
  // Implement simple LRU by deleting oldest if over limit
  if (assetCache.size >= MAX_CACHE_SIZE) {
    const firstKey = assetCache.keys().next().value;
    if (firstKey) {
      assetCache.delete(firstKey);
    }
  }
  
  assetCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Media Router - Serves asset URLs from database
 * 
 * Endpoints:
 * - GET /api/media/getAsset?key=videoBg.intro
 * - GET /api/media/listAssets
 * - GET /api/media/listByKind?kind=video
 */

export const mediaRouter = router({
  /**
   * Get a single asset URL by key
   * Query: ?key=videoBg.intro
   */
  getAsset: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input, ctx }) => {
      // Check cache first (server-cache-lru best practice)
      const cached = getCachedAsset(input.key);
      if (cached) {
        console.log('[media.getAsset] Cache hit for:', input.key);
        return cached;
      }
      
      // Debug logging
      console.log('[media.getAsset] Received input:', JSON.stringify(input));
      
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      console.log('[media.getAsset] Looking for key:', input.key);
      const result = await database
        .select()
        .from(assets)
        .where(eq(assets.key, input.key))
        .limit(1);

      console.log('[media.getAsset] Query result:', result.length, 'rows');

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Asset not found: ${input.key}`,
        });
      }

      // Minimize data serialization (server-serialization best practice)
      const response = { 
        key: result[0].key, 
        kind: result[0].kind, 
        url: result[0].url, 
        mime: result[0].mime 
      };
      
      // Cache the result
      setCachedAsset(input.key, response);
      
      return response;
    }),

  /**
   * List all assets
   */
  listAssets: publicProcedure.query(async () => {
    const database = await getDb();
    if (!database) {
      return [];
    }

    return database.select().from(assets);
  }),

  /**
   * List assets by kind (audio, video, background, character, etc.)
   * Query: ?kind=video
   */
  listByKind: publicProcedure
    .input(z.object({ kind: z.enum(["audio", "video", "background", "character", "document", "ui"]) }))
    .query(async ({ input }) => {
      const database = await getDb();
      if (!database) {
        return [];
      }

      return database
        .select()
        .from(assets)
        .where(eq(assets.kind, input.kind));
    }),
});
