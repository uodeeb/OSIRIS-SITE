/**
 * Hook: useReducedMotion
 * 
 * Detects user's motion preference for accessibility.
 * Critical for users with vestibular disorders.
 * 
 * @see project_history/03_ux_ui_review.md — Issue A1 (Critical)
 * @example
 * const shouldReduceMotion = useReducedMotion();
 * 
 * <motion.div
 *   animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
 *   transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
 * />
 */

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes (user can toggle mid-session)
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
