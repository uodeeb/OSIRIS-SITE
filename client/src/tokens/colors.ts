/**
 * Design System Tokens — Colors
 * 
 * Centralized color system for OSIRIS Novel.
 * Replaces scattered hardcoded colors across components.
 * 
 * @see project_history/03_ux_ui_review.md — Issue C2
 */

// Base accent colors (chapter themes)
export const accent = {
  gold: '#c9a96e',
  amber: '#fbbf24',
  rose: '#f472b6',
  emerald: '#10b981',
  sapphire: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  teal: '#14b8a6',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
} as const;

// Chapter-specific accent mapping
export const chapterAccents: Record<string, string> = {
  'part-0': accent.gold,
  'part-1': accent.red,
  'part-2': accent.green,
  'part-3': accent.blue,
  'part-4': accent.purple,
  'part-5': accent.orange,
  'part-6': accent.teal,
  'default': accent.gold,
};

/**
 * Get accent color for a chapter
 * @param chapterId — Chapter identifier (e.g., 'part-0')
 * @returns Hex color string
 */
export function getChapterAccent(chapterId: string): string {
  return chapterAccents[chapterId] ?? chapterAccents.default;
}

// UI color system with accessibility in mind
export const ui = {
  // Backgrounds
  background: {
    primary: 'rgba(0,0,0,0.72)',
    elevated: 'rgba(10,10,15,0.8)',
    overlay: 'rgba(0,0,0,0.85)',
    card: 'rgba(0,0,0,0.5)',
    dark: 'rgba(11,11,15,0.9)',
  },
  
  // Border colors
  border: {
    subtle: 'rgba(255,255,255,0.1)',
    default: 'rgba(255,255,255,0.15)',
    strong: 'rgba(255,255,255,0.25)',
    accent: (hex: string, alpha = 0.3) => `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
  },
  
  // Text colors — WCAG AA/AAA compliant
  text: {
    primary: 'rgba(255,255,255,0.9)',      // 90% — WCAG AAA
    secondary: 'rgba(255,255,255,0.75)',   // 75% — WCAG AAA
    muted: 'rgba(255,255,255,0.60)',       // 60% — WCAG AA minimum
    subtle: 'rgba(255,255,255,0.40)',      // 40% — Decorative only
    inverse: '#0b0b0f',
  },
  
  // Status/feedback colors
  status: {
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Effects
  shadow: {
    sm: '0 2px 8px rgba(0,0,0,0.3)',
    md: '0 4px 20px rgba(0,0,0,0.4)',
    lg: '0 8px 32px rgba(0,0,0,0.5)',
    glow: (color: string) => `0 0 40px ${color}20`,
  },
} as const;

// Helper to convert hex to rgba
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Color mixing helper (for CSS color-mix equivalent in JS)
export function mixColor(color1: string, color2: string, ratio: number): string {
  // Simple implementation — for complex mixing use CSS color-mix
  const r = ratio;
  return `color-mix(in srgb, ${color1} ${r * 100}%, ${color2})`;
}

// Re-export for convenience
export const colors = {
  accent,
  ui,
  chapterAccents,
} as const;
