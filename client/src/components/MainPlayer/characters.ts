/**
 * OSIRIS MainPlayer Character Map - UPDATED
 * 
 * This file now uses the new database-driven asset loading system
 * instead of hardcoded ASSET_URLS.
 */

import { character } from '@/lib/assets';
import type { CharacterConfig, CharacterState, CharacterEmotion } from './types';

export const CHARACTER_MAP: Record<string, CharacterConfig> = {
  Narrator: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5sYWlsYSJ9LCJtZXRhIjp7fX0=', // Will be resolved by getAssetUrl
  },
  yahya: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci55YWh5YSJ9LCJtZXRhIjp7fX0=',
  },
  yahya_breakdown: {
    name: 'Yahya',
    arabicName: 'يحيى (انهيار)',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci55YWh5YV9icmVha2Rvd24ifSwibWV0YSI6e319',
  },
  yahya_confront: {
    name: 'Yahya',
    arabicName: 'يحيى (مواجهة)',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci55YWh5YV9jb25mcm9udCJ9LCJtZXRhIjp7fX0=',
  },
  laila: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5sYWlsYSJ9LCJtZXRhIjp7fX0=',
  },
  laila_faith: {
    name: 'Laila',
    arabicName: 'ليلى (إيمان)',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5sYWlsYV9mYWl0aCJ9LCJtZXRhIjp7fX0=',
  },
  laila_witness: {
    name: 'Laila',
    arabicName: 'ليلى (شاهدة)',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5sYWlsYV93aXRuZXNzIn0sIm1ldGEiOnt9fQ==',
  },
  tarek: {
    name: 'Tarek',
    arabicName: 'طارق',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci50YXJlayJ9LCJtZXRhIjp7fX0=',
  },
  tarek_ghost: {
    name: 'Tarek',
    arabicName: 'طارق (شبح)',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci50YXJla19naG9zdCJ9LCJtZXRhIjp7fX0=',
  },
  tarek_dream: {
    name: 'Tarek',
    arabicName: 'طارق (حلم)',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci50YXJla19kcmVhbSJ9LCJtZXRhIjp7fX0=',
  },
  first_engineer: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5maXJzdF9lbmdpbmVlciJ9LCJtZXRhIjp7fX0=',
  },
  first_engineer_2: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول (2)',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5maXJzdF9lbmdpbmVlcl8yIn0sIm1ldGEiOnt9fQ==',
  },
  first_engineer_confront: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول (مواجهة)',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5maXJzdF9lbmdpbmVlcl9jb25mcm9udCJ9LCJtZXRhIjp7fX0=',
  },
  first_engineer_exposed: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول (منكشف)',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5maXJzdF9lbmdpbmVlcl9leHBvc2VkIn0sIm1ldGEiOnt9fQ==',
  },
  arius: {
    name: 'Arius',
    arabicName: 'آريوس',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5hcml1cyJ9LCJtZXRhIjp7fX0=',
  },
  athanasius: {
    name: 'Athanasius',
    arabicName: 'أثناسيوس',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5hdGhhbmFzaXVzIn0sIm1ldGEiOnt9fQ==',
  },
  samiri: {
    name: 'Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5zYW1pcmlifSwibWV0YSI6e319',
  },
  samiri_calf: {
    name: 'Samiri',
    arabicName: 'السامري (العجل)',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5zYW1pcmlfY2FsZiJ9LCJtZXRhIjp7fX0=',
  },
  constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#10b981',
    glowColor: 'rgba(16,185,129,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5jb25zdGFudGluZSJ9LCJtZXRhIjp7fX0=',
  },
  ramses: {
    name: 'Ramses',
    arabicName: 'رامسيس',
    color: '#f97316',
    glowColor: 'rgba(249,115,22,0.3)',
    position: 'left',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5yYW1zZXMifSwibWV0YSI6e319',
  },
  abu_abdullah: {
    name: 'Abu Abdullah',
    arabicName: 'أبو عبد الله',
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.3)',
    position: 'right',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5hYnVfYWJkdWxsYWgifSwibWV0YSI6e319',
  },
  dictator: {
    name: 'Dictator',
    arabicName: 'الديكتاتور',
    color: '#64748b',
    glowColor: 'rgba(100,116,139,0.3)',
    position: 'center',
    imageUrl: '/api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci5kaWN0YXRvciJ9LCJtZXRhIjp7fX0=',
  },
};

export const CHARACTER_FILTERS: Record<CharacterEmotion, string> = {
  neutral: 'none',
  fearful: 'brightness(0.9) contrast(1.1)',
  sad: 'saturate(0.7) brightness(0.85)',
  angry: 'brightness(1.1) contrast(1.2) saturate(1.2)',
  shocked: 'brightness(1.3) contrast(1.3)',
  dying: 'saturate(0.5) brightness(0.7) sepia(0.3)',
  determined: 'brightness(1.05) contrast(1.1)',
  ghost: 'saturate(0.3) brightness(1.2) opacity(0.7)',
  breakdown: 'saturate(0.6) brightness(0.8) blur(0.5px)',
};

export const SCENE_CHARACTER_STATES: Record<string, CharacterState> = {
  'zero-1-1-summons': { emotion: 'fearful', effect: 'pulse' },
  'one-1-5-4-sacrifice': { emotion: 'sad', effect: 'ghost' },
  'three-3-1b-devil-song': { emotion: 'angry', effect: 'glitch' },
  'six-6-1-osiris-reveal': { emotion: 'shocked', effect: 'flash' },
  'zero-1-6-confession': { emotion: 'dying', effect: 'ghost' },
  'two-2-4-judgment': { emotion: 'determined', effect: 'pulse' },
  'five-5-3-haunting': { emotion: 'ghost', effect: 'ghost' },
  'six-6-5-breakdown': { emotion: 'breakdown', effect: 'glitch' },
};

/**
 * Helper function to resolve character image URL from tRPC to actual asset URL
 * This maintains backward compatibility while using the new database system
 */
export async function resolveCharacterImageUrl(characterKey: string): Promise<string> {
  const config = CHARACTER_MAP[characterKey];
  if (!config || !config.imageUrl) {
    throw new Error(`Character not found or no image URL: ${characterKey}`);
  }
  
  // If it's already a direct asset URL, return it
  if (!config.imageUrl.includes('/api/trpc/media.getAsset')) {
    return config.imageUrl;
  }
  
  // Extract the asset key from the tRPC URL
  const urlParams = new URLSearchParams(config.imageUrl.split('?')[1]);
  const input = urlParams.get('input');
  
  if (!input) {
    throw new Error(`Invalid character asset URL: ${config.imageUrl}`);
  }
  
  try {
    // Decode the base64 input to get the JSON
    const decoded = JSON.parse(atob(input));
    const assetKey = decoded.json.key;
    
    // Load actual asset URL from new assets system
    return character(assetKey);
  } catch (error) {
    console.error(`[CharacterMap] Failed to resolve character image for ${characterKey}:`, error);
    throw new Error(`Character image resolution failed: ${characterKey}`);
  }
}

export function getCharacterConfig(characterKey: string): CharacterConfig {
  return CHARACTER_MAP[characterKey] || CHARACTER_MAP.Narrator;
}

export function getCharacterState(sceneId: string): CharacterState {
  return SCENE_CHARACTER_STATES[sceneId] || { emotion: 'neutral', effect: 'none' };
}

export default CHARACTER_MAP;
