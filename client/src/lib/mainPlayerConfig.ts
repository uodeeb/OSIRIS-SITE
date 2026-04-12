/**
 * MainPlayer Configuration Module
 * Static data and configuration extracted from MainPlayer.tsx
 */

import { getAsset } from '@/lib/assets';
import type { CSSProperties } from 'react';
import { PART_LABELS, SCENES as ALL_SCENES, type DialogueLine } from '@/lib/sceneSystem';

// ─── Character Configuration ────────────────────────────────────────────────

export interface CharacterConfig {
  name: string;
  arabicName: string;
  color: string;
  glowColor: string;
  imageUrl?: string;
  position: 'left' | 'right' | 'center';
}

export const CHARACTER_MAP: Record<string, CharacterConfig> = {
  Narrator: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: getAsset('character.narrator'),
  },
  yahya: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: getAsset('character.yahya'),
  },
  laila: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: getAsset('character.laila'),
  },
  tarek: {
    name: 'Tarek',
    arabicName: 'طارق',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: getAsset('character.tarek'),
  },
  first_engineer: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: getAsset('character.first_engineer'),
  },
  arius: {
    name: 'Arius',
    arabicName: 'آريوس',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    position: 'left',
    imageUrl: getAsset('character.arius'),
  },
  athanasius: {
    name: 'Athanasius',
    arabicName: 'أثناسيوس',
    color: '#d4af37',
    glowColor: 'rgba(212,175,55,0.3)',
    position: 'right',
    imageUrl: getAsset('character.athanasius'),
  },
  samiri: {
    name: 'Al-Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'left',
    imageUrl: getAsset('character.samiri'),
  },
  constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    position: 'right',
    imageUrl: getAsset('character.constantine'),
  },
  yahya_breakdown: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'right',
    imageUrl: getAsset('character.yahya_breakdown'),
  },
  yahya_confront: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.4)',
    position: 'right',
    imageUrl: getAsset('character.yahya_confront'),
  },
  tarek_ghost: {
    name: 'Tarek (Recording)',
    arabicName: 'تسجيل طارق',
    color: '#94a3b8',
    glowColor: 'rgba(148,163,184,0.3)',
    position: 'left',
    imageUrl: getAsset('character.tarek_ghost'),
  },
  tarek_dream: {
    name: 'Tarek (Dream)',
    arabicName: 'طارق',
    color: '#818cf8',
    glowColor: 'rgba(129,140,248,0.3)',
    position: 'left',
    imageUrl: getAsset('character.tarek_dream'),
  },
  laila_faith: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.4)',
    position: 'right',
    imageUrl: getAsset('character.laila_faith'),
  },
  laila_witness: {
    name: 'Laila (Witness)',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.4)',
    position: 'right',
    imageUrl: getAsset('character.laila_witness'),
  },
  first_engineer_2: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: getAsset('character.first_engineer_2'),
  },
  first_engineer_exposed: {
    name: 'First Engineer (Exposed)',
    arabicName: 'المهندس الأول',
    color: '#b91c1c',
    glowColor: 'rgba(185,28,28,0.4)',
    position: 'left',
    imageUrl: getAsset('character.first_engineer_exposed'),
  },
  first_engineer_confront: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.4)',
    position: 'left',
    imageUrl: getAsset('character.first_engineer_confront'),
  },
  yahya_dying: {
    name: 'Yahya (Dying)',
    arabicName: 'يحيى (يحتضر)',
    color: '#991b1b',
    glowColor: 'rgba(153,27,27,0.5)',
    position: 'right',
    imageUrl: getAsset('character.yahya_dying'),
  },
  laila_crying: {
    name: 'Laila (Crying)',
    arabicName: 'ليلى (تبكي)',
    color: '#be185d',
    glowColor: 'rgba(190,24,93,0.4)',
    position: 'right',
    imageUrl: getAsset('character.laila_crying'),
  },
  samiri_calf: {
    name: 'Al-Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.5)',
    position: 'left',
    imageUrl: getAsset('character.samiri_calf'),
  },
  Yahya: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: getAsset('character.yahya'),
  },
  Laila: {
    name: 'Laila',
    arabicName: 'ليلى',
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
    position: 'right',
    imageUrl: getAsset('character.laila'),
  },
  Tarek: {
    name: 'Tarek',
    arabicName: 'طارق',
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
    position: 'left',
    imageUrl: getAsset('character.tarek'),
  },
  FirstEngineer: {
    name: 'First Engineer',
    arabicName: 'المهندس الأول',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.3)',
    position: 'left',
    imageUrl: getAsset('character.first_engineer'),
  },
  Arius: {
    name: 'Arius',
    arabicName: 'آريوس',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    position: 'left',
    imageUrl: getAsset('character.arius'),
  },
  Athanasius: {
    name: 'Athanasius',
    arabicName: 'أثناسيوس',
    color: '#d4af37',
    glowColor: 'rgba(212,175,55,0.3)',
    position: 'right',
    imageUrl: getAsset('character.athanasius'),
  },
  Samiri: {
    name: 'Al-Samiri',
    arabicName: 'السامري',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'left',
    imageUrl: getAsset('character.samiri'),
  },
  Constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    position: 'right',
    imageUrl: getAsset('character.constantine'),
  },
  Ramses: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: getAsset('character.narrator'),
  },
  Iblis: {
    name: 'Narrator',
    arabicName: 'الراوي الكوني',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
    imageUrl: getAsset('character.narrator'),
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
    imageUrl: getAsset('character.narrator'),
  },
};

