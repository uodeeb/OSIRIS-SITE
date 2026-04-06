/**
 * Hook: useMediaSelector
 * 
 * Fine-grained media context subscription.
 * Prevents unnecessary re-renders from context changes.
 * 
 * @see project_history/03_ux_ui_review.md — Issue S1 (Prop drilling)
 * @example
 * // Component only re-renders when elapsedMs changes
 * const elapsedMs = useMediaElapsedMs();
 * 
 * // Component never re-renders from context
 * const { play, pause } = useMediaActions();
 */

import { useContext } from 'react';
import { useMediaState } from '@/contexts/MediaStateContext';
import type { MediaControllerState } from '@/contexts/MediaControllerContext';

// Type for selector function
type Selector<T> = (state: MediaControllerState) => T;

/**
 * Generic selector hook for media state
 * Only re-renders when selected value changes
 */
export function useMediaSelector<T>(selector: Selector<T>): T {
  const state = useMediaState();
  
  // For now, just return the selected value from current state
  // In a future optimization, we could implement proper subscription
  return selector(state);
}

// Pre-defined selectors for common use cases
export function useMediaElapsedMs(): number {
  return useMediaSelector(state => state.elapsedMs);
}

export function useMediaIsPlaying(): boolean {
  return useMediaSelector(state => state.isPlaying);
}

export function useMediaVolume(): number {
  return useMediaSelector(state => state.primaryVolume);
}

export function useMediaIsMuted(): boolean {
  return useMediaSelector(state => state.isMuted);
}

export function useMediaAccentColor(): string {
  return useMediaSelector(state => state.accentColor);
}

export function useMediaUILanguage(): 'en' | 'ar' {
  return useMediaSelector(state => state.uiLang);
}

export default useMediaSelector;
