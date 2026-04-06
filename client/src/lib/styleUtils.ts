/**
 * Type-safe CSS Utilities
 * 
 * Replaces unsafe `as React.CSSProperties` casts with typed helpers.
 * 
 * @see project_history/03_ux_ui_review.md — Issue T1
 * @example
 * // BEFORE (unsafe):
 * style={{ '--choice-bg': 'rgba(0,0,0,0.72)' } as React.CSSProperties }
 * 
 * // AFTER (type-safe):
 * style={customStyles({ '--choice-bg': 'rgba(0,0,0,0.72)' })}
 */

import type { CSSProperties } from 'react';

// Define all custom CSS properties used in the application
type CSSCustomProperties = {
  // Choice panel properties
  '--choice-bg'?: string;
  '--choice-border'?: string;
  '--choice-shadow'?: string;
  '--choice-backdrop'?: string;
  '--choice-accent'?: string;
  
  // Choice number properties
  '--choice-num-bg'?: string;
  '--choice-num-color'?: string;
  '--choice-num-border'?: string;
  
  // Countdown/timer properties
  '--countdown-color'?: string;
  
  // End scene properties
  '--end-scene-bg'?: string;
  '--end-scene-border'?: string;
  '--end-scene-backdrop'?: string;
  
  // Button properties
  '--end-btn-bg'?: string;
  '--end-btn-color'?: string;
  '--secondary-btn-border'?: string;
  '--secondary-btn-bg'?: string;
  '--secondary-btn-color'?: string;
  '--tertiary-btn-border'?: string;
  '--tertiary-btn-bg'?: string;
  '--tertiary-btn-color'?: string;
  
  // Audio indicator
  '--audio-bar-bg'?: string;
  
  // Dynamic properties (any accent color)
  '--accent-color'?: string;
  '--glow-color'?: string;
  '--highlight-color'?: string;
  
  // MainPlayer specific properties
  '--dynamic-color'?: string;
  '--dynamic-border'?: string;
  '--dynamic-bg'?: string;
  '--dynamic-backdrop'?: string;
  '--dynamic-glow'?: string;
  '--dynamic-gradient-overlay'?: string;
  '--dynamic-auto-line'?: string;
  '--dynamic-progress-line'?: string;
  '--dynamic-radial-glow'?: string;
  '--auto-line'?: string;
  '--glow-intensity'?: string;
  '--blend-mode'?: string;
  '--portrait-shadow'?: string;
  '--portrait-border'?: string;
  '--portrait-filter'?: string;
  '--gradient-overlay'?: string;
  '--radial-glow'?: string;
  '--dialogue-border'?: string;
  '--dialogue-shadow'?: string;
  '--dialogue-backdrop'?: string;
  '--progress-line'?: string;
};

/**
 * Type-safe custom styles helper
 * Provides autocomplete and type checking for CSS custom properties
 */
export function customStyles(styles: CSSCustomProperties): CSSProperties {
  return styles as CSSProperties;
}

/**
 * Create choice panel styles with accent color
 */
export function choicePanelStyles(accentColor: string): CSSProperties {
  return customStyles({
    '--choice-accent': accentColor,
  });
}

/**
 * Create end scene styles with accent color
 */
export function endSceneStyles(accentColor: string): CSSProperties {
  return customStyles({
    '--end-scene-bg': 'rgba(0,0,0,0.75)',
    '--end-scene-border': `1px solid ${accentColor}22`,
    '--end-scene-backdrop': 'blur(16px)',
    '--accent-color': accentColor,
  });
}

/**
 * Create button styles with accent color
 */
export function buttonStyles(accentColor: string): CSSProperties {
  return customStyles({
    '--end-btn-bg': `linear-gradient(135deg, ${accentColor}, #f0d080)`,
    '--end-btn-color': '#0b0b0d',
    '--secondary-btn-border': `1px solid ${accentColor}33`,
    '--secondary-btn-bg': 'rgba(0,0,0,0.35)',
    '--secondary-btn-color': `${accentColor}CC`,
    '--tertiary-btn-border': `1px solid ${accentColor}22`,
    '--tertiary-btn-bg': 'rgba(0,0,0,0.25)',
    '--tertiary-btn-color': 'rgba(255,255,255,0.7)',
  });
}

/**
 * Create timer/countdown styles
 */
export function countdownStyles(color: string): CSSProperties {
  return customStyles({
    '--countdown-color': color,
  });
}

/**
 * Create audio indicator styles
 */
export function audioIndicatorStyles(color = 'rgba(255,255,255,0.5)'): CSSProperties {
  return customStyles({
    '--audio-bar-bg': color,
  });
}

// Utility to combine multiple style objects
export function combineStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {}) as CSSProperties;
}

// Re-export for convenience
export type { CSSCustomProperties };
