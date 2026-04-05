/**
 * Migration script to standardize all asset URLs to Cloudflare R2
 * 
 * This script:
 * 1. Fetches all assets from the database
 * 2. Updates any non-R2 URLs to R2 format
 * 3. Handles Cloudfront URLs and local paths
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { assets } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { generateR2UrlFromAsset } from "./lib/r2";

dotenv.config({ path: ".env.local" });

const R2_ENDPOINT = process.env.S3_ENDPOINT || "";

async function migrateToR2() {
  console.log("🔄 Starting R2 URL migration...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    return;
  }

  if (!R2_ENDPOINT) {
    console.error("❌ S3_ENDPOINT not set");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  // Fetch all assets
  const allAssets = await db.select().from(assets);
  console.log(`📊 Found ${allAssets.length} assets in database`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const asset of allAssets) {
    try {
      // Check if URL is already R2
      if (asset.url && asset.url.includes(R2_ENDPOINT)) {
        console.log(`⏭️  Skipped (already R2): ${asset.key}`);
        skippedCount++;
        continue;
      }

      // Generate new R2 URL
      const r2Url = generateR2UrlFromAsset({
        key: asset.key,
        kind: asset.kind,
        mime: asset.mime || undefined,
      });

      // Update the asset
      await db.update(assets)
        .set({ 
          url: r2Url,
          updatedAt: new Date(),
        })
        .where(eq(assets.key, asset.key));

      console.log(`✅ Updated: ${asset.key}`);
      console.log(`   Old: ${asset.url}`);
      console.log(`   New: ${r2Url}`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Failed to update: ${asset.key}`, error);
      errorCount++;
    }
  }

  await pool.end();
  
  console.log("\n📊 Migration Summary:");
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${allAssets.length}`);
  
  if (errorCount === 0) {
    console.log("🎉 Migration complete! All assets now use R2 URLs.");
  } else {
    console.log("⚠️  Migration completed with errors.");
  }
}

migrateToR2().catch(console.error);
