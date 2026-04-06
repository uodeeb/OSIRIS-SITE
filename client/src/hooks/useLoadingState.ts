/**
 * Hook: useLoadingState
 * 
 * Manages loading states with progress tracking.
 * For scene transitions and asset loading.
 * 
 * @see project_history/03_ux_ui_review.md — Issue B1 (Critical)
 * @example
 * const { isLoading, progress, startLoading, setProgress, finishLoading } = useLoadingState();
 * 
 * startLoading();
 * await preloadAssets(urls, setProgress);
 * finishLoading();
 */

import { useState, useCallback } from 'react';

export interface LoadingState {
  /** Whether currently loading */
  isLoading: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Current loading message */
  message: string;
  /** Start loading */
  startLoading: (message?: string) => void;
  /** Update progress (0-100) */
  setProgress: (progress: number) => void;
  /** Update loading message */
  setMessage: (message: string) => void;
  /** Mark loading as complete */
  finishLoading: () => void;
  /** Reset to initial state */
  reset: () => void;
}

export function useLoadingState(): LoadingState {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [message, setMessageState] = useState('');

  const startLoading = useCallback((initialMessage = '') => {
    setIsLoading(true);
    setProgressState(0);
    setMessageState(initialMessage);
  }, []);

  const setProgress = useCallback((value: number) => {
    setProgressState(Math.min(100, Math.max(0, value)));
  }, []);

  const setMessage = useCallback((msg: string) => {
    setMessageState(msg);
  }, []);

  const finishLoading = useCallback(() => {
    setProgressState(100);
    // Small delay before hiding to show 100%
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setProgressState(0);
    setMessageState('');
  }, []);

  return {
    isLoading,
    progress,
    message,
    startLoading,
    setProgress,
    setMessage,
    finishLoading,
    reset,
  };
}

export default useLoadingState;
