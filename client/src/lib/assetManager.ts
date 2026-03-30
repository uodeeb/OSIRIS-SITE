/**
 * OSIRIS Asset Manager
 * Centralized management of all CDN assets with error handling, caching, and preloading
 */

export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  title?: string;
  preload?: boolean;
}

export interface AssetCategory {
  ui: Record<string, Asset>;
  characters: Record<string, Asset>;
  backgrounds: Record<string, Asset>;
  documents: Record<string, Asset>;
  audio: Record<string, Asset>;
  video: Record<string, Asset>;
}

/**
 * Asset URLs - All assets hosted on CDN
 * Format: https://d2xsxph8kpxj0f.cloudfront.net/[project-id]/[asset-id]/[filename]
 */
const CDN_BASE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8';

export const OSIRIS_ASSETS: AssetCategory = {
  ui: {
    logo_primary: {
      id: 'ui_logo_primary',
      type: 'image',
      url: `${CDN_BASE}/ui_logo_primary_69b919a2.png`,
      alt: 'OSIRIS Logo',
      title: 'OSIRIS - The Corruptors in the Land',
      preload: true,
    },
    logo_icon: {
      id: 'ui_logo_icon',
      type: 'image',
      url: `${CDN_BASE}/ui_logo_icon_99b745d6.png`,
      alt: 'OSIRIS Icon',
      preload: true,
    },
    bg_pattern: {
      id: 'ui_bg_pattern',
      type: 'image',
      url: `${CDN_BASE}/ui_bg_pattern_c1606719.png`,
      alt: 'Background Pattern',
    },
  },
  characters: {
    yahya_main: {
      id: 'char_yahya_main',
      type: 'image',
      url: `${CDN_BASE}/char_yahya.png`,
      alt: 'Yahya Al-Sulaimani',
      title: 'The Protagonist',
    },
    laila: {
      id: 'char_laila',
      type: 'image',
      url: `${CDN_BASE}/char_laila.png`,
      alt: 'Laila - The Spiritual Compass',
      title: 'Defense Witness',
    },
    tarek: {
      id: 'char_tarek',
      type: 'image',
      url: `${CDN_BASE}/char_tarek.png`,
      alt: 'Tarek - The Silent Witness',
      title: 'Martyred Soldier',
    },
    first_engineer: {
      id: 'char_first_engineer',
      type: 'image',
      url: `${CDN_BASE}/char_first_engineer.png`,
      alt: 'The First Engineer',
      title: 'The Mysterious Figure',
    },
    ramses: {
      id: 'char_ramses',
      type: 'image',
      url: `${CDN_BASE}/char_ramses.png`,
      alt: 'Ramses II',
      title: 'The Pharaoh',
    },
    constantine: {
      id: 'char_constantine',
      type: 'image',
      url: `${CDN_BASE}/char_constantine.png`,
      alt: 'Constantine',
      title: 'The Emperor',
    },
    abu_abdullah: {
      id: 'char_abu_abdullah',
      type: 'image',
      url: `${CDN_BASE}/char_abu_abdullah.png`,
      alt: 'Abu Abdullah Al-Sagir',
      title: 'Last King of Granada',
    },
    dictator: {
      id: 'char_dictator',
      type: 'image',
      url: `${CDN_BASE}/char_dictator.png`,
      alt: 'The Dictator Archetype',
      title: '20th Century Tyrant',
    },
  },
  backgrounds: {
    yahya_apartment: {
      id: 'bg_yahya_apartment',
      type: 'image',
      url: `${CDN_BASE}/bg_yahya_apartment.png`,
      alt: 'Yahya\'s Apartment',
      title: 'Oxford, Present Day',
    },
    white_space: {
      id: 'bg_white_space',
      type: 'image',
      url: `${CDN_BASE}/bg_white_space.png`,
      alt: 'White Space',
      title: 'The Void',
    },
    pharaoh_temple: {
      id: 'bg_pharaoh_temple',
      type: 'image',
      url: `${CDN_BASE}/bg_pharaoh_temple.png`,
      alt: 'Pharaoh\'s Temple',
      title: 'Ancient Egypt',
    },
    nicaea_council: {
      id: 'bg_nicaea_council',
      type: 'image',
      url: `${CDN_BASE}/bg_nicaea_council.png`,
      alt: 'Council of Nicaea',
      title: 'Rome, 325 AD',
    },
    granada_fall: {
      id: 'bg_granada_fall',
      type: 'image',
      url: `${CDN_BASE}/bg_granada_fall.png`,
      alt: 'Fall of Granada',
      title: 'Spain, 1492',
    },
    berlin_1933: {
      id: 'bg_berlin_1933',
      type: 'image',
      url: `${CDN_BASE}/bg_berlin_1933.png`,
      alt: 'Berlin 1933',
      title: 'Nazi Germany',
    },
    moscow_1937: {
      id: 'bg_moscow_1937',
      type: 'image',
      url: `${CDN_BASE}/bg_moscow_1937.png`,
      alt: 'Moscow 1937',
      title: 'Soviet Terror',
    },
    cambodia_1975: {
      id: 'bg_cambodia_1975',
      type: 'image',
      url: `${CDN_BASE}/bg_cambodia_1975.png`,
      alt: 'Cambodia 1975',
      title: 'Khmer Rouge',
    },
    corporate_lab: {
      id: 'bg_corporate_lab',
      type: 'image',
      url: `${CDN_BASE}/bg_corporate_lab.png`,
      alt: 'Corporate Laboratory',
      title: 'Silicon Valley',
    },
    osiris_cosmic: {
      id: 'bg_osiris_cosmic',
      type: 'image',
      url: `${CDN_BASE}/bg_osiris_cosmic.png`,
      alt: 'OSIRIS Cosmic Interface',
      title: 'The Cosmic Courtroom',
      preload: true,
    },
    osiris_interface: {
      id: 'bg_osiris_interface',
      type: 'image',
      url: `${CDN_BASE}/bg_osiris_interface.png`,
      alt: 'OSIRIS Interface',
      title: 'Digital System',
    },
    qabil_habil_altar: {
      id: 'bg_qabil_habil_altar',
      type: 'image',
      url: `${CDN_BASE}/bg_qabil_habil_altar.png`,
      alt: 'The Altar',
      title: 'First Crime Scene',
    },
    qabil_habil_rage: {
      id: 'bg_qabil_habil_rage',
      type: 'image',
      url: `${CDN_BASE}/bg_qabil_habil_rage.png`,
      alt: 'Qabil\'s Rage',
      title: 'The Moment of Decision',
    },
    qabil_habil_aftermath: {
      id: 'bg_qabil_habil_aftermath',
      type: 'image',
      url: `${CDN_BASE}/bg_qabil_habil_aftermath.png`,
      alt: 'The Aftermath',
      title: 'Alone with the Deed',
    },
  },
  documents: {
    encrypted_file: {
      id: 'doc_encrypted_file',
      type: 'image',
      url: `${CDN_BASE}/doc_encrypted_file.png`,
      alt: 'Encrypted File',
      title: 'Digital Evidence',
    },
    kgb_order: {
      id: 'doc_kgb_order',
      type: 'image',
      url: `${CDN_BASE}/doc_kgb_order.png`,
      alt: 'KGB Execution Order',
      title: 'Historical Document',
    },
    facebook_leak: {
      id: 'doc_facebook_leak',
      type: 'image',
      url: `${CDN_BASE}/doc_facebook_leak.png`,
      alt: 'Facebook Leak Memo',
      title: 'Corporate Evidence',
    },
    nicaea_scroll: {
      id: 'doc_nicaea_scroll',
      type: 'image',
      url: `${CDN_BASE}/doc_nicaea_scroll.png`,
      alt: 'Nicaea Council Scroll',
      title: 'Religious Document',
    },
    ramses_carving: {
      id: 'doc_ramses_carving',
      type: 'image',
      url: `${CDN_BASE}/doc_ramses_carving.png`,
      alt: 'Ramses Stone Carving',
      title: 'Ancient Inscription',
    },
  },
  audio: {
    intro_narration: {
      id: 'aud_intro_narration',
      type: 'audio',
      url: `${CDN_BASE}/aud_intro_narration.wav`,
      alt: 'OSIRIS System Opening',
      title: 'Cosmic Trial Introduction',
      preload: true,
    },
    yahya_monologue: {
      id: 'aud_yahya_monologue',
      type: 'audio',
      url: `${CDN_BASE}/aud_yahya_monologue.wav`,
      alt: 'Yahya\'s Internal Monologue',
      title: 'The Data Analyst Confronting the Pattern',
    },
  },
  video: {
    logo_reveal: {
      id: 'vid_logo_reveal',
      type: 'video',
      url: `${CDN_BASE}/vid_logo_reveal.mp4`,
      alt: 'OSIRIS Logo Reveal',
      title: 'Cinematic Opening',
      preload: true,
    },
    qabil_scene: {
      id: 'vid_qabil_scene',
      type: 'video',
      url: `${CDN_BASE}/vid_qabil_scene.mp4`,
      alt: 'Qabil and Habil Scene',
      title: 'The First Crime',
    },
  },
};