// ─── Character Regex Patterns ──────────────────────────────────────────────

export const CHARACTER_REGEX_PATTERNS = {
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

// ─── Scene Character Timeline ─────────────────────────────────────────────

export const SCENE_CHARACTER_TIMELINE: Record<string, string> = {
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

export const EMOTIONAL_OVERLAY: Record<string, string> = {
  dark: 'rgba(0,0,0,0.72)',
  hopeful: 'rgba(15,23,42,0.62)',
  intense: 'rgba(20,0,0,0.68)',
  contemplative: 'rgba(10,10,20,0.68)',
  tragic: 'rgba(5,5,5,0.75)',
};

export const TONE_ACCENT: Record<string, string> = {
  dark: '#c9a96e',
  hopeful: '#93c5fd',
  intense: '#fca5a5',
  contemplative: '#a5b4fc',
  tragic: '#fcd34d',
};

// ─── Audio Track Configuration ───────────────────────────────────────────────

export const TRACK_URL_CANDIDATES: Record<string, string[]> = {
  track01: ['/assets/music-tracks/TRACK-01.mp3'],
  track02: ['/assets/music-tracks/TRACK-02.mp3'],
  track03: ['/assets/music-tracks/TRACK-03.mp3'],
  track04: ['/assets/music-tracks/TRACK-04.mp3'],
  track05: ['/assets/music-tracks/TRACK-05.mp3'],
  track06: ['/assets/music-tracks/TRACK-06.mp3'],
  track07: ['/assets/music-tracks/TRACK-07.mp3'],
  track08: ['/assets/music-tracks/TRACK-08.mp3'],
  track09: ['/assets/music-tracks/TRACK-09.mp3'],
  track10: ['/assets/music-tracks/TRACK-10.mp3'],
  track11: ['/assets/music-tracks/TRACK-11.mp3'],
  track12: ['/assets/music-tracks/TRACK-12.mp3'],
  track13: ['/assets/music-tracks/TRACK-13.mp3'],
  track14: ['/assets/music-tracks/TRACK-14.mp3'],
  track15: ['/assets/songs/ya-rab.m4a'],
};

// Type export for audio hook integration
export type TrackUrlKey = keyof typeof TRACK_URL_CANDIDATES;

export const SCENE_TRACK_SEQUENCE: Record<string, keyof typeof TRACK_URL_CANDIDATES> = {
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

export function getSceneMusicCandidates(sceneId: string, fallbackUrl?: string): string[] {
  const key = SCENE_TRACK_SEQUENCE[sceneId] ?? 'track01';
  const candidates = TRACK_URL_CANDIDATES[key] ?? TRACK_URL_CANDIDATES.track01;
  const result = [...candidates];
  if (fallbackUrl && !result.includes(fallbackUrl)) {
    result.push(fallbackUrl);
  }
  if (!result.includes(getAsset('audio.main_theme'))) {
    result.push(getAsset('audio.main_theme'));
  }
  return result;
}

export function parseTrackFromDialogue(line?: string): keyof typeof TRACK_URL_CANDIDATES | 'stop' | null {
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

// ─── Image Cues ─────────────────────────────────────────────────────────────

export type ImageCue = {
  src: string;
  points: number[];
  opacity?: number;
  blend?: CSSProperties['mixBlendMode'];
};

export const SCENE_IMAGE_CUES: Partial<Record<string, ImageCue>> = {
  'zero-1-1-summons': { src: '/assets/images/yehia-room.jpg', points: [0], opacity: 0.2, blend: 'screen' },
  'zero-1-2-prosecution': { src: '/assets/characters/narrator-visual.png', points: [2], opacity: 0.35, blend: 'overlay' },
  'four-4-1-desert': { src: '/assets/images/02.jpg', points: [1], opacity: 0.24, blend: 'soft-light' },
  'four-4-2-crowd-engineering': { src: '/assets/images/03.jpg', points: [1], opacity: 0.24, blend: 'overlay' },
  'six-8-1-andalusia': { src: '/assets/images/04.jpg', points: [1], opacity: 0.22, blend: 'screen' },
  'six-8-2-last-tears': { src: '/assets/images/04.jpg', points: [0], opacity: 0.2, blend: 'screen' },
  'seven-10-1-karbala': { src: '/assets/images/05.jpg', points: [1], opacity: 0.28, blend: 'soft-light' },
  'seven-12-1-truth-leak': { src: '/assets/images/06.jpg', points: [1], opacity: 0.26, blend: 'overlay' },
  'six-8d-1-attack': { src: '/assets/images/07.jpg', points: [0], opacity: 0.26, blend: 'screen' },
};

// ─── Voice Configuration ──────────────────────────────────────────────────────

export type VoiceCue = { at: number; voice: number };

export type VoiceDefinition = { voice: number; sceneId: string; anchor: string; fallbackAt?: number };

export const VOICE_DEFINITIONS: VoiceDefinition[] = [
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

export function normalizeArabicForMatch(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/[ؤئ]/g, 'ي')
    .replace(/[^\u0600-\u06FF\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Build SCENE_VOICE_CUES from definitions
export const SCENE_VOICE_CUES: Partial<Record<string, VoiceCue[]>> = VOICE_DEFINITIONS.reduce((acc, def) => {
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

export function getVoiceCandidates(voiceNumber: number): string[] {
  const padded = String(Math.max(1, Math.min(18, voiceNumber))).padStart(2, '0');
  // Voice 01-02 are mp3, 03-18 are wav
  const ext = voiceNumber <= 2 ? 'mp3' : 'wav';
  return [`/assets/voices/voice-${padded}.${ext}`];
}

// Special voice for devil scenes - fallback to voice-07 (iblis)
export function getDevilVoiceCandidates(): string[] {
  return ['/assets/voices/voice-07.mp3'];
}

// ─── Timing Constants ───────────────────────────────────────────────────────

export const AUTO_SCENE_DELAY_MS: Record<'very-slow' | 'slow' | 'normal', number> = {
  'very-slow': 12000,
  slow: 7000,
  normal: 4000,
};
