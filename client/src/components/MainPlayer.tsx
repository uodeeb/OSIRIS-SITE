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

import { useEffect, useRef, useState, useCallback, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { PART_LABELS, SCENES as ALL_SCENES, type Scene, type SceneChoice } from '@/lib/sceneSystem';
import { ASSET_URLS } from '@/lib/assetUrls';
import { getAssetOverride } from '@/lib/assetOverrides';
import { useBandwidthStrategy } from '@/lib/mediaStrategy';
import { detectOsirisEffectId, preloadOsirisEffects, type OsirisEffectId } from "@/lib/osirisEffects";
import { CinematicStage } from '@/components/CinematicStage';
import { OsirisEffectLayer } from "@/components/OsirisEffectLayer";
import osirisLogo from '@/LOGO/new-logo/favicon-black-0.25.png';

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
    arabicName: 'الراوي',
    color: '#c9a96e',
    glowColor: 'rgba(201,169,110,0.3)',
    position: 'center',
  },
  Iblis: {
    name: 'Iblis',
    arabicName: 'إبليس',
    color: '#ff4444',
    glowColor: 'rgba(255,68,68,0.35)',
    position: 'left',
  },
  Ramses: {
    name: 'Ramses',
    arabicName: 'رمسيس',
    color: '#d4af37',
    glowColor: 'rgba(212,175,55,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.ramses,
  },
  Priest: {
    name: 'Mysterious Priest',
    arabicName: 'الكاهن الغامض',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.3)',
    position: 'left',
  },
  Moses: {
    name: 'Moses',
    arabicName: 'موسى',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.3)',
    position: 'right',
  },
  Constantine: {
    name: 'Constantine',
    arabicName: 'قسطنطين',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.constantine,
  },
  Arius: {
    name: 'Arius',
    arabicName: 'آريوس',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    position: 'left',
  },
  AbuAbdullah: {
    name: 'Abu Abdullah',
    arabicName: 'أبو عبد الله',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.abu_abdullah,
  },
  Qabil: {
    name: 'Qabil',
    arabicName: 'قابيل',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.35)',
    position: 'left',
  },
  Mother: {
    name: 'Mother',
    arabicName: 'الأم',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    position: 'left',
  },
  Bilal: {
    name: 'Bilal',
    arabicName: 'بلال',
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.3)',
    position: 'right',
    imageUrl: ASSET_URLS.characters.yahya_main,
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
  Yahya: {
    name: 'Yahya',
    arabicName: 'يحيى',
    color: '#34d399',
    glowColor: 'rgba(52,211,153,0.3)',
    position: 'left',
    imageUrl: ASSET_URLS.characters.yahya_main,
  },
  Hitler: {
    name: 'Hitler',
    arabicName: 'هتلر',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.35)',
    position: 'left',
  },
  Stalin: {
    name: 'Stalin',
    arabicName: 'ستالين',
    color: '#b91c1c',
    glowColor: 'rgba(185,28,28,0.35)',
    position: 'left',
  },
  PotPot: {
    name: 'Pol Pot',
    arabicName: 'بول بوت',
    color: '#991b1b',
    glowColor: 'rgba(153,27,27,0.35)',
    position: 'left',
  },
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
    '/music/TRACK-01.mp3',
    '/music/TRACK-01.m4a',
    '/music/TRACK%2001%20%E2%80%94%20%D8%A7%D9%84%D8%AB%D9%8A%D9%85%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%20%D9%84%D9%84%D8%B1%D9%88%D8%A7%D9%8A%D8%A9.mp3',
    '/music/TRACK%2001%20%E2%80%94%20%D8%A7%D9%84%D8%AB%D9%8A%D9%85%20%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%20%D9%84%D9%84%D8%B1%D9%88%D8%A7%D9%8A%D8%A9.m4a',
  ],
  track02: ['/music/TRACK%2002.m4a', '/music/TRACK-02.m4a', '/music/TRACK-02.mp3', '/music/TRACK%2002%20%E2%80%94%20%D8%A7%D9%84%D8%AC%D8%B2%D8%A1%20%D8%A7%D9%84%D8%B5%D9%81%D8%B1-%D8%BA%D8%B1%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%83%D9%85%D8%A9%20%D8%A7%D9%84%D9%83%D9%88%D9%86%D9%8A%D8%A9.m4a'],
  track03: ['/music/TRACK-03.m4a', '/music/TRACK%2003.m4a', '/music/TRACK%2003.mp3', '/music/devil-voice-to-clone.m4a', '/music/devil-voice-to-clone.wav'],
  track04: ['/music/TRACK-04.m4a', '/music/TRACK%2004.m4a', '/music/TRACK%2004.mp3'],
  track05: ['/music/TRACK-05.m4a', '/music/TRACK%2005.m4a'],
  track06: ['/music/TRACK-06.m4a', '/music/TRACK%2006.m4a'],
  track07: ['/music/TRACK-07.m4a', '/music/TRACK%2007.m4a'],
  track08: ['/music/TRACK-08.m4a', '/music/TRACK%2008.m4a'],
  track09: ['/music/TRACK-09.m4a', '/music/TRACK%2009.m4a'],
  track10: ['/music/TRACK-10.m4a', '/music/TRACK%2010.m4a'],
  track11: ['/music/TRACK-11.m4a', '/music/TRACK%2011.m4a'],
  track12: ['/music/TRACK-12.m4a', '/music/TRACK%2012.m4a'],
  track13: ['/music/TRACK-13.m4a', '/music/TRACK%2013.m4a'],
  track14: ['/music/TRACK-14.m4a', '/music/TRACK%2014.m4a', '/music/TRACK%2014.mp3', '/music/TRACK-01.mp3', '/music/TRACK%2011.m4a'],
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
  'zero-1-1-summons': { src: '/generated-assets/images/01.jpg', points: [0], opacity: 0.2, blend: 'screen' },
  'four-4-1-desert': { src: '/generated-assets/images/02.jpg', points: [1], opacity: 0.24, blend: 'soft-light' },
  'four-4-2-crowd-engineering': { src: '/generated-assets/images/03.jpg', points: [1], opacity: 0.24, blend: 'overlay' },
  'six-8-1-andalusia': { src: '/generated-assets/images/04.jpg', points: [1], opacity: 0.22, blend: 'screen' },
  'six-8-2-last-tears': { src: '/generated-assets/images/04.jpg', points: [0], opacity: 0.2, blend: 'screen' },
  'seven-10-1-karbala': { src: '/generated-assets/images/05.jpg', points: [1], opacity: 0.28, blend: 'soft-light' },
  'seven-12-1-truth-leak': { src: '/generated-assets/images/06.jpg', points: [1], opacity: 0.26, blend: 'overlay' },
  'six-8d-1-attack': { src: '/generated-assets/images/07.jpg', points: [0], opacity: 0.26, blend: 'screen' },
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
  return [`/music/VOICE-${padded}.wav`, `/generated-assets/voices/VOICE-${padded}.wav`];
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

