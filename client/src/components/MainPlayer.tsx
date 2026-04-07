/**
 * OSIRIS — المفسدون في الأرض
 * Main Player — Cinema-Mode Multimedia Interactive Digital Novel
 *
 * KEY DESIGN DECISIONS:
 * - User controls ALL progression (no auto-advance after dialogue finishes)
 * - Typewriter completes, then waits for user click/keypress to advance
 * - Narration audio: unique per scene, plays ONCE (no loop), stops on scene change
 * - Background music: separate ambient loop, volume-controlled independently
 * - Transitions: slow cinematic (1.8s fade in/out)
 * - Keyboard: Space/Enter = next, Backspace = prev dialogue, Escape = home
 */

import { useEffect, useMemo, useRef, useState, useCallback, memo, type CSSProperties } from 'react';
import styles from './MainPlayer.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { PART_LABELS, SCENES as ALL_SCENES, type DialogueLine, type Scene, type SceneChoice } from '@/lib/sceneSystem';
import { ASSET_URLS } from '@/lib/assetUrls';
import { getAssetOverride } from '@/lib/assetOverrides';
import { customStyles, choicePanelStyles, endSceneStyles, buttonStyles } from '@/lib/styleUtils';
import { useBandwidthStrategy } from '@/lib/mediaStrategy';
import { detectOsirisEffectId, preloadOsirisEffects, type OsirisEffectId } from "@/lib/osirisEffects";
import { loadCanonicalDialogueMap } from '@/lib/canonicalScript.ts'; // Netlify fix: explicit .ts extension required
import { CinematicStage } from '@/components/CinematicStage';
import { OsirisEffectLayer } from "@/components/OsirisEffectLayer";
import { GlobalMediaLayer } from "@/components/GlobalMediaLayer";
import { useMediaState } from "@/contexts/MediaStateContext";
import { useMediaActions } from "@/contexts/MediaActionsContext";
import { useReducedMotion } from '@/hooks/useReducedMotion';
import osirisLogo from '@/LOGO/new-logo/favicon-black-0.25.png';

// Hoisted regex patterns for performance (Rule 7.9)
const CHARACTER_REGEX_PATTERNS = {
  yahya: /قال يحيى|أجاب يحيى|همس يحيى|صرخ يحيى|رد يحيى|يحيى/i,
  laila: /قالت ليلى|أجابت ليلى|همست ليلى|صرخت ليلى|ليلى/i,
  tarek: /قال طارق|أجاب طارق|همس طارق|صوت طارق|تسجيل طارق|طارق/i,
  engineer: /قال المهندس الأول|أجاب المهندس الأول|المهندس الأول|المهندس/i,
  arius: /قال آريوس|آريوس/i,
  athanasius: /قال أثناسيوس|أثناسيوس/i,
  constantine: /قال قسطنطين|قسطنطين/i,
  samiri: /السامري|العجل/i,
  calf: /عجل/i,
} as const;

// Helper function to normalize URLs
function normalize(url: string): string {
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

interface MainPlayerProps {
  initialSceneId?: string;
}

// ─── Character Configuration ────────────────────────────────────────────────

interface CharacterConfig {
  name: string;
  arabicName: string;
  color: string;
  glowColor: string;
  imageUrl?: string;
  position: 'left' | 'right' | 'center';
}

const CHARACTER_MAP: Record<string, CharacterConfig> = {
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
  laila: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila,
  },
  tarek: {
    name: 'Tarek',
    arabicName: 'طارق',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek,
  },
  first_engineer: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer,
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
    name: 'Al-Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.samiri,
  },
  constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.constantine,
  },
  yahya_breakdown: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya_breakdown,
  },
  yahya_confront: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.4)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya_confront,
  },
  tarek_ghost: {
    name: 'Tarek (Recording)',
    arabicName: 'تسجيل طارق',
    color: '#94a3b8',
    glowColor: 'rgba(148,163,184,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek_ghost,
  },
  tarek_dream: {
    name: 'Tarek (Dream)',
    arabicName: 'طارق',
    color: '#818cf8',
    glowColor: 'rgba(129,140,248,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek_dream,
  },
  laila_faith: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.4)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila_faith,
  },
  laila_witness: {
    name: 'Laila (Witness)',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.4)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila_witness,
  },
  first_engineer_2: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer_2,
  },
  first_engineer_exposed: {
    name: 'First Engineer (Exposed)',
    arabicName: 'المهندس الأول',
    color: '#b91c1c',
    glowColor: 'rgba(185,28,28,0.4)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer_exposed,
  },
  first_engineer_confront: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.4)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer_confront,
  },
  yahya_dying: {
    name: 'Yahya (Dying)',
    arabicName: 'يحيى (يحتضر)',
    color: '#991b1b',
    glowColor: 'rgba(153,27,27,0.5)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya_dying,
  },
  laila_crying: {
    name: 'Laila (Crying)',
    arabicName: 'ليلى (تبكي)',
    color: '#be185d',
    glowColor: 'rgba(190,24,93,0.4)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila_crying,
  },
  samiri_calf: {
    name: 'Al-Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.5)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.samiri_calf,
  },
  Yahya: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya,
  },
  Laila: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.laila,
  },
  Tarek: {
    name: 'Tarek',
    arabicName: 'طارق',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.tarek,
  },
  FirstEngineer: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.first_engineer,
  },
  Arius: {
    name: 'Arius',
    arabicName: 'آريوس',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.arius,
  },
  Athanasius: {
    name: 'Athanasius',
    arabicName: 'أثناسيوس',
    color: '#d4af37',
    glowColor: 'rgba(212,175,55,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.athanasius,
  },
  Samiri: {
    name: 'Al-Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.samiri,
  },
  Constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.constantine,
  },
  Ramses: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.narrator,
  },
  Iblis: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: ASSET_URLS.characters.narrator,
  },
  hitler: {
    name: 'Hitler',
    arabicName: 'هتلر',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.35)',
    position: 'left',
  },
  stalin: {
    name: 'Stalin',
    arabicName: 'ستالين',
    color: '#b91c1c',
    glowColor: 'rgba(185,28,28,0.35)',
    position: 'left',
  },
  polpot: {
    name: 'Pol Pot',
    arabicName: 'بول بوت',
    color: '#991b1b',
    glowColor: 'rgba(153,27,27,0.35)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.narrator,
  },
};

const SCENE_CHARACTER_TIMELINE: Record<string, string> = {
  'zero-1-1-summons': 'yahya',
  'zero-1-2-prosecution': 'Narrator',
  'one-1-5-1-promise': 'tarek',
  'one-1-5-2-bitter-truth': 'laila',
  'one-1-5-3-no-escape': 'yahya',
  'one-1-5-4-sacrifice': 'tarek',
  'two-2-1-escape': 'yahya',
  'two-2-2-osiris-launch': 'first_engineer',
  'three-3-1-creation': 'yahya',
  'three-3-1b-devil-song': 'Narrator',
  'three-3-2-virus-design': 'first_engineer',
  'four-4-1-desert': 'samiri',
  'four-4-2-crowd-engineering': 'samiri_calf',
  'four-5-1-tarek-message': 'tarek_ghost',
  'four-5-2-analyst-tears': 'yahya_breakdown',
  'five-6a-1-nicaea-debate': 'arius',
  'five-6b-1-constantine': 'constantine',
  'five-6c-1-laila-pain': 'laila_faith',
  'five-6c-2-tarek-second': 'tarek_dream',
  'six-8-1-andalusia': 'Narrator',
  'six-8-2-last-tears': 'Narrator',
  'six-8b-1-berlin': 'Narrator',
  'six-8c-1-death-signatures': 'Narrator',
  'six-8d-1-attack': 'yahya_confront',
  'six-8d-2-final-update': 'first_engineer_exposed',
  'transition-dream': 'tarek_dream',
  'seven-10-1-karbala': 'Narrator',
  'seven-11-1-temptation': 'first_engineer_2',
  'seven-11-2-decision': 'yahya_confront',
  'seven-12-1-truth-leak': 'laila_witness',
  'seven-13-1-awakening': 'yahya',
  'seven-13-2-closing': 'Narrator',
};

// ─── Emotional Tone Styles ───────────────────────────────────────────────────

const EMOTIONAL_OVERLAY: Record<string, string> = {
  dark: 'rgba(0,0,0,0.72)',
  hopeful: 'rgba(15,23,42,0.62)',
  intense: 'rgba(20,0,0,0.68)',
  contemplative: 'rgba(10,10,20,0.68)',
  tragic: 'rgba(5,5,5,0.75)',
};

const TONE_ACCENT: Record<string, string> = {
  dark: '#c9a96e',
  hopeful: '#93c5fd',
  intense: '#fca5a5',
  contemplative: '#a5b4fc',
  tragic: '#fcd34d',
};

const TRACK_URL_CANDIDATES: Record<string, string[]> = {
  track01: [
    '/assets/music-tracks/TRACK-01.mp3',
    '/assets/music-tracks/TRACK-01.m4a',
  ],
  track02: [
    '/assets/music-tracks/TRACK-02.m4a',
    '/assets/music-tracks/TRACK-02.mp3',
  ],
  track03: [
    '/assets/music-tracks/TRACK-03.m4a',
    '/assets/music-tracks/TRACK-03.mp3',
  ],
  track04: [
    '/assets/music-tracks/TRACK-04.m4a',
    '/assets/music-tracks/TRACK-04.mp3',
  ],
  track05: [
    '/assets/music-tracks/TRACK-05.m4a',
  ],
  track06: [
    '/assets/music-tracks/TRACK-06.m4a',
  ],
  track07: [
    '/assets/music-tracks/TRACK-07.m4a',
  ],
  track08: [
    '/assets/music-tracks/TRACK-08.m4a',
  ],
  track09: [
    '/assets/music-tracks/TRACK-09.m4a',
  ],
  track10: [
    '/assets/music-tracks/TRACK-10.m4a',
  ],
  track11: [
    '/assets/music-tracks/TRACK-11.m4a',
  ],
  track12: [
    '/assets/music-tracks/TRACK-12.m4a',
  ],
  track13: [
    '/assets/music-tracks/TRACK-13.m4a',
  ],
  track14: [
    '/assets/music-tracks/TRACK-14.m4a',
    '/assets/music-tracks/TRACK-14.mp3',
  ],
  track15: ['/assets/songs+/ya-rab.m4a'],
};

const SCENE_TRACK_SEQUENCE: Record<string, keyof typeof TRACK_URL_CANDIDATES> = {
  'zero-1-1-summons': 'track02',
  'zero-1-2-prosecution': 'track02',
  'one-1-5-1-promise': 'track04',
  'one-1-5-2-bitter-truth': 'track04',
  'one-1-5-3-no-escape': 'track04',
  'one-1-5-4-sacrifice': 'track04',
  'two-2-1-escape': 'track12',
  'two-2-2-osiris-launch': 'track01',
  'three-3-1-creation': 'track03',
  'three-3-1b-devil-song': 'track15',
  'three-3-2-virus-design': 'track03',
  'four-4-1-desert': 'track05',
  'four-4-2-crowd-engineering': 'track05',
  'four-5-1-tarek-message': 'track01',
  'four-5-2-analyst-tears': 'track01',
  'five-6a-1-nicaea-debate': 'track06',
  'five-6b-1-constantine': 'track06',
  'five-6c-1-laila-pain': 'track06',
  'five-6c-2-tarek-second': 'track06',
  'six-8-1-andalusia': 'track07',
  'six-8-2-last-tears': 'track07',
  'six-8b-1-berlin': 'track08',
  'six-8c-1-death-signatures': 'track08',
  'six-8d-1-attack': 'track12',
  'six-8d-2-final-update': 'track12',
  'transition-dream': 'track13',
  'seven-10-1-karbala': 'track09',
  'seven-11-1-temptation': 'track10',
  'seven-11-2-decision': 'track10',
  'seven-12-1-truth-leak': 'track11',
  'seven-13-1-awakening': 'track11',
  'seven-13-2-closing': 'track14',
};

function getSceneMusicCandidates(sceneId: string, fallbackUrl?: string): string[] {
  const key = SCENE_TRACK_SEQUENCE[sceneId] ?? 'track01';
  const candidates = TRACK_URL_CANDIDATES[key] ?? TRACK_URL_CANDIDATES.track01;
  const result = [...candidates];
  if (fallbackUrl && !result.includes(fallbackUrl)) {
    result.push(fallbackUrl);
  }
  if (!result.includes(ASSET_URLS.audio.main_theme)) {
    result.push(ASSET_URLS.audio.main_theme);
  }
  return result;
}

type ImageCue = {
  src: string;
  points: number[];
  opacity?: number;
  blend?: CSSProperties['mixBlendMode'];
};

