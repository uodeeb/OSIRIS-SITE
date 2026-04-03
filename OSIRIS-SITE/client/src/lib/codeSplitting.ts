/**
 * OSIRIS Code Splitting Configuration
 * Dynamic imports for narrative parts to reduce initial bundle size
 */

import { lazy } from 'react';

// Lazy load scene data by parts - only loads when needed
export const ScenePartImports = {
  part0: () => import(/* webpackChunkName: "scenes-part0" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('zero-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
  part1: () => import(/* webpackChunkName: "scenes-part1" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('one-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
  part2: () => import(/* webpackChunkName: "scenes-part2" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('two-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
  part3: () => import(/* webpackChunkName: "scenes-part3" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('three-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
  part4: () => import(/* webpackChunkName: "scenes-part4" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('four-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
  part5: () => import(/* webpackChunkName: "scenes-part5" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('five-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
  part6: () => import(/* webpackChunkName: "scenes-part6" */ '@/lib/sceneSystem').then(m => ({
    scenes: Object.entries(m.SCENES)
      .filter(([id]) => id.startsWith('six-'))
      .reduce((acc, [id, scene]) => ({ ...acc, [id]: scene }), {})
  })),
};

// Dynamic component imports - use direct imports for named exports
export const DynamicComponents = {
  CinematicStage: lazy(() => import(/* webpackChunkName: "cinematic" */ '@/components/CinematicStage').then(m => ({ default: m.CinematicStage }))),
  OsirisEffectLayer: lazy(() => import(/* webpackChunkName: "effects" */ '@/components/OsirisEffectLayer').then(m => ({ default: m.OsirisEffectLayer }))),
  GlobalMediaLayer: lazy(() => import(/* webpackChunkName: "media" */ '@/components/GlobalMediaLayer').then(m => ({ default: m.GlobalMediaLayer }))),
  CharacterAnimation: lazy(() => import(/* webpackChunkName: "character" */ '@/components/CharacterAnimation').then(m => ({ default: m.CharacterAnimation }))),
  VisualEffects: lazy(() => import(/* webpackChunkName: "vfx" */ '@/components/VisualEffects').then(m => ({ default: m.VisualEffects }))),
};

// Preload strategy - starts loading next part when user is in current part
export function preloadNextPart(currentPart: number) {
  const nextPart = currentPart + 1;
  if (nextPart <= 6) {
    const preloadFn = ScenePartImports[`part${nextPart}` as keyof typeof ScenePartImports];
    if (preloadFn) {
      // Start loading but don't await
      void preloadFn();
    }
  }
}

// Get part number from scene ID
export function getPartFromSceneId(sceneId: string): number {
  if (sceneId.startsWith('zero-')) return 0;
  if (sceneId.startsWith('one-')) return 1;
  if (sceneId.startsWith('two-')) return 2;
  if (sceneId.startsWith('three-')) return 3;
  if (sceneId.startsWith('four-')) return 4;
  if (sceneId.startsWith('five-')) return 5;
  if (sceneId.startsWith('six-')) return 6;
  return 0;
}

// Route-based code splitting configuration for Vite
export const viteChunkConfig = {
  manualChunks: {
    // Vendor chunks
    'react-vendor': ['react', 'react-dom'],
    'animation-vendor': ['framer-motion'],
    'audio-vendor': ['howler'],
    'router-vendor': ['wouter'],
    
    // Feature chunks
    'scenes-core': ['./src/lib/sceneSystem.ts'],
    'audio-engine': ['./src/lib/culturalAudioEngine.ts'],
    'cinematic-engine': ['./src/lib/cinematicCompositionEngine.ts'],
    
    // UI component chunks
    'ui-components': ['./src/components/ui'],
  }
};
