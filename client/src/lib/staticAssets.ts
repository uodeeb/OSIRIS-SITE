/**
 * Static Asset Resolution System
 * 
 * Replaces the dynamic assetOverrides.ts Proxy system with static manifest lookup.
 * For Vercel deployment with optimized performance.
 * 
 * @see project_history/02_architecture_asset_plan.md — Section 1.3
 * @example
 * // BEFORE (dynamic proxy):
 * import { ASSET_URLS } from './assetOverrides';
 * const url = ASSET_URLS.characters.neferhotep.default;
 * 
 * // AFTER (static lookup):
 * import { getAssetUrl } from './staticAssets';
 * const url = getAssetUrl('character.neferhotep');
 */

/**
 * @deprecated This module is deprecated. Use client/src/lib/assets.ts instead.
 * This incomplete static system is replaced by the full assets.ts implementation.
 */

import type { AssetManifest, AssetEntry, AssetKey } from '@/types/asset-manifest';

// Global manifest cache
let manifestCache: AssetManifest | null = null;
let manifestPromise: Promise<AssetManifest> | null = null;

/**
 * Load the asset manifest from the public directory.
 * Called once on app initialization.
 */
export async function loadAssetManifest(): Promise<AssetManifest> {
  if (manifestCache) return manifestCache;
  if (manifestPromise) return manifestPromise;
  
  manifestPromise = fetch('/asset-manifest.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load asset manifest: ${response.status}`);
      }
      return response.json();
    })
    .then(manifest => {
      manifestCache = manifest;
      return manifest;
    })
    .catch(error => {
      console.error('[staticAssets] Failed to load manifest:', error);
      // Return empty manifest as fallback
      return {
        version: '0.0.0',
        generatedAt: new Date().toISOString(),
        totalAssets: 0,
        assets: {},
        categories: { character: [], background: [], audio: [], document: [], ui: [] }
      } as AssetManifest;
    });
  
  return manifestPromise;
}

/**
 * Synchronous manifest access (only after loadAssetManifest() has resolved)
 */
export function getManifest(): AssetManifest | null {
  return manifestCache;
}

/**
 * Check if manifest is loaded
 */
export function isManifestLoaded(): boolean {
  return manifestCache !== null;
}

/**
 * Get asset URL by key.
 * Returns the local public path for Vercel static serving.
 */
export function getAssetUrl(key: string): string | null {
  if (!manifestCache) {
    console.warn(`[staticAssets] Manifest not loaded. Call loadAssetManifest() first.`);
    return null;
  }
  
  const asset = manifestCache.assets[key];
  if (!asset) {
    console.warn(`[staticAssets] Asset not found: ${key}`);
    return null;
  }
  
  return asset.publicPath;
}

/**
 * Get asset entry with full metadata
 */
export function getAsset(key: string): AssetEntry | null {
  if (!manifestCache) return null;
  return manifestCache.assets[key] || null;
}

/**
 * Get all assets in a category
 */
export function getAssetsByCategory(category: AssetEntry['category']): AssetEntry[] {
  if (!manifestCache) return [];
  
  const keys = manifestCache.categories[category] || [];
  return keys.map(key => manifestCache!.assets[key]).filter(Boolean);
}

/**
 * Preload an image asset
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
    img.src = url;
  });
}

/**
 * Preload multiple assets
 */
export async function preloadAssets(keys: string[]): Promise<void> {
  const urls = keys.map(key => getAssetUrl(key)).filter(Boolean) as string[];
  
  await Promise.allSettled(urls.map(url => preloadImage(url)));
}

// Convenience object with getters for common asset patterns
export const staticAssets = {
  character: {
    get: (name: string) => getAssetUrl(`character.${name}`),
  },
  background: {
    get: (name: string) => getAssetUrl(`background.${name}`),
  },
  audio: {
    get: (name: string) => getAssetUrl(`audio.${name}`),
  },
  document: {
    get: (name: string) => getAssetUrl(`document.${name}`),
  },
  ui: {
    get: (name: string) => getAssetUrl(`ui.${name}`),
  },
};

export default {
  loadAssetManifest,
  getManifest,
  isManifestLoaded,
  getAssetUrl,
  getAsset,
  getAssetsByCategory,
  preloadImage,
  preloadAssets,
  staticAssets,
};
