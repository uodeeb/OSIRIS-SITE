/**
 * useSceneLogic Hook
 * Manages scene progression, dialogue advancement, choices, and auto-mode
 * Integrated with mainPlayerStore for state management
 */

import { useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMainPlayerStore, type AutoMode } from '@/store/mainPlayerStore';
import { SCENES as ALL_SCENES, type Scene, type SceneChoice, type DialogueLine } from '@/lib/sceneSystem';
import { checkVisualEffectTriggers, type VisualEffect } from '@/lib/visualEffects';
import { detectOsirisEffectId, type OsirisEffectId } from '@/lib/osirisEffects';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SceneLogicOptions {
  canonicalMode?: boolean;
  onEffectTrigger?: (fx: { flash?: number; shake?: boolean; ui?: number }) => void;
}

export interface UseSceneLogicReturn {
  // Scene Navigation
  goToScene: (sceneId: string, options?: { recordHistory?: boolean }) => void;
  handleBackScene: () => void;
  handleNoChoiceAdvance: () => void;

  // Dialogue Progression
  advanceDialogue: () => void;
  handleAdvance: () => void;
  handleForwardScript: () => void;

  // Choices
  handleChoice: (choice: SceneChoice) => void;

  // Auto-mode
  setAutoMode: (mode: AutoMode) => void;
  autoMode: AutoMode;
  autoProgress: number;

  // Typewriter
  skipTyping: () => void;
  isTyping: boolean;
  isDialogueComplete: boolean;

  // Effects
  triggerVisualEffects: (dialogue?: DialogueLine) => void;
  activeVisualEffect: VisualEffect | null;
  osirisEffectId: OsirisEffectId | null;

  // Derived State
  currentScene: Scene | undefined;
  currentDialogue: DialogueLine | undefined;
  dialogueLines: DialogueLine[];
  dialogueIndex: number;
  showChoices: boolean;
  isVoicedDialogue: boolean;
  voiceSyncLock: boolean;
}

// ─── Helper: Check for text-based effect triggers ────────────────────────────

const checkEffectTriggers = (text: string): { flash?: number; shake?: boolean; ui?: number } | null => {
  const t = text.toLowerCase();

  // Cosmic vibration / shock effects
  if (
    t.includes('الاهتزاز الكوني') ||
    t.includes('اهتزاز كوني') ||
    t.includes('ارتجاج') ||
    t.includes('رجفة') ||
    t.includes('زلزال') ||
    t.includes('اهتز') ||
    t.includes('ارتعاش') ||
    t.includes('cosmic vibration') ||
    t.includes('shockwave') ||
    t.includes('rumble')
  ) {
    return { flash: 0.3, shake: true, ui: 1 };
  }

  // Warning effects
  if (t.includes('warning') || t.includes('تحذير')) {
    return { flash: 0.18, shake: true, ui: 1 };
  }

  // Enter/pressure effects
  if (t.includes('enter') || (t.includes('ضغط') && t.includes('enter'))) {
    return { flash: 0.22, ui: 0.85 };
  }

  // Explosion effects
  if (t.includes('explod') || t.includes('انفجر')) {
    return { flash: 0.28, shake: true, ui: 0.7 };
  }

  // Red/crimson effects
  if (t.includes('crimson') || t.includes('red') || t.includes('الأحمر') || t.includes('الاحمر')) {
    return { flash: 0.12, ui: 0.35 };
  }

  // Osiris mention
  if (t.includes('osiris') || t.includes('أوزيريس') || t.includes('اوزيريس')) {
    return { ui: 0.35 };
  }

  return null;
};

// ─── Hook Implementation ───────────────────────────────────────────────────

