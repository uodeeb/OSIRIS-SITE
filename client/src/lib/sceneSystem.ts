// OSIRIS Scene System - v1.0.1 (Modular)
import { PART_ZERO } from './scenes/partZero.ts';
import { PART_ONE } from './scenes/partOne.ts';
import { PART_TWO } from './scenes/partTwo.ts';
import { PART_THREE } from './scenes/partThree.ts';
import { PART_FOUR } from './scenes/partFour.ts';
import { PART_FIVE } from './scenes/partFive.ts';
import { PART_SIX } from './scenes/partSix.ts';
import { TRANSITION } from './scenes/transition.ts';
import { PART_SEVEN } from './scenes/partSeven.ts';

export interface DialogueLine {
  character: string;
  text: string;
  arabicText: string;
  duration: number;
  delay?: number;
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
  visualEffect?: "glitch" | "scanlines" | "cctv" | "alarm" | "montage" | "none";
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
