/**
 * Design System Tokens — Typography
 * 
 * Type scale and semantic typography tokens.
 * Replaces arbitrary Tailwind values (text-[11px], etc.)
 * 
 * @see project_history/03_ux_ui_review.md — Issue C1
 */

// Size scale — maps to Tailwind classes
export const size = {
  '2xs': 'text-[10px]',    // 10px — Labels, badges
  xs: 'text-xs',           // 12px — Captions, hints
  sm: 'text-sm',           // 14px — Body small
  base: 'text-base',       // 16px — Body default
  lg: 'text-lg',           // 18px — Body large
  xl: 'text-xl',           // 20px — H6
  '2xl': 'text-2xl',       // 24px — H5
  '3xl': 'text-3xl',       // 30px — H4
  '4xl': 'text-4xl',       // 36px — H3
  '5xl': 'text-5xl',       // 48px — H2
  '6xl': 'text-6xl',       // 60px — H1
} as const;

// Font families
export const family = {
  sans: 'font-sans',                    // Inter, system-ui
  serif: 'font-serif',                   // Georgia
  mono: 'font-mono',                   // JetBrains Mono
  arabic: 'font-arabic',               // Scheherazade New
  'arabic-ui': 'font-arabic-ui',       // Harmattan
  'arabic-title': 'font-arabic-title', // Aref Ruqaa Ink
} as const;

// Font weights
export const weight = {
  light: 'font-light',     // 300
  normal: 'font-normal',   // 400
  medium: 'font-medium',   // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',       // 700
} as const;

// Line heights
export const leading = {
  tight: 'leading-tight',    // 1.25
  snug: 'leading-snug',      // 1.375
  normal: 'leading-normal',  // 1.5
  relaxed: 'leading-relaxed', // 1.625
  loose: 'leading-loose',    // 2
} as const;

// Letter spacing (tracking)
export const tracking = {
  tighter: 'tracking-tighter',  // -0.05em
  tight: 'tracking-tight',     // -0.025em
  normal: 'tracking-normal',     // 0
  wide: 'tracking-wide',         // 0.025em
  wider: 'tracking-wider',       // 0.05em
  widest: 'tracking-widest',     // 0.1em
  // Semantic
  label: 'tracking-[0.2em]',    // Uppercase labels
  mono: 'tracking-wider',        // Mono text
} as const;

// Semantic typography tokens
export const typography = {
  // Labels and metadata
  label: `${size['2xs']} ${family.mono} ${tracking.label} uppercase`,
  caption: `${size.xs} text-white/60`,
  timestamp: `${size['2xs']} ${family.mono} ${tracking.mono}`,
  
  // Body text
  body: `${size.sm} ${leading.relaxed}`,
  bodyLarge: `${size.base} ${leading.relaxed}`,
  bodySmall: `${size.xs} ${leading.normal}`,
  
  // Headings
  heading: {
    h1: `${size['4xl']} md:${size['5xl']} ${weight.bold} ${tracking.tight}`,
    h2: `${size['3xl']} md:${size['4xl']} ${weight.semibold} ${tracking.tight}`,
    h3: `${size['2xl']} md:${size['3xl']} ${weight.semibold}`,
    h4: `${size.xl} ${weight.semibold}`,
    h5: `${size.lg} ${weight.medium}`,
    h6: `${size.base} ${weight.medium} ${tracking.wide} uppercase`,
  },
  
  // Interactive
  button: `${size.sm} ${weight.medium}`,
  link: `${size.sm} ${weight.medium} underline-offset-4`,
  
  // Display (hero text)
  display: `${size['4xl']} md:${size['5xl']} lg:${size['6xl']} ${weight.bold} ${tracking.tighter}`,
  
  // Arabic variants
  arabic: {
    body: `${size.base} ${family.arabic} ${leading.loose}`,
    bodyLarge: `${size.lg} ${family.arabic} ${leading.loose}`,
    title: `${size['2xl']} ${family['arabic-title']}`,
    heading: `${size['3xl']} ${family['arabic-title']} ${weight.semibold}`,
  },
  
  // Novel-specific
  novel: {
    english: `${size.base} ${family.serif} ${leading.relaxed}`,
    arabic: `${size.lg} ${family.arabic} ${leading.loose}`,
    dialogue: `${size.sm} ${leading.relaxed} text-white/90`,
  },
} as const;

// Convenience export
export default {
  size,
  family,
  weight,
  leading,
  tracking,
  typography,
};
