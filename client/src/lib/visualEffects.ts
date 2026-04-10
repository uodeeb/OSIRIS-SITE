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
    videoSrc: '/generated-assets/video-bg/osiris-vid-bg/OSIRIS_falcon_hologram_202603301403.mp4',
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
    videoSrc: '/generated-assets/video-bg/osiris-vid-bg/Neural_network_forms_202603301407.mp4',
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
    videoSrc: '/generated-assets/video-bg/osiris-vid-bg/Falcon_hologram_data_202603301414.mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 04 — سطح المبنى (وداع طارق).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 02 — غرفة يحيى (المشهد الافتتاحي).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 02 — غرفة يحيى (المشهد الافتتاحي).mp4',
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
    videoSrc: '/generated-assets/video-bg/osiris-vid-bg/Egyptian_falcon_eye_202603301359.mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 12 — الفضاء الرقمي (المواجهة مع المهندس).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 07 — مجمع نيقية (الإمبراطور والحكيم).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 08 — الأندلس (جمال يتلاشى).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 11 — كربلاء (الحق الأعزل).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 05 — صحراء سيناء (العجل الذهبي).mp4',
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
    videoSrc: '/generated-assets/video-bg/VIDEO 10 — برلين 1933 (الكبر يصبح نظاماً).mp4',
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
