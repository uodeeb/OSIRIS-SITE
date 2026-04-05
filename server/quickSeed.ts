import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { assets } from "../drizzle/schema";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function quickSeed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Quick seeding assets...");

  const basicAssets = [
    {
      key: "videoBg.yahya_room",
      kind: "video" as const,
      url: "/generated-assets/video-bg/yehya-office-vid.mp4",
      mime: "video/mp4",
    },
    {
      key: "videoBg.sinai_desert", 
      kind: "video" as const,
      url: "/generated-assets/video-bg/desert.mp4",
      mime: "video/mp4",
    },
    {
      key: "videoBg.andalusia",
      kind: "video" as const, 
      url: "/generated-assets/video-bg/andalus.mp4",
      mime: "video/mp4",
    },
    {
      key: "videoBg.karbala",
      kind: "video" as const,
      url: "/generated-assets/video-bg/karblaa.mp4", 
      mime: "video/mp4",
    },
    {
      key: "character.narrator",
      kind: "character" as const,
      url: "/generated-assets/characters/narrator.png",
      mime: "image/png",
    },
    {
      key: "character.yahya",
      kind: "character" as const,
      url: "/generated-assets/characters/yahya.png",
      mime: "image/png", 
    },
    {
      key: "character.laila",
      kind: "character" as const,
      url: "/generated-assets/characters/laila.png",
      mime: "image/png",
    },
    {
      key: "audio.main_theme",
      kind: "audio" as const,
      url: "/generated-assets/music-tracks/TRACK-01.mp3",
      mime: "audio/mpeg",
    },
  ];

  for (const asset of basicAssets) {
    try {
      await db.insert(assets).values({
        key: asset.key,
        kind: asset.kind,
        url: asset.url,
        mime: asset.mime,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: assets.key,
        set: {
          kind: asset.kind,
          url: asset.url,
          mime: asset.mime,
          updatedAt: new Date(),
        },
      });
      console.log(`✓ Seeded: ${asset.key}`);
    } catch (error) {
      console.error(`✗ Failed: ${asset.key}`, error);
    }
  }

  await pool.end();
  console.log("Quick seeding complete!");
}

quickSeed().catch(console.error);
