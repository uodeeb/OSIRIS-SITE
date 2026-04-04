import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import * as db from "../db";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  assets: publicProcedure.query(async () => {
    const assets = await db.listAssets();
    return { assets } as const;
  }),

  debug: publicProcedure.query(async () => {
    const databaseAssets = await db.listAssets();
    return {
      databaseConnected: databaseAssets.length > 0,
      assetCount: databaseAssets.length,
      sampleAssets: databaseAssets.slice(0, 5)
    } as const;
  }),

  seedAssets: publicProcedure.mutation(async () => {
    try {
      const { inlineSeed } = await import("../inlineSeed");
      await inlineSeed();
      return { success: true, message: "Assets seeded successfully" } as const;
    } catch (error) {
      console.error("Seeding failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Seeding failed: ${errorMessage}`);
    }
  }),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),
});
