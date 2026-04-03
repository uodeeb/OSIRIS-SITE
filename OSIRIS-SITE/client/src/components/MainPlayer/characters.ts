/**
 * OSIRIS MainPlayer Character Map
 * Centralized character configuration
 */

import { ASSET_URLS } from '@/lib/assetUrls';
import type { CharacterConfig, CharacterState, CharacterEmotion } from './types';

export const CHARACTER_MAP: Record<string, CharacterConfig> = {
  Narrator: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.narrator,
  },
  yahya: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya,
  },
  yahya_breakdown: {
    name: 'Yahya',
    arabicName: 'يحيى (انهيار)',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya_breakdown,
  },
  yahya_confront: {
    name: 'Yahya',
    arabicName: 'يحيى (مواجهة)',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya_confront,
  },
  laila: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila,
  },
  laila_faith: {
    name: 'Laila',
    arabicName: 'ليلى (إيمان)',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila_faith,
  },
  laila_witness: {
    name: 'Laila',
    arabicName: 'ليلى (شاهدة)',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila_witness,
  },
  tarek: {
    name: 'Tarek',
    arabicName: 'طارق',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek,
  },
  tarek_ghost: {
    name: 'Tarek',
    arabicName: 'طارق (شبح)',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.5)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek_ghost,
  },
  tarek_dream: {
    name: 'Tarek',
    arabicName: 'طارق (حلم)',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek_dream,
  },
  first_engineer: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer,
  },
  first_engineer_confront: {
    name: 'First Engineer',
    arabicName: 'المهندس (مواجهة)',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.4)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer_confront,
  },
  first_engineer_exposed: {
    name: 'First Engineer',
    arabicName: 'المهندس (منكشف)',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.5)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer_exposed,
  },
  arius: {
    name: 'Arius',
    arabicName: 'آريوس',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.arius,
  },
  athanasius: {
    name: 'Athanasius',
    arabicName: 'أثناسيوس',
    color: '#d4af37',
    glowColor: 'rgba(212,175,55,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.athanasius,
  },
  samiri: {
    name: 'The Samaritan',
    arabicName: 'السامري',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.samiri,
  },
  samiri_calf: {
    name: 'The Samaritan',
    arabicName: 'السامري (العجل)',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.4)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.samiri_calf,
  },
  constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#6366f1',
    glowColor: 'rgba(99,102,241,0.3)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.constantine,
  },
  ramses: {
    name: 'Ramses II',
    arabicName: 'رمسيس الثاني',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.ramses,
  },
  abu_abdullah: {
    name: 'Abu Abdullah',
    arabicName: 'أبو عبد الله',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.abu_abdullah,
  },
  dictator: {
    name: 'The Dictator',
    arabicName: 'الديكتاتور',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.4)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.dictator,
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

export function getCharacterConfig(characterKey: string): CharacterConfig {
  return CHARACTER_MAP[characterKey] || CHARACTER_MAP.Narrator;
}

export function getCharacterState(sceneId: string): CharacterState {
  return SCENE_CHARACTER_STATES[sceneId] || { emotion: 'neutral', effect: 'none' };
}
