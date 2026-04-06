/**
 * Animation Presets
 * 
 * Pre-configured animation settings for consistent motion across the app.
 * 
 * @see project_history/03_ux_ui_review.md — Issues A1, A2
 * @example
 * import { transitions, variants, withReducedMotion } from '@/lib/animationPresets';
 * 
 * <motion.div
 *   variants={variants.fadeUp}
 *   transition={transitions.normal}
 * />
 */

import type { Transition, Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Duration constants (seconds)
export const DURATION = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;

// Easing functions
export const EASING = {
  linear: [0, 0, 1, 1] as const,
  ease: [0.25, 0.1, 0.25, 1] as const,
  easeIn: [0.42, 0, 1, 1] as const,
  easeOut: [0, 0, 0.58, 1] as const,
  easeInOut: [0.42, 0, 0.58, 1] as const,
  cinematic: [0.25, 0.46, 0.45, 0.94] as const,
  dramatic: [0.22, 1, 0.36, 1] as const,
} as const;

// Standard transitions
export const transitions: Record<string, Transition> = {
  instant: { duration: DURATION.instant },
  
  fade: {
    duration: DURATION.normal,
    ease: EASING.ease,
  },
  
  'fade-slow': {
    duration: DURATION.slow,
    ease: EASING.ease,
  },
  
  'fade-up': {
    duration: DURATION.normal,
    ease: EASING.cinematic,
  },
  
  'scale-pop': {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
  
  'slide-in': {
    duration: DURATION.normal,
    ease: EASING.cinematic,
  },
  
  choice: {
    duration: DURATION.slow,
    ease: EASING.cinematic,
  },
  
  chapter: {
    duration: DURATION.slower,
    ease: EASING.cinematic,
  },
  
  modal: {
    duration: DURATION.normal,
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  
  pulse: {
    duration: 1.2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
} as const;

// Animation variants
export const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  
  'fade-down': {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  
  'fade-left': {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 28 },
  },
  
  'fade-right': {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -28 },
  },
  
  'scale-pop': {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  
  'stagger-item': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
} as const;

/**
 * Hook: Get transitions respecting reduced motion preference
 * 
 * @example
 * const transition = useTransition('fade');
 * // Returns instant transition if user prefers reduced motion
 */
export function useTransition(name: keyof typeof transitions): Transition {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return transitions.instant;
  }
  
  return transitions[name];
}

/**
 * Hook: Get variants respecting reduced motion preference
 */
export function useVariants(name: keyof typeof variants): Variants {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return {
      hidden: {},
      visible: {},
      exit: {},
    };
  }
  
  return variants[name];
}

/**
 * Higher-order function to wrap any transition with reduced motion check
 */
export function withReducedMotion(
  transition: Transition,
  enabled: boolean
): Transition {
  if (enabled) {
    return { duration: 0 };
  }
  return transition;
}

export default {
  DURATION,
  EASING,
  transitions,
  variants,
};
