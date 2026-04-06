/**
 * Asset Preloading Hook
 * 
 * Provides eager preloading of critical assets to ensure they're available
 * when needed, reducing load times and preventing missing asset issues.
 * 
 * Usage:
 *   const { preloadSceneAssets, preloadCharacter, isPreloading } = useAssetPreloader();
 *   useEffect(() => {
 *     preloadSceneAssets(currentSceneId);
 *   }, [currentSceneId]);
 */

import { useCallback, useRef, useState } from 'react';
import { getAssetUrl, preloadAssets } from '@/lib/assetUrls';
import { initAssetOverrides, getAssetOverride } from '@/lib/assetOverrides';

// Critical assets that should be preloaded for each scene
const SCENE_CRITICAL_ASSETS: Record<string, string[]> = {
  'zero-1-1-summons': ['character.yahya'],
  'zero-1-2-prosecution': ['character.narrator'],
  'one-1-5-1-promise': ['character.tarek'],
  'one-1-5-2-bitter-truth': ['character.laila'],
  'one-1-5-3-no-escape': ['character.yahya'],
  'one-1-5-4-sacrifice': ['character.tarek'],
  'two-2-1-escape': ['character.yahya'],
  'two-2-2-osiris-launch': ['character.first_engineer'],
  'three-3-1-creation': ['character.yahya'],
  'three-3-1b-devil-song': ['character.narrator'],
  'three-3-2-virus-design': ['character.first_engineer'],
  'four-4-1-desert': ['character.samiri'],
  'four-4-2-crowd-engineering': ['character.samiri_calf'],
  'four-5-1-tarek-message': ['character.tarek_ghost'],
  'four-5-2-analyst-tears': ['character.yahya_breakdown'],
  'five-6a-1-nicaea-debate': ['character.arius'],
  'five-6b-1-constantine': ['character.constantine'],
  'five-6c-1-laila-pain': ['character.laila_faith'],
  'five-6c-2-tarek-second': ['character.tarek_dream'],
  'six-8-1-andalusia': ['character.narrator'],
  'six-8-2-last-tears': ['character.narrator'],
  'six-8b-1-berlin': ['character.narrator'],
  'six-8c-1-death-signatures': ['character.narrator'],
  'six-8d-1-attack': ['character.yahya_confront'],
  'six-8d-2-final-update': ['character.first_engineer_exposed'],
  'transition-dream': ['character.tarek_dream'],
  'seven-10-1-karbala': ['character.narrator'],
  'seven-11-1-temptation': ['character.first_engineer_2'],
  'seven-11-2-decision': ['character.yahya_confront'],
  'seven-12-1-truth-leak': ['character.laila_witness'],
  'seven-13-1-awakening': ['character.yahya'],
  'seven-13-2-closing': ['character.narrator'],
};

// All character assets for global preloading
const ALL_CHARACTER_ASSETS = [
  'character.narrator',
  'character.yahya',
  'character.yahya_breakdown',
  'character.yahya_confront',
  'character.yahya_dying',
  'character.laila',
  'character.laila_faith',
  'character.laila_witness',
  'character.laila_crying',
  'character.tarek',
  'character.tarek_ghost',
  'character.tarek_dream',
  'character.first_engineer',
  'character.first_engineer_2',
  'character.first_engineer_confront',
  'character.first_engineer_exposed',
  'character.arius',
  'character.athanasius',
  'character.samiri',
  'character.samiri_calf',
  'character.constantine',
  'character.ramses',
];

interface UseAssetPreloaderResult {
  /** Preload assets for a specific scene */
  preloadSceneAssets: (sceneId: string) => Promise<void>;
  /** Preload a specific character asset */
  preloadCharacter: (characterKey: string) => Promise<void>;
  /** Preload all character assets */
  preloadAllCharacters: () => Promise<void>;
  /** Initialize asset overrides (call on app mount) */
  initializeOverrides: () => Promise<void>;
  /** Whether preloading is in progress */
  isPreloading: boolean;
  /** Whether overrides are loaded */
  overridesReady: boolean;
  /** Track which assets have been preloaded */
  preloadedAssets: Set<string>;
}

export function useAssetPreloader(): UseAssetPreloaderResult {
  const [isPreloading, setIsPreloading] = useState(false);
  const [overridesReady, setOverridesReady] = useState(false);
  const preloadedAssets = useRef<Set<string>>(new Set());
  const initStarted = useRef(false);

  const initializeOverrides = useCallback(async () => {
    if (initStarted.current) return;
    initStarted.current = true;
    
    try {
      await initAssetOverrides({ timeoutMs: 5000 });
      setOverridesReady(true);
      console.log('[AssetPreloader] Overrides initialized successfully');
    } catch (err) {
      console.error('[AssetPreloader] Failed to initialize overrides:', err);
      // Still mark as ready to prevent blocking
      setOverridesReady(true);
    }
  }, []);

  const preloadCharacter = useCallback(async (characterKey: string) => {
    const assetKey = characterKey.startsWith('character.') 
      ? characterKey 
      : `character.${characterKey}`;
    
    if (preloadedAssets.current.has(assetKey)) {
      return;
    }

    try {
      // First try to get from override
      const override = getAssetOverride(assetKey);
      if (override) {
        preloadedAssets.current.add(assetKey);
        return;
      }

      // Fall back to fetching from API
      await getAssetUrl(assetKey);
      preloadedAssets.current.add(assetKey);
    } catch (err) {
      console.warn('[AssetPreloader] Failed to preload character:', assetKey, err);
    }
  }, []);

  const preloadSceneAssets = useCallback(async (sceneId: string) => {
    const assets = SCENE_CRITICAL_ASSETS[sceneId];
    if (!assets || assets.length === 0) return;

    setIsPreloading(true);
    try {
      // Preload in parallel
      await Promise.all(
        assets.map(key => preloadCharacter(key))
      );
      console.log('[AssetPreloader] Preloaded assets for scene:', sceneId);
    } catch (err) {
      console.error('[AssetPreloader] Error preloading scene assets:', err);
    } finally {
      setIsPreloading(false);
    }
  }, [preloadCharacter]);

  const preloadAllCharacters = useCallback(async () => {
    setIsPreloading(true);
    try {
      // Preload all character assets in parallel (with batching for performance)
      const batchSize = 5;
      for (let i = 0; i < ALL_CHARACTER_ASSETS.length; i += batchSize) {
        const batch = ALL_CHARACTER_ASSETS.slice(i, i + batchSize);
        await Promise.all(batch.map(key => preloadCharacter(key)));
      }
      console.log('[AssetPreloader] Preloaded all character assets');
    } catch (err) {
      console.error('[AssetPreloader] Error preloading all characters:', err);
    } finally {
      setIsPreloading(false);
    }
  }, [preloadCharacter]);

  return {
    preloadSceneAssets,
    preloadCharacter,
    preloadAllCharacters,
    initializeOverrides,
    isPreloading,
    overridesReady,
    preloadedAssets: preloadedAssets.current,
  };
}

export default useAssetPreloader;