// ─── Volume Control UI ───────────────────────────────────────────────────────

function VolumeControl({
  musicVol,
  sfxVol,
  onMusicChange,
  onSfxChange,
  isMuted,
  onToggleMute,
}: {
  musicVol: number;
  sfxVol: number;
  onMusicChange: (v: number) => void;
  onSfxChange: (v: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-white/10"
        style={{ color: 'rgba(201,169,110,0.7)' }}
        title="Audio Controls"
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
        <span className="text-[9px] font-mono tracking-wider">AUDIO</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 p-4 rounded-xl z-50 min-w-[200px]"
            style={{
              background: 'rgba(0,0,0,0.92)',
              border: '1px solid rgba(201,169,110,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono tracking-wider text-amber-300/70">AMBIENT MUSIC</span>
                <span className="text-[9px] font-mono text-white/40">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={musicVol}
                onChange={(e) => onMusicChange(parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#c9a96e' }}
              />
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono tracking-wider text-amber-300/70">AMBIENT / SFX</span>
                <span className="text-[9px] font-mono text-white/40">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={sfxVol}
                onChange={(e) => onSfxChange(parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#c9a96e' }}
              />
            </div>
            <button
              onClick={onToggleMute}
              className="w-full py-1.5 rounded-lg text-[9px] font-mono tracking-wider transition-all duration-200"
              style={{
                background: isMuted ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.06)',
                color: isMuted ? '#c9a96e' : 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(201,169,110,0.15)',
              }}
            >
              {isMuted ? '▶ UNMUTE ALL' : '⏸ MUTE ALL'}
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
  const [musicVol, setMusicVol] = useState(0.18);
  const [sfxVol, setSfxVol] = useState(0.22);
  const [isMuted, setIsMuted] = useState(false);
  const [scriptTrackOverride, setScriptTrackOverride] = useState<keyof typeof TRACK_URL_CANDIDATES | null>(null);
  const [activeImageCue, setActiveImageCue] = useState<{ src: string; opacity: number; blend: CSSProperties['mixBlendMode']; token: string } | null>(null);
  const [techBoost, setTechBoost] = useState(0);
  const [voiceSyncLock, setVoiceSyncLock] = useState(false);
  const [activeVoiceNumber, setActiveVoiceNumber] = useState<number | null>(null);
  const [osirisEffectId, setOsirisEffectId] = useState<OsirisEffectId | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const bedMusicRef = useRef<HTMLAudioElement | null>(null);
  const bedMusicFadeRef = useRef<number | null>(null);
  const sceneMusicRef = useRef<HTMLAudioElement | null>(null);
  const sceneMusicFadeRef = useRef<number | null>(null);
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
  const currentDialogue = currentScene?.dialogue?.[dialogueIndex];
  const sceneTrackKey = scriptTrackOverride ?? (SCENE_TRACK_SEQUENCE[currentSceneId] ?? 'track01');
  const isSceneUsingBedOnly = sceneTrackKey === 'track01';
  const rawVoiceCue = SCENE_VOICE_CUES[currentSceneId]?.find((item) => item.at === dialogueIndex);
  const rawVoiceToken = rawVoiceCue ? `${currentSceneId}:${dialogueIndex}:${rawVoiceCue.voice}` : null;
  const currentVoiceCue = rawVoiceCue && rawVoiceToken && !disabledVoiceTokensRef.current.has(rawVoiceToken) ? rawVoiceCue : undefined;
  const isVoicedDialogue = !!currentVoiceCue;
  const isVoiceModeActive = voiceSyncLock && activeVoiceNumber !== null;
  const isArabic = lang === 'ar';
  const currentCharConfig = currentDialogue?.character
    ? (CHARACTER_MAP[currentDialogue.character] || CHARACTER_MAP['Narrator'])
    : CHARACTER_MAP['Narrator'];

  const tone = currentScene?.emotionalTone || 'dark';

  const accentColor = TONE_ACCENT[tone] || '#c9a96e';
  const overlay = EMOTIONAL_OVERLAY[tone] || EMOTIONAL_OVERLAY.dark;
  const { allowVideo } = useBandwidthStrategy();

  useEffect(() => {
    preloadOsirisEffects(allowVideo);
  }, [allowVideo]);
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
  }, []);

  const handleMusicVol = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setMusicVol(next);
    if (isMuted) return;
    const voiceMixFactor = voiceSyncLock ? 0.46 : 1;
    const bedTarget = (isSceneUsingBedOnly ? next : next * 0.35) * voiceMixFactor;
    const sceneTarget = (isSceneUsingBedOnly ? 0 : Math.min(1, next * 0.95)) * voiceMixFactor;
    if (bedMusicRef.current) bedMusicRef.current.volume = bedTarget;
    if (sceneMusicRef.current) sceneMusicRef.current.volume = sceneTarget;
  }, [isMuted, isSceneUsingBedOnly, voiceSyncLock]);

  const handleSfxVol = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setSfxVol(next);
    if (ambientRef.current && !isMuted) {
      ambientRef.current.volume = next * (voiceSyncLock ? 0.55 : 1);
    }
  }, [isMuted, voiceSyncLock]);

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    const voiceMixFactor = voiceSyncLock ? 0.46 : 1;
    if (bedMusicRef.current) bedMusicRef.current.volume = newMuted ? 0 : (isSceneUsingBedOnly ? musicVol : musicVol * 0.35) * voiceMixFactor;
    if (sceneMusicRef.current) sceneMusicRef.current.volume = newMuted ? 0 : (isSceneUsingBedOnly ? 0 : Math.min(1, musicVol * 0.95)) * voiceMixFactor;
    if (ambientRef.current) ambientRef.current.volume = newMuted ? 0 : sfxVol * (voiceSyncLock ? 0.55 : 1);
  }, [isMuted, musicVol, sfxVol, isSceneUsingBedOnly, voiceSyncLock]);

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
    if (nextIdx < currentScene.dialogue.length) {
      setDialogueIndex(nextIdx);
      setIsDialogueComplete(false);
      setShowCharacter(false);
      setTimeout(() => setShowCharacter(true), 250);
    } else {
      setShowChoices(true);
      if (!currentScene.choices || currentScene.choices.length === 0) {
      }
    }
  }, [currentScene, dialogueIndex]);

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
    if (!currentScene || voiceSyncLock) return;

    if (showChoices) {
      setShowChoices(false);
      const lastDialogueIndex = Math.max(0, currentScene.dialogue.length - 1);
      setDialogueIndex(lastDialogueIndex);
      return;
    }

    setDialogueIndex((prev) => Math.max(0, prev - 1));
  }, [currentScene, showChoices, voiceSyncLock]);

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
    return window.location.origin;
  }, []);

  const handleCopyShareLink = useCallback(() => {
    const url = getShareUrl();
    if (!url) return;
    navigator.clipboard?.writeText(url).catch(() => {});
  }, [getShareUrl]);

  const handleShareNative = useCallback(() => {
    const url = getShareUrl();
    if (!url) return;
    const title = lang === 'ar' ? 'OSIRIS — المفسدون في الأرض' : 'OSIRIS — Multimedia Interactive Novel';
    const text = lang === 'ar' ? 'تجربة رواية تفاعلية سينمائية' : 'A cinematic interactive novel experience';
    const nav: any = navigator as any;
    if (nav?.share) {
      nav.share({ title, text, url }).catch(() => {});
    }
  }, [getShareUrl, lang]);

  const handleShareTo = useCallback((target: 'whatsapp' | 'telegram' | 'facebook' | 'x' | 'email') => {
    const url = getShareUrl();
    if (!url) return;
    const title = lang === 'ar' ? 'OSIRIS — المفسدون في الأرض' : 'OSIRIS — Multimedia Interactive Novel';
    const text = lang === 'ar' ? 'تجربة رواية تفاعلية سينمائية' : 'A cinematic interactive novel experience';
    const shareUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(`${text} — ${title}`);
    const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

    if (target === 'whatsapp') return open(`https://wa.me/?text=${shareText}%20${shareUrl}`);
    if (target === 'telegram') return open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`);
    if (target === 'facebook') return open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
    if (target === 'x') return open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`);
    open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`);
  }, [getShareUrl, lang]);


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

    let action: (() => void) | null = null;

    if (showChoices) {
      const firstChoice = currentScene?.choices?.[0];
      if (firstChoice) {
        action = () => handleChoice(firstChoice);
      } else {
        action = () => handleNoChoiceAdvance();
      }

    } else if (isDialogueComplete && !isTyping) {
      action = () => {
        if (dialogueIndex < (currentScene?.dialogue.length || 1) - 1) {
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

  useEffect(() => {
    if (!audioEnabled) return;
    const normalize = (url: string) => {
      try {
        return new URL(url, window.location.href).href;
      } catch {
        return url;
      }
    };

    const desiredBedCandidates = TRACK_URL_CANDIDATES.track01.map((u) => normalize(u));
    const sceneFallbackMusicUrl = resolveAsset(currentScene?.musicKey);
    const sceneTrackCandidates = TRACK_URL_CANDIDATES[sceneTrackKey] ?? TRACK_URL_CANDIDATES.track01;
    const desiredSceneCandidates = [...sceneTrackCandidates];
    if (sceneFallbackMusicUrl && !desiredSceneCandidates.includes(sceneFallbackMusicUrl)) {
      desiredSceneCandidates.push(sceneFallbackMusicUrl);
    }
    if (!desiredSceneCandidates.includes(ASSET_URLS.audio.main_theme)) {
      desiredSceneCandidates.push(ASSET_URLS.audio.main_theme);
    }
    const normalizedSceneCandidates = desiredSceneCandidates.map((u) => normalize(u));
    const desiredAmbientUrl = (currentScene?.ambientKeys ?? [])
      .map(k => resolveAsset(k))
      .find((u): u is string => typeof u === "string" && u.length > 0);

    const setSourceWithFallback = (audio: HTMLAudioElement, candidates: string[]) => {
      let index = 0;
      const tryNext = () => {
        if (index >= candidates.length) return;
        const nextSrc = candidates[index++];
        audio.onerror = tryNext;
        audio.src = nextSrc;
        audio.load();
        audio.play().catch(() => {});
      };
      tryNext();
    };

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
      if (audio.paused) audio.play().catch(() => {});
    };

    if (!bedMusicRef.current) {
      bedMusicRef.current = new Audio();
      bedMusicRef.current.preload = 'auto';
      bedMusicRef.current.loop = true;
      bedMusicRef.current.volume = 0;
      setSourceWithFallback(bedMusicRef.current, desiredBedCandidates);
    } else {
      const activeSrc = normalize(bedMusicRef.current.src);
      if (!desiredBedCandidates.includes(activeSrc)) {
        bedMusicRef.current.pause();
        bedMusicRef.current.volume = 0;
        setSourceWithFallback(bedMusicRef.current, desiredBedCandidates);
      }
    }

    if (!sceneMusicRef.current) {
      sceneMusicRef.current = new Audio();
      sceneMusicRef.current.preload = 'auto';
      sceneMusicRef.current.loop = true;
      sceneMusicRef.current.volume = 0;
    }

    if (!isSceneUsingBedOnly && sceneMusicRef.current) {
      const activeSrc = normalize(sceneMusicRef.current.src);
      if (!normalizedSceneCandidates.includes(activeSrc)) {
        sceneMusicRef.current.pause();
        sceneMusicRef.current.volume = 0;
        setSourceWithFallback(sceneMusicRef.current, normalizedSceneCandidates);
      }
    }

    if (desiredAmbientUrl) {
      if (!ambientRef.current) {
        ambientRef.current = new Audio(normalize(desiredAmbientUrl));
        ambientRef.current.preload = 'metadata';
        ambientRef.current.loop = true;
        ambientRef.current.volume = isMuted ? 0 : 0;
        ambientRef.current.play().catch(() => {});
      } else {
        const nextSrc = normalize(desiredAmbientUrl);
        if (ambientRef.current.src !== nextSrc) {
          ambientRef.current.pause();
          ambientRef.current.src = nextSrc;
          ambientRef.current.loop = true;
          ambientRef.current.volume = 0;
          ambientRef.current.play().catch(() => {});
        }
      }
    } else if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current.src = '';
      ambientRef.current = null;
    }

    const baseMusic = isMuted ? 0 : musicVol;
    const voiceMixFactor = voiceSyncLock ? 0.46 : 1;
    const bedTarget = (isSceneUsingBedOnly ? baseMusic : baseMusic * 0.35) * voiceMixFactor;
    const sceneTarget = (isSceneUsingBedOnly ? 0 : Math.min(1, baseMusic * 0.95)) * voiceMixFactor;

    if (bedMusicRef.current) fade(bedMusicRef.current, bedTarget, bedMusicFadeRef);
    if (sceneMusicRef.current) fade(sceneMusicRef.current, sceneTarget, sceneMusicFadeRef);
    if (ambientRef.current) fade(ambientRef.current, (isMuted ? 0 : sfxVol) * (voiceSyncLock ? 0.55 : 1), ambientFadeRef);

    return () => {
      if (bedMusicFadeRef.current) cancelAnimationFrame(bedMusicFadeRef.current);
      if (sceneMusicFadeRef.current) cancelAnimationFrame(sceneMusicFadeRef.current);
      if (ambientFadeRef.current) cancelAnimationFrame(ambientFadeRef.current);
    };
  }, [audioEnabled, currentSceneId, currentScene?.musicKey, currentScene?.ambientKeys, isMuted, musicVol, sfxVol, resolveAsset, isSceneUsingBedOnly, sceneTrackKey, voiceSyncLock]);

  useEffect(() => {
    if (!audioEnabled) return;
    const keys = currentScene?.enterSfxKeys ?? [];
    if (!keys.length) return;
    for (const key of keys) {
      const url = resolveAsset(key);
      if (!url) continue;
      const a = new Audio(url);
      a.preload = 'metadata';
      a.loop = false;
      a.volume = isMuted ? 0 : Math.min(1, Math.max(0, sfxVol));
      a.play().catch(() => {});
    }
  }, [audioEnabled, currentSceneId, currentScene?.enterSfxKeys, isMuted, sfxVol, resolveAsset]);

  useEffect(() => {
    if (!audioEnabled || showChoices || !currentDialogue || !currentVoiceCue) {
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
    }

    const voice = voiceRef.current;
    voice.volume = isMuted ? 0 : Math.min(1, Math.max(0.12, sfxVol * 1.1));
    const fullText = currentDialogue.text || '';
    const fullArabic = currentDialogue.arabicText || '';

    let cancelled = false;
    let started = false;
    let lastVisible = 0;
    let lastRendered = 0;
    let lastUpdateMs = 0;

    const syncDisplayedTextToVoice = () => {
      if (cancelled) return;
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

  }, [audioEnabled, showChoices, currentSceneId, dialogueIndex, currentDialogue, currentVoiceCue, isMuted, sfxVol, lang]);

  // ── Background video ─────────────────────────────────────────────────────────
  useEffect(() => {
    const bgVideoSrc = resolveAsset(currentScene?.backgroundVideo);
    if (!allowVideo) {
      if (bgVideoRef.current) bgVideoRef.current.pause();
      return;
    }
    if (bgVideoRef.current && bgVideoSrc) {
      bgVideoRef.current.load();
      bgVideoRef.current.play().catch(() => {});
    }
  }, [allowVideo, currentSceneId, currentScene?.backgroundVideo, resolveAsset]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (bedMusicFadeRef.current) cancelAnimationFrame(bedMusicFadeRef.current);
      if (sceneMusicFadeRef.current) cancelAnimationFrame(sceneMusicFadeRef.current);
      if (voiceSyncRafRef.current) cancelAnimationFrame(voiceSyncRafRef.current);
      if (bedMusicRef.current) { bedMusicRef.current.pause(); bedMusicRef.current.src = ''; }

      if (sceneMusicRef.current) { sceneMusicRef.current.pause(); sceneMusicRef.current.src = ''; }
      if (ambientFadeRef.current) cancelAnimationFrame(ambientFadeRef.current);
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
      <div className="w-screen h-screen bg-black flex items-center justify-center">
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
      className="relative w-screen h-screen overflow-hidden bg-black select-none font-novel"
      onClick={handleAdvance}
      animate={fxShake ? { x: [0, -4, 3, -2, 2, 0], y: [0, 2, -2, 3, -1, 0] } : { x: 0, y: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <CinematicStage
        scene={currentScene}
        sceneId={currentSceneId}
        bgImageSrc={bgImageSrc}
        bgVideoSrc={bgVideoSrc}
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
            style={{ mixBlendMode: activeImageCue.blend, zIndex: 7, filter: 'saturate(1.1) contrast(1.05)' }}
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

      <AnimatePresence>
        {showAudioPrompt && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ background: 'rgba(0,0,0,0.92)' }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 24 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center px-10 py-12 rounded-2xl max-w-sm mx-4"
              style={{
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(201,169,110,0.25)',
                backdropFilter: 'blur(24px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={osirisLogo}
                alt="OSIRIS"
                className="w-20 h-20 mx-auto mb-6 opacity-95"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <h2 className="text-3xl font-light text-amber-300 mb-1 tracking-[0.3em]">OSIRIS</h2>
              <p className="text-amber-200/55 text-sm font-arabic-title mb-1" dir="rtl">المفسدون في الأرض</p>
              <p className="text-white/35 text-[10px] mb-8 font-mono tracking-widest">A MULTIMEDIA INTERACTIVE DIGITAL NOVEL</p>
              <p className="text-white/60 text-sm mb-2 leading-relaxed">For the best experience, use headphones.</p>
              <p className="text-white/40 text-xs mb-8 leading-relaxed font-arabic" dir="rtl">للحصول على أفضل تجربة، استخدم سماعات الأذن</p>
              <button
                onClick={enableAudio}
                className="w-full py-4 rounded-xl font-semibold tracking-[0.2em] text-sm transition-all duration-300 hover:brightness-110 active:scale-95 text-black"
                style={{ background: 'linear-gradient(135deg, #c9a96e, #f0d080)' }}
              >
                ▶ BEGIN THE TRIAL
              </button>
              <p className="text-white/25 text-[10px] mt-3 font-arabic" dir="rtl">ابدأ المحاكمة</p>
              <p className="text-white/20 text-[9px] mt-4 font-mono">SPACE or CLICK to advance · ESC to exit</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVoiceModeActive && (
        <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6 h-11 sm:h-12 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={(e) => { e.stopPropagation(); setLocation('/'); }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-white/10"
            style={{ color: 'rgba(201,169,110,0.65)' }}
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
              className="px-2 py-1 text-[9px] font-mono rounded-lg tracking-wider transition-all duration-200 hover:bg-white/10"
              style={{ border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(0,0,0,0.5)', color: 'rgba(201,169,110,0.85)' }}
            >
              {isFullscreen ? (isArabic ? 'إغلاق ملء الشاشة' : 'EXIT FULL') : (isArabic ? 'ملء الشاشة' : 'FULL')}
            </button>

            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(0,0,0,0.5)' }}>
              <button
                onClick={() => setLang('ar')}
                className="px-2.5 py-1 text-[9px] font-mono tracking-wider transition-all duration-200"
                style={{ background: lang === 'ar' ? 'rgba(201,169,110,0.25)' : 'transparent', color: lang === 'ar' ? '#c9a96e' : 'rgba(255,255,255,0.35)' }}
              >عر</button>
              <div style={{ width: '1px', height: '14px', background: 'rgba(201,169,110,0.15)' }} />
              <button
                onClick={() => setLang('en')}
                className="px-2.5 py-1 text-[9px] font-mono tracking-wider transition-all duration-200"
                style={{ background: lang === 'en' ? 'rgba(201,169,110,0.25)' : 'transparent', color: lang === 'en' ? '#c9a96e' : 'rgba(255,255,255,0.35)' }}
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
        className="absolute z-20 flex flex-col items-center px-3 py-1 rounded-full"
        style={{
          top: 56,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}
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
        {showCharacter && currentCharConfig.imageUrl && currentDialogue?.character !== 'Narrator' && (
          <motion.div
            key={(currentDialogue?.character || '') + '-portrait-' + dialogueIndex}
            className={`absolute bottom-44 sm:bottom-32 ${currentCharConfig.position === 'left' ? 'left-4 sm:left-6 md:left-14' : 'right-4 sm:right-6 md:right-14'} z-30 pointer-events-none`}
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{ opacity: 0.92, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-25"
                style={{ background: currentCharConfig.glowColor }}
              />
              <img
                src={currentCharConfig.imageUrl}
                alt={currentCharConfig.name}
                className="relative w-20 h-28 sm:w-28 sm:h-40 md:w-36 md:h-52 object-cover rounded-2xl"
                style={{
                  boxShadow: `0 0 50px ${currentCharConfig.glowColor}, 0 20px 60px rgba(0,0,0,0.7)`,
                  border: `1px solid ${currentCharConfig.color}25`,
                  filter: 'brightness(0.85) contrast(1.05)',
                }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-16 rounded-b-2xl"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
              />
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[8px] font-mono tracking-wider whitespace-nowrap"
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  border: `1px solid ${currentCharConfig.color}30`,
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
                    className="h-px flex-1 max-w-[50px]"
                    style={{ background: isArabic ? `linear-gradient(to left, transparent, ${currentCharConfig.color}70)` : `linear-gradient(to right, transparent, ${currentCharConfig.color}70)` }}
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
                      textShadow: `0 0 16px ${currentCharConfig.glowColor}`,
                    }}
                  >
                    {lang === 'ar' ? currentCharConfig.arabicName : currentCharConfig.name}
                  </span>
                  <div className="h-px flex-1 max-w-[50px]" style={{ background: isArabic ? `linear-gradient(to right, transparent, ${currentCharConfig.color}70)` : `linear-gradient(to left, transparent, ${currentCharConfig.color}70)` }} />
                </motion.div>
              )}

              {/* Dialogue Box */}
              <div
                className={`relative rounded-2xl px-4 py-4 sm:px-7 sm:py-6 md:px-9 md:py-7 ${isArabic ? 'text-right' : ''}`}
                dir={isArabic ? 'rtl' : 'ltr'}
                style={{
                  background: currentScene.backgroundVideo ? 'rgba(0,0,0,0.56)' : 'rgba(0,0,0,0.66)',
                  border: isAutoRunning && !showChoices ? '1px solid rgba(0,0,0,0)' : `1px solid ${currentCharConfig.color}18`,
                  boxShadow: `0 10px 70px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 ${currentCharConfig.color}10`,
                  backdropFilter: 'blur(18px)',
                }}
              >

                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, ${currentCharConfig.color}10, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25))`,
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    opacity: uiGlow * 0.7,
                    background: `radial-gradient(circle at 20% 20%, ${currentCharConfig.color}33, rgba(0,0,0,0) 55%)`,
                    mixBlendMode: "screen",
                  }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-[2px] rounded-t-2xl"
                  style={{ background: `linear-gradient(to right, ${accentColor}30, ${accentColor}95)` }}
                  animate={{ width: `${((currentIdx + 1) / sceneKeys.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                {isAutoRunning && !showChoices && (
                  <>
                    <motion.div
                      className="absolute top-0 left-0 h-px rounded-t-2xl"
                      style={{ background: currentCharConfig.color }}
                      animate={{ width: `${autoTop * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute top-0 right-0 w-px rounded-r-2xl"
                      style={{ background: currentCharConfig.color }}
                      animate={{ height: `${autoRight * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 h-px rounded-b-2xl"
                      style={{ background: currentCharConfig.color }}
                      animate={{ width: `${autoBottom * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-px rounded-l-2xl"
                      style={{ background: currentCharConfig.color }}
                      animate={{ height: `${autoLeft * 100}%` }}
                      transition={{ duration: 0.05, ease: 'linear' }}
                    />
                  </>
                )}
                {/* Active Language Text Only */}
                {lang === 'en' ? (
                  <p
                    className="text-white/93 text-[20px] md:text-[26px] font-light"
                    style={{
                      textShadow: '0 1px 8px rgba(0,0,0,0.98)',
                      letterSpacing: '0.012em',
                      lineHeight: '1.75',
                    }}
                  >
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-0.5 h-6 ml-1 align-middle"
                        style={{ background: currentCharConfig.color }}
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity }}
                      />
                    )}
                  </p>
                ) : (
                  <p
                    className="text-white/93 text-[22px] md:text-[30px] text-right font-arabic"
                    dir="rtl"
                    style={{
                      textShadow: '0 1px 8px rgba(0,0,0,0.98)',
                      lineHeight: '2.1',
                    }}
                  >
                    {displayedArabic}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-0.5 h-6 mr-1 align-middle"
                        style={{ background: currentCharConfig.color }}
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity }}
                      />
                    )}
                  </p>
                )}

                {/* Dialogue Progress Dots */}
                {currentScene.dialogue.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-5">
                    {currentScene.dialogue.map((_, idx) => (
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
                        onClick={(e) => { e.stopPropagation(); handleBackScene(); }}
                        disabled={!showChoices && dialogueIndex === 0}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: 'rgba(201,169,110,0.75)', border: '1px solid rgba(201,169,110,0.22)', background: 'rgba(0,0,0,0.35)' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points={isArabic ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
                        </svg>
                        <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'السابق' : 'BACK'}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleForwardScript(); }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-white/10"
                        style={{ color: 'rgba(201,169,110,0.78)', border: '1px solid rgba(201,169,110,0.26)', background: 'rgba(0,0,0,0.35)' }}
                      >
                        <span className="text-[9px] font-mono tracking-wider">{isArabic ? 'التالي' : 'NEXT'}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points={isArabic ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
                        </svg>
                      </button>
                    </div>

                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center rounded-lg overflow-hidden ${isArabic ? 'flex-row-reverse' : ''}`} style={{ border: '1px solid rgba(201,169,110,0.22)', background: 'rgba(0,0,0,0.35)' }}>
                        <button onClick={() => setAutoMode('off')} className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`} style={{ background: autoMode === 'off' ? 'rgba(201,169,110,0.25)' : 'transparent', color: autoMode === 'off' ? '#c9a96e' : 'rgba(255,255,255,0.4)' }}>{isArabic ? 'تلقائي إيقاف' : 'AUTO OFF'}</button>
                        <button onClick={() => setAutoMode('very-slow')} className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`} style={{ background: autoMode === 'very-slow' ? 'rgba(201,169,110,0.25)' : 'transparent', color: autoMode === 'very-slow' ? '#c9a96e' : 'rgba(255,255,255,0.4)' }}>{isArabic ? 'بطيء جدًا' : 'VSLOW'}</button>
                        <button onClick={() => setAutoMode('slow')} className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`} style={{ background: autoMode === 'slow' ? 'rgba(201,169,110,0.25)' : 'transparent', color: autoMode === 'slow' ? '#c9a96e' : 'rgba(255,255,255,0.4)' }}>{isArabic ? 'بطيء' : 'SLOW'}</button>
                        <button onClick={() => setAutoMode('normal')} className={`px-2 py-1 text-[8px] tracking-wider transition-all duration-200 ${isArabic ? 'font-arabic-ui' : 'font-mono'}`} style={{ background: autoMode === 'normal' ? 'rgba(201,169,110,0.25)' : 'transparent', color: autoMode === 'normal' ? '#c9a96e' : 'rgba(255,255,255,0.4)' }}>{isArabic ? 'عادي' : 'NORMAL'}</button>
                      </div>
                      <VolumeControl
                        musicVol={musicVol}
                        sfxVol={sfxVol}
                        onMusicChange={handleMusicVol}
                        onSfxChange={handleSfxVol}
                        isMuted={isMuted}
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
                    className="h-full rounded-full"
                    style={{
                      width: `${choiceProgress}%`,
                      background: choiceProgress > 55
                        ? `linear-gradient(to right, ${accentColor}80, ${accentColor})`
                        : choiceProgress > 22
                          ? 'linear-gradient(to right, #f97316, #fbbf24)'
                          : 'linear-gradient(to right, #ef4444, #f97316)',
                      transition: 'width 0.05s linear',
                    }}
                  />
                </div>
                {/* Countdown number */}
                <motion.span
                  className={`text-[11px] font-mono tabular-nums flex-shrink-0 w-6 ${isArabic ? 'text-left' : 'text-right'}`}
                  style={{
                    color: choiceProgress > 55 ? `${accentColor}90`
                      : choiceProgress > 22 ? '#fbbf2490'
                      : '#ef444490',
                  }}
                  animate={{ scale: timerSeconds <= 5 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: timerSeconds <= 5 ? Infinity : 0 }}
                >
                  {timerSeconds}
                </motion.span>
              </div>

              <div className="grid gap-3">
                {currentScene.choices.map((choice, idx) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -28 : 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: idx * 0.1 }}
                    onClick={() => handleChoice(choice)}
                    className={`group relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] ${isArabic ? 'text-right' : 'text-left'}`}
                    style={{
                      background: 'rgba(0,0,0,0.72)',
                      border: `1px solid ${accentColor}20`,
                      boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(14px)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = `${accentColor}55`;
                      el.style.background = `${accentColor}0a`;
                      el.style.boxShadow = `0 4px 40px ${accentColor}15`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = `${accentColor}20`;
                      el.style.background = 'rgba(0,0,0,0.72)';
                      el.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
                    }}
                  >
                    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono flex-shrink-0"
                        style={{
                          background: `${accentColor}15`,
                          color: accentColor,
                          border: `1px solid ${accentColor}30`,
                        }}
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
                        className={`text-base mx-1 flex-shrink-0 opacity-0 group-hover:opacity-70 transition-all duration-300 ${isArabic ? 'order-first' : ''}`}
                        style={{ color: accentColor }}
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
                className="inline-flex flex-col items-center gap-3 px-6 sm:px-10 py-5 sm:py-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(0,0,0,0.75)',
                  border: `1px solid ${accentColor}22`,
                  backdropFilter: 'blur(16px)',
                }}
              >
                {currentScene?.defaultNextScene ? (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); handleNoChoiceAdvance(); }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
                  >
                    <span className={lang === 'ar' ? 'text-sm tracking-wider font-arabic-ui' : 'text-sm font-mono tracking-[0.25em] uppercase'} style={{ color: `${accentColor}90` }}>
                      {isArabic ? 'التالي' : 'NEXT'}
                    </span>
                    <motion.span
                      style={{ color: `${accentColor}90`, fontSize: '18px' }}
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
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'} `}
                        style={{ background: `linear-gradient(135deg, ${accentColor}, #f0d080)`, color: '#0b0b0d' }}
                      >
                        {isArabic ? 'الصفحة الرئيسية' : 'HOME'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareMenuOpen((v) => !v); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                        style={{ border: `1px solid ${accentColor}33`, background: 'rgba(0,0,0,0.35)', color: `${accentColor}CC` }}
                      >
                        {isArabic ? 'مشاركة' : 'SHARE'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyShareLink(); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                        style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {isArabic ? 'نسخ الرابط' : 'COPY LINK'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goToScene('zero-1-1-summons'); }}
                        className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                        style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {isArabic ? 'إعادة البدء' : 'RESTART'}
                      </button>
                    </div>
                    {shareMenuOpen && (
                      <div className={`mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareNative(); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                          style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          {isArabic ? 'مشاركة النظام' : 'NATIVE'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('whatsapp'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                          style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('telegram'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                          style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          Telegram
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('facebook'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                          style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          Facebook
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('x'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                          style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          X
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleShareTo('email'); }}
                          className={`px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] ${isArabic ? 'font-arabic-ui' : 'font-mono'}`}
                          style={{ border: `1px solid ${accentColor}22`, background: 'rgba(0,0,0,0.25)', color: 'rgba(255,255,255,0.75)' }}
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
      {audioEnabled && ((bedMusicRef.current && !bedMusicRef.current.paused) || (sceneMusicRef.current && !sceneMusicRef.current.paused)) && (
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
                className="w-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.5)' }}
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

export default MainPlayer;
