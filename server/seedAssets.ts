import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ASSET_URLS } from "../client/src/lib/assetUrls";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../drizzle/schema";
import { upsertAsset } from "../server/db.js";
import mime from "mime-types";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Database connection for seeding
async function getSeedDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool, { schema });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const S3_CONFIG = {
  bucket: process.env.S3_BUCKET_NAME || "osiris-novel-assets",
  region: process.env.AWS_REGION || "us-east-1",
  basePath: "assets",
};

const s3Client = new S3Client({
  region: S3_CONFIG.region,
  endpoint: process.env.S3_ENDPOINT || undefined, // R2 requires explicit endpoint
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function uploadToS3(localPath: string, s3Key: string): Promise<string> {
  const fullPath = path.join(rootDir, localPath);
  
  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`File not found: ${localPath}`);
  }

  const content = await fs.readFile(fullPath);
  const mimeType = mime.lookup(fullPath) || "application/octet-stream";

  // Check if already exists
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: s3Key,
    }));
    console.log(`  [S3 SKIP] Already exists: ${s3Key}`);
    return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${s3Key}`;
  } catch {
    // Doesn't exist, upload
  }

  await s3Client.send(new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: s3Key,
    Body: content,
    ContentType: mimeType,
  }));

  console.log(`  [S3 UPLOADED] ${s3Key}`);
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${s3Key}`;
}

function isLocalPath(url: string): boolean {
  return url.startsWith("/") || url.startsWith("./") || !url.startsWith("http");
}

function getS3KeyFromUrl(url: string): string {
  // Convert local path to S3 key
  // /generated-assets/video-bg/VIDEO 01.mp4 → assets/video/intro
  const urlMap: Record<string, string> = {
    "videoBg.intro": "video/intro",
    "videoBg.yahya_room": "video/yahya-room",
    "videoBg.cosmic_opening": "video/cosmic-opening",
    "videoBg.tarek_rooftop": "video/tarek-rooftop",
    "videoBg.sinai_desert": "video/sinai-desert",
    "videoBg.molten_gold": "video/molten-gold",
    "videoBg.nicaea": "video/nicaea",
    "videoBg.andalusia": "video/andalusia",
    "videoBg.abu_abdullah_tears": "video/abu-abdullah-tears",
    "videoBg.berlin_1933": "video/berlin-1933",
    "videoBg.karbala": "video/karbala",
    "videoBg.digital_space": "video/digital-space",
    "videoBg.enter_key": "video/enter-key",
  };
  
  // Extract from path if not in map
  const cleanPath = url.replace(/^\/generated-assets\//, "");
  const hash = cleanPath.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  return `assets/${hash.substring(0, 50)}`;
}

async function migrateLocalAsset(url: string, key: string, kind: string): Promise<string> {
  if (!isLocalPath(url)) {
    return url; // Already external URL
  }

  const localPath = url.startsWith("/") ? url.slice(1) : url;
  const s3Key = `${S3_CONFIG.basePath}/${kind}/${key.replace(/\./g, "-")}`;
  
  return await uploadToS3(localPath, s3Key);
}

function guessMime(url: string): string | null {
  if (!url) return null;
  const clean = url.split("?")[0]?.toLowerCase() ?? "";
  if (clean.endsWith(".mp3")) return "audio/mpeg";
  if (clean.endsWith(".wav")) return "audio/wav";
  if (clean.endsWith(".m4a")) return "audio/mp4";
  if (clean.endsWith(".mp4")) return "video/mp4";
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  if (clean.endsWith(".webp")) return "image/webp";
  return mime.lookup(url) || null;
}

async function main() {
  console.log("=".repeat(60));
  console.log("OSIRIS ASSET MIGRATION (S3 + DB)");
  console.log("=".repeat(60));
  console.log(`S3 Bucket: ${S3_CONFIG.bucket}`);
  console.log(`Region: ${S3_CONFIG.region}`);
  console.log("-".repeat(60));

  const entries: Array<{ key: string; kind: any; url: string; mime: string | null; bytes?: number }> = [];

  // Process each asset category
  for (const [k, url] of Object.entries(ASSET_URLS.audio) as Array<[string, string]>) {
    // Fix path: /music/TRACK-01.mp3 -> generated-assets/music-tracks/TRACK-01.mp3
    const fixedUrl = url.replace("/music/", "generated-assets/music-tracks/");
    const migratedUrl = await migrateLocalAsset(fixedUrl, `audio-${k}`, "audio");
    entries.push({ key: `audio.${k}`, kind: "audio", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  for (const [k, url] of Object.entries(ASSET_URLS.video) as Array<[string, string]>) {
    const migratedUrl = await migrateLocalAsset(url, `video-${k}`, "video");
    entries.push({ key: `video.${k}`, kind: "video", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  for (const [k, url] of Object.entries(ASSET_URLS.videoBg) as Array<[string, string]>) {
    const migratedUrl = await migrateLocalAsset(url, `videoBg-${k}`, "video");
    entries.push({ key: `videoBg.${k}`, kind: "video", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  for (const [k, url] of Object.entries(ASSET_URLS.backgrounds) as Array<[string, string]>) {
    const migratedUrl = await migrateLocalAsset(url, `background-${k}`, "background");
    entries.push({ key: `background.${k}`, kind: "background", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  for (const [k, url] of Object.entries(ASSET_URLS.characters) as Array<[string, string]>) {
    const migratedUrl = await migrateLocalAsset(url, `character-${k}`, "character");
    entries.push({ key: `character.${k}`, kind: "character", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  for (const [k, url] of Object.entries(ASSET_URLS.documents) as Array<[string, string]>) {
    const migratedUrl = await migrateLocalAsset(url, `document-${k}`, "document");
    entries.push({ key: `document.${k}`, kind: "document", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  for (const [k, url] of Object.entries(ASSET_URLS.ui) as Array<[string, string]>) {
    const migratedUrl = await migrateLocalAsset(url, `ui-${k}`, "ui");
    entries.push({ key: `ui.${k}`, kind: "ui", url: migratedUrl, mime: guessMime(migratedUrl) });
  }

  console.log("-".repeat(60));
  console.log(`Migrating ${entries.length} assets to database...`);
  console.log("-".repeat(60));

  let success = 0;
  for (const entry of entries) {
    try {
      const db = await getSeedDb();
      await db.insert(schema.assets).values({
        key: entry.key,
        kind: entry.kind,
        url: entry.url,
        mime: entry.mime,
        bytes: entry.bytes || null,
      }).onConflictDoUpdate({
        target: schema.assets.key,
        set: {
          kind: entry.kind,
          url: entry.url,
          mime: entry.mime,
          bytes: entry.bytes || null,
        },
      });
      console.log(`[DB] Registered: ${entry.key}`);
      success++;
    } catch (error) {
      console.error(`[DB FAIL] ${entry.key}:`, error);
    }
  }

  console.log("=".repeat(60));
  console.log(`MIGRATION COMPLETE: ${success}/${entries.length} assets`);
  console.log("=".repeat(60));
  console.log("\nNEXT STEPS:");
  console.log("1. Update client/src/lib/assetUrls.ts to use API endpoints");
  console.log("2. Test: npm run dev");
  console.log("3. Remove local assets from git history");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
