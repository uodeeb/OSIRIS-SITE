/**
 * Design System Tokens — Animation
 * 
 * Animation presets, timing, and easing functions.
 * Replaces inline animation configurations.
 * 
 * @see project_history/03_ux_ui_review.md — Issues A1, A2, A3, A4
 */

import type { Transition } from 'framer-motion';

// Duration scale (in seconds)
export const duration = {
  instant: 0,
  fastest: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1.0,
} as const;

// Easing functions
export const easing = {
  // Standard
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  
  // Framer Motion presets
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  'spring-gentle': { type: 'spring', stiffness: 200, damping: 25 },
  'spring-bouncy': { type: 'spring', stiffness: 400, damping: 15 },
  
  // Custom cinematic
  cinematic: [0.25, 0.46, 0.45, 0.94],
  dramatic: [0.22, 1, 0.36, 1],
  subtle: [0.4, 0, 0.2, 1],
} as const;

// Pre-configured transitions
export const transitions: Record<string, Transition> = {
  // Fade transitions
  fade: {
    duration: duration.normal,
    ease: easing.ease,
  },
  'fade-slow': {
    duration: duration.slow,
    ease: easing.ease,
  },
  
  // Slide transitions
  'slide-up': {
    duration: duration.normal,
    ease: easing.cinematic,
  },
  'slide-down': {
    duration: duration.normal,
    ease: easing.cinematic,
  },
  'slide-left': {
    duration: duration.normal,
    ease: easing.cinematic,
  },
  'slide-right': {
    duration: duration.normal,
    ease: easing.cinematic,
  },
  
  // Scale transitions
  'scale-in': {
    duration: duration.fast,
    ...easing.spring,
  },
  'scale-out': {
    duration: duration.fast,
    ease: easing['ease-out'],
  },
  
  // UI specific
  'choice-appear': {
    duration: duration.slow,
    ease: easing.cinematic,
    staggerChildren: 0.1,
  },
  'chapter-expand': {
    duration: duration.slow,
    ease: easing.cinematic,
  },
  'modal-pop': {
    duration: duration.normal,
    ...easing.spring,
  },
  
  // Reduced motion — instant
  'reduced-motion': {
    duration: duration.instant,
  },
} as const;

// Animation variants for common patterns
export const variants = {
  // Fade in/out
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Slide up with fade
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  
  // Scale pop
  'scale-pop': {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  // Stagger children
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
  },
  
  // Pulse animation (for audio indicators)
  pulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    },
  },
  
  // Infinite pulse
  'pulse-infinite': {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
} as const;

// Stagger delays for lists
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  slower: 0.2,
} as const;

// Animation configuration for reduced motion
export const reducedMotion = {
  transition: {
    duration: 0,
  },
  variants: {
    hidden: {},
    visible: {},
    exit: {},
  },
} as const;

// CSS custom property helpers for dynamic animations
export function createDynamicTransition(
  baseTransition: Transition,
  accentColor?: string
): Transition {
  return {
    ...baseTransition,
    ...(accentColor && {
      // Framer Motion doesn't directly support CSS vars in transitions
      // This is for reference when setting up dynamic values
    }),
  };
}
