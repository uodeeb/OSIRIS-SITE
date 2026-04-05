// OSIRIS Scene System - v1.0.1 (Modular)
import { PART_ZERO } from './scenes/partZero';
import { PART_ONE } from './scenes/partOne';
import { PART_TWO } from './scenes/partTwo';
import { PART_THREE } from './scenes/partThree';
import { PART_FOUR } from './scenes/partFour';
import { PART_FIVE } from './scenes/partFive';
import { PART_SIX } from './scenes/partSix';
import { TRANSITION } from './scenes/transition';
import { PART_SEVEN } from './scenes/partSeven';

export interface DialogueLine {
  character: string;
  text: string;
  arabicText: string;
  duration: number;
  audioUrl?: string;
}

export interface SceneChoice {
  id: string;
  text: string;
  arabicText: string;
  nextSceneId: string;
  consequence?: string;
}

export interface Scene {
  id: string;
  title: string;
  arabicTitle: string;
  part: number;
  backgroundVideo?: string;
  backgroundImage?: string;
  backgroundVideoAudioDescEn?: string;
  backgroundVideoAudioDescAr?: string;
  audioUrl?: string;
  visualEffect?: "glitch" | "scanlines" | "cctv" | "none";
  musicKey?: string;
  ambientKeys?: string[];
  enterSfxKeys?: string[];
  dialogue: DialogueLine[];
  choices?: SceneChoice[];
  defaultNextScene?: string;
  transitionType?: 'fade' | 'dissolve' | 'glitch' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  transitionDuration?: number;
  emotionalTone?: 'hopeful' | 'intense' | 'tragic' | 'dark' | 'contemplative' | 'urgent';
}

export const PART_LABELS: Record<number, { en: string; ar: string }> = {
  0: { en: 'Part 0: Prologue', ar: 'الجزء 0: الاستدعاء' },
  1: { en: 'Part 1: The Code', ar: 'الجزء 1: الكود' },
  2: { en: 'Part 2: The Golden Calf', ar: 'الجزء 2: العجل الذهبي' },
  3: { en: 'Part 3: The Sacred Corruption', ar: 'الجزء 3: الفساد المقدس' },
  4: { en: 'Part 4: The New Blood', ar: 'الجزء 4: الدماء الجديدة' },
};

export const SCENES: Record<string, Scene> = {
  ...PART_ZERO,
  ...PART_ONE,
  ...PART_TWO,
  ...PART_THREE,
  ...PART_FOUR,
  ...PART_FIVE,
  ...PART_SIX,
  ...TRANSITION,
  ...PART_SEVEN,
};

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}

export function getFirstScene(): Scene {
  return SCENES['transition-real-to-sim'];
}
