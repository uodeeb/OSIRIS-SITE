// Quick inline database seeding with Cloudflare R2 URLs
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { assets } from "../drizzle/schema";
import * as dotenv from "dotenv";
import { generateR2UrlFromAsset, isR2Configured } from "./lib/r2";

dotenv.config({ path: ".env.local" });

async function inlineSeed() {
  console.log("🌱 Starting inline database seeding...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    return;
  }

  if (!isR2Configured()) {
    console.error("❌ R2 not configured. Please set S3_ENDPOINT and AWS_ACCESS_KEY_ID");
    return;
  }

  console.log("📡 Connecting to database...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log("✅ Pool created");
  const db = drizzle(pool);
  console.log("✅ Drizzle initialized");

  // Asset definitions (keys, kinds, mime types - URLs will be R2)
  const assetDefinitions = [
    // Video backgrounds
    { key: "videoBg.yahya_room", kind: "video" as const, mime: "video/mp4" },
    { key: "videoBg.sinai_desert", kind: "video" as const, mime: "video/mp4" },
    { key: "videoBg.andalusia", kind: "video" as const, mime: "video/mp4" },
    { key: "videoBg.karbala", kind: "video" as const, mime: "video/mp4" },
    
    // Character assets
    { key: "character.narrator", kind: "character" as const, mime: "image/png" },
    { key: "character.yahya", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.yahya_breakdown", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.yahya_confront", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.laila", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.laila_faith", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.laila_witness", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.tarek", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.tarek_ghost", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.first_engineer", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.arius", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.athanasius", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.samiri", kind: "character" as const, mime: "image/jpeg" },
    { key: "character.constantine", kind: "character" as const, mime: "image/jpeg" },
    
    // Scene backgrounds
    { key: "sceneBg.zero-1-1-summons", kind: "background" as const, mime: "image/jpeg" },
    { key: "sceneBg.four-4-1-desert", kind: "background" as const, mime: "image/jpeg" },
    { key: "sceneBg.four-4-2-crowd-engineering", kind: "background" as const, mime: "image/jpeg" },
    
    // Background assets (migrating from CloudFront to R2)
    { key: "background.berlin_1933", kind: "background" as const, mime: "image/png" },
    { key: "background.cambodia_1975", kind: "background" as const, mime: "image/png" },
    { key: "background.corporate_lab", kind: "background" as const, mime: "image/png" },
    { key: "background.granada_fall", kind: "background" as const, mime: "image/png" },
    { key: "background.moscow_1937", kind: "background" as const, mime: "image/png" },
    { key: "background.nicaea_council", kind: "background" as const, mime: "image/png" },
    { key: "background.osiris_cosmic", kind: "background" as const, mime: "image/png" },
    { key: "background.osiris_interface", kind: "background" as const, mime: "image/png" },
    { key: "background.pharaoh_temple", kind: "background" as const, mime: "image/png" },
    { key: "background.qabil_habil_aftermath", kind: "background" as const, mime: "image/png" },
    { key: "background.qabil_habil_altar", kind: "background" as const, mime: "image/png" },
    { key: "background.qabil_habil_rage", kind: "background" as const, mime: "image/png" },
    { key: "background.white_space", kind: "background" as const, mime: "image/png" },
    { key: "background.yahya_apartment", kind: "background" as const, mime: "image/png" },
    
    // Audio
    { key: "audio.main_theme", kind: "audio" as const, mime: "audio/mpeg" },
  ];

  let successCount = 0;
  for (const assetDef of assetDefinitions) {
    try {
      // Generate R2 URL for this asset
      const r2Url = generateR2UrlFromAsset(assetDef);
      
      await db.insert(assets).values({
        key: assetDef.key,
        kind: assetDef.kind,
        url: r2Url,
        mime: assetDef.mime,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: assets.key,
        set: {
          kind: assetDef.kind,
          url: r2Url,
          mime: assetDef.mime,
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Seeded: ${assetDef.key} -> ${r2Url}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${assetDef.key}`, error);
    }
  }

  await pool.end();
  console.log(`🎉 Seeding complete! ${successCount}/${assetDefinitions.length} assets added.`);
  console.log(`🌐 All assets use Cloudflare R2 storage`);
}

// Export for potential import
export { inlineSeed };

// Always run when executed
inlineSeed().catch(console.error);
