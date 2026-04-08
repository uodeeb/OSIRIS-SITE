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

export type AssetCategory = 'character' | 'background' | 'videoBg' | 'audio' | 'voice' | 'ambient' | 'document' | 'ui';

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

// Key aliases for backward compatibility
// Maps short keys used in code to full keys in manifest
const KEY_ALIASES: Record<string, string> = {
  // Character aliases
  'character.yahya': 'character.yahya-portrait',
  'character.yahya_main': 'character.yahya-portrait',
  'character.yahya_dying': 'character.yahya-portrait',
  'character.yahya_breakdown': 'character.yahya-breakdown',
  'character.yahya_confront': 'character.yahya-confront',
  'character.laila': 'character.laila-portrait',
  'character.laila_crying': 'character.laila-faith',
  'character.laila_faith': 'character.laila-faith',
  'character.laila_witness': 'character.laila-witness',
  'character.tarek': 'character.tarek-portrait',
  'character.tarek_ghost': 'character.tarek-ghost',
  'character.tarek_dream': 'character.tarek-dream',
  'character.narrator': 'character.narrator-visual',
  'character.first_engineer': 'character.first-engineer-portrait',
  'character.first_engineer_2': 'character.first-engineer-portrait-02',
  'character.first_engineer_confront': 'character.first-engineer-confront',
  'character.first_engineer_exposed': 'character.first-engineer-exposed',
  'character.arius': 'character.arius',
  'character.athanasius': 'character.athanasius',
  'character.samiri': 'character.samiri-portrait',
  'character.samiri_calf': 'character.samiri-calf',
  'character.constantine': 'character.constantine-portrait',
  'character.ramses': 'character.ramses',
  'character.abu_abdullah': 'character.tarek-portrait', // Alias
  'character.dictator': 'character.first-engineer-portrait', // Alias
  
  // Video background aliases
  'videoBg.yahya_room': 'videoBg.yahya-room',
  'videoBg.yahya_office': 'videoBg.yehya-office-vid',
  'videoBg.cosmic_opening': 'videoBg.cosmic-opening',
  'videoBg.tarek_rooftop': 'videoBg.tarek-rooftop',
  'videoBg.sinai_desert': 'videoBg.sinai-desert',
  'videoBg.molten_gold': 'videoBg.molten-gold',
  'videoBg.nicaea': 'videoBg.nicaea',
  'videoBg.granada_fall': 'videoBg.granada-fall',
  'videoBg.abu_abdullah_tears': 'videoBg.abu-abdullah-tears',
  'videoBg.berlin_1933': 'videoBg.berlin-1933',
  'videoBg.karbala': 'videoBg.karbala',
  'videoBg.digital_space': 'videoBg.digital-space',
  'videoBg.enter_key': 'videoBg.enter-key',
  
  // Audio aliases
  'audio.main_theme': 'audio.main-theme',
  'audio.intro_narration': 'audio.track-02',
  'audio.intro_narration_v1': 'audio.track-02',
  'audio.yahya_monologue': 'audio.track-01',
  'audio.tragic_sacrifice': 'audio.track-10',
  'audio.cosmic_end': 'audio.track-11',
  
  // Video aliases
  'video.logo_reveal': 'videoBg.intro',
  'video.qabil_scene': 'videoBg.intro',
  
  // Background aliases (map scene backgrounds to descriptive image names)
  'background.berlin_1933': 'background.yehia-room',
  'background.cambodia_1975': 'background.logo-new-flow01',
  'background.corporate_lab': 'background.fire-worship',
  'background.granada_fall': 'background.logo-new-flow01',
  'background.moscow_1937': 'background.sun-and-desert',
  'background.nicaea_council': 'background.egypt-nile-temple02',
  'background.osiris_cosmic': 'background.cosmic-bg',
  'background.osiris_interface': 'background.sun-and-desert',
  'background.pharaoh_temple': 'background.egypt-nile-temple02',
  'background.qabil_habil_aftermath': 'background.yehia-room',
  'background.qabil_habil_altar': 'background.logo-new-flow01',
  'background.qabil_habil_rage': 'background.fire-worship',
  'background.white_space': 'background.logo-new-flow01',
  'background.yahya_apartment': 'background.logo-new-flow02',
  
  // Scene background mappings (for scene-specific backgrounds)
  'sceneBg.zero-1-1-summons': 'background.yehia-room',
  'sceneBg.zero-1-2-prosecution': 'background.sun-and-desert',
  
  // Ambient aliases
  'sfx.ping': 'amb.ping',
  'sfx.door_clang': 'amb.door_clang',
  'sfx.cannon_fire': 'amb.cannon_fire',
  'sfx.cups_clink': 'amb.cups_clink',
};

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
  
  // Try key alias first, then original key
  const mappedKey = KEY_ALIASES[key] || key;
  
  const asset = manifestCache.assets[mappedKey];
  if (!asset) {
    console.warn(`[assets] Asset not found: ${key} (mapped: ${mappedKey})`);
    return '';
  }
  
  return asset.path;
}

/**
 * Get asset entry with full metadata
 */
export function getAssetEntry(key: AssetKey | string): AssetEntry | null {
  if (!manifestCache) return null;
  const mappedKey = KEY_ALIASES[key] || key;
  return manifestCache.assets[mappedKey] || null;
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
 * Get all assets from manifest
 */
export function getAllAssets(): AssetEntry[] {
  if (!manifestCache) return [];
  return Object.values(manifestCache.assets);
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

/**
 * Get ambient sound effect URL
 * @example ambient('rain') // "/assets/amb/amb.rain.mp3"
 */
export function ambient(name: string): string {
  return getAsset(`ambient.${name}` as AssetKey);
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
  get ambient() {
    return createCategoryProxy('ambient');
  },
  get voice() {
    return createCategoryProxy('voice');
  },
  get projectMedia() {
    return {
      get video() {
        return createCategoryProxy('video');
      },
      get images() {
        return createCategoryProxy('image');
      }
    };
  }
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
  ambient,
  ASSET_URLS,
};
