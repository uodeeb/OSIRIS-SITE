/**
 * Asset URL Resolver - Dynamic API-based asset loading
 *
 * REVISED: Now primarily fetches from database/Cloudflare with fallback support
 * All assets should be stored in database and served via Cloudflare CDN
 *
 * Usage:
 *   const videoUrl = await getAssetUrl("videoBg.intro");
 *   const allVideos = await getAssetsByKind("video");
 */

import superjson from 'superjson';

// Cache for asset URLs to avoid repeated API calls
const assetCache = new Map<string, string>();

// Helper to make API calls to tRPC endpoints
async function apiCall(endpoint: string, params?: Record<string, string>) {
  // tRPC with superjson transformer expects input as base64-encoded superjson
  const input = params ? btoa(superjson.stringify(params)) : '';
  const queryString = input ? `?input=${encodeURIComponent(input)}` : '';
  const res = await fetch(`/api/trpc/${endpoint}${queryString}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`API call failed: ${res.status}`);
  return res.json();
}

function extractAssetFromResponse(json: any) {
  // Handle different response shapes from tRPC with superjson
  const result = json?.result?.data?.json ?? json?.result?.data ?? json;
  return result;
}

/**
 * Fetch a single asset URL from database by key
 * Example: getAssetUrl("videoBg.intro") -> "https://cloudflare-cdn.com/..."
 * 
 * This is the PRIMARY method for fetching assets from the database
 */
export async function getAssetUrl(key: string): Promise<string> {
  // Check cache first
  if (assetCache.has(key)) {
    return assetCache.get(key)!;
  }

  try {
    const json = await apiCall('media.getAsset', { key });
    const asset = extractAssetFromResponse(json);
    if (!asset || !asset.url) {
      throw new Error(`Asset not found: ${key}`);
    }
    assetCache.set(key, asset.url);
    return asset.url;
  } catch (error) {
    // Fallback to hardcoded URLs for critical assets
    const fallbackUrl = getFallbackAssetUrl(key);
    if (fallbackUrl) {
      assetCache.set(key, fallbackUrl);
      return fallbackUrl;
    }
    
    throw new Error(`Asset not found: ${key}`);
  }
}

/**
 * Fetch all assets of a specific kind from database
 * Example: getAssetsByKind("video") -> [{key, url, mime}, ...]
 */
export async function getAssetsByKind(kind: "audio" | "video" | "background" | "character" | "document" | "ui") {
  try {
    const json = await apiCall('media.listByKind', { kind });
    const assets = extractAssetFromResponse(json);
    return Array.isArray(assets) ? assets : [];
  } catch (error) {
    // Fallback to hardcoded assets
    const fallbackAssets = getFallbackAssetsByKind(kind);
    return fallbackAssets;
  }
}

/**
 * Fetch multiple asset URLs in parallel for maximum performance
 * Example: getAssetUrls(['videoBg.intro', 'audio.main_theme', 'character.laila'])
 */
export async function getAssetUrls(keys: string[]): Promise<Record<string, string>> {
  // Use Promise.all for parallel fetching (async-parallel best practice)
  const results = await Promise.all(
    keys.map(async (key) => {
      try {
        const url = await getAssetUrl(key);
        return { key, url };
      } catch (error) {
        return { key, url: getFallbackAssetUrl(key) || '' };
      }
    })
  );

  // Convert array to object for easy lookup
  return results.reduce((acc, { key, url }) => {
    if (url) acc[key] = url;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Preload multiple assets into cache using parallel fetching
 * Useful for loading screens and predictive preloading
 */
export async function preloadAssets(keys: string[]): Promise<void> {
  // Use parallel fetching for faster preloading (async-parallel best practice)
  await getAssetUrls(keys);
}

/**
 * Clear the asset cache (useful for logout/reset)
 */
export function clearAssetCache(): void {
  assetCache.clear();
}

/**
 * Fetch all available assets from database
 * Useful for debugging and asset management
 */
export async function getAllAssets() {
  try {
    const json = await apiCall('media.listAssets');
    const assets = extractAssetFromResponse(json);
    return Array.isArray(assets) ? assets : [];
  } catch (error) {
    return [];
  }
}

// ============================================
// FALLBACK SYSTEM - For development/offline
// ============================================

/**
 * Get fallback URL for critical assets when database is unavailable
 */
function getFallbackAssetUrl(key: string): string | undefined {
  const fallbackMap: Record<string, string> = {
    // Critical video backgrounds
    'videoBg.yahya_room': '/assets/video-bg/yehya-office-vid.mp4',
    'videoBg.sinai_desert': '/assets/video-bg/desert.mp4',
    'videoBg.andalusia': '/assets/video-bg/andalus.mp4',
    'videoBg.karbala': '/assets/video-bg/karblaa.mp4',
    
    // Critical characters - using actual Arabic filenames from assets/ui/characters/
    'character.narrator': '/assets/ui/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png',
    'character.yahya': '/assets/ui/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg',
    'character.yahya_breakdown': '/assets/ui/characters/يحيى الراشد-صورة الانهيار (Breakdown Scene).jpeg',
    'character.yahya_confront': '/assets/ui/characters/يحيى الراشد-صورة المواجهة (Confrontation Scene).jpeg',
    'character.yahya_dying': '/assets/ui/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg',
    'character.yahya_main': '/assets/ui/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg',
    'character.laila': '/assets/ui/characters/ليلى حسنالصورة الأساسية (Portrait).jpeg',
    'character.laila_faith': '/assets/ui/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpeg',
    'character.laila_witness': '/assets/ui/characters/ليلى حسن-صورة الشاهدة (Witness Scene — Final Chapter).jpeg',
    'character.laila_crying': '/assets/ui/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpeg',
    'character.tarek': '/assets/ui/characters/طارق الراشد-الصورة الأساسية (Portrait).jpeg',
    'character.tarek_ghost': '/assets/ui/characters/طارق الراشد-صورة التسجيل (Recording — Ghost Image).jpeg',
    'character.tarek_dream': '/assets/ui/characters/طارق الراشد-صورة الحلم (Dream Sequence).jpeg',
    'character.first_engineer': '/assets/ui/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg',
    'character.first_engineer_2': '/assets/ui/characters/المهندس الأول-الصورة الأساسية (Portrait)02.jpeg',
    'character.first_engineer_confront': '/assets/ui/characters/المهندس الأول-صورة المواجهة (Confrontation).jpeg',
    'character.first_engineer_exposed': '/assets/ui/characters/المهندس الأول-صورة الانكشاف (Exposed — Final Scene).jpeg',
    'character.arius': '/assets/ui/characters/آريوس.jpeg',
    'character.athanasius': '/assets/ui/characters/أثناسيوس.jpeg',
    'character.samiri': '/assets/ui/characters/السامري-الصورة الأساسية (Portrait).jpeg',
    'character.samiri_calf': '/assets/ui/characters/السامري-اصورة صناعة العجل (The Golden Calf Scene).png',
    'character.constantine': '/assets/ui/characters/قسطنطين-الصورة الأساسية (Portrait).jpeg',
    'character.ramses': '/assets/ui/characters/RAMSIS.jpg',
    'character.abu_abdullah': '/assets/ui/characters/طارق الراشد-الصورة الأساسية (Portrait).jpeg',
    'character.dictator': '/assets/ui/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg',
    
    // Critical audio
    'audio.main_theme': '/assets/music-tracks/TRACK-01.mp3',
  };
  
  return fallbackMap[key];
}

/**
 * Get fallback assets by kind when database is unavailable
 */
function getFallbackAssetsByKind(kind: string) {
  const allFallbacks = {
    video: [
      { key: 'videoBg.yahya_room', url: '/generated-assets/video-bg/yehya-office-vid.mp4', mime: 'video/mp4' },
      { key: 'videoBg.sinai_desert', url: '/generated-assets/video-bg/desert.mp4', mime: 'video/mp4' },
      { key: 'videoBg.andalusia', url: '/generated-assets/video-bg/andalus.mp4', mime: 'video/mp4' },
    ],
    character: [
      { key: 'character.narrator', url: '/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png', mime: 'image/png' },
      { key: 'character.yahya', url: '/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
      { key: 'character.laila', url: '/generated-assets/characters/ليلى حسنالصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
      { key: 'character.tarek', url: '/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
      { key: 'character.first_engineer', url: '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
      { key: 'character.arius', url: '/generated-assets/characters/آريوس.jpeg', mime: 'image/jpeg' },
      { key: 'character.athanasius', url: '/generated-assets/characters/أثناسيوس.jpeg', mime: 'image/jpeg' },
      { key: 'character.samiri', url: '/generated-assets/characters/السامري-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
      { key: 'character.constantine', url: '/generated-assets/characters/قسطنطين-الصورة الأساسية (Portrait).jpeg', mime: 'image/jpeg' },
      { key: 'character.ramses', url: '/generated-assets/characters/RAMSIS.jpg', mime: 'image/jpeg' },
    ],
    audio: [
      { key: 'audio.main_theme', url: '/generated-assets/music-tracks/TRACK-01.mp3', mime: 'audio/mpeg' },
    ],
  };
  
  return allFallbacks[kind as keyof typeof allFallbacks] || [];
}

// ============================================
// MIGRATION COMPATIBILITY LAYER
// DEPRECATED: Use getAssetUrl() instead for new code
// ============================================

import { createAssetProxy } from "./assetOverrides";

// Raw URLs - after migration, these will be S3 URLs from the database
// This is kept for backward compatibility during transition
const RAW_ASSET_URLS = {
  audio: {
    main_theme: "/music/TRACK-01.mp3",
    intro_narration: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration_e17de323.wav",
    intro_narration_v1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration_v1_2522b4cb.wav",
    yahya_monologue: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_yahya_monologue_4cc9724c.wav",
    tragic_sacrifice: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_tragic_sacrifice_8f3e2a1c.wav",
    cosmic_end: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_cosmic_end_b4e9f2d1.wav",
  },
  video: {
    logo_reveal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/vid_logo_reveal_e046ce72.mp4",
    qabil_scene: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/vid_qabil_scene_cf2f94d4.mp4",
  },
  // These will be replaced after migration with S3 URLs
  // tRPC format with superjson: ?input=base64({"json":{"key":"..."},"meta":{}})
  videoBg: {
    intro: "videoBg.intro",
    yahya_room: "videoBg.yahya_room",
    cosmic_opening: "videoBg.cosmic_opening",
    tarek_rooftop: "videoBg.tarek_rooftop",
    sinai_desert: "videoBg.sinai_desert",
    molten_gold: "videoBg.molten_gold",
    nicaea: "videoBg.nicaea",
    andalusia: "videoBg.andalusia",
    abu_abdullah_tears: "videoBg.abu_abdullah_tears",
    berlin_1933: "videoBg.berlin_1933",
    karbala: "videoBg.karbala",
    digital_space: "videoBg.digital_space",
    enter_key: "videoBg.enter_key",
  },
  backgrounds: {
    berlin_1933: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_berlin_1933_a86c8d1e.png",
    cambodia_1975: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_cambodia_1975_c5282e82.png",
    corporate_lab: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_corporate_lab_2db6685d.png",
    granada_fall: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_granada_fall_582e149f.png",
    moscow_1937: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_moscow_1937_ee9ff2ff.png",
    nicaea_council: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_nicaea_council_f4ebd953.png",
    osiris_cosmic: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_osiris_cosmic_61c9c5b0.png",
    osiris_interface: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_osiris_interface_d275313a.png",
    pharaoh_temple: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_pharaoh_temple_98bcc51c.png",
    qabil_habil_aftermath: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_qabil_habil_aftermath_4d071a34.png",
    qabil_habil_altar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_qabil_habil_altar_87782666.png",
    qabil_habil_rage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_qabil_habil_rage_d1f7e300.png",
    white_space: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_white_space_1c056d5f.png",
    yahya_apartment: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/bg_yahya_apartment_43c987a4.png",
  },
  characters: {
    narrator: "character.narrator",
    arius: "character.arius",
    athanasius: "character.athanasius",
    samiri: "character.samiri",
    samiri_calf: "character.samiri_calf",
    first_engineer: "character.first_engineer",
    first_engineer_2: "character.first_engineer_2",
    first_engineer_confront: "character.first_engineer_confront",
    first_engineer_exposed: "character.first_engineer_exposed",
    tarek: "character.tarek",
    tarek_ghost: "character.tarek_ghost",
    tarek_dream: "character.tarek_dream",
    constantine: "character.constantine",
    laila: "character.laila",
    laila_faith: "character.laila_faith",
    laila_witness: "character.laila_witness",
    yahya: "character.yahya",
    yahya_breakdown: "character.yahya_breakdown",
    yahya_confront: "character.yahya_confront",
    yahya_dying: "character.yahya_dying",
    laila_crying: "character.laila_crying",
    ramses: "character.ramses",
    yahya_main: "character.yahya_main",
    abu_abdullah: "character.abu_abdullah",
    dictator: "character.dictator",
  },
  documents: {
    encrypted_file: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_encrypted_file_c10f4f48.png",
    facebook_leak: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_facebook_leak_64b7fcbd.png",
    kgb_order: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_kgb_order_e0f72fd0.png",
    nicaea_scroll: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_nicaea_scroll_2f133ee9.png",
    ramses_carving: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/doc_ramses_carving_eb77dd87.png",
  },
  ui: {
    logo_icon: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_logo_icon_c1fb9bc2.png",
    logo_primary: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_logo_primary_084de0f8.png",
    logo_dark: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_logo_dark_e0eb7967.png",
    bg_pattern: "https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/ui_bg_pattern_739a77da.png",
  },
  projectMedia: {
    audio: {
      track_01: "/api/media/getAsset?key=projectMedia.audio.track_01",
      track_02: "/api/media/getAsset?key=projectMedia.audio.track_02",
      track_03: "/api/media/getAsset?key=projectMedia.audio.track_03",
      track_04: "/api/media/getAsset?key=projectMedia.audio.track_04",
      track_05: "/api/media/getAsset?key=projectMedia.audio.track_05",
      track_06: "/api/media/getAsset?key=projectMedia.audio.track_06",
      track_07: "/api/media/getAsset?key=projectMedia.audio.track_07",
      track_08: "/api/media/getAsset?key=projectMedia.audio.track_08",
      track_09: "/api/media/getAsset?key=projectMedia.audio.track_09",
      track_10: "/api/media/getAsset?key=projectMedia.audio.track_10",
      track_11: "/api/media/getAsset?key=projectMedia.audio.track_11",
      track_12: "/api/media/getAsset?key=projectMedia.audio.track_12",
      track_13: "/api/media/getAsset?key=projectMedia.audio.track_13",
      track_14: "/api/media/getAsset?key=projectMedia.audio.track_14",
      voice_01: "/api/media/getAsset?key=projectMedia.audio.voice_01",
      voice_02: "/api/media/getAsset?key=projectMedia.audio.voice_02",
      voice_03: "/api/media/getAsset?key=projectMedia.audio.voice_03",
      voice_04: "/api/media/getAsset?key=projectMedia.audio.voice_04",
      voice_05: "/api/media/getAsset?key=projectMedia.audio.voice_05",
      voice_06: "/api/media/getAsset?key=projectMedia.audio.voice_06",
      voice_07: "/api/media/getAsset?key=projectMedia.audio.voice_07",
      voice_08: "/api/media/getAsset?key=projectMedia.audio.voice_08",
      voice_09: "/api/media/getAsset?key=projectMedia.audio.voice_09",
      voice_10: "/api/media/getAsset?key=projectMedia.audio.voice_10",
      voice_11: "/api/media/getAsset?key=projectMedia.audio.voice_11",
      voice_12: "/api/media/getAsset?key=projectMedia.audio.voice_12",
      voice_13: "/api/media/getAsset?key=projectMedia.audio.voice_13",
      voice_14: "/api/media/getAsset?key=projectMedia.audio.voice_14",
      voice_15: "/api/media/getAsset?key=projectMedia.audio.voice_15",
      voice_16: "/api/media/getAsset?key=projectMedia.audio.voice_16",
      voice_17: "/api/media/getAsset?key=projectMedia.audio.voice_17",
      voice_18: "/api/media/getAsset?key=projectMedia.audio.voice_18",
    },
    video: {
      video_01_intro: "/api/media/getAsset?key=projectMedia.video.video_01_intro",
      video_02_yahya_room: "/api/media/getAsset?key=projectMedia.video.video_02_yahya_room",
      video_03_cosmic_opening: "/api/media/getAsset?key=projectMedia.video.video_03_cosmic_opening",
      video_04_tarek_rooftop: "/api/media/getAsset?key=projectMedia.video.video_04_tarek_rooftop",
      video_05_sinai_desert: "/api/media/getAsset?key=projectMedia.video.video_05_sinai_desert",
      video_06_molten_gold: "/api/media/getAsset?key=projectMedia.video.video_06_molten_gold",
      video_07_nicaea: "/api/media/getAsset?key=projectMedia.video.video_07_nicaea",
      video_08_andalusia: "/api/media/getAsset?key=projectMedia.video.video_08_andalusia",
      video_09_abu_abdullah_tears: "/api/media/getAsset?key=projectMedia.video.video_09_abu_abdullah_tears",
      video_10_berlin_1933: "/api/media/getAsset?key=projectMedia.video.video_10_berlin_1933",
      video_11_karbala: "/api/media/getAsset?key=projectMedia.video.video_11_karbala",
      video_12_digital_space: "/api/media/getAsset?key=projectMedia.video.video_12_digital_space",
      video_13_enter_key: "/api/media/getAsset?key=projectMedia.video.video_13_enter_key",
      generated_andalus: "/api/media/getAsset?key=projectMedia.video.generated_andalus",
      generated_desert: "/api/media/getAsset?key=projectMedia.video.generated_desert",
      generated_karblaa: "/api/media/getAsset?key=projectMedia.video.generated_karblaa",
      generated_yehya_office: "/api/media/getAsset?key=projectMedia.video.generated_yehya_office",
    },
    image: {
      generated_01: "/api/media/getAsset?key=projectMedia.image.generated_01",
      generated_02: "/api/media/getAsset?key=projectMedia.image.generated_02",
      generated_03: "/api/media/getAsset?key=projectMedia.image.generated_03",
      generated_04: "/api/media/getAsset?key=projectMedia.image.generated_04",
      generated_05: "/api/media/getAsset?key=projectMedia.image.generated_05",
      generated_06: "/api/media/getAsset?key=projectMedia.image.generated_06",
      generated_07: "/api/media/getAsset?key=projectMedia.image.generated_07",
      guide_scene_1_1: "/api/media/getAsset?key=projectMedia.image.guide_scene_1_1",
      logo_01: "/api/media/getAsset?key=projectMedia.image.logo_01",
      logo_02: "/api/media/getAsset?key=projectMedia.image.logo_02",
      logo_03: "/api/media/getAsset?key=projectMedia.image.logo_03",
      logo_04: "/api/media/getAsset?key=projectMedia.image.logo_04",
      logo_05: "/api/media/getAsset?key=projectMedia.image.logo_05",
      logo_06: "/api/media/getAsset?key=projectMedia.image.logo_06",
    },
    sceneBg: {
      'zero-1-1-summons': 'sceneBg.zero-1-1-summons',
      'four-4-1-desert': 'sceneBg.four-4-1-desert',
      'four-4-2-crowd-engineering': 'sceneBg.four-4-2-crowd-engineering',
    },
    project: {
      devil_voice_aup3: "MUSIC-BG/devil-voice-to-clone.aup3",
      prompts_spec: "OSIRIS_ASSET_PROMPTS.md",
    },
  },
} as const;

export type AssetUrls = typeof RAW_ASSET_URLS;

export const ASSET_URLS = createAssetProxy(RAW_ASSET_URLS) as AssetUrls;

export interface ProjectMediaEntry {
  key: string;
  kind: "audio" | "video" | "image" | "project";
  value: string;
}

export function getProjectMediaEntries(): ProjectMediaEntry[] {
  const groups = ASSET_URLS.projectMedia;
  const entries: ProjectMediaEntry[] = [];
  (Object.entries(groups.audio) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "audio", value });
  });
  (Object.entries(groups.video) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "video", value });
  });
  (Object.entries(groups.image) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "image", value });
  });
  (Object.entries(groups.project) as Array<[string, string]>).forEach(([key, value]) => {
    entries.push({ key, kind: "project", value });
  });
  return entries;
}