const SCENE_IMAGE_CUES: Partial<Record<string, ImageCue>> = {
  'zero-1-1-summons': { src: '/assets/images/01.jpg', points: [0], opacity: 0.2, blend: 'screen' },
  'zero-1-2-prosecution': { src: '/assets/characters/narrator.png', points: [2], opacity: 0.35, blend: 'overlay' },
  'four-4-1-desert': { src: '/assets/images/02.jpg', points: [1], opacity: 0.24, blend: 'soft-light' },
  'four-4-2-crowd-engineering': { src: '/assets/images/03.jpg', points: [1], opacity: 0.24, blend: 'overlay' },
  'six-8-1-andalusia': { src: '/assets/images/04.jpg', points: [1], opacity: 0.22, blend: 'screen' },
  'six-8-2-last-tears': { src: '/assets/images/04.jpg', points: [0], opacity: 0.2, blend: 'screen' },
  'seven-10-1-karbala': { src: '/assets/images/05.jpg', points: [1], opacity: 0.28, blend: 'soft-light' },
  'seven-12-1-truth-leak': { src: '/assets/images/06.jpg', points: [1], opacity: 0.26, blend: 'overlay' },
  'six-8d-1-attack': { src: '/assets/images/07.jpg', points: [0], opacity: 0.26, blend: 'screen' },
};

function parseTrackFromDialogue(line?: string) {
  if (!line) return null;
  const startMatch = line.match(/\[\[TRACK:(\d{1,2}):START\]\]/i);
  if (startMatch) {
    const num = Math.max(1, Math.min(14, parseInt(startMatch[1], 10)));
    return (`track${String(num).padStart(2, '0')}` as keyof typeof TRACK_URL_CANDIDATES);
  }
  const stopMatch = line.match(/\[\[TRACK:(\d{1,2}):STOP\]\]/i);
  if (stopMatch) return 'stop';
  return null;
}

type VoiceCue = { at: number; voice: number };

type VoiceDefinition = { voice: number; sceneId: string; anchor: string; fallbackAt?: number };

const VOICE_DEFINITIONS: VoiceDefinition[] = [
  { voice: 1, sceneId: 'zero-1-2-prosecution', anchor: 'الملف رقم واحد', fallbackAt: 2 },
  { voice: 3, sceneId: 'four-5-1-tarek-message', anchor: 'اذا كنت تستمع لهذا', fallbackAt: 0 },
  { voice: 4, sceneId: 'one-1-5-4-sacrifice', anchor: 'اخي اذا وصلت اليك هذه الرسالة', fallbackAt: 2 },
  { voice: 5, sceneId: 'three-3-2-virus-design', anchor: 'طارق كان محقا', fallbackAt: 9 },
  { voice: 6, sceneId: 'six-8-2-last-tears', anchor: 'ابك كالنساء', fallbackAt: 2 },
  { voice: 7, sceneId: 'six-8-1-andalusia', anchor: 'انهم يفسدون فيها', fallbackAt: 1 },
  { voice: 8, sceneId: 'seven-10-1-karbala', anchor: 'هذا هو مضاد الفيروسات', fallbackAt: 6 },
  { voice: 9, sceneId: 'transition-dream', anchor: 'الخوارزمية لا تستطيع حساب التضحية غير المشروطة', fallbackAt: 6 },
  { voice: 10, sceneId: 'seven-11-2-decision', anchor: 'انا ارفض جنتك المزيفة', fallbackAt: 5 },
  { voice: 11, sceneId: 'seven-13-2-closing', anchor: 'الدفاع قدم شهوده', fallbackAt: 1 },
  { voice: 12, sceneId: 'seven-12-1-truth-leak', anchor: 'لا تفصليه دعي الكود يصل', fallbackAt: 4 },
  { voice: 13, sceneId: 'seven-10-1-karbala', anchor: 'لان الاستسلام ليزيد يعني اعطاء الشرعية', fallbackAt: 4 },
  { voice: 14, sceneId: 'seven-11-1-temptation', anchor: 'البشر غير مؤهلين للحرية يا يحيى', fallbackAt: 4 },
  { voice: 15, sceneId: 'five-6c-1-laila-pain', anchor: 'امي كانت ضحية للمؤسسة ايضا', fallbackAt: 3 },
  { voice: 16, sceneId: 'five-6c-2-tarek-second', anchor: 'اذا رايت نيقية فستفهم كيف تسرق الاديان', fallbackAt: 2 },
  { voice: 17, sceneId: 'seven-13-2-closing', anchor: 'الملف رقم واحد يغلق مؤقتا', fallbackAt: 7 },
  { voice: 18, sceneId: 'seven-13-2-closing', anchor: 'القضية مستمرة والخيار الان لك', fallbackAt: 9 },
];

