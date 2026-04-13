// ═══════════════════════════════════════════════════════════════════════════════
// OSIRIS VISUAL EFFECTS SYSTEM
// Dialogue-triggered video overlays and OSIRIS model effects
// ═══════════════════════════════════════════════════════════════════════════════

import type { CSSProperties } from 'react';

export type VisualEffectType = 'osiris-model' | 'scene-overlay' | 'historical';

export interface VisualEffect {
  id: string;
  type: VisualEffectType;
  triggerPhrase: string;
  altPhrases?: string[];
  videoSrc: string;
  opacity: number;
  blendMode: CSSProperties['mixBlendMode'];
  duration: number;
  position: 'fullscreen' | 'corner' | 'center';
}

// ═══════════════════════════════════════════════════════════════════════════════
// OSIRIS AI MODEL OVERLAYS
// Triggered when OSIRIS/simulation/AI is mentioned
// ═══════════════════════════════════════════════════════════════════════════════
export const OSIRIS_MODEL_EFFECTS: VisualEffect[] = [
  {
    id: 'osiris-hologram',
    type: 'osiris-model',
    triggerPhrase: 'أوزيريس',
    altPhrases: ['osiris', 'simulation', 'المحاكاة', 'النظام', 'system', 'خوارزمية', 'algorithm'],
    videoSrc: '/assets/osiris-vid-bg/falcon-hologram.mp4',
    opacity: 0.4,
    blendMode: 'screen',
    duration: 8000,
    position: 'corner',
  },
  {
    id: 'neural-network',
    type: 'osiris-model',
    triggerPhrase: 'شبكة عصبية',
    altPhrases: ['neural', 'ذكاء اصطناعي', 'AI', 'تعلم آلي', 'machine learning'],
    videoSrc: '/assets/osiris-vid-bg/neural-network-forms.mp4',
    opacity: 0.35,
    blendMode: 'overlay',
    duration: 6000,
    position: 'center',
  },
  {
    id: 'falcon-data',
    type: 'osiris-model',
    triggerPhrase: 'بيانات',
    altPhrases: ['data', 'معلومات', 'information', 'تحليل', 'analysis'],
    videoSrc: '/assets/osiris-vid-bg/falcon-hologram-data.mp4',
    opacity: 0.3,
    blendMode: 'screen',
    duration: 5000,
    position: 'corner',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE-SPECIFIC DIALOGUE TRIGGERS
// Contextual visual overlays based on narrative moments
// ═══════════════════════════════════════════════════════════════════════════════
export const DIALOGUE_VISUAL_EFFECTS: VisualEffect[] = [
  // Lab/Server Room Scene
  {
    id: 'lab-server-room',
    type: 'scene-overlay',
    triggerPhrase: 'طارق يجلس وحيداً في المختبر',
    altPhrases: ['المختبر', 'شاشات', 'خوادم', 'servers', 'lab', 'خرائط عصبية'],
    videoSrc: '/assets/video-bg/tarek-rooftop.mp4',
    opacity: 0.5,
    blendMode: 'multiply',
    duration: 6000,
    position: 'fullscreen',
  },
  // Tarek's Dark Apartment
  {
    id: 'tarek-apartment',
    type: 'scene-overlay',
    triggerPhrase: 'يتلفت حوله في شقته المظلمة',
    altPhrases: ['شقته المظلمة', 'يتلفت حوله', 'الجدران تراقبه', 'غرفته'],
    videoSrc: '/assets/video-bg/yahya-room.mp4',
    opacity: 0.45,
    blendMode: 'overlay',
    duration: 7000,
    position: 'fullscreen',
  },
  // Yahya Wakes Up
  {
    id: 'yahya-awakening',
    type: 'scene-overlay',
    triggerPhrase: 'عاد يحيى إلى وعيه في غرفته',
    altPhrases: ['الدموع تنهمر', 'وعيه'],
    videoSrc: '/assets/video-bg/yahya-room.mp4',
    opacity: 0.4,
    blendMode: 'soft-light',
    duration: 5000,
    position: 'fullscreen',
  },
  // OSIRIS Eye/Summons
  {
    id: 'osiris-summons',
    type: 'osiris-model',
    triggerPhrase: 'العين تراقب',
    altPhrases: ['عين أوزيريس', 'الشاشة تنبض', 'نظام أوزيريس'],
    videoSrc: '/assets/video-bg/cosmic-opening.mp4',
    opacity: 0.55,
    blendMode: 'screen',
    duration: 4000,
    position: 'center',
  },
  // Digital/Cyberspace
  {
    id: 'digital-space',
    type: 'scene-overlay',
    triggerPhrase: 'الفضاء الرقمي',
    altPhrases: ['عالم رقمي', 'الكود', 'cyberspace', 'digital'],
    videoSrc: '/assets/video-bg/digital-space.mp4',
    opacity: 0.5,
    blendMode: 'overlay',
    duration: 8000,
    position: 'fullscreen',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORICAL FLASHBACK OVERLAYS
// ═══════════════════════════════════════════════════════════════════════════════
export const HISTORICAL_VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: 'historical-nicaea',
    type: 'historical',
    triggerPhrase: 'مجمع نيقية',
    altPhrases: ['نيقية', 'الإمبراطور', 'الحكيم', 'arius', 'athanasius'],
    videoSrc: '/assets/video-bg/nicaea.mp4',
    opacity: 0.6,
    blendMode: 'overlay',
    duration: 6000,
    position: 'fullscreen',
  },
  {
    id: 'historical-andalus',
    type: 'historical',
    triggerPhrase: 'الأندلس',
    altPhrases: ['غرناطة', 'أبو عبد الله', 'الحمراء', 'boabdil', 'granada'],
    videoSrc: '/assets/video-bg/andalus.mp4',
    opacity: 0.6,
    blendMode: 'overlay',
    duration: 6000,
    position: 'fullscreen',
  },
  {
    id: 'historical-karbala',
    type: 'historical',
    triggerPhrase: 'كربلاء',
    altPhrases: ['الحسين', 'الأربعين', 'الحق الأعزل', 'hussein', 'karbala'],
    videoSrc: '/assets/video-bg/karbala.mp4',
    opacity: 0.6,
    blendMode: 'overlay',
    duration: 6000,
    position: 'fullscreen',
  },
  {
    id: 'historical-desert',
    type: 'historical',
    triggerPhrase: 'العجل الذهبي',
    altPhrases: ['صحراء سيناء', 'سيناء', 'العبادة'],
    videoSrc: '/assets/video-bg/sinai-desert.mp4',
    opacity: 0.55,
    blendMode: 'overlay',
    duration: 6000,
    position: 'fullscreen',
  },
  {
    id: 'historical-berlin',
    type: 'historical',
    triggerPhrase: 'برلين',
    altPhrases: ['1933', 'totalitarian', 'النظام'],
    videoSrc: '/assets/video-bg/berlin-1933.mp4',
    opacity: 0.55,
    blendMode: 'overlay',
    duration: 6000,
    position: 'fullscreen',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ALL EFFECTS COMBINED
// ═══════════════════════════════════════════════════════════════════════════════
export const ALL_VISUAL_EFFECTS: VisualEffect[] = [
  ...OSIRIS_MODEL_EFFECTS,
  ...DIALOGUE_VISUAL_EFFECTS,
  ...HISTORICAL_VISUAL_EFFECTS,
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function normalizeArabicForMatch(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[اأإآ]/g, 'ا')
    .replace(/[ىي]/g, 'ي')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .trim();
}

export function checkVisualEffectTriggers(dialogueText: string): VisualEffect | null {
  if (!dialogueText) return null;
  const normalized = normalizeArabicForMatch(dialogueText);
  
  for (const effect of ALL_VISUAL_EFFECTS) {
    const phrases = [effect.triggerPhrase, ...(effect.altPhrases || [])];
    for (const phrase of phrases) {
      if (normalized.includes(normalizeArabicForMatch(phrase))) {
        return effect;
      }
    }
  }
  return null;
}

export function getOSIRISEffects(): VisualEffect[] {
  return OSIRIS_MODEL_EFFECTS;
}

export function getDialogueEffects(): VisualEffect[] {
  return DIALOGUE_VISUAL_EFFECTS;
}

export function getHistoricalEffects(): VisualEffect[] {
  return HISTORICAL_VISUAL_EFFECTS;
}
