/**
 * MainPlayer State Store
 * Consolidates 35+ useState hooks into organized Zustand slices
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { DialogueLine, Scene } from '@/lib/sceneSystem';
import type { VisualEffect } from '@/lib/visualEffects';
import type { OsirisEffectId } from '@/lib/osirisEffects';
import type { CSSProperties } from 'react';
import { SCENES as ALL_SCENES } from '@/lib/sceneSystem';
import {
  TRACK_URL_CANDIDATES,
  getSceneMusicCandidates,
  SCENE_VOICE_CUES,
  getVoiceCandidates,
  getDevilVoiceCandidates,
  type ImageCue,
} from '@/lib/mainPlayerConfig';

// ─── State Types ────────────────────────────────────────────────────────────

export type Language = 'en' | 'ar';
export type AutoMode = 'off' | 'very-slow' | 'slow' | 'normal';

export interface MainPlayerState {
  // Language
  lang: Language;
  setLang: (lang: Language) => void;

  // Scene State
  currentSceneId: string;
  dialogueIndex: number;
  sceneHistory: string[];
  setCurrentSceneId: (id: string) => void;
  setDialogueIndex: (index: number) => void;
  addToHistory: (sceneId: string) => void;
  goToScene: (sceneId: string) => void;

  // Display State
  displayedText: string;
  displayedArabic: string;
  isTyping: boolean;
  isDialogueComplete: boolean;
  setDisplayedText: (text: string) => void;
  setDisplayedArabic: (text: string) => void;
  setIsTyping: (typing: boolean) => void;
  setIsDialogueComplete: (complete: boolean) => void;

  // UI State
  showChoices: boolean;
  choiceProgress: number;
  sceneTransitioning: boolean;
  bgLoaded: boolean;
  videoReady: boolean;
  showCharacter: boolean;
  autoMode: AutoMode;
  autoProgress: number;
  isFullscreen: boolean;
  shareMenuOpen: boolean;
  setShowChoices: (show: boolean) => void;
  setChoiceProgress: (progress: number) => void;
  setSceneTransitioning: (transitioning: boolean) => void;
  setBgLoaded: (loaded: boolean) => void;
  setVideoReady: (ready: boolean) => void;
  setShowCharacter: (show: boolean) => void;
  setAutoMode: (mode: AutoMode) => void;
  setAutoProgress: (progress: number) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShareMenuOpen: (open: boolean) => void;

  // Audio State
  audioEnabled: boolean;
  showAudioPrompt: boolean;
  bgVol: number;
  sceneVol: number;
  voiceVol: number;
  sfxVol: number;
  isMuted: boolean;
  isPlaying: boolean;
  scriptTrackOverride: keyof typeof TRACK_URL_CANDIDATES | null;
  setAudioEnabled: (enabled: boolean) => void;
  setShowAudioPrompt: (show: boolean) => void;
  setBgVol: (vol: number) => void;
  setSceneVol: (vol: number) => void;
  setVoiceVol: (vol: number) => void;
  setSfxVol: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setScriptTrackOverride: (track: keyof typeof TRACK_URL_CANDIDATES | null) => void;
  toggleMute: () => void;
  togglePlayPause: () => void;

  // Effects State
  fxFlash: number;
  fxShake: number;
  uiPulse: number;
  activeImageCue: { src: string; opacity: number; blend: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'; token: string } | null;
  activeVisualEffect: VisualEffect | null;
  techBoost: number;
  voiceSyncLock: boolean;
  activeVoiceNumber: number | null;
  osirisEffectId: OsirisEffectId | null;
  setFxFlash: (flash: number) => void;
  setFxShake: (shake: number) => void;
  setUiPulse: (pulse: number) => void;
  setActiveImageCue: (cue: { src: string; opacity: number; blend: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'; token: string } | null) => void;
  setActiveVisualEffect: (effect: VisualEffect | null) => void;
  setTechBoost: (boost: number) => void;
  setVoiceSyncLock: (locked: boolean) => void;
  setActiveVoiceNumber: (voice: number | null) => void;
  setOsirisEffectId: (effect: OsirisEffectId | null) => void;

  // Derived Data
  canonicalDialogueByScene: Record<string, DialogueLine[]>;
  setCanonicalDialogueByScene: (map: Record<string, DialogueLine[]>) => void;

  // Computed (derived from other state)
  getCurrentScene: () => Scene | undefined;
  getDialogueLines: (canonicalMode: boolean) => DialogueLine[];
  getCurrentDialogue: (canonicalMode: boolean) => DialogueLine | undefined;
}

// ─── Store Implementation ───────────────────────────────────────────────────

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

export const useMainPlayerStore = create<MainPlayerState>()(
  persist(
    (set, get) => ({
      // Language
      lang: 'ar' as Language,
      setLang: (lang: Language) => set({ lang }),

      // Scene State
      currentSceneId: 'zero-1-1-summons',
      dialogueIndex: 0,
      sceneHistory: [] as string[],
      setCurrentSceneId: (id: string) => set({ currentSceneId: id }),
      setDialogueIndex: (index: number) => set({ dialogueIndex: index }),
      addToHistory: (sceneId: string) =>
        set(
          (state: { sceneHistory: string[] }) => ({ sceneHistory: [...state.sceneHistory, sceneId].slice(-120) })
        ),
      goToScene: (sceneId: string) => {
        const state = get();
        if (state.currentSceneId !== sceneId) {
          state.addToHistory(state.currentSceneId);
        }
        set(
          {
            currentSceneId: sceneId,
            dialogueIndex: 0,
            showChoices: false,
            sceneTransitioning: true,
            bgLoaded: false,
            videoReady: false,
            showCharacter: false,
            displayedText: '',
            displayedArabic: '',
            isTyping: false,
            isDialogueComplete: false,
            scriptTrackOverride: null,
            activeVisualEffect: null,
            osirisEffectId: null,
          }
        );
        // Trigger scene transition effect
        setTimeout(() => {
          set({ sceneTransitioning: false });
        }, 1800);
        setTimeout(() => {
          set({ bgLoaded: true, videoReady: true });
        }, 300);
        setTimeout(() => {
          set({ showCharacter: true });
        }, 600);
      },

      // Display State
      displayedText: '',
      displayedArabic: '',
      isTyping: false,
      isDialogueComplete: false,
      setDisplayedText: (text: string) => set({ displayedText: text }),
      setDisplayedArabic: (text: string) => set({ displayedArabic: text }),
      setIsTyping: (typing: boolean) => set({ isTyping: typing }),
      setIsDialogueComplete: (complete: boolean) => set({ isDialogueComplete: complete }),

      // UI State
      showChoices: false,
      choiceProgress: 100,
      sceneTransitioning: false,
      bgLoaded: false,
      videoReady: false,
      showCharacter: false,
      autoMode: 'off',
      autoProgress: 100,
      isFullscreen: false,
      shareMenuOpen: false,
      setShowChoices: (show: boolean) => set({ showChoices: show }),
      setChoiceProgress: (progress: number) => set({ choiceProgress: progress }),
      setSceneTransitioning: (transitioning: boolean) => set({ sceneTransitioning: transitioning }),
      setBgLoaded: (loaded: boolean) => set({ bgLoaded: loaded }),
      setVideoReady: (ready: boolean) => set({ videoReady: ready }),
      setShowCharacter: (show: boolean) => set({ showCharacter: show }),
      setAutoMode: (mode: AutoMode) => set({ autoMode: mode }),
      setAutoProgress: (progress: number) => set({ autoProgress: progress }),
      setIsFullscreen: (fullscreen: boolean) => set({ isFullscreen: fullscreen }),
      setShareMenuOpen: (open: boolean) => set({ shareMenuOpen: open }),

      // Audio State
      audioEnabled: false,
      showAudioPrompt: true,
      bgVol: 0.25,
      sceneVol: 0.4,
      voiceVol: 0.85,
      sfxVol: 0.35,
      isMuted: false,
      isPlaying: false,
      scriptTrackOverride: null,
      setAudioEnabled: (enabled: boolean) => set({ audioEnabled: enabled }),
      setShowAudioPrompt: (show: boolean) => set({ showAudioPrompt: show }),
      setBgVol: (vol: number) => set({ bgVol: Math.min(1, Math.max(0, vol)) }),
      setSceneVol: (vol: number) => set({ sceneVol: Math.min(1, Math.max(0, vol)) }),
      setVoiceVol: (vol: number) => set({ voiceVol: Math.min(1, Math.max(0, vol)) }),
      setSfxVol: (vol: number) => set({ sfxVol: Math.min(1, Math.max(0, vol)) }),
      setIsMuted: (muted: boolean) => set({ isMuted: muted }),
      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
      setScriptTrackOverride: (track: keyof typeof TRACK_URL_CANDIDATES | null) => set({ scriptTrackOverride: track }),
      toggleMute: () => {
        const state = get();
        set({ isMuted: !state.isMuted });
      },
      togglePlayPause: () => {
        const state = get();
        set({ isPlaying: !state.isPlaying });
      },

      // Effects State
      fxFlash: 0,
      fxShake: 0,
      uiPulse: 0,
      activeImageCue: null,
      activeVisualEffect: null,
      techBoost: 0,
      voiceSyncLock: false,
      activeVoiceNumber: null,
      osirisEffectId: null,
      setFxFlash: (flash: number) => set({ fxFlash: flash }),
      setFxShake: (shake: number) => set({ fxShake: shake }),
      setUiPulse: (pulse: number) => set({ uiPulse: pulse }),
      setActiveImageCue: (cue: { src: string; opacity: number; blend: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'; token: string } | null) => set({ activeImageCue: cue }),
      setActiveVisualEffect: (effect: VisualEffect | null) => set({ activeVisualEffect: effect }),
      setTechBoost: (boost: number) => set({ techBoost: boost }),
      setVoiceSyncLock: (locked: boolean) => set({ voiceSyncLock: locked }),
      setActiveVoiceNumber: (voice: number | null) => set({ activeVoiceNumber: voice }),
      setOsirisEffectId: (effect: OsirisEffectId | null) => set({ osirisEffectId: effect }),

      // Canonical Data
      canonicalDialogueByScene: {},
      setCanonicalDialogueByScene: (map: Record<string, DialogueLine[]>) => set({ canonicalDialogueByScene: map }),

      // Computed
      getCurrentScene: () => {
        const { currentSceneId } = get();
        return ALL_SCENES[currentSceneId];
      },
      getDialogueLines: (canonicalMode: boolean) => {
        const state = get();
        const scene = state.getCurrentScene();
        if (!scene) return [];
        if (!canonicalMode) return scene.dialogue || [];
        const canonical = state.canonicalDialogueByScene[state.currentSceneId];
        return canonical && canonical.length ? canonical : scene.dialogue || [];
      },
      getCurrentDialogue: (canonicalMode: boolean) => {
        const state = get();
        const lines = state.getDialogueLines(canonicalMode);
        return lines[state.dialogueIndex];
      },
    }),
    {
      name: 'MainPlayerStore',
    }
  )
);

// ─── Selectors (for performance) ──────────────────────────────────────────

export const selectScene = (state: MainPlayerState) => state.getCurrentScene();
export const selectDialogueLines = (canonicalMode: boolean) => (state: MainPlayerState) =>
  state.getDialogueLines(canonicalMode);
export const selectCurrentDialogue = (canonicalMode: boolean) => (state: MainPlayerState) =>
  state.getCurrentDialogue(canonicalMode);