function normalizeArabicForMatch(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[ؤئ]/g, 'ي')
    .replace(/[^\u0600-\u06FF\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const SCENE_VOICE_CUES: Partial<Record<string, VoiceCue[]>> = VOICE_DEFINITIONS.reduce((acc, def) => {
  const scene = ALL_SCENES[def.sceneId];
  if (!scene?.dialogue?.length) return acc;

  const target = normalizeArabicForMatch(def.anchor);
  const targetTokens = target.split(' ').filter(Boolean);
  let bestIndex = def.fallbackAt ?? 0;
  let bestScore = -1;
  let bestOverlap = 0;
  let bestStrongMatch = false;

  scene.dialogue.forEach((dialogue, idx) => {
    const candidate = normalizeArabicForMatch(dialogue.arabicText || '');
    if (!candidate) return;

    const candidateTokens = new Set(candidate.split(' ').filter(Boolean));
    const overlap = targetTokens.reduce((n, token) => n + (candidateTokens.has(token) ? 1 : 0), 0);
    let score = overlap / Math.max(1, targetTokens.length);
    const strongMatch = Boolean(target && candidate.includes(target));
    if (strongMatch) score += 0.8;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = idx;
      bestOverlap = overlap;
      bestStrongMatch = strongMatch;
    }
  });

  if (targetTokens.length > 0) {
    const minOverlap = Math.min(2, targetTokens.length);
    if (!bestStrongMatch && bestOverlap < minOverlap) return acc;
  }

  if (!acc[def.sceneId]) acc[def.sceneId] = [];
  acc[def.sceneId]!.push({ at: bestIndex, voice: def.voice });
  return acc;
}, {} as Partial<Record<string, VoiceCue[]>>);

function getVoiceCandidates(voiceNumber: number) {
  const padded = String(Math.max(1, Math.min(18, voiceNumber))).padStart(2, '0');
  return [
    `/assets/voices/new-voices/VOICE${padded}.mp3`,
    `/assets/voices/new-voices/VOICE${voiceNumber}.mp3`,
    `/assets/voices/VOICE-${padded}.wav`,
  ];
}

// Special voice for devil scenes
function getDevilVoiceCandidates() {
  return [
    '/assets/voices/new-voices/main-devil.wav',
    '/assets/voices/main-devil.wav',
  ];
}

// ─── Particles ───────────────────────────────────────────────────────────────
// ─── Particles ───────────────────────────────────────────────────────────────

function Particles({ tone }: { tone: string }) {
  const color = TONE_ACCENT[tone] || '#c9a96e';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2.5 + 1,
            height: Math.random() * 2.5 + 1,
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [0, -(Math.random() * 100 + 60)],
            opacity: [0, Math.random() * 0.4 + 0.1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Audio Control UI ─────────────────────────────────────────────────────────
// Clean minimal 4-channel control: BG, Scene, Voice, SFX

interface AudioControlProps {
  bgVol: number;
  sceneVol: number;
  voiceVol: number;
  sfxVol: number;
  isMuted: boolean;
  onBgChange: (v: number) => void;
  onSceneChange: (v: number) => void;
  onVoiceChange: (v: number) => void;
  onSfxChange: (v: number) => void;
  onToggleMute: () => void;
}

function AudioControl({
  bgVol,
  sceneVol,
  voiceVol,
  sfxVol,
  isMuted,
  onBgChange,
  onSceneChange,
  onVoiceChange,
  onSfxChange,
  onToggleMute,
}: AudioControlProps) {
  const [open, setOpen] = useState(false);

  const channels = [
    { key: 'bg', label: 'خلفية', value: bgVol, onChange: onBgChange, color: '#c9a96e' },
    { key: 'scene', label: 'مشهد', value: sceneVol, onChange: onSceneChange, color: '#3b82f6' },
    { key: 'voice', label: 'صوت', value: voiceVol, onChange: onVoiceChange, color: '#22c55e' },
    { key: 'sfx', label: 'مؤثرات', value: sfxVol, onChange: onSfxChange, color: '#ef4444' },
  ];

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Main Toggle Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 ${styles.audioButton}`}
        title="التحكم بالصوت"
      >
        {isMuted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
        <span className="text-[9px] font-arabic-ui tracking-wider">صوت</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full right-0 mb-2 p-4 rounded-xl z-50 min-w-[240px] ${styles.audioPanel}`}
          >
            {/* 4 Channel Sliders */}
            <div className="space-y-3 mb-4">
              {channels.map((ch) => (
                <div key={ch.key} className="flex items-center gap-3">
                  <span className="text-[8px] font-mono w-10 text-white/50">{ch.label}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ch.value}
                    onChange={(e) => ch.onChange(parseFloat(e.target.value))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${ch.color} ${ch.value * 100}%, rgba(255,255,255,0.1) ${ch.value * 100}%)`,
                    }}
                    aria-label={`${ch.label} Volume`}
                  />
                  <span className="text-[8px] font-mono w-6 text-right text-white/40">{Math.round(ch.value * 100)}</span>
                </div>
              ))}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={onToggleMute}
              className={`w-full py-2 rounded-lg text-[9px] font-arabic-ui tracking-wider transition-all duration-200 ${isMuted ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              {isMuted ? '🔊 تفعيل الصوت' : '🔇 كتم الصوت'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Player ─────────────────────────────────────────────────────────────

export function MainPlayer({ initialSceneId = 'zero-1-1-summons' }: MainPlayerProps) {
  const [, setLocation] = useLocation();
  const globalMediaState = useMediaState();
  const {
    play: globalPlay,
    setAccentColor,
    setPrimaryAudioMuted,
    setPrimaryAudioSources,
    setPrimaryAudioVolume,
    registerMedia,
    setDurationMs,
  } = useMediaActions();
  const canonicalMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('canonical') === '1' || params.get('script') === 'canonical';
  }, []);

  // Handle scene parameter from shared URLs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sceneParam = params.get('scene');
    if (sceneParam && sceneParam in ALL_SCENES) {
      setCurrentSceneId(sceneParam);
      setDialogueIndex(0);
      setDisplayedText('');
      setDisplayedArabic('');
      setIsDialogueComplete(false);
      setShowChoices(false);
    }
  }, []);

  // Language state — 'en' or 'ar'
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  // Scene state
  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [displayedArabic, setDisplayedArabic] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDialogueComplete, setIsDialogueComplete] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [choiceProgress, setChoiceProgress] = useState(100);
  const [sceneTransitioning, setSceneTransitioning] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [fxFlash, setFxFlash] = useState(0);
  const [fxShake, setFxShake] = useState(0);
  const [uiPulse, setUiPulse] = useState(0);
  const [, setSceneHistory] = useState<string[]>([]);
  const [autoMode, setAutoMode] = useState<'off' | 'very-slow' | 'slow' | 'normal'>('off');
  const [autoProgress, setAutoProgress] = useState(100);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  // 4-Channel Audio System: BG, Scene, Voice, SFX
  const [bgVol, setBgVol] = useState(0.25);
  const [sceneVol, setSceneVol] = useState(0.40);
  const [voiceVol, setVoiceVol] = useState(0.85);
  const [sfxVol, setSfxVol] = useState(0.35);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scriptTrackOverride, setScriptTrackOverride] = useState<keyof typeof TRACK_URL_CANDIDATES | null>(null);
  const [activeImageCue, setActiveImageCue] = useState<{ src: string; opacity: number; blend: CSSProperties['mixBlendMode']; token: string } | null>(null);
  const [techBoost, setTechBoost] = useState(0);
  const [voiceSyncLock, setVoiceSyncLock] = useState(false);
  const [activeVoiceNumber, setActiveVoiceNumber] = useState<number | null>(null);
  const [osirisEffectId, setOsirisEffectId] = useState<OsirisEffectId | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [canonicalDialogueByScene, setCanonicalDialogueByScene] = useState<Record<string, DialogueLine[]>>({});
  // Multi-track audio refs: base (main theme) + scene overlay
  const baseTrackRef = useRef<HTMLAudioElement | null>(null);
  const sceneTrackRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const voiceSyncRafRef = useRef<number | null>(null);
  const lastVoiceCueRef = useRef<string>('');
  const disabledVoiceTokensRef = useRef<Set<string>>(new Set());
  const playedVoiceNumbersRef = useRef<Set<number>>(new Set());
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const ambientFadeRef = useRef<number | null>(null);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const choiceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSceneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoProgressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPartRef = useRef<number>(-1);
  const fxTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const currentScene: Scene | undefined = ALL_SCENES[currentSceneId];
  useEffect(() => {
    if (!currentScene) return;
    const part = currentScene.part;
    const color =
      part === 0 ? "#c9a96e" :
      part === 1 ? "#ef4444" :
      part === 2 ? "#d4af37" :
      part === 3 ? "#3b82f6" :
      part === 4 ? "#22c55e" :
      part === 5 ? "#f97316" :
      "#8b5cf6";
    setAccentColor(color);
    const estMinutes =
      part === 0 ? 14 :
      part === 1 ? 16 :
      part === 2 ? 18 :
      part === 3 ? 16 :
      part === 4 ? 18 :
      part === 5 ? 14 :
      12;
    setDurationMs(Math.max(10_000, estMinutes * 60 * 1000));
  }, [currentScene, setAccentColor, setDurationMs]);
  const dialogueLines = useMemo(() => {
    if (!currentScene) return [];
    if (!canonicalMode) return currentScene.dialogue || [];
    const canonical = canonicalDialogueByScene[currentSceneId];
    return canonical && canonical.length ? canonical : (currentScene.dialogue || []);
  }, [canonicalMode, canonicalDialogueByScene, currentSceneId, currentScene]);
  const currentDialogue = dialogueLines[dialogueIndex];
  const sceneTrackKey = scriptTrackOverride ?? (SCENE_TRACK_SEQUENCE[currentSceneId] ?? 'track01');
  const isSceneUsingBedOnly = sceneTrackKey === 'track01';
  const rawVoiceCue = canonicalMode ? undefined : SCENE_VOICE_CUES[currentSceneId]?.find((item) => item.at === dialogueIndex);
  const rawVoiceToken = rawVoiceCue ? `${currentSceneId}:${dialogueIndex}:${rawVoiceCue.voice}` : null;
  const currentVoiceCue = rawVoiceCue && rawVoiceToken && !disabledVoiceTokensRef.current.has(rawVoiceToken) ? rawVoiceCue : undefined;
  const isVoicedDialogue = !!currentVoiceCue;
  const isVoiceModeActive = voiceSyncLock && activeVoiceNumber !== null;
  const isArabic = lang === 'ar';
  const timelineCharacterKey = SCENE_CHARACTER_TIMELINE[currentSceneId];
  const rawDialogueCharacterKey = currentDialogue?.character || '';
  const dialogueTextForCharacter = `${currentDialogue?.text || ''} ${currentDialogue?.arabicText || ''}`;
  const resolveCharacterKey = useCallback((rawKey: string, text: string, sceneId: string) => {
    if (CHARACTER_REGEX_PATTERNS.yahya.test(text)) return sceneId === 'four-5-2-analyst-tears' ? 'yahya_breakdown' : 'yahya';
    if (CHARACTER_REGEX_PATTERNS.laila.test(text)) return sceneId === 'seven-12-1-truth-leak' ? 'laila_witness' : 'laila';
    if (CHARACTER_REGEX_PATTERNS.tarek.test(text)) return sceneId === 'four-5-1-tarek-message' ? 'tarek_ghost' : 'tarek';
    if (CHARACTER_REGEX_PATTERNS.engineer.test(text)) return sceneId === 'six-8d-2-final-update' ? 'first_engineer_exposed' : 'first_engineer';
    if (CHARACTER_REGEX_PATTERNS.arius.test(text)) return 'arius';
    if (CHARACTER_REGEX_PATTERNS.athanasius.test(text)) return 'athanasius';
    if (CHARACTER_REGEX_PATTERNS.constantine.test(text)) return 'constantine';
    if (CHARACTER_REGEX_PATTERNS.samiri.test(text)) return CHARACTER_REGEX_PATTERNS.calf.test(text) ? 'samiri_calf' : 'samiri';
    if (rawKey && rawKey in CHARACTER_MAP && rawKey !== 'Narrator') return rawKey;
    if (CHARACTER_REGEX_PATTERNS.yahya.test(text)) return sceneId === 'four-5-2-analyst-tears' ? 'yahya_breakdown' : 'yahya';
    if (CHARACTER_REGEX_PATTERNS.laila.test(text)) return sceneId === 'seven-12-1-truth-leak' ? 'laila_witness' : 'laila';
    if (CHARACTER_REGEX_PATTERNS.tarek.test(text)) return sceneId === 'four-5-1-tarek-message' ? 'tarek_ghost' : 'tarek';
    if (CHARACTER_REGEX_PATTERNS.engineer.test(text)) return sceneId === 'six-8d-2-final-update' ? 'first_engineer_exposed' : 'first_engineer';
    if (CHARACTER_REGEX_PATTERNS.arius.test(text)) return 'arius';
    if (CHARACTER_REGEX_PATTERNS.athanasius.test(text)) return 'athanasius';
    if (CHARACTER_REGEX_PATTERNS.constantine.test(text)) return 'constantine';
    if (CHARACTER_REGEX_PATTERNS.samiri.test(text)) return CHARACTER_REGEX_PATTERNS.calf.test(text) ? 'samiri_calf' : 'samiri';
    return rawKey;
  }, []);
  const dialogueCharacterKey = resolveCharacterKey(rawDialogueCharacterKey, dialogueTextForCharacter, currentSceneId);
  const preferredCharacterKey = dialogueCharacterKey in CHARACTER_MAP
    ? dialogueCharacterKey
    : (timelineCharacterKey || 'Narrator');
  const currentCharConfig = preferredCharacterKey && CHARACTER_MAP[preferredCharacterKey]
    ? CHARACTER_MAP[preferredCharacterKey]
    : CHARACTER_MAP['Narrator'];

  const tone = currentScene?.emotionalTone || 'dark';

  const accentColor = TONE_ACCENT[tone] || '#c9a96e';
  const overlay = EMOTIONAL_OVERLAY[tone] || EMOTIONAL_OVERLAY.dark;
  const { allowVideo } = useBandwidthStrategy();

  useEffect(() => {
    preloadOsirisEffects(allowVideo);
  }, [allowVideo]);

  useEffect(() => {
    if (!canonicalMode) return;
    loadCanonicalDialogueMap().then((map) => setCanonicalDialogueByScene(map));
  }, [canonicalMode]);
  const autoSceneDelayMs: Record<'very-slow' | 'slow' | 'normal', number> = {
    'very-slow': 12000,
    slow: 7000,
    normal: 4000,
  };
  const resolveAsset = useCallback((keyOrUrl: string | undefined) => {
    if (!keyOrUrl) return undefined;
    if (keyOrUrl.includes("://") || keyOrUrl.startsWith("/")) return keyOrUrl;
    const override = getAssetOverride(keyOrUrl);
    if (override) return override;
    const parts = keyOrUrl.split(".");
    let cur: any = ASSET_URLS as any;
    for (const p of parts) {
      if (!cur || typeof cur !== "object") return undefined;
      cur = cur[p];
    }
    return typeof cur === "string" ? cur : undefined;
  }, []);

  // Resolve character image URL using direct asset key mapping
  const resolvedCharImageUrl = useMemo(() => {
    if (!currentCharConfig.imageUrl) return undefined;
    
    // Map character keys to direct asset keys for database lookup
    const charAssetKeyMap: Record<string, string> = {
      'narrator': 'character.narrator',
      'yahya': 'character.yahya',
      'yahya_breakdown': 'character.yahya_breakdown',
      'yahya_confront': 'character.yahya_confront',
      'yahya_dying': 'character.yahya_dying',
      'yahya_main': 'character.yahya_main',
      'laila': 'character.laila',
      'laila_faith': 'character.laila_faith',
      'laila_witness': 'character.laila_witness',
      'laila_crying': 'character.laila_crying',
      'tarek': 'character.tarek',
      'tarek_ghost': 'character.tarek_ghost',
      'tarek_dream': 'character.tarek_dream',
      'first_engineer': 'character.first_engineer',
      'first_engineer_2': 'character.first_engineer_2',
      'first_engineer_confront': 'character.first_engineer_confront',
      'first_engineer_exposed': 'character.first_engineer_exposed',
      'arius': 'character.arius',
      'athanasius': 'character.athanasius',
      'samiri': 'character.samiri',
      'samiri_calf': 'character.samiri_calf',
      'constantine': 'character.constantine',
      'ramses': 'character.ramses',
      'abu_abdullah': 'character.abu_abdullah',
      'dictator': 'character.dictator',
    };
    
    // Get the character key from the current config
    const charKey = preferredCharacterKey || 'narrator';
    const normalizedCharKey = charKey.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const assetKey = charAssetKeyMap[normalizedCharKey];
    
    if (!assetKey) {
      console.warn('[Character] No asset key mapping for character:', charKey);
      // Fallback to the config's imageUrl if available
      return currentCharConfig.imageUrl.startsWith('http') || currentCharConfig.imageUrl.startsWith('/')
        ? currentCharConfig.imageUrl 
        : undefined;
    }
    
    // Try to get the override directly first
    const override = getAssetOverride(assetKey);
    if (override && override.startsWith('http')) {
      return override;
    }
    
    // Fallback to ASSET_URLS proxy resolution
    const charName = normalizedCharKey;
    const proxyUrl = (ASSET_URLS.characters as any)[charName];
    if (proxyUrl && typeof proxyUrl === 'string' && proxyUrl.startsWith('http')) {
      return proxyUrl;
    }
    
    // Final fallback: use the config's imageUrl
    if (currentCharConfig.imageUrl.startsWith('http') || currentCharConfig.imageUrl.startsWith('/')) {
      return currentCharConfig.imageUrl;
    }
    
    console.warn('[Character] Could not resolve image URL for:', charKey, 'assetKey:', assetKey);
    return undefined;
  }, [preferredCharacterKey, currentCharConfig.imageUrl]);

  const burstFx = useCallback((fx: { flash?: number; shake?: boolean; ui?: number }) => {
    fxTimersRef.current.forEach(t => clearTimeout(t));
    fxTimersRef.current = [];
    if (fx.flash != null) {
      setFxFlash(fx.flash);
      fxTimersRef.current.push(setTimeout(() => setFxFlash(0), 650));
    }
    if (fx.shake) {
      setFxShake(1);
      fxTimersRef.current.push(setTimeout(() => setFxShake(0), 520));
    }
    if (fx.ui != null) {
      setUiPulse(fx.ui);
      fxTimersRef.current.push(setTimeout(() => setUiPulse(0), 1100));
    }
  }, []);

  const triggerBeatsForDialogue = useCallback((d: { text?: string; arabicText?: string }) => {
    const t = `${d.text || ""} ${d.arabicText || ""}`.toLowerCase();
    if (
      t.includes("الاهتزاز الكوني") ||
      t.includes("اهتزاز كوني") ||
      t.includes("ارتجاج") ||
      t.includes("رجفة") ||
      t.includes("زلزال") ||
      t.includes("اهتز") ||
      t.includes("ارتعاش") ||
      t.includes("cosmic vibration") ||
      t.includes("shockwave") ||
      t.includes("rumble")
    ) {
      burstFx({ flash: 0.3, shake: true, ui: 1 });
      return;
    }
    if (t.includes("warning") || t.includes("تحذير")) {
      burstFx({ flash: 0.18, shake: true, ui: 1 });
      return;
    }
    if (t.includes("enter") || (t.includes("ضغط") && t.includes("enter"))) {
      burstFx({ flash: 0.22, ui: 0.85 });
      return;
    }
    if (t.includes("explod") || t.includes("انفجر")) {
      burstFx({ flash: 0.28, shake: true, ui: 0.7 });
      return;
    }
    if (t.includes("crimson") || t.includes("red") || t.includes("الأحمر") || t.includes("الاحمر")) {
      burstFx({ flash: 0.12, ui: 0.35 });
      return;
    }
    if (t.includes("osiris") || t.includes("أوزيريس") || t.includes("اوزيريس")) {
      burstFx({ ui: 0.35 });
    }
  }, [burstFx]);

  const enableAudio = useCallback(() => {
    setAudioEnabled(true);
    setShowAudioPrompt(false);
    setIsPlaying(true);
    globalPlay();
  }, [globalPlay]);

  // 4-Channel Volume Handlers
  const handleBgVol = useCallback((v: number) => {
    setBgVol(Math.min(1, Math.max(0, v)));
    if (baseTrackRef.current && !isMuted) {
      baseTrackRef.current.volume = v;
    }
  }, [isMuted]);

  const handleSceneVol = useCallback((v: number) => {
    setSceneVol(Math.min(1, Math.max(0, v)));
    if (sceneTrackRef.current && !isMuted) {
      sceneTrackRef.current.volume = v;
    }
  }, [isMuted]);

  const handleVoiceVol = useCallback((v: number) => {
    setVoiceVol(Math.min(1, Math.max(0, v)));
    if (voiceRef.current && !isMuted) {
      voiceRef.current.volume = v;
    }
  }, [isMuted]);

  const handleSfxVol = useCallback((v: number) => {
    setSfxVol(Math.min(1, Math.max(0, v)));
    if (ambientRef.current && !isMuted) {
      ambientRef.current.volume = v;
    }
  }, [isMuted]);

  // Refs to track paused state for resume from exact same point
  const videoPausedTimeRef = useRef<number>(0);
  const audioPausedTimeRef = useRef<{base: number, scene: number, ambient: number}>({base: 0, scene: 0, ambient: 0});

  // Solid Play/Pause Control - affects all media (audio + video) and pauses at current point
  const handlePlayPause = useCallback(() => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);

    // Control background video
    if (bgVideoRef.current) {
      if (newPlaying) {
        // Resume from paused time
        bgVideoRef.current.currentTime = videoPausedTimeRef.current;
        bgVideoRef.current.play().catch(() => {});
      } else {
        // Store current time and pause
        videoPausedTimeRef.current = bgVideoRef.current.currentTime;
        bgVideoRef.current.pause();
      }
    }

    // Control base track
    if (baseTrackRef.current) {
      if (newPlaying) {
        baseTrackRef.current.currentTime = audioPausedTimeRef.current.base;
        baseTrackRef.current.play().catch(() => {});
      } else {
        audioPausedTimeRef.current.base = baseTrackRef.current.currentTime;
        baseTrackRef.current.pause();
      }
    }

    // Control scene track
    if (sceneTrackRef.current) {
      if (newPlaying) {
        sceneTrackRef.current.currentTime = audioPausedTimeRef.current.scene;
        sceneTrackRef.current.play().catch(() => {});
      } else {
        audioPausedTimeRef.current.scene = sceneTrackRef.current.currentTime;
        sceneTrackRef.current.pause();
      }
    }

    // Control ambient
    if (ambientRef.current) {
      if (newPlaying) {
        ambientRef.current.currentTime = audioPausedTimeRef.current.ambient;
        ambientRef.current.play().catch(() => {});
      } else {
        audioPausedTimeRef.current.ambient = ambientRef.current.currentTime;
        ambientRef.current.pause();
      }
    }

    // Note: Voice is intentionally NOT controlled here - voice cues play independently
    // and should not be affected by the play/pause button

    // Sync with global media controller
    if (newPlaying) {
      globalPlay();
    }
  }, [isPlaying, globalPlay]);

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    // Apply to all audio elements
    if (baseTrackRef.current) baseTrackRef.current.volume = newMuted ? 0 : bgVol;
    if (sceneTrackRef.current) sceneTrackRef.current.volume = newMuted ? 0 : sceneVol;
    if (voiceRef.current) voiceRef.current.volume = newMuted ? 0 : voiceVol;
    if (ambientRef.current) ambientRef.current.volume = newMuted ? 0 : sfxVol;
  }, [isMuted, bgVol, sceneVol, voiceVol, sfxVol]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    onFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const typeText = useCallback((
    text: string,
    arabic: string,
    activeLang: 'en' | 'ar',
    options?: { durationMs?: number; startWithFirstWord?: boolean }
  ) => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setDisplayedText('');
    setDisplayedArabic('');
    setIsTyping(true);
    setIsDialogueComplete(false);

    const activeText = activeLang === 'ar' ? arabic : text;
    const len = activeText.length;
    if (len === 0) {
      setIsTyping(false);
      setIsDialogueComplete(true);
      return;
    }

    const baseSpeed = Math.max(45, Math.min(80, 5500 / Math.max(len, 1)));
    const modeFactor = autoMode === 'very-slow' ? 1.6 : autoMode === 'slow' ? 1.3 : 1;
    const defaultSpeed = Math.round(baseSpeed * modeFactor);
    const syncSpeed = options?.durationMs ? Math.max(18, Math.round(options.durationMs / Math.max(len, 1))) : defaultSpeed;

    const firstWord = activeText.trimStart().split(/\s+/)[0] || '';
    let i = options?.startWithFirstWord ? Math.min(firstWord.length, len) : 0;

    if (i > 0) {
      if (activeLang === 'ar') setDisplayedArabic(arabic.slice(0, i));
      else setDisplayedText(text.slice(0, i));
    }

    const tick = () => {
      i++;
      if (activeLang === 'ar') {
        setDisplayedArabic(arabic.slice(0, i));
      } else {
        setDisplayedText(text.slice(0, i));
      }
      if (i < len) {
        typewriterRef.current = setTimeout(tick, syncSpeed);
      } else {
        setIsTyping(false);
        setIsDialogueComplete(true);
      }
    };

    if (i >= len) {
      setIsTyping(false);
      setIsDialogueComplete(true);
      return;
    }

    typewriterRef.current = setTimeout(tick, syncSpeed);
  }, [autoMode]);



  const advanceDialogue = useCallback(() => {
    if (!currentScene) return;
    const nextIdx = dialogueIndex + 1;
    if (nextIdx < dialogueLines.length) {
      setDialogueIndex(nextIdx);
      setIsDialogueComplete(false);
      setShowCharacter(false);
      setTimeout(() => setShowCharacter(true), 250);
    } else {
      setShowChoices(true);
      if (!currentScene.choices || currentScene.choices.length === 0) {
      }
    }
  }, [currentScene, dialogueIndex, dialogueLines.length]);

  const goToScene = useCallback((sceneId: string, options?: { recordHistory?: boolean }) => {
    if (!ALL_SCENES[sceneId]) return;
    if (options?.recordHistory !== false && sceneId !== currentSceneId) {
      setSceneHistory((prev) => [...prev, currentSceneId].slice(-120));
    }

    setSceneTransitioning(true);
    if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    if (autoSceneTimerRef.current) clearTimeout(autoSceneTimerRef.current);

    setTimeout(() => {
      setCurrentSceneId(sceneId);
      setDialogueIndex(0);
      setDisplayedText('');
      setDisplayedArabic('');
      setShowChoices(false);
      setChoiceProgress(100);
      setBgLoaded(false);
      setVideoReady(false);
      setShowCharacter(false);
      setIsDialogueComplete(false);
      setIsTyping(false);
      setSceneTransitioning(false);
      setTimeout(() => setShowCharacter(true), 600);
    }, 1800);
  }, [currentSceneId]);
  const handleBackScene = useCallback(() => {
    if (!currentScene) return;

    if (showChoices) {
      setShowChoices(false);
      const lastDialogueIndex = Math.max(0, dialogueLines.length - 1);
      setDialogueIndex(lastDialogueIndex);
      return;
    }

    setDialogueIndex((prev) => Math.max(0, prev - 1));
  }, [currentScene, showChoices, dialogueLines.length]);

  const handleChoice = useCallback((choice: SceneChoice) => {
    if (voiceSyncLock) return;
    if (choice.nextSceneId) {
      goToScene(choice.nextSceneId);
    }
  }, [goToScene, voiceSyncLock]);

  const handleAdvance = useCallback(() => {
    if (!audioEnabled) {
      enableAudio();
      return;
    }
    if (showChoices || voiceSyncLock) return;

    if (isTyping) {
      if (isVoicedDialogue) return;
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      setDisplayedText(currentDialogue?.text || '');
      setDisplayedArabic(currentDialogue?.arabicText || '');
      setIsTyping(false);
      setIsDialogueComplete(true);
      return;
    }

    if (isDialogueComplete) {
      advanceDialogue();
    }
  }, [audioEnabled, enableAudio, showChoices, voiceSyncLock, isTyping, isVoicedDialogue, currentDialogue, isDialogueComplete, advanceDialogue]);

  const handleNoChoiceAdvance = useCallback(() => {
    if (!currentScene) return;
    const nextId = currentScene.defaultNextScene;
    if (nextId) {
      goToScene(nextId);
    } else {
      setLocation('/');
    }
  }, [currentScene, goToScene, setLocation]);

  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    const sceneParam = currentSceneId ? `?scene=${encodeURIComponent(currentSceneId)}` : '';
    return `${baseUrl}${currentPath}${sceneParam}`;
  }, [currentSceneId]);

  const handleCopyShareLink = useCallback(() => {
    const url = getShareUrl();
    if (!url) return;
    navigator.clipboard?.writeText(url).catch(() => {});
  }, [getShareUrl]);

  const handleShareNative = useCallback(() => {
    const url = getShareUrl();
    if (!url) return;
    
    // Get current scene info for better sharing
    const sceneTitle = currentScene?.arabicTitle || currentScene?.title || 'OSIRIS';
    const scenePart = currentScene?.part !== undefined ? `Part ${currentScene.part}` : '';
    
    const title = lang === 'ar' 
      ? `OSIRIS — ${sceneTitle}` 
      : `OSIRIS — ${currentScene?.title || 'Interactive Novel'}`;
    
    const text = lang === 'ar' 
      ? `أنا أقرأ "المفسدون في الأرض" - ${sceneTitle} ${scenePart}. انضم إليّ في هذه التجربة السينمائية.`
      : `I'm reading "OSIRIS - The Corruptors on Earth" - ${currentScene?.title || 'Interactive Novel'} ${scenePart}. Join me in this cinematic experience.`;
    
    const nav: any = navigator as any;
    if (nav?.share) {
      nav.share({ title, text, url }).catch(() => {});
    }
  }, [getShareUrl, lang, currentScene]);

  const handleShareTo = useCallback((target: 'whatsapp' | 'telegram' | 'facebook' | 'x' | 'email') => {
    const url = getShareUrl();
    if (!url) return;
    
    // Get current scene info for better sharing
    const sceneTitle = currentScene?.arabicTitle || currentScene?.title || 'OSIRIS';
    const scenePart = currentScene?.part !== undefined ? `Part ${currentScene.part}` : '';
    
    const title = lang === 'ar' 
      ? `OSIRIS — ${sceneTitle}` 
      : `OSIRIS — ${currentScene?.title || 'Interactive Novel'}`;
    
    const text = lang === 'ar' 
      ? `أنا أقرأ "المفسدون في الأرض" - ${sceneTitle} ${scenePart}. انضم إليّ في هذه التجربة السينمائية.`
      : `I'm reading "OSIRIS - The Corruptors on Earth" - ${currentScene?.title || 'Interactive Novel'} ${scenePart}. Join me in this cinematic experience.`;
    
    const shareUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(`${text} — ${title}`);
    const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

    if (target === 'whatsapp') return open(`https://wa.me/?text=${shareText}%20${shareUrl}`);
    if (target === 'telegram') return open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`);
    if (target === 'facebook') return open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
    if (target === 'x') return open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`);
    open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`);
  }, [getShareUrl, lang, currentScene]);


  const handleForwardScript = useCallback(() => {
    if (showChoices) {
      if (currentScene?.choices && currentScene.choices.length > 0) {
        handleChoice(currentScene.choices[0]);
      } else {
        handleNoChoiceAdvance();
      }
      return;
    }

    handleAdvance();
  }, [showChoices, currentScene, handleChoice, handleNoChoiceAdvance, handleAdvance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'BUTTON' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleForwardScript();
      }
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBackScene();
      }
      if (e.key === 'Escape') {
        setLocation('/');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleForwardScript, handleBackScene, setLocation]);

  useEffect(() => {
    if (!currentScene || !currentDialogue || showChoices) return;
    if (isVoicedDialogue) return;
    const text = currentDialogue.text || '';
    const arabic = currentDialogue.arabicText || '';
    const delay = currentDialogue.delay || 0;
    const start = () => {
      triggerBeatsForDialogue(currentDialogue);
      typeText(text, arabic, lang);
    };
    if (delay > 0) {
      const t = setTimeout(start, delay);
      return () => clearTimeout(t);
    }
    start();
  }, [currentScene?.id, dialogueIndex, showChoices, lang, currentDialogue, isVoicedDialogue, triggerBeatsForDialogue, typeText]);

  useEffect(() => {
    if (!currentScene) return;
    const next = detectOsirisEffectId({
      sceneId: currentSceneId,
      sceneTitle: currentScene.title,
      sceneArabicTitle: currentScene.arabicTitle,
      visualEffect: currentScene.visualEffect,
      text: currentDialogue?.text,
      arabicText: currentDialogue?.arabicText,
    });
    setOsirisEffectId(next);
  }, [currentSceneId, currentScene?.title, currentScene?.arabicTitle, currentScene?.visualEffect, dialogueIndex, currentDialogue?.text, currentDialogue?.arabicText]);

  useEffect(() => {
    if (!showChoices || !currentScene?.choices?.length) return;
    if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);

    const timerMs = 30000;
    const startTime = Date.now();

    choiceIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / timerMs) * 100);
      setChoiceProgress(remaining);

      if (elapsed >= timerMs) {
        clearInterval(choiceIntervalRef.current!);
        const firstChoice = currentScene.choices![0];
        if (firstChoice) {
          handleChoice(firstChoice);
        }
      }
    }, 50);

    return () => {
      if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);
    };
  }, [showChoices, currentScene?.id, handleChoice]);

  useEffect(() => {
    if (autoSceneTimerRef.current) {
      clearTimeout(autoSceneTimerRef.current);
      autoSceneTimerRef.current = null;
    }
    if (autoProgressIntervalRef.current) {
      clearInterval(autoProgressIntervalRef.current);
      autoProgressIntervalRef.current = null;
    }
    setAutoProgress(100);

    if (autoMode === 'off' || sceneTransitioning || voiceSyncLock) return;

    // Use refs to avoid stale closures
    const currentSceneRef = currentScene;
    const currentDialogueIndexRef = dialogueIndex;
    const currentDialogueLinesRef = dialogueLines;

    let action: (() => void) | null = null;

    if (showChoices) {
      const firstChoice = currentSceneRef?.choices?.[0];
      if (firstChoice) {
        action = () => handleChoice(firstChoice);
      } else {
        action = () => handleNoChoiceAdvance();
      }

    } else if (isDialogueComplete && !isTyping) {
      action = () => {
        if (currentDialogueIndexRef < (currentDialogueLinesRef.length || 1) - 1) {
          advanceDialogue();
        } else {
          setShowChoices(true);
        }
      };
    }

    if (!action) return;

    const delay = autoSceneDelayMs[autoMode];
    const startTime = Date.now();

    autoProgressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / delay) * 100);
      setAutoProgress(remaining);
    }, 50);

    autoSceneTimerRef.current = setTimeout(() => {
      if (autoProgressIntervalRef.current) {
        clearInterval(autoProgressIntervalRef.current);
        autoProgressIntervalRef.current = null;
      }
      setAutoProgress(0);
      action?.();
    }, delay);

    return () => {
      if (autoSceneTimerRef.current) {
        clearTimeout(autoSceneTimerRef.current);
        autoSceneTimerRef.current = null;
      }
      if (autoProgressIntervalRef.current) {
        clearInterval(autoProgressIntervalRef.current);
        autoProgressIntervalRef.current = null;
      }
    };
  }, [autoMode, sceneTransitioning, voiceSyncLock, showChoices, currentScene?.id, dialogueIndex, isDialogueComplete, isTyping, advanceDialogue, handleChoice, handleNoChoiceAdvance]);

  useEffect(() => {
    setScriptTrackOverride(null);
    setVoiceSyncLock(false);
    setActiveVoiceNumber(null);
    setShareMenuOpen(false);
    lastVoiceCueRef.current = '';
  }, [currentSceneId]);

  useEffect(() => {
    const parsed = parseTrackFromDialogue(`${currentDialogue?.text || ''} ${currentDialogue?.arabicText || ''}`);
    if (!parsed) return;
    if (parsed === 'stop') {
      setScriptTrackOverride(null);
      return;
    }
    setScriptTrackOverride(parsed);
  }, [currentDialogue?.text, currentDialogue?.arabicText]);

  useEffect(() => {
    const cue = SCENE_IMAGE_CUES[currentSceneId];
    if (!cue || !cue.points.includes(dialogueIndex)) return;
    setActiveImageCue({
      src: cue.src,
      opacity: cue.opacity ?? 0.22,
      blend: cue.blend ?? 'screen',
      token: `${currentSceneId}-${dialogueIndex}-${Date.now()}`,
    });
    setTechBoost(1);
    const t = setTimeout(() => setTechBoost(0), 1800);
    return () => clearTimeout(t);
  }, [currentSceneId, dialogueIndex]);


  // --- Music candidate normalization logic moved to render scope ---
  const normalizedSceneCandidates = useMemo(() => {
    const normalize = (url: string) => {
      try {
        return new URL(url, window.location.href).href;
      } catch {
        return url;
      }
    };

    const sceneFallbackMusicUrl = resolveAsset(currentScene?.musicKey);
    const sceneTrackCandidates = TRACK_URL_CANDIDATES[sceneTrackKey] ?? TRACK_URL_CANDIDATES.track01;
    const desiredSceneCandidates = [...sceneTrackCandidates];
    if (sceneFallbackMusicUrl && !desiredSceneCandidates.includes(sceneFallbackMusicUrl)) {
      desiredSceneCandidates.push(sceneFallbackMusicUrl);
    }
    if (!desiredSceneCandidates.includes(ASSET_URLS.audio.main_theme)) {
      desiredSceneCandidates.push(ASSET_URLS.audio.main_theme);
    }
    return desiredSceneCandidates.map((u) => normalize(u));
  }, [currentScene?.musicKey, sceneTrackKey, resolveAsset]);

  useEffect(() => {
    if (!audioEnabled) return;
    const shouldPlay = globalMediaState.isPlaying;
    const desiredAmbientUrl = (currentScene?.ambientKeys ?? [])
      .map(k => resolveAsset(k))
      .find((u): u is string => typeof u === "string" && u.length > 0);

    const fade = (
      audio: HTMLAudioElement,
      target: number,
      ref: { current: number | null }
    ) => {
      const targetVolume = Math.min(1, Math.max(0, target));
      const startVolume = audio.volume;
      const durationMs = 1500;
      const startAt = performance.now();
      if (ref.current) cancelAnimationFrame(ref.current);

      const tick = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - startAt) / durationMs));
        const next = startVolume + (targetVolume - startVolume) * t;
        audio.volume = Math.min(1, Math.max(0, next));
        if (t < 1) {
          ref.current = requestAnimationFrame(tick);
        } else {
          ref.current = null;
        }
      };

      ref.current = requestAnimationFrame(tick);
      if (shouldPlay && audio.paused) audio.play().catch(() => {});
    };

    setPrimaryAudioMuted(isMuted);
    setPrimaryAudioSources(normalizedSceneCandidates || [], true);

    if (desiredAmbientUrl) {
      if (!ambientRef.current) {
        ambientRef.current = new Audio(normalize(desiredAmbientUrl));
        ambientRef.current.preload = 'metadata';
        ambientRef.current.loop = true;
        ambientRef.current.volume = isMuted ? 0 : 0;
        if (shouldPlay) ambientRef.current.play().catch(() => {});
        registerMedia(ambientRef.current);
      } else {
        const nextSrc = normalize(desiredAmbientUrl);
        if (ambientRef.current.src !== nextSrc) {
          ambientRef.current.pause();
          ambientRef.current.src = nextSrc;
          ambientRef.current.loop = true;
          ambientRef.current.volume = 0;
          if (shouldPlay) ambientRef.current.play().catch(() => {});
        }
      }
    } else if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current.src = '';
      ambientRef.current = null;
    }

    const baseMusic = isMuted ? 0 : bgVol;
    const voiceMixFactor = voiceSyncLock ? 0.46 : 1;
    setPrimaryAudioVolume(baseMusic * voiceMixFactor);

    return () => {
      if (ambientFadeRef.current) cancelAnimationFrame(ambientFadeRef.current);
    };
  }, [audioEnabled, globalMediaState.isPlaying, currentSceneId, currentScene?.musicKey, currentScene?.ambientKeys, isMuted, bgVol, resolveAsset, sceneTrackKey, voiceSyncLock, registerMedia, setPrimaryAudioMuted, setPrimaryAudioSources, setPrimaryAudioVolume, normalizedSceneCandidates]);

  useEffect(() => {
    if (!audioEnabled || !globalMediaState.isPlaying || showChoices || !currentDialogue || !currentVoiceCue) {
      setVoiceSyncLock(false);
      setActiveVoiceNumber(null);
      return;
    }

    if (currentVoiceCue.voice === 17 && playedVoiceNumbersRef.current.has(17)) return;

    const token = `${currentSceneId}:${dialogueIndex}:${currentVoiceCue.voice}`;
    if (lastVoiceCueRef.current === token) return;
    lastVoiceCueRef.current = token;

    setVoiceSyncLock(true);
    setActiveVoiceNumber(currentVoiceCue.voice);

    const candidates = getVoiceCandidates(currentVoiceCue.voice);
    if (!voiceRef.current) {
      voiceRef.current = new Audio();
      voiceRef.current.preload = 'metadata';
      voiceRef.current.loop = false;
      // Note: Voice is NOT registered with media controller to prevent play/pause interference
    }

    const voice = voiceRef.current;
    voice.volume = isMuted ? 0 : voiceVol;
    const fullText = currentDialogue.text || '';
    const fullArabic = currentDialogue.arabicText || '';

    let cancelled = false;
    let started = false;
    let lastVisible = 0;
    let lastRendered = 0;
    let lastUpdateMs = 0;

  const syncDisplayedTextToVoice = () => {
      if (cancelled || voice.ended || voice.paused) {
        if (voiceSyncRafRef.current) {
          cancelAnimationFrame(voiceSyncRafRef.current);
          voiceSyncRafRef.current = null;
        }
        return;
      }
      const activeText = lang === 'ar' ? fullArabic : fullText;
      const len = activeText.length;
      if (len === 0) {
        setDisplayedText('');
        setDisplayedArabic('');
        setIsTyping(false);
        setIsDialogueComplete(true);
        return;
      }

      const firstWord = activeText.trimStart().split(/\s+/)[0] || '';
      const startLen = Math.min(firstWord.length, len);
      const estimatedDuration =
        Number.isFinite(voice.duration) && voice.duration > 0
          ? voice.duration
          : (currentDialogue.duration ? currentDialogue.duration / 1000 : 0);
      const progress =
        estimatedDuration > 0 ? Math.min(1, Math.max(0, voice.currentTime / estimatedDuration)) : 0;
      const visibleChars = startLen + Math.floor((len - startLen) * progress);
      const safeVisible = Math.max(lastVisible, Math.max(startLen, Math.min(len, visibleChars)));
      lastVisible = safeVisible;

      const now = performance.now();
      if (safeVisible === lastRendered || now - lastUpdateMs < 33) {
        if (!voice.paused && !voice.ended) {
          voiceSyncRafRef.current = requestAnimationFrame(syncDisplayedTextToVoice);
        }
        return;
      }
      lastRendered = safeVisible;
      lastUpdateMs = now;

      if (lang === 'ar') {
        setDisplayedArabic(fullArabic.slice(0, safeVisible));
        setDisplayedText('');
      } else {
        setDisplayedText(fullText.slice(0, safeVisible));
        setDisplayedArabic('');
      }

      if (!voice.paused && !voice.ended) {
        voiceSyncRafRef.current = requestAnimationFrame(syncDisplayedTextToVoice);
      }
    };

    const startSync = () => {
      if (cancelled || started) return;
      started = true;
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
        typewriterRef.current = null;
      }
      setIsTyping(true);
      setIsDialogueComplete(false);
      syncDisplayedTextToVoice();
      voice.play().then(() => {
        if (voiceSyncRafRef.current) cancelAnimationFrame(voiceSyncRafRef.current);
        voiceSyncRafRef.current = requestAnimationFrame(syncDisplayedTextToVoice);
      }).catch(() => {
        disabledVoiceTokensRef.current.add(token);
        setVoiceSyncLock(false);
        setActiveVoiceNumber(null);
      });
    };

    const tryCandidate = (index: number) => {
      if (cancelled || index >= candidates.length) {
        disabledVoiceTokensRef.current.add(token);
        setVoiceSyncLock(false);
        setActiveVoiceNumber(null);
        // FALLBACK: Start typewriter when voice fails
        if (typewriterRef.current) clearTimeout(typewriterRef.current);
        setIsTyping(true);
        setIsDialogueComplete(false);
        const activeText = lang === 'ar' ? fullArabic : fullText;
        const len = activeText.length;
        if (len > 0) {
          let i = 0;
          const tick = () => {
            i++;
            if (lang === 'ar') setDisplayedArabic(fullArabic.slice(0, i));
            else setDisplayedText(fullText.slice(0, i));
            if (i < len) {
              typewriterRef.current = setTimeout(tick, 50);
            } else {
              setIsTyping(false);
              setIsDialogueComplete(true);
            }
          };
          typewriterRef.current = setTimeout(tick, 50);
        } else {
          setIsTyping(false);
          setIsDialogueComplete(true);
        }
        return;
      }
      voice.onerror = () => tryCandidate(index + 1);
      voice.onloadedmetadata = startSync;
      voice.oncanplaythrough = startSync;
      voice.onended = () => {
        if (cancelled) return;
        if (voiceSyncRafRef.current) {
          cancelAnimationFrame(voiceSyncRafRef.current);
          voiceSyncRafRef.current = null;
        }
        if (lang === 'ar') {
          setDisplayedArabic(fullArabic);
          setDisplayedText('');
        } else {
          setDisplayedText(fullText);
          setDisplayedArabic('');
        }
        setIsTyping(false);
        setIsDialogueComplete(true);
        setVoiceSyncLock(false);
        setActiveVoiceNumber(null);
        if (currentVoiceCue.voice === 17) playedVoiceNumbersRef.current.add(17);
      };
      voice.src = candidates[index];
      voice.currentTime = 0;
      voice.load();
    };

    tryCandidate(0);

    return () => {
      cancelled = true;
      if (voiceSyncRafRef.current) {
        cancelAnimationFrame(voiceSyncRafRef.current);
        voiceSyncRafRef.current = null;
      }
      voice.onended = null;
      voice.onloadedmetadata = null;
      voice.oncanplaythrough = null;
      voice.onerror = null;
      voice.pause();
    };

  }, [audioEnabled, globalMediaState.isPlaying, showChoices, currentSceneId, dialogueIndex, currentDialogue, currentVoiceCue, isMuted, voiceVol, lang, registerMedia]);

  // ── Multi-Track Audio System: Base (main theme) + Scene Overlay ─────────────────
  useEffect(() => {
    if (!audioEnabled) return;
    const shouldPlay = isPlaying;

    // Base track - always track01 (main theme)
    const baseCandidates = TRACK_URL_CANDIDATES.track01;
    if (!baseTrackRef.current) {
      baseTrackRef.current = new Audio(baseCandidates[0]);
      baseTrackRef.current.preload = 'metadata';
      baseTrackRef.current.loop = true;
      baseTrackRef.current.volume = isMuted ? 0 : bgVol * 0.6; // Base at 60% of BG volume
      if (shouldPlay) baseTrackRef.current.play().catch(() => {});
      registerMedia(baseTrackRef.current);
    } else {
      // Update volume if changed
      baseTrackRef.current.volume = isMuted ? 0 : bgVol * 0.6;
    }

    // Scene overlay track - changes per scene
    const sceneCandidates = TRACK_URL_CANDIDATES[sceneTrackKey] ?? TRACK_URL_CANDIDATES.track01;
    const sceneUrl = sceneCandidates[0];

    if (!sceneTrackRef.current) {
      // First time - create and play
      if (sceneTrackKey !== 'track01') { // Only if different from base
        sceneTrackRef.current = new Audio(sceneUrl);
        sceneTrackRef.current.preload = 'metadata';
        sceneTrackRef.current.loop = true;
        sceneTrackRef.current.volume = isMuted ? 0 : sceneVol;
        if (shouldPlay) sceneTrackRef.current.play().catch(() => {});
        registerMedia(sceneTrackRef.current);
      }
    } else {
      // Check if scene changed
      const currentSceneSrc = sceneTrackRef.current.src;
      const normalizedCurrent = currentSceneSrc ? new URL(currentSceneSrc).pathname : '';
      const normalizedNew = new URL(sceneUrl, window.location.href).pathname;

      if (normalizedCurrent !== normalizedNew && sceneTrackKey !== 'track01') {
        // Scene changed - crossfade
        const oldTrack = sceneTrackRef.current;
        const fadeOut = () => {
          let vol = oldTrack.volume;
          const fade = setInterval(() => {
            vol -= 0.05;
            if (vol <= 0) {
              clearInterval(fade);
              oldTrack.pause();
              oldTrack.src = '';
            } else {
              oldTrack.volume = Math.max(0, vol);
            }
          }, 50);
        };
        fadeOut();

        // Create new track
        sceneTrackRef.current = new Audio(sceneUrl);
        sceneTrackRef.current.preload = 'metadata';
        sceneTrackRef.current.loop = true;
        sceneTrackRef.current.volume = 0;
        if (shouldPlay) sceneTrackRef.current.play().catch(() => {});
        registerMedia(sceneTrackRef.current);

        // Fade in
        let newVol = 0;
        const fadeIn = setInterval(() => {
          newVol += 0.05;
          if (newVol >= (isMuted ? 0 : sceneVol)) {
            clearInterval(fadeIn);
            sceneTrackRef.current!.volume = isMuted ? 0 : sceneVol;
          } else {
            sceneTrackRef.current!.volume = newVol;
          }
        }, 50);
      } else {
        // Just update volume
        sceneTrackRef.current.volume = isMuted ? 0 : sceneVol;
      }
    }

    // Handle ambient/SFX
    const desiredAmbientUrl = (currentScene?.ambientKeys ?? [])
      .map(k => resolveAsset(k))
      .find((u): u is string => typeof u === "string" && u.length > 0);

    if (desiredAmbientUrl) {
      if (!ambientRef.current) {
        ambientRef.current = new Audio(desiredAmbientUrl);
        ambientRef.current.preload = 'metadata';
        ambientRef.current.loop = true;
        ambientRef.current.volume = isMuted ? 0 : sfxVol;
        if (shouldPlay) ambientRef.current.play().catch(() => {});
        registerMedia(ambientRef.current);
      } else if (ambientRef.current.src !== desiredAmbientUrl) {
        ambientRef.current.src = desiredAmbientUrl;
        ambientRef.current.volume = isMuted ? 0 : sfxVol;
        if (shouldPlay) ambientRef.current.play().catch(() => {});
      } else {
        ambientRef.current.volume = isMuted ? 0 : sfxVol;
      }
    } else if (ambientRef.current) {
      ambientRef.current.pause();
    }

    return () => {
      // Cleanup handled in main cleanup effect
    };
  }, [audioEnabled, isPlaying, currentSceneId, sceneTrackKey, isMuted, bgVol, sceneVol, sfxVol, resolveAsset, registerMedia]);

  // ── Background video ─────────────────────────────────────────────────────────
  useEffect(() => {
    const bgVideoSrc = resolveAsset(currentScene?.backgroundVideo);
    if (!allowVideo) {
      if (bgVideoRef.current) bgVideoRef.current.pause();
      return;
    }
    if (!globalMediaState.isPlaying) {
      if (bgVideoRef.current) bgVideoRef.current.pause();
      return;
    }
    if (bgVideoRef.current && bgVideoSrc) {
      // Only reload if source changed - prevents jump on resume
      const currentSrc = bgVideoRef.current.currentSrc || bgVideoRef.current.src;
      if (currentSrc !== bgVideoSrc) {
        bgVideoRef.current.src = bgVideoSrc;
        bgVideoRef.current.load();
      }
      bgVideoRef.current.play().catch(() => {});
    }
  }, [allowVideo, globalMediaState.isPlaying, currentSceneId, currentScene?.backgroundVideo, resolveAsset]);

  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;
    return registerMedia(v);
  }, [currentSceneId, registerMedia, videoReady]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (voiceSyncRafRef.current) cancelAnimationFrame(voiceSyncRafRef.current);
      if (ambientFadeRef.current) cancelAnimationFrame(ambientFadeRef.current);
      // Cleanup all audio elements
      if (baseTrackRef.current) { baseTrackRef.current.pause(); baseTrackRef.current.src = ''; }
      if (sceneTrackRef.current) { sceneTrackRef.current.pause(); sceneTrackRef.current.src = ''; }
      if (ambientRef.current) { ambientRef.current.pause(); ambientRef.current.src = ''; }
      if (voiceRef.current) { voiceRef.current.pause(); voiceRef.current.src = ''; }
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);
      if (autoSceneTimerRef.current) clearTimeout(autoSceneTimerRef.current);
      if (autoProgressIntervalRef.current) clearInterval(autoProgressIntervalRef.current);
      fxTimersRef.current.forEach(t => clearTimeout(t));
    };

  }, []);

  // ─── Scene not found ──────────────────────────────────────────────────────────
  if (!currentScene) {
    return (
      <div className="w-screen h-dvh bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl mb-4 font-mono text-amber-400">Scene not found: {currentSceneId}</p>
          <button
            onClick={() => goToScene('zero-1-1-summons')}
            className="px-6 py-3 bg-amber-600 rounded-lg hover:bg-amber-500 transition-colors font-mono"
          >
            ← Return to Beginning
          </button>
        </div>
      </div>
    );
  }
  const partLabel = PART_LABELS[currentScene.part] || { en: `Part ${currentScene.part}`, ar: `الجزء ${currentScene.part}` };
  const sceneKeys = Object.keys(ALL_SCENES);
  const currentIdx = sceneKeys.indexOf(currentSceneId);
  const timerSeconds = Math.ceil(choiceProgress / 100 * 30);
  const isEndOfScene = showChoices && (!currentScene.choices || currentScene.choices.length === 0);
  const isAutoRunning = autoMode !== 'off' && autoProgress < 100;
  const autoElapsed = Math.max(0, Math.min(1, (100 - autoProgress) / 100));
  const autoTop = Math.min(1, autoElapsed * 4);
  const autoRight = Math.min(1, Math.max(0, (autoElapsed - 0.25) * 4));
  const autoBottom = Math.min(1, Math.max(0, (autoElapsed - 0.5) * 4));
  const autoLeft = Math.min(1, Math.max(0, (autoElapsed - 0.75) * 4));

  const bgVideoSrc = resolveAsset(currentScene.backgroundVideo);
  const bgImageSrc = resolveAsset(currentScene.backgroundImage);

  const grade = (() => {
    switch (currentScene.emotionalTone) {
      case 'hopeful':
        return { b: 0.6, s: 0.74, c: 1.05 };
      case 'urgent':
        return { b: 0.5, s: 0.78, c: 1.22 };
      case 'tragic':
        return { b: 0.52, s: 0.62, c: 1.1 };
      case 'contemplative':
        return { b: 0.58, s: 0.65, c: 1.02 };
      case 'intense':
        return { b: 0.55, s: 0.72, c: 1.12 };
      case 'dark':
      default:
        return { b: 0.52, s: 0.65, c: 1.1 };
    }
  })();

  const mediaFilter = `brightness(${grade.b}) saturate(${grade.s}) contrast(${grade.c})`;
  const uiGlow = Math.max(0, Math.min(1, uiPulse));

  return (
    <motion.div
      data-testid="scene-container"
      className="relative w-screen h-dvh overflow-hidden bg-black select-none font-novel"
      onClick={handleAdvance}
      animate={fxShake ? { x: [0, -4, 3, -2, 2, 0], y: [0, 2, -2, 3, -1, 0] } : { x: 0, y: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <CinematicStage
        scene={currentScene}
        sceneId={currentSceneId}
        bgImageSrc={bgImageSrc}
        bgVideoSrc={bgVideoSrc}
        audioDescSrcEn={currentScene.backgroundVideoAudioDescEn}
        audioDescSrcAr={currentScene.backgroundVideoAudioDescAr}
        allowVideo={allowVideo}
        bgLoaded={bgLoaded}
        setBgLoaded={setBgLoaded}
        videoReady={videoReady}
        setVideoReady={setVideoReady}
        overlay={overlay}
        mediaFilter={mediaFilter}
        videoRef={bgVideoRef}
        fx={{ flash: fxFlash, shake: fxShake, uiPulse }}
      />
      <OsirisEffectLayer effectId={osirisEffectId} allowVideo={allowVideo} />
        <GlobalMediaLayer primaryAudioSources={normalizedSceneCandidates} />
      {activeVoiceNumber && (
        <motion.div
          className="absolute top-6 right-6 z-30 px-3 py-2 rounded-lg border"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: [0.6, 1, 0.7], y: 0 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'rgba(7,18,28,0.78)',
            borderColor: 'rgba(120,220,255,0.4)',
            boxShadow: '0 0 24px rgba(80,220,255,0.18)',
          }}
        >
          <div className="text-[10px] font-mono tracking-widest text-cyan-200/90">VOICE CUE {String(activeVoiceNumber).padStart(2, '0')}</div>
          <div className="mt-1 flex items-end gap-1">
            {[0, 1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                className="w-1.5 rounded-sm bg-cyan-300/80"
                animate={{ height: [4, 12 + (bar % 3) * 6, 5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.55 + bar * 0.11, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </motion.div>
      )}


      {/* ── AMBIENT PARTICLES ── */}
      {activeImageCue && (
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImageCue.token}
            src={activeImageCue.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: activeImageCue.opacity, scale: [1.03, 1.06, 1.03], x: ['0%', '0.8%', '0%'], y: ['0%', '-0.4%', '0%'] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.65 }, scale: { duration: 16, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 13, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 15, repeat: Infinity, ease: 'easeInOut' } }}
            style={{
              mixBlendMode: activeImageCue.blend || 'screen',
              zIndex: 7,
              filter: 'saturate(1.1) contrast(1.05)'
            }}
            onError={() => setActiveImageCue(null)}
          />
        </AnimatePresence>
      )}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: techBoost ? [0.06, 0.2, 0.08] : [0.02, 0.06, 0.03], x: techBoost ? [0, 2, -2, 0] : 0 }}
        transition={{ duration: techBoost ? 1.2 : 3.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'repeating-linear-gradient(90deg, rgba(120,200,255,0.05) 0px, rgba(120,200,255,0.0) 1px, rgba(0,0,0,0) 4px)',
          mixBlendMode: 'screen',
          zIndex: 8,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ y: ['-100%', '100%'], opacity: techBoost ? [0, 0.32, 0] : [0, 0.14, 0] }}
        transition={{ duration: techBoost ? 2.4 : 4.8, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(to bottom, rgba(0,255,255,0), rgba(0,255,255,0.18), rgba(0,255,255,0))',
          zIndex: 8,
        }}
      />

      {isVoiceModeActive && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.25, 0.42, 0.3], scale: [1, 1.03, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(circle at 50% 55%, rgba(40,200,255,0.18), rgba(5,20,35,0.72) 45%, rgba(0,0,0,0.9) 80%)',
              mixBlendMode: 'screen',
              zIndex: 12,
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.08, 0.2, 0.08], backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }}
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(140,240,255,0.1) 0px, rgba(140,240,255,0.0) 2px, rgba(0,0,0,0) 6px)',
              zIndex: 12,
            }}
          />
        </>
      )}

      <Particles tone={tone} />

      {/* ── SCENE TRANSITION OVERLAY ── */}
      <AnimatePresence>
        {sceneTransitioning && (
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
          />
        )}
      </AnimatePresence>

      {!isVoiceModeActive && (
        <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6 h-11 sm:h-12 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={(e) => { e.stopPropagation(); setLocation('/'); }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-white/10 ${styles.dynamicColor}`}
            style={{ '--dynamic-color': 'rgba(201,169,110,0.65)' } as React.CSSProperties}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points={isArabic ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
            </svg>
            <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'الرئيسية' : 'HOME'}</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <img
              src={osirisLogo}
              alt="OSIRIS"
              className="w-5 h-5 opacity-45"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`flex items-center gap-2 sm:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleFullscreen}
              className={`px-2 py-1 text-[9px] font-mono rounded-lg tracking-wider transition-all duration-200 hover:bg-white/10 ${styles.dynamicBorder} ${styles.dynamicBg} ${styles.dynamicColor}`}
              style={{
                '--dynamic-border': 'rgba(201,169,110,0.2)',
                '--dynamic-bg': 'rgba(0,0,0,0.5)',
                '--dynamic-color': 'rgba(201,169,110,0.85)'
              } as React.CSSProperties}
            >
              {isFullscreen ? (isArabic ? 'إغلاق ملء الشاشة' : 'EXIT FULL') : (isArabic ? 'ملء الشاشة' : 'FULL')}
            </button>

            <div
              className={`flex items-center rounded-lg overflow-hidden ${styles.dynamicBorder} ${styles.dynamicBg}`}
              style={{
                '--dynamic-border': 'rgba(201,169,110,0.2)',
                '--dynamic-bg': 'rgba(0,0,0,0.5)'
              } as React.CSSProperties}
            >
              <button
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1 text-[9px] font-mono tracking-wider transition-all duration-200 ${styles.dynamicBg} ${styles.dynamicColor}`}
                style={{
                  '--dynamic-bg': lang === 'ar' ? 'rgba(201,169,110,0.25)' : 'transparent',
                  '--dynamic-color': lang === 'ar' ? '#c9a96e' : 'rgba(255,255,255,0.35)'
                } as React.CSSProperties}
              >عر</button>
              <div className={styles.separatorLine} style={{ '--auto-line': 'rgba(201,169,110,0.15)' } as React.CSSProperties} />
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[9px] font-mono tracking-wider transition-all duration-200 ${styles.dynamicBg} ${styles.dynamicColor}`}
                style={{
                  '--dynamic-bg': lang === 'en' ? 'rgba(201,169,110,0.25)' : 'transparent',
                  '--dynamic-color': lang === 'en' ? '#c9a96e' : 'rgba(255,255,255,0.35)'
                } as React.CSSProperties}
              >EN</button>
            </div>
          </motion.div>
        </div>
      )}


      {/* ── PART LABEL (bottom of top bar) ── */}
      <motion.div
        key={currentSceneId + '-part'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`absolute z-20 flex flex-col items-center px-3 py-1 rounded-full ${styles.dynamicPartLabel}`}
        style={{
          '--dynamic-bg': 'rgba(0,0,0,0.35)',
          '--dynamic-border': '1px solid rgba(255,255,255,0.06)',
          '--dynamic-backdrop': 'blur(10px)'
        } as React.CSSProperties}
      >
        {lang === 'ar' ? (
          <span className="text-amber-400/70 text-[12px] font-arabic-title leading-none" dir="rtl">
            {partLabel.ar}
          </span>
        ) : (
          <span className="text-amber-400/50 text-[9px] font-mono tracking-[0.28em] uppercase leading-none">
            {partLabel.en}
          </span>
        )}
      </motion.div>

      {/* ── CHARACTER PORTRAIT ── */}
      <AnimatePresence mode="wait">
        {showCharacter && resolvedCharImageUrl && preferredCharacterKey !== 'Narrator' && (
          <motion.div
            key={dialogueCharacterKey + '-portrait-' + dialogueIndex}
            className={`absolute bottom-44 sm:bottom-32 ${currentCharConfig.position === 'left' ? 'left-4 sm:left-6 md:left-14' : 'right-4 sm:right-6 md:right-14'} z-30 pointer-events-none`}
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{ opacity: 0.92, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative">
              <div
                className={`absolute -inset-4 rounded-3xl blur-2xl opacity-25 ${styles.dynamicGlow}`}
                style={{ '--glow-color': currentCharConfig.glowColor } as React.CSSProperties}
              />
              <img
                src={resolvedCharImageUrl}
                alt={currentCharConfig.name}
                className={`relative w-20 h-28 sm:w-28 sm:h-40 md:w-36 md:h-52 object-cover rounded-2xl ${styles.dynamicPortrait}`}
                style={{
                  '--portrait-shadow': `0 0 50px ${currentCharConfig.glowColor}, 0 20px 60px rgba(0,0,0,0.7)`,
                  '--portrait-border': `1px solid ${currentCharConfig.color}25`,
                  '--portrait-filter': 'brightness(0.85) contrast(1.05)'
                } as React.CSSProperties}
                onError={(e) => { 
                  console.warn('[Character] Failed to load image:', resolvedCharImageUrl);
                  (e.target as HTMLImageElement).style.display = 'none'; 
                }}
              />
              <div
                className={`absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl ${styles.dynamicGradientOverlay}`}
                style={{ '--gradient-overlay': 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' } as React.CSSProperties}
              />
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[8px] font-mono tracking-wider whitespace-nowrap border"
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  borderColor: `${currentCharConfig.color}40`,
                  color: currentCharConfig.color,
                }}
              >
                {currentCharConfig.arabicName}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN DIALOGUE AREA ── */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-20 px-3 sm:px-4 md:px-10 pb-4">
        <AnimatePresence mode="wait">
          {!showChoices && currentDialogue && (
            <motion.div
              key={currentSceneId + '-dlg-' + dialogueIndex}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Character Name Badge */}
              {currentDialogue.character && (
                <motion.div
                  initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`mb-3 flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`h-px flex-1 max-w-[50px] ${styles.dynamicAutoLine}`}
                    style={{ '--auto-line': isArabic ? `linear-gradient(to left, transparent, ${currentCharConfig.color}70)` : `linear-gradient(to right, transparent, ${currentCharConfig.color}70)` } as React.CSSProperties}
                  />
                  <span
                    className={lang === 'ar'
                      ? "text-[14px] font-arabic-title px-4 py-1.5 rounded-full border"
                      : "text-[10px] font-mono tracking-[0.22em] uppercase px-3 py-1 rounded-full border"
                    }
                    style={{
                      color: currentCharConfig.color,
                      borderColor: `${currentCharConfig.color}28`,
                      background: `linear-gradient(90deg, ${currentCharConfig.color}18, rgba(0,0,0,0.25))`,
                      textShadow: `0 0 16px ${currentCharConfig.glowColor}`
                    }}
                  >
                    {lang === 'ar' ? currentCharConfig.arabicName : currentCharConfig.name}
                  </span>
                  <div className={`h-px flex-1 max-w-[50px] ${styles.dynamicAutoLine}`} style={{ '--auto-line': isArabic ? `linear-gradient(to right, transparent, ${currentCharConfig.color}70)` : `linear-gradient(to left, transparent, ${currentCharConfig.color}70)` } as React.CSSProperties} />
                </motion.div>
              )}

              {/* Dialogue Box */}
              <div
                data-testid="dialogue-box"
                className={`relative rounded-2xl px-4 py-4 sm:px-7 sm:py-6 md:px-9 md:py-7 ${isArabic ? 'text-right' : ''} ${styles.dynamicDialogueBox}`}
                dir={isArabic ? 'rtl' : 'ltr'}
                style={{
                  '--dialogue-bg': currentScene.backgroundVideo ? 'rgba(0,0,0,0.56)' : 'rgba(0,0,0,0.66)',
                  '--dialogue-border': isAutoRunning && !showChoices ? '1px solid rgba(0,0,0,0)' : `1px solid ${currentCharConfig.color}18`,
                  '--dialogue-shadow': `0 10px 70px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 ${currentCharConfig.color}10`,
                  '--dialogue-backdrop': 'blur(18px)'
                } as React.CSSProperties}
              >

                <div
                  className={`absolute inset-0 rounded-2xl pointer-events-none ${styles.dynamicGradientOverlay}`}
                  style={{
                    '--gradient-overlay': `linear-gradient(180deg, ${currentCharConfig.color}10, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25))`
                  } as React.CSSProperties}
                />
                <div
                  className={`absolute inset-0 rounded-2xl pointer-events-none ${styles.dynamicRadialGlow}`}
                  style={{
                    '--radial-glow': `radial-gradient(circle at 20% 20%, ${currentCharConfig.color}33, rgba(0,0,0,0) 55%)`,
                    '--blend-mode': 'screen',
                    opacity: uiGlow * 0.7
                  } as React.CSSProperties}
                />
                <motion.div
                  className={`absolute top-0 left-0 h-[2px] rounded-t-2xl ${styles.dynamicProgressLine}`}
                  style={{ '--progress-line': `linear-gradient(to right, ${accentColor}30, ${accentColor}95)` } as React.CSSProperties}
                  animate={{ width: `${((currentIdx + 1) / sceneKeys.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                {isAutoRunning && !showChoices && (
                  <>
                    <motion.div
                      className={`absolute top-0 left-0 h-px rounded-t-2xl ${styles.dynamicAutoLine}`}
                      style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                      animate={{ width: `${autoTop * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                    <motion.div
                      className={`absolute top-0 right-0 w-px rounded-r-2xl ${styles.dynamicAutoLine}`}
                      style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                      animate={{ height: `${autoRight * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                    <motion.div
                      className={`absolute bottom-0 right-0 h-px rounded-b-2xl ${styles.dynamicAutoLine}`}
                      style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                      animate={{ width: `${autoBottom * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                    <motion.div
                      className={`absolute bottom-0 left-0 w-px rounded-l-2xl ${styles.dynamicAutoLine}`}
                      style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                      animate={{ height: `${autoLeft * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                  </>
                )}
                {/* Single Language Text Display - Only show selected language */}
                {lang === 'en' ? (
                  <div>
                    {/* English Text Only */}
                    <p
                      data-testid="dialogue-text"
                      className={`text-white/93 text-[20px] md:text-[26px] font-light ${styles.dynamicDialogueText}`}
                      style={{
                        '--text-shadow': '0 1px 8px rgba(0,0,0,0.98)',
                        '--letter-spacing': '0.012em',
                        '--line-height': '1.75'
                      } as React.CSSProperties}
                    >
                      {displayedText}
                      {isTyping && (
                        <motion.span
                          className={`inline-block w-0.5 h-6 ml-1 align-middle ${styles.dynamicAutoLine}`}
                          style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.55, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Arabic Text Only */}
                    <p
                      data-testid="dialogue-text"
                      className={`text-white/93 text-[22px] md:text-[30px] text-right font-arabic ${styles.dynamicArabicText}`}
                      dir="rtl"
                      style={{
                        '--text-shadow': '0 1px 8px rgba(0,0,0,0.98)',
                        '--line-height': '2.1'
                      } as React.CSSProperties}
                    >
                      {displayedArabic}
                      {isTyping && (
                        <motion.span
                          className={`inline-block w-0.5 h-6 mr-1 align-middle ${styles.dynamicAutoLine}`}
                          style={{ '--auto-line': currentCharConfig.color } as React.CSSProperties}
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.55, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </div>
                )}

                {/* Dialogue Progress Dots */}
                {dialogueLines.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-5">
                    {dialogueLines.map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="rounded-full"
                        animate={{
                          width: idx === dialogueIndex ? 24 : 5,
                          opacity: idx === dialogueIndex ? 1 : idx < dialogueIndex ? 0.45 : 0.15,
                        }}
                        transition={{ duration: 0.35 }}
                        style={{
                          height: 3,
                          background: idx === dialogueIndex
                            ? currentCharConfig.color
                            : idx < dialogueIndex
                              ? `${currentCharConfig.color}65`
                              : 'rgba(255,255,255,0.12)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {!isVoiceModeActive && (
                  <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <button
                        data-testid="back-button"
                        onClick={(e) => { e.stopPropagation(); handleBackScene(); }}
                        disabled={dialogueIndex === 0 && !showChoices}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed ${styles.dynamicColor} ${styles.dynamicBorder} ${styles.dynamicBg}`}
                        style={{
                          '--dynamic-color': 'rgba(201,169,110,0.75)',
                          '--dynamic-border': 'rgba(201,169,110,0.22)',
                          '--dynamic-bg': 'rgba(0,0,0,0.35)'
                        } as React.CSSProperties}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points={isArabic ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
                        </svg>
                        <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'السابق' : 'BACK'}</span>
                      </button>
                      <button
                        data-testid="next-button"
                        onClick={(e) => { e.stopPropagation(); handleForwardScript(); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-white/10 ${styles.dynamicColor} ${styles.dynamicBorder} ${styles.dynamicBg}`}
                        style={{
                          '--dynamic-color': 'rgba(201,169,110,0.78)',
                          '--dynamic-border': 'rgba(201,169,110,0.26)',
                          '--dynamic-bg': 'rgba(0,0,0,0.35)'
                        } as React.CSSProperties}
                      >
                        <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'التالي' : 'NEXT'}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points={isArabic ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
                        </svg>
                      </button>
                    </div>

                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`flex items-center rounded-lg overflow-hidden ${isArabic ? 'flex-row-reverse' : ''} ${styles.dynamicBorder} ${styles.dynamicBg}`}
                        style={{
                          '--dynamic-border': 'rgba(201,169,110,0.22)',
                          '--dynamic-bg': 'rgba(0,0,0,0.35)'
                        } as React.CSSProperties}
                      >
                        <button
                          onClick={() => setAutoMode('off')}
                          className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicBg} ${styles.dynamicColor}`}
                          style={{
                            '--dynamic-bg': autoMode === 'off' ? 'rgba(201,169,110,0.25)' : 'transparent',
                            '--dynamic-color': autoMode === 'off' ? '#c9a96e' : 'rgba(255,255,255,0.4)'
                          } as React.CSSProperties}
                        >{isArabic ? 'تلقائي إيقاف' : 'إيقاف تلقائي'}</button>
                        <button
                          onClick={() => setAutoMode('very-slow')}
                          className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicBg} ${styles.dynamicColor}`}
                          style={{
                            '--dynamic-bg': autoMode === 'very-slow' ? 'rgba(201,169,110,0.25)' : 'transparent',
                            '--dynamic-color': autoMode === 'very-slow' ? '#c9a96e' : 'rgba(255,255,255,0.4)'
                          } as React.CSSProperties}
                        >{isArabic ? 'بطيء جدًا' : 'بطيء جدا'}</button>
                        <button
                          onClick={() => setAutoMode('slow')}
                          className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicBg} ${styles.dynamicColor}`}
                          style={{
                            '--dynamic-bg': autoMode === 'slow' ? 'rgba(201,169,110,0.25)' : 'transparent',
                            '--dynamic-color': autoMode === 'slow' ? '#c9a96e' : 'rgba(255,255,255,0.4)'
                          } as React.CSSProperties}
                        >{isArabic ? 'بطيء' : 'بطيء'}</button>
                        <button
                          onClick={() => setAutoMode('normal')}
                          className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicBg} ${styles.dynamicColor}`}
                          style={{
                            '--dynamic-bg': autoMode === 'normal' ? 'rgba(201,169,110,0.25)' : 'transparent',
                            '--dynamic-color': autoMode === 'normal' ? '#c9a96e' : 'rgba(255,255,255,0.4)'
                          } as React.CSSProperties}
                        >{isArabic ? 'عادي' : 'عادي'}</button>
                      </div>

                      {/* Main Play/Pause Button - Always visible */}
                      <button
                        onClick={handlePlayPause}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${isPlaying ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}
                        title={isPlaying ? 'إيقاف' : 'تشغيل'}
                      >
                        <span className="text-sm">{isPlaying ? '⏸' : '▶'}</span>
                        <span className="text-[10px] font-arabic-ui tracking-wider">
                          {isPlaying ? 'إيقاف' : 'تشغيل'}
                        </span>
                      </button>

                      <AudioControl
                        bgVol={bgVol}
                        sceneVol={sceneVol}
                        voiceVol={voiceVol}
                        sfxVol={sfxVol}
                        isMuted={isMuted}
                        onBgChange={handleBgVol}
                        onSceneChange={handleSceneVol}
                        onVoiceChange={handleVoiceVol}
                        onSfxChange={handleSfxVol}
                        onToggleMute={handleToggleMute}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CHOICES ── */}
        <AnimatePresence>
          {showChoices && currentScene.choices && currentScene.choices.length > 0 && (
            <motion.div
              data-testid="choice-panel"
              key="choices-panel"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 28 }}
              transition={{ duration: 0.9 }}
              className={`max-w-4xl mx-auto ${isArabic ? 'text-right' : ''}`}
              dir={isArabic ? 'rtl' : 'ltr'}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`mb-4 flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1 h-0.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${styles.dynamicProgressBar}`}
                    style={{
                      '--progress-background': choiceProgress > 55
                        ? `linear-gradient(to right, ${accentColor}80, ${accentColor})`
                        : choiceProgress > 22
                          ? 'linear-gradient(to right, #f97316, #fbbf24)'
                          : 'linear-gradient(to right, #ef4444, #f97316)',
                      width: `${choiceProgress}%`,
                      transition: 'width 0.05s linear'
                    } as React.CSSProperties}
                  />
                </div>
                {/* Countdown number */}
                <motion.span
                  data-testid="choice-timer"
                  className={`text-[11px] font-mono tabular-nums flex-shrink-0 w-6 ${styles.dynamicCountdown} ${isArabic ? 'text-left' : 'text-right'}`}
                  style={{
                    '--countdown-color': choiceProgress > 55 ? `${accentColor}90`
                      : choiceProgress > 22 ? '#fbbf2490'
                      : '#ef444490'
                  } as React.CSSProperties}
                  animate={{ scale: timerSeconds <= 5 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: timerSeconds <= 5 ? Infinity : 0 }}
                >
                  {timerSeconds}
                </motion.span>
              </div>

              <div className="grid gap-3">
                {currentScene.choices.map((choice, idx) => (
                  <motion.button
                    data-testid="choice-button"
                    key={choice.id}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -28 : 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: idx * 0.1 }}
                    onClick={() => handleChoice(choice)}
                    className={`group relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] ${isArabic ? 'text-right' : 'text-left'} ${styles.dynamicChoicePanel}`}
                    style={{
                      '--choice-bg': 'rgba(0,0,0,0.72)',
                      '--choice-border': `1px solid ${accentColor}20`,
                      '--choice-shadow': '0 4px 30px rgba(0,0,0,0.5)',
                      '--choice-backdrop': 'blur(14px)'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.setProperty('--choice-border', `1px solid ${accentColor}55`);
                      el.style.setProperty('--choice-bg', `${accentColor}0a`);
                      el.style.setProperty('--choice-shadow', `0 4px 40px ${accentColor}15`);
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.setProperty('--choice-border', `1px solid ${accentColor}20`);
                      el.style.setProperty('--choice-bg', 'rgba(0,0,0,0.72)');
                      el.style.setProperty('--choice-shadow', '0 4px 30px rgba(0,0,0,0.5)');
                    }}
                  >
                    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0 ${styles.dynamicChoiceNumber}`}
                        style={{
                          '--choice-num-bg': `${accentColor}15`,
                          '--choice-num-color': accentColor,
                          '--choice-num-border': `1px solid ${accentColor}30`
                        } as React.CSSProperties}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        {lang === 'en' ? (
                          <p className="text-white/88 text-base md:text-lg font-light leading-snug">{choice.text}</p>
                        ) : (
                          <p className="text-white/93 text-base md:text-lg leading-relaxed text-right font-arabic" dir="rtl">{choice.arabicText || choice.text}</p>
                        )}
                      </div>

                      <span
                        className={`text-base mx-1 flex-shrink-0 opacity-0 group-hover:opacity-70 transition-all duration-300 ${styles.dynamicCountdown} ${isArabic ? 'order-first' : ''}`}
                        style={{ '--countdown-color': accentColor } as React.CSSProperties}
                      >
                        {isArabic ? '←' : '→'}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {lang === 'ar' ? (
                <p className="text-center text-white/30 text-[11px] mt-3 font-arabic-ui" dir="rtl">
                  {`سيتابع تلقائياً خلال ${timerSeconds} ثانية`}
                </p>
              ) : (
                <p className="text-center text-white/30 text-[10px] mt-3 font-mono tracking-wider">
                  {`Auto-continuing in ${timerSeconds}s`}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── END OF SCENE (no choices) — click to continue ── */}
        <AnimatePresence>
          {isEndOfScene && (
            <motion.div
              key="end-of-scene"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`max-w-4xl mx-auto ${isArabic ? 'text-right' : 'text-center'}`}
              onClick={(e) => { e.stopPropagation(); }}
            >
              <div
                className={`inline-flex flex-col items-center gap-3 px-6 sm:px-10 py-5 sm:py-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${styles.dynamicEndOfScene}`}
                style={{
                  '--end-scene-bg': 'rgba(0,0,0,0.75)',
                  '--end-scene-border': `1px solid ${accentColor}22`,
                  '--end-scene-backdrop': 'blur(16px)'
                } as React.CSSProperties}
              >
                {currentScene?.defaultNextScene ? (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleNoChoiceAdvance(); }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
                  >
                    <span className={`${lang === 'ar' ? 'text-sm tracking-wider font-arabic-ui' : 'text-sm font-mono tracking-[0.25em] uppercase'} ${styles.dynamicCountdown}`} style={{ '--countdown-color': `${accentColor}90` } as React.CSSProperties}>
                      {isArabic ? 'التالي' : 'NEXT'}
                    </span>
                    <motion.span
                      className={styles.dynamicCountdown}
                      style={{ '--countdown-color': `${accentColor}90`, fontSize: '18px' } as React.CSSProperties}
                      animate={{ x: isArabic ? [0, -6, 0] : [0, 6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      {isArabic ? '‹' : '›'}
                    </motion.span>
                  </motion.button>
                ) : (
                  <>
                    <div className={`text-[11px] tracking-[0.22em] text-white/55 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}>
                      {isArabic ? 'نهاية التجربة' : 'END OF EXPERIENCE'}
                    </div>
                    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setLocation('/'); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicEndButton}`}
                        style={{
                          '--end-btn-bg': `linear-gradient(135deg, ${accentColor}, #f0d080)`,
                          '--end-btn-color': '#0b0b0d'
                        } as React.CSSProperties}
                      >
                        {isArabic ? 'الصفحة الرئيسية' : 'HOME'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareMenuOpen((v) => !v); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicSecondaryButton}`}
                        style={{
                          '--secondary-btn-border': `1px solid ${accentColor}33`,
                          '--secondary-btn-bg': 'rgba(0,0,0,0.35)',
                          '--secondary-btn-color': `${accentColor}CC`
                        } as React.CSSProperties}
                      >
                        {isArabic ? 'مشاركة' : 'SHARE'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyShareLink(); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                        style={{
                          '--tertiary-btn-border': `1px solid ${accentColor}22`,
                          '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                          '--tertiary-btn-color': 'rgba(255,255,255,0.7)'
                        } as React.CSSProperties}
                      >
                        {isArabic ? 'نسخ الرابط' : 'COPY LINK'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goToScene('zero-1-1-summons'); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                        style={{
                          '--tertiary-btn-border': `1px solid ${accentColor}22`,
                          '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                          '--tertiary-btn-color': 'rgba(255,255,255,0.7)'
                        } as React.CSSProperties}
                      >
                        {isArabic ? 'إعادة البدء' : 'RESTART'}
                      </button>
                    </div>
                    {shareMenuOpen && (
                      <div className={`mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareNative(); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                          style={{
                            '--tertiary-btn-border': `1px solid ${accentColor}22`,
                            '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                            '--tertiary-btn-color': 'rgba(255,255,255,0.75)'
                          } as React.CSSProperties}
                        >
                          {isArabic ? 'مشاركة النظام' : 'NATIVE'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('whatsapp'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                          style={{
                            '--tertiary-btn-border': `1px solid ${accentColor}22`,
                            '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                            '--tertiary-btn-color': 'rgba(255,255,255,0.75)'
                          } as React.CSSProperties}
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('telegram'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                          style={{
                            '--tertiary-btn-border': `1px solid ${accentColor}22`,
                            '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                            '--tertiary-btn-color': 'rgba(255,255,255,0.75)'
                          } as React.CSSProperties}
                        >
                          Telegram
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('facebook'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                          style={{
                            '--tertiary-btn-border': `1px solid ${accentColor}22`,
                            '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                            '--tertiary-btn-color': 'rgba(255,255,255,0.75)'
                          } as React.CSSProperties}
                        >
                          Facebook
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('x'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                          style={{
                            '--tertiary-btn-border': `1px solid ${accentColor}22`,
                            '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                            '--tertiary-btn-color': 'rgba(255,255,255,0.75)'
                          } as React.CSSProperties}
                        >
                          X
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('email'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} ${styles.dynamicTertiaryButton}`}
                          style={{
                            '--tertiary-btn-border': `1px solid ${accentColor}22`,
                            '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
                            '--tertiary-btn-color': 'rgba(255,255,255,0.75)'
                          } as React.CSSProperties}
                        >
                          Email
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── AUDIO STATUS INDICATOR ── */}
      {/* (Narration indicator removed; only music status remains) */}
      {audioEnabled && globalMediaState.isPlaying && !isMuted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-14 left-5 z-30 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-end gap-0.5 opacity-40" title="Music playing">
            {[1, 2, 1].map((h, i) => (
              <motion.div
                key={i}
                className={`w-0.5 rounded-full ${styles.dynamicAudioIndicator}`}
                style={{ '--audio-bar-bg': 'rgba(255,255,255,0.5)' } as React.CSSProperties}
                animate={{ height: [h * 2, h * 3, h * 2] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── KEYBOARD HINT ── */}
      {audioEnabled && !showAudioPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-14 right-5 z-30 pointer-events-none"
        >
          <span className="text-[8px] font-mono tracking-wider text-white/18">
            SPACE · CLICK · ESC
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default memo(MainPlayer);