/**
 * Asset Manager Class
 * Handles loading, caching, and error management for all assets
 */
export class AssetManager {
  private static instance: AssetManager;
  private cache: Map<string, string> = new Map();
  private loadingPromises: Map<string, Promise<string>> = new Map();
  private failedAssets: Set<string> = new Set();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * Get asset URL with caching and error handling
   */
  async getAsset(assetId: string): Promise<string> {
    // Check cache first
    if (this.cache.has(assetId)) {
      return this.cache.get(assetId)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(assetId)) {
      return this.loadingPromises.get(assetId)!;
    }

    // Check if previously failed
    if (this.failedAssets.has(assetId)) {
      console.warn(`Asset ${assetId} previously failed to load`);
      return '';
    }

    // Load asset
    const promise = this.loadAsset(assetId);
    this.loadingPromises.set(assetId, promise);

    try {
      const url = await promise;
      this.cache.set(assetId, url);
      this.loadingPromises.delete(assetId);
      return url;
    } catch (error) {
      this.failedAssets.add(assetId);
      this.loadingPromises.delete(assetId);
      console.error(`Failed to load asset ${assetId}:`, error);
      return '';
    }
  }

  /**
   * Load asset from CDN
   */
  private async loadAsset(assetId: string): Promise<string> {
    // Find asset in all categories
    for (const category of Object.values(OSIRIS_ASSETS)) {
      for (const [key, assetValue] of Object.entries(category)) {
        const asset = assetValue as Asset;
        if (asset.id === assetId) {
          // Verify URL is valid
          if (!asset.url || asset.url.includes('[hash]')) {
            console.warn(`Invalid asset URL for ${assetId}, using placeholder`);
            return '';
          }

          // For images and videos, verify they exist
          if (asset.type === 'image' || asset.type === 'video') {
            try {
              return await this.verifyAssetExists(asset.url, assetId);
            } catch (error) {
              console.warn(`Asset ${assetId} verification failed, using placeholder`);
              return '';
            }
          }

          return asset.url;
        }
      }
    }

    console.warn(`Asset ${assetId} not found in manifest`);
    return '';
  }

