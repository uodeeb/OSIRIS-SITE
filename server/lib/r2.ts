/**
 * Cloudflare R2 Storage Utilities
 * 
 * R2 uses S3-compatible API but with different URL format
 */

import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const R2_CONFIG = {
  endpoint: process.env.S3_ENDPOINT || "",
  bucket: process.env.S3_BUCKET_NAME || "osiris-novel-assets",
  region: process.env.AWS_REGION || "auto",
};

/**
 * Generate a public R2 URL for an asset
 * Format: {endpoint}/{bucket}/assets/{kind}/{filename}
 */
export function generateR2Url(key: string, kind: string, filename?: string): string {
  // Extract filename from key if not provided
  const actualFilename = filename || key.split(".").pop() || key;
  
  // Determine file extension based on mime type or key
  const extension = getExtensionFromKey(key, kind);
  
  // Build the path: assets/{kind}/{key}.{ext}
  const path = `assets/${kind}/${key}${extension}`;
  
  // Full URL: endpoint/bucket/path
  const url = `${R2_CONFIG.endpoint}/${R2_CONFIG.bucket}/${path}`;
  
  return url;
}

/**
 * Get file extension from asset key and kind
 */
function getExtensionFromKey(key: string, kind: string): string {
  // If key already has extension, use it
  if (key.includes(".")) {
    const parts = key.split(".");
    const ext = parts[parts.length - 1];
    if (ext && ext.length <= 4) {
      return "";
    }
  }
  
  // Default extensions by kind
  switch (kind) {
    case "character":
      return ".jpg";
    case "video":
      return ".mp4";
    case "audio":
      return ".mp3";
    case "background":
      return ".jpg";
    default:
      return "";
  }
}

/**
 * Generate R2 URL from existing asset info
 */
export function generateR2UrlFromAsset(asset: {
  key: string;
  kind: string;
  mime?: string;
}): string {
  // Determine extension from mime type
  let extension = "";
  if (asset.mime) {
    extension = getExtensionFromMime(asset.mime);
  }
  
  // Build the path
  const path = `assets/${asset.kind}/${asset.key}${extension}`;
  
  return `${R2_CONFIG.endpoint}/${R2_CONFIG.bucket}/${path}`;
}

function getExtensionFromMime(mime: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/ogg": ".ogg",
  };
  
  return mimeToExt[mime] || "";
}

/**
 * Check if R2 is configured
 */
export function isR2Configured(): boolean {
  return !!R2_CONFIG.endpoint && !!process.env.AWS_ACCESS_KEY_ID;
}

/**
 * Get R2 configuration
 */
export function getR2Config() {
  return R2_CONFIG;
}
