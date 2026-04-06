/**
 * Design System Tokens — Spacing
 * 
 * Consistent spacing scale for margins, padding, gaps.
 * Replaces arbitrary spacing values.
 */

// Base spacing scale (4px grid)
export const space = {
  0: '0',
  px: 'px',       // 1px
  0.5: '0.5',     // 2px
  1: '1',         // 4px
  1.5: '1.5',     // 6px
  2: '2',         // 8px
  2.5: '2.5',     // 10px
  3: '3',         // 12px
  3.5: '3.5',     // 14px
  4: '4',         // 16px
  5: '5',         // 20px
  6: '6',         // 24px
  7: '7',         // 28px
  8: '8',         // 32px
  9: '9',         // 36px
  10: '10',       // 40px
  12: '12',       // 48px
  14: '14',       // 56px
  16: '16',       // 64px
  20: '20',       // 80px
  24: '24',       // 96px
} as const;

// Semantic spacing tokens
export const spacing = {
  // Component internal spacing
  component: {
    xs: space[1],   // 4px — Tight component padding
    sm: space[2],   // 8px — Default component padding
    md: space[3],   // 12px — Comfortable padding
    lg: space[4],   // 16px — Generous padding
    xl: space[6],   // 24px — Large component padding
  },
  
  // Layout gaps
  gap: {
    xs: space[1],   // 4px
    sm: space[2],   // 8px
    md: space[3],   // 12px
    lg: space[4],   // 16px
    xl: space[6],   // 24px
    '2xl': space[8], // 32px
  },
  
  // Section spacing
  section: {
    sm: space[6],   // 24px
    md: space[8],   // 32px
    lg: space[12],  // 48px
    xl: space[16],  // 64px
    '2xl': space[20], // 80px
  },
  
  // Content container padding
  container: {
    mobile: space[4],   // 16px
    tablet: space[6],   // 24px
    desktop: space[8], // 32px
  },
} as const;

// Touch target sizes (WCAG AAA)
export const touch = {
  min: 'min-w-[44px] min-h-[44px]',  // 44×44px minimum
  comfortable: 'min-w-[48px] min-h-[48px]', // 48×48px comfortable
} as const;

// Screen edge safe areas
export const safe = {
  mobile: 'px-4',     // 16px
  tablet: 'px-6',     // 24px
  desktop: 'px-8',    // 32px
} as const;