  /**
   * Verify asset exists on CDN
   */
  private async verifyAssetExists(url: string, assetId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.onerror = null;
        img.onload = null;
        resolve(url); // Return URL even if timeout
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve(url);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Asset ${assetId} failed to load from CDN`));
      };

      img.src = url;
    });
  }

  /**
   * Preload critical assets
   */
  async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = Object.values(OSIRIS_ASSETS)
      .flatMap((category) => Object.values(category))
      .filter((asset) => (asset as Asset).preload)
      .map((asset) => (asset as Asset).id);

    await Promise.allSettled(
      criticalAssets.map((assetId) => this.getAsset(assetId))
    );
  }

  /**
   * Get asset by category and key
   */
  getAssetByKey(category: keyof AssetCategory, key: string): Asset | null {
    const categoryAssets = OSIRIS_ASSETS[category];
    if (categoryAssets && key in categoryAssets) {
      return (categoryAssets[key as keyof typeof categoryAssets]) as Asset;
    }
    return null;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.failedAssets.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { cached: number; failed: number; loading: number } {
    return {
      cached: this.cache.size,
      failed: this.failedAssets.size,
      loading: this.loadingPromises.size,
    };
  }
}

/**
 * Export singleton instance for easy access
 */
export const assetManager = AssetManager.getInstance();
