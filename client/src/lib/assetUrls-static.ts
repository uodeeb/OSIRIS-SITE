/**
 * Static Asset URL Resolver - Phase 1 Migration
 * 
 * MIGRATED: Now serves assets from static manifest instead of database API
 * All assets are served from /generated-assets/ via Vercel Edge Network
 *
 * Usage:
 *   const videoUrl = getAssetUrl("videoBg.intro");
 *   const allVideos = getAssetsByKind("video");
 */

import assetsManifest from '../../../assets-manifest.json';

// Cache for resolved URLs
const urlCache = new Map<string, string>();

/**
 * Get asset URL from static manifest
 * Example: getAssetUrl("videoBg.intro") -> "/generated-assets/video-bg/VIDEO 01 — الشاشة الرئيسية (Intro).mp4"
 */
export function getAssetUrl(key: string): string {
  // Check cache first
  if (urlCache.has(key)) {
    return urlCache.get(key)!;
  }

  // Parse key (format: "category.assetName")
  const [category, assetName] = key.split('.');
  
  if (!category || !assetName) {
    console.warn(`Invalid asset key format: ${key}. Expected format: "category.assetName"`);
    return '';
  }

  // Look up in manifest
  const manifest = assetsManifest as any;
  const categoryData = manifest.categories[category];
  
  if (!categoryData) {
    console.warn(`Asset category not found: ${category}`);
    return '';
  }

  const assetPath = categoryData.assets[assetName];
  
  if (!assetPath) {
    console.warn(`Asset not found: ${key}`);
    return '';
  }

  // Build full URL
  const fullUrl = `${manifest.baseUrl}/${assetPath}`;
  
  // Cache and return
  urlCache.set(key, fullUrl);
  return fullUrl;
}

/**
 * Get all assets of a specific category
 * Example: getAssetsByKind("video") -> { intro: "/generated-assets/video-bg/...", ... }
 */
export function getAssetsByKind(category: string): Record<string, string> {
  const manifest = assetsManifest as any;
  const categoryData = manifest.categories[category];
  
  if (!categoryData) {
    console.warn(`Asset category not found: ${category}`);
    return {};
  }

  const baseUrl = manifest.baseUrl;
  const result: Record<string, string> = {};
  
  Object.entries(categoryData.assets).forEach(([key, path]) => {
    result[key] = `${baseUrl}/${path}`;
  });
  
  return result;
}

/**
 * Legacy ASSET_URLS object for backward compatibility
 * Maps to the new static system
 */
export const ASSET_URLS = {
  characters: getAssetsByKind('characters'),
  videoBg: getAssetsByKind('videoBg'),
  backgrounds: getAssetsByKind('backgrounds'),
  music: getAssetsByKind('music'),
  voices: getAssetsByKind('voices'),
  audio: getAssetsByKind('music'), // Alias for music
} as const;

/**
 * Check if an asset exists
 */
export function hasAsset(key: string): boolean {
  return getAssetUrl(key) !== '';
}

/**
 * Get asset metadata
 */
export function getAssetInfo(key: string): { exists: boolean; url: string; category: string } {
  const url = getAssetUrl(key);
  const [category] = key.split('.');
  
  return {
    exists: url !== '',
    url,
    category: category || 'unknown'
  };
}

/**
 * Preload multiple assets
 */
export function preloadAssets(keys: string[]): Promise<void[]> {
  const promises = keys.map(key => {
    const url = getAssetUrl(key);
    if (!url) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload: ${key}`));
      img.src = url;
    });
  });
  
  return Promise.all(promises);
}
