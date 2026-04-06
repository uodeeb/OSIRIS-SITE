/**
 * Design System Tokens — Border Radius
 * 
 * Consistent border radius scale.
 * Replaces mixed arbitrary values.
 * 
 * @see project_history/03_ux_ui_review.md — Issue C3
 */

// Base radius scale
export const radius = {
  none: 'rounded-none',
  sm: 'rounded-sm',     // 2px
  md: 'rounded-md',     // 6px
  DEFAULT: 'rounded',   // 4px (default)
  lg: 'rounded-lg',     // 8px
  xl: 'rounded-xl',     // 12px
  '2xl': 'rounded-2xl', // 16px
  '3xl': 'rounded-3xl', // 24px
  full: 'rounded-full',
} as const;

// Semantic radius tokens
export const borderRadius = {
  // UI elements
  button: radius.xl,        // 12px — Buttons
  input: radius.lg,         // 8px — Inputs
  card: radius['2xl'],      // 16px — Cards
  modal: radius['2xl'],     // 16px — Modals, dialogs
  tooltip: radius.md,       // 6px — Tooltips
  badge: radius.full,       // Full — Badges, pills
  
  // Containers
  container: radius['2xl'], // 16px — Main containers
  panel: radius.xl,         // 12px — Panels, sections
  
  // Interactive
  choice: radius.xl,        // 12px — Choice buttons
  chapter: radius['2xl'],     // 16px — Chapter cards
  portrait: radius.lg,        // 8px — Character portraits
} as const;

// Export for convenience
export default radius;
