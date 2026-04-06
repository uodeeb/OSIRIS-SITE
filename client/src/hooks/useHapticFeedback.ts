/**
 * Hook: useHapticFeedback
 * 
 * Provides tactile feedback on mobile devices.
 * Enhances UX by confirming interactions.
 * 
 * @see project_history/03_ux_ui_review.md — Issue B2 (Medium)
 * @example
 * const { vibrate } = useHapticFeedback();
 * 
 * <button onClick={() => {
 *   vibrate(20); // Light feedback
 *   handleAction();
 * }}>
 */

import { useCallback } from 'react';

export type VibrationPattern = number | number[];

export interface HapticFeedback {
  /** Trigger vibration */
  vibrate: (pattern?: VibrationPattern) => void;
  /** Check if vibration is supported */
  isSupported: boolean;
}

export function useHapticFeedback(): HapticFeedback {
  const vibrate = useCallback((pattern: VibrationPattern = 50) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const isSupported = typeof navigator !== 'undefined' && !!navigator.vibrate;

  return { vibrate, isSupported };
}

// Predefined vibration patterns
export const hapticPatterns = {
  /** Light tap — button press */
  light: 20,
  /** Medium feedback — action completed */
  medium: 50,
  /** Strong feedback — important action */
  strong: 100,
  /** Error feedback — double tap */
  error: [50, 100, 50],
  /** Success feedback — escalating pattern */
  success: [30, 50, 60],
} as const;

export default useHapticFeedback;
