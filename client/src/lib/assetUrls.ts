/**
 * @deprecated This module is deprecated and will be removed.
 * All exports now redirect to the new static asset system in assets.ts
 * 
 * Migration guide:
 * - Replace `import { ASSET_URLS } from '@/lib/assetUrls'` with `import { getAsset } from '@/lib/assets'`
 * - Replace `ASSET_URLS.characters.yahya` with `getAsset('character.yahya')`
 * - Replace `ASSET_URLS.videoBg.intro` with `getAsset('videoBg.intro')`
 * - Replace `ASSET_URLS.audio.main_theme` with `getAsset('audio.main_theme')`
 * - Replace `ASSET_URLS.backgrounds.berlin_1933` with `getAsset('background.berlin_1933')`
 */

import { getAsset } from './assets';

// Create a proxy that redirects all accesses to getAsset
function createCategoryProxy(category: string) {
  return new Proxy({} as Record<string, string>, {
    get(_, prop: string) {
      if (typeof prop === 'symbol') return undefined;
      const key = `${category}.${prop}`;
      const result = getAsset(key as any);
      if (!result) {
        console.warn(`[assetUrls] Asset not found: ${key}. Please migrate to getAsset('${key}')`);
      }
      return result || '';
    }
  });
}

/**
 * @deprecated Use `getAsset()` from '@/lib/assets' instead
 */
export const ASSET_URLS = {
  characters: createCategoryProxy('character'),
  videoBg: createCategoryProxy('videoBg'),
  audio: createCategoryProxy('audio'),
  backgrounds: createCategoryProxy('background'),
  // Legacy categories for backward compatibility
  video: createCategoryProxy('videoBg'), // Alias to videoBg
  documents: {} as Record<string, string>, // Empty - not used in static system
  ui: {} as Record<string, string>, // Empty - not used in static system
  projectMedia: {
    audio: createCategoryProxy('audio'),
    video: createCategoryProxy('videoBg'),
    image: createCategoryProxy('background'),
  }
} as const;

/**
 * @deprecated Use `getAsset()` from '@/lib/assets' instead
 */
export function getAssetUrl(key: string): string {
  return getAsset(key as any) || '';
}

/**
 * @deprecated Use `getAsset()` from '@/lib/assets' for each key instead
 */
export function getAssetUrls(keys: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = getAsset(key as any) || '';
  }
  return result;
}

/**
 * @deprecated Use `getAssetsByCategory()` from '@/lib/assets' instead
 */
export function getAssetsByKind(kind: string): any[] {
  const { getAssetsByCategory } = require('./assets');
  return getAssetsByCategory(kind) || [];
}

/**
 * @deprecated Use `getManifest()` from '@/lib/assets' instead
 */
export function getAllAssets(): Record<string, any> {
  const { getManifest } = require('./assets');
  const manifest = getManifest();
  return manifest?.assets || {};
}

/**
 * @deprecated Use `loadAssetManifest()` from '@/lib/assets' instead
 */
export async function initAssetUrls(): Promise<void> {
  const { loadAssetManifest } = await import('./assets');
  await loadAssetManifest();
}