export function useSceneLogic(options: SceneLogicOptions = {}): UseSceneLogicReturn {
  const { canonicalMode = false, onEffectTrigger } = options;
  const [, setLocation] = useLocation();

  // Store selectors
  const store = useMainPlayerStore();

  // Refs for timers to manage cleanup
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const choiceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSceneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoProgressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoCleanupRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);
      if (autoSceneTimerRef.current) clearTimeout(autoSceneTimerRef.current);
      if (autoProgressIntervalRef.current) clearInterval(autoProgressIntervalRef.current);
    };
  }, []);

  // ─── Derived State ─────────────────────────────────────────────────────────

  const currentScene = store.getCurrentScene();
  const dialogueLines = store.getDialogueLines(canonicalMode);
  const currentDialogue = dialogueLines[store.dialogueIndex];

  const isVoicedDialogue = Boolean(currentDialogue?.audioUrl);

  // ─── Scene Navigation ──────────────────────────────────────────────────────

  const goToScene = useCallback(
    (sceneId: string, opts?: { recordHistory?: boolean }) => {
      if (!ALL_SCENES[sceneId]) return;

      // Record history if enabled and scene is changing
      if (opts?.recordHistory !== false && sceneId !== store.currentSceneId) {
        store.addToHistory(store.currentSceneId);
      }

      // Clear any running timers
      if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      if (autoSceneTimerRef.current) clearTimeout(autoSceneTimerRef.current);

      // Trigger scene transition
      store.setSceneTransitioning(true);

      setTimeout(() => {
        store.setCurrentSceneId(sceneId);
        store.setDialogueIndex(0);
        store.setDisplayedText('');
        store.setDisplayedArabic('');
        store.setShowChoices(false);
        store.setChoiceProgress(100);
        store.setBgLoaded(false);
        store.setVideoReady(false);
        store.setShowCharacter(false);
        store.setIsDialogueComplete(false);
        store.setIsTyping(false);
        store.setScriptTrackOverride(null);
        store.setActiveVisualEffect(null);
        store.setOsirisEffectId(null);
        store.setSceneTransitioning(false);

        // Show character after delay
        setTimeout(() => store.setShowCharacter(true), 600);
      }, 1800);
    },
    [store.currentSceneId]
  );

  const handleBackScene = useCallback(() => {
    if (!currentScene) return;

    // Clear typing timer immediately
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
      typewriterRef.current = null;
    }

    // Reset typing states
    store.setIsTyping(false);
    store.setIsDialogueComplete(true);

    // If showing choices, hide them and return to last dialogue
    if (store.showChoices) {
      store.setShowChoices(false);
      const lastDialogueIndex = Math.max(0, dialogueLines.length - 1);
      store.setDialogueIndex(lastDialogueIndex);

      // Restore text immediately
      const targetDialogue = dialogueLines[lastDialogueIndex];
      if (targetDialogue) {
        store.setDisplayedText(targetDialogue.text || '');
        store.setDisplayedArabic(targetDialogue.arabicText || '');
      }
      return;
    }

    // Go back one dialogue step
    const newIndex = Math.max(0, store.dialogueIndex - 1);
    store.setDialogueIndex(newIndex);

    // Pre-load the text
    const targetDialogue = dialogueLines[newIndex];
    if (targetDialogue) {
      store.setDisplayedText(targetDialogue.text || '');
      store.setDisplayedArabic(targetDialogue.arabicText || '');
    }
  }, [currentScene, dialogueLines, store.showChoices, store.dialogueIndex]);

  const handleNoChoiceAdvance = useCallback(() => {
    if (!currentScene) return;
    const nextId = currentScene.defaultNextScene;
    if (nextId) {
      goToScene(nextId);
    } else {
      setLocation('/');
    }
  }, [currentScene, goToScene, setLocation]);

  // ─── Dialogue Progression ──────────────────────────────────────────────────

  const advanceDialogue = useCallback(() => {
    if (!currentScene) return;

    const nextIdx = store.dialogueIndex + 1;
    if (nextIdx < dialogueLines.length) {
      store.setDialogueIndex(nextIdx);
      store.setIsDialogueComplete(false);
      store.setShowCharacter(false);
      setTimeout(() => store.setShowCharacter(true), 250);
    } else {
      // End of dialogue - show choices or auto-advance
      store.setShowChoices(true);
    }
  }, [currentScene, dialogueLines.length, store.dialogueIndex]);

  const skipTyping = useCallback(() => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
      typewriterRef.current = null;
    }

    if (currentDialogue) {
      store.setDisplayedText(currentDialogue.text || '');
      store.setDisplayedArabic(currentDialogue.arabicText || '');
    }

    store.setIsTyping(false);
    store.setIsDialogueComplete(true);
  }, [currentDialogue, store]);

  const handleAdvance = useCallback(() => {
    // If audio not enabled, enable it first
    if (!store.audioEnabled) {
      store.setAudioEnabled(true);
      store.setShowAudioPrompt(false);
      store.setIsPlaying(true);
      return;
    }

    // Block if showing choices or voice is locked
    if (store.showChoices || store.voiceSyncLock) return;

    // If currently typing, skip to end (unless voiced)
    if (store.isTyping) {
      if (isVoicedDialogue) return;
      skipTyping();
      return;
    }

    // If dialogue complete, advance to next
    if (store.isDialogueComplete) {
      advanceDialogue();
    }
  }, [
    store.isDialogueComplete,
    isVoicedDialogue,
    skipTyping,
    advanceDialogue,
  ]);

  const handleForwardScript = useCallback(() => {
    if (store.showChoices) {
      if (currentScene?.choices && currentScene.choices.length > 0) {
        // Select first choice
        const firstChoice = currentScene.choices[0];
        if (firstChoice.nextSceneId) {
          goToScene(firstChoice.nextSceneId);
        }
      } else {
        handleNoChoiceAdvance();
      }
      return;
    }

    handleAdvance();
  }, [store.showChoices, currentScene, goToScene, handleNoChoiceAdvance, handleAdvance]);

  // ─── Choice Handling ───────────────────────────────────────────────────────

  const handleChoice = useCallback(
    (choice: SceneChoice) => {
      if (store.voiceSyncLock) return;
      if (choice.nextSceneId) {
        goToScene(choice.nextSceneId);
      }
    },
    [store.voiceSyncLock, goToScene]
  );

  // ─── Auto-mode Logic ───────────────────────────────────────────────────────

  const autoSceneDelayMs: Record<Exclude<AutoMode, 'off'>, number> = {
    'very-slow': 12000,
    slow: 7000,
    normal: 4000,
  };

  // Auto-mode effect
  useEffect(() => {
    // Exit if auto-mode off or scene transitioning or voice locked
    if (store.autoMode === 'off' || store.sceneTransitioning || store.voiceSyncLock) {
      // Only cleanup if not already cleaned up
      if (!autoCleanupRef.current) {
        if (autoSceneTimerRef.current) {
          clearTimeout(autoSceneTimerRef.current);
          autoSceneTimerRef.current = null;
        }
        if (autoProgressIntervalRef.current) {
          clearInterval(autoProgressIntervalRef.current);
          autoProgressIntervalRef.current = null;
        }
        // Only set to 0 if not already 0 to prevent infinite loop
        if (store.autoProgress !== 0) {
          store.setAutoProgress(0);
        }
        autoCleanupRef.current = true;
      }
      return;
    }

    // Reset cleanup flag when entering auto-mode
    autoCleanupRef.current = false;

    // Clear existing timers when entering auto-mode
    if (autoSceneTimerRef.current) {
      clearTimeout(autoSceneTimerRef.current);
      autoSceneTimerRef.current = null;
    }
    if (autoProgressIntervalRef.current) {
      clearInterval(autoProgressIntervalRef.current);
      autoProgressIntervalRef.current = null;
    }
    // Only set to 100 if not already 100 to prevent unnecessary updates
    if (store.autoProgress !== 100) {
      store.setAutoProgress(100);
    }

    const delay = autoSceneDelayMs[store.autoMode as Exclude<AutoMode, 'off'>];
    let action: (() => void) | null = null;

    if (store.showChoices) {
      const firstChoice = currentScene?.choices?.[0];
      if (firstChoice) {
        action = () => handleChoice(firstChoice);
      } else {
        action = () => handleNoChoiceAdvance();
      }
    } else if (store.isDialogueComplete && !store.isTyping) {
      action = () => {
        if (store.dialogueIndex < dialogueLines.length - 1) {
          advanceDialogue();
        } else {
          store.setShowChoices(true);
        }
      };
    }

    if (!action) return;

    const startTime = Date.now();

    // Progress countdown
    autoProgressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / delay) * 100);
      store.setAutoProgress(remaining);
    }, 50);

    // Execute action after delay
    autoSceneTimerRef.current = setTimeout(() => {
      if (autoProgressIntervalRef.current) {
        clearInterval(autoProgressIntervalRef.current);
        autoProgressIntervalRef.current = null;
      }
      store.setAutoProgress(0);
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
  }, [
    store.autoMode,
    store.sceneTransitioning,
    store.voiceSyncLock,
    store.showChoices,
    store.isDialogueComplete,
    store.isTyping,
    store.dialogueIndex,
    currentScene?.id,
    dialogueLines.length,
    advanceDialogue,
    handleChoice,
    handleNoChoiceAdvance,
    store,
  ]);

  // ─── Choice Timer ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!store.showChoices || !currentScene?.choices?.length) return;
    if (choiceIntervalRef.current) clearInterval(choiceIntervalRef.current);

    const timerMs = 30000;
    const startTime = Date.now();

    choiceIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / timerMs) * 100);
      store.setChoiceProgress(remaining);

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
  }, [store.showChoices, currentScene?.id, currentScene?.choices, handleChoice, store]);

  // ─── Effect Triggers ───────────────────────────────────────────────────────

  const triggerVisualEffects = useCallback(
    (dialogue?: DialogueLine) => {
      const d = dialogue || currentDialogue;
      if (!d) return;

      const text = `${d.text || ''} ${d.arabicText || ''}`;
      const effects = checkEffectTriggers(text);

      if (effects && onEffectTrigger) {
        onEffectTrigger(effects);
      }
    },
    [currentDialogue, onEffectTrigger]
  );

  // Auto-clear visual effects
  useEffect(() => {
    if (!store.activeVisualEffect) return;

    const timer = setTimeout(() => {
      store.setActiveVisualEffect(null);
    }, store.activeVisualEffect.duration);

    return () => clearTimeout(timer);
  }, [store.activeVisualEffect, store]);

  // Detect Osiris effects
  useEffect(() => {
    if (!currentScene) return;

    const next = detectOsirisEffectId({
      sceneId: store.currentSceneId,
      sceneTitle: currentScene.title,
      sceneArabicTitle: currentScene.arabicTitle,
      visualEffect: currentScene.visualEffect,
      text: currentDialogue?.text,
      arabicText: currentDialogue?.arabicText,
    });

    store.setOsirisEffectId(next);
  }, [
    store.currentSceneId,
    currentScene?.title,
    currentScene?.arabicTitle,
    currentScene?.visualEffect,
    store.dialogueIndex,
    currentDialogue?.text,
    currentDialogue?.arabicText,
    currentScene,
  ]);

  // ─── Keyboard Handler ──────────────────────────────────────────────────────

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

  // ─── Return API ────────────────────────────────────────────────────────────

  return {
    // Scene Navigation
    goToScene,
    handleBackScene,
    handleNoChoiceAdvance,

    // Dialogue Progression
    advanceDialogue,
    handleAdvance,
    handleForwardScript,

    // Choices
    handleChoice,

    // Auto-mode
    setAutoMode: store.setAutoMode,
    autoMode: store.autoMode,
    autoProgress: store.autoProgress,

    // Typewriter
    skipTyping,
    isTyping: store.isTyping,
    isDialogueComplete: store.isDialogueComplete,

    // Effects
    triggerVisualEffects,
    activeVisualEffect: store.activeVisualEffect,
    osirisEffectId: store.osirisEffectId,

    // Derived State
    currentScene,
    currentDialogue,
    dialogueLines,
    dialogueIndex: store.dialogueIndex,
    showChoices: store.showChoices,
    isVoicedDialogue,
    voiceSyncLock: store.voiceSyncLock,
  };
}
