/**
 * Static Asset Resolution System
 * 
 * Single source of truth for asset loading.
 * Replaces: assetUrls.ts, assetOverrides.ts, staticAssets.ts
 * 
 * Usage:
 *   import { character, videoBg, audio } from '@/lib/assets';
 *   const url = character('yahya'); // Returns "/assets/characters/yahya-portrait.jpeg"
 */

// ============================================================================
// Type Definitions (inline to avoid circular dependencies during migration)
// ============================================================================

export type AssetCategory = 'character' | 'background' | 'videoBg' | 'audio' | 'voice' | 'document' | 'ui';

export interface AssetEntry {
  key: string;
  path: string;
  category: AssetCategory;
  mime: string;
  originalName: string;
  size?: number;
}

export interface AssetManifest {
  version: string;
  generatedAt: string;
  totalAssets: number;
  assets: Record<string, AssetEntry>;
}

export type AssetKey = `${AssetCategory}.${string}`;

// ============================================================================
// Manifest Loading
// ============================================================================

let manifestCache: AssetManifest | null = null;
let manifestPromise: Promise<AssetManifest> | null = null;

/**
 * Load the asset manifest from the server.
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
      console.error('[assets] Failed to load manifest:', error);
      // Return empty manifest as fallback
      return {
        version: '0.0.0',
        generatedAt: new Date().toISOString(),
        totalAssets: 0,
        assets: {},
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
 * Returns the local public path for static serving.
 * 
 * @example
 *   getAsset('character.yahya') // "/assets/characters/yahya-portrait.jpeg"
 *   getAsset('videoBg.intro')   // "/assets/video-bg/intro.mp4"
 */
export function getAsset(key: AssetKey | string): string {
  if (!manifestCache) {
    console.warn(`[assets] Manifest not loaded. Call loadAssetManifest() first.`);
    return '';
  }
  
  const asset = manifestCache.assets[key];
  if (!asset) {
    console.warn(`[assets] Asset not found: ${key}`);
    return '';
  }
  
  return asset.path;
}

/**
 * Get asset entry with full metadata
 */
export function getAssetEntry(key: AssetKey | string): AssetEntry | null {
  if (!manifestCache) return null;
  return manifestCache.assets[key] || null;
}

/**
 * Get all assets in a category
 */
export function getAssetsByCategory(category: string): AssetEntry[] {
  if (!manifestCache) return [];
  
  return Object.values(manifestCache.assets).filter(
    asset => asset.category === category
  );
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
  const urls = keys.map(key => getAsset(key)).filter(Boolean);
  await Promise.allSettled(urls.map(url => preloadImage(url)));
}

// ============================================================================
// Convenience exports for common asset categories
// ============================================================================

/**
 * Get character portrait URL
 * @example character('yahya') // "/assets/characters/yahya-portrait.jpeg"
 */
export function character(name: string): string {
  return getAsset(`character.${name}` as AssetKey);
}

/**
 * Get video background URL
 * @example videoBg('intro') // "/assets/video-bg/intro.mp4"
 */
export function videoBg(name: string): string {
  return getAsset(`videoBg.${name}` as AssetKey);
}

/**
 * Get background image URL
 * @example background('osiris_cosmic') // "/assets/images/osiris_cosmic.jpg"
 */
export function background(name: string): string {
  return getAsset(`background.${name}` as AssetKey);
}

/**
 * Get audio/music track URL
 * @example audio('main_theme') // "/assets/music-tracks/main-theme.mp3"
 */
export function audio(name: string): string {
  return getAsset(`audio.${name}` as AssetKey);
}

/**
 * Get voice narration URL
 * @example voice('yahya_monologue') // "/assets/voices/..."
 */
export function voice(name: string): string {
  return getAsset(`voice.${name}` as AssetKey);
}

// ============================================================================
// Legacy compatibility (for gradual migration)
// ============================================================================

/**
 * @deprecated Use getAsset() or category helpers instead
 */
export const ASSET_URLS = {
  get characters() {
    return createCategoryProxy('character');
  },
  get videoBg() {
    return createCategoryProxy('videoBg');
  },
  get backgrounds() {
    return createCategoryProxy('background');
  },
  get audio() {
    return createCategoryProxy('audio');
  },
};

function createCategoryProxy(category: string) {
  return new Proxy({}, {
    get(_, prop) {
      const key = `${category}.${String(prop)}`;
      return getAsset(key);
    },
  });
}

// Default export
export default {
  loadAssetManifest,
  getManifest,
  isManifestLoaded,
  getAsset,
  getAssetEntry,
  getAssetsByCategory,
  preloadImage,
  preloadAssets,
  character,
  videoBg,
  background,
  audio,
  voice,
  ASSET_URLS,
};
