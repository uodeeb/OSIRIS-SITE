/**
 * OSIRIS MainPlayer Component Types
 * Shared type definitions for modular MainPlayer architecture
 */

import type { Scene, SceneChoice, DialogueLine } from '@/lib/sceneSystem';

export interface MainPlayerProps {
  initialSceneId?: string;
}

export interface CharacterConfig {
  name: string;
  arabicName: string;
  color: string;
  glowColor: string;
  imageUrl?: string;
  position: 'left' | 'right' | 'center';
}

export interface ImageCue {
  src: string;
  points: number[];
  opacity?: number;
  blend?: string;
  token: string;
  animation?: 'fade' | 'zoom' | 'glitch' | 'pulse' | 'scan' | 'warp';
}

export type AutoMode = 'off' | 'very-slow' | 'slow' | 'normal';

export interface VoiceCue {
  voice: number;
  at: number;
  lock?: boolean;
  dialogueStartMs?: number;
}

export type CharacterEmotion = 
  | 'neutral' 
  | 'fearful' 
  | 'sad' 
  | 'angry' 
  | 'shocked' 
  | 'dying' 
  | 'determined' 
  | 'ghost' 
  | 'breakdown';

export type CharacterEffect = 
  | 'pulse' 
  | 'glitch' 
  | 'flash' 
  | 'ghost' 
  | 'none';

export interface CharacterState {
  emotion: CharacterEmotion;
  effect: CharacterEffect;
}

export interface ActiveImageCue {
  src: string;
  opacity: number;
  blend: string;
  token: string;
}

export interface DialogueDisplayProps {
  dialogue: DialogueLine | undefined;
  characterConfig: CharacterConfig;
  displayedText: string;
  displayedArabic: string;
  isTyping: boolean;
  isArabic: boolean;
  currentCharConfig: CharacterConfig;
  isVoiceModeActive: boolean;
  isAutoRunning: boolean;
  dialogueIndex: number;
  totalDialogues: number;
  currentIdx: number;
  sceneKeys: string[];
  accentColor: string;
  autoTop: number;
  autoRight: number;
  autoBottom: number;
  autoLeft: number;
  isDialogueComplete: boolean;
  lang: 'en' | 'ar';
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  autoMode: AutoMode;
  onAutoModeChange: (mode: AutoMode) => void;
  musicVol: number;
  sfxVol: number;
  isMuted: boolean;
  onMusicVolChange: (vol: number) => void;
  onSfxVolChange: (vol: number) => void;
  onToggleMute: () => void;
}

export interface ChoicePanelProps {
  choices: SceneChoice[] | undefined;
  isArabic: boolean;
  choiceProgress: number;
  accentColor: string;
  timerSeconds: number;
  lang: 'en' | 'ar';
  onChoice: (choice: SceneChoice) => void;
}

export interface ShareMenuProps {
  isOpen: boolean;
  isArabic: boolean;
  currentScene: Scene | undefined;
  currentSceneId: string;
  lang: 'en' | 'ar';
  accentColor: string;
  onClose: () => void;
  onCopyLink: () => void;
  onShareNative: () => void;
  onShareTo: (target: 'whatsapp' | 'telegram' | 'facebook' | 'x' | 'email') => void;
  onRestart: () => void;
  onHome: () => void;
}

export interface SceneTransitionProps {
  isTransitioning: boolean;
  children: React.ReactNode;
}

export interface NavigationControlsProps {
  isArabic: boolean;
  canGoBack: boolean;
  autoMode: AutoMode;
  onBack: () => void;
  onForward: () => void;
  onAutoModeChange: (mode: AutoMode) => void;
}
