/**
 * nivaran Design System — Tokens Export
 * Immutable canonical design token definitions
 */

export const typographyTokens = {
  fontFamily: {
    primary: '"Noto Sans", "Noto Sans Devanagari", system-ui, -apple-system, sans-serif',
    mono: '"Noto Sans Mono", monospace',
  },
  fontSize: {
    caption: '14px', // Absolute citizen floor
    body: '16px',
    heading: '20px',
    display: '28px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
  lineHeight: {
    body: 1.5,
    heading: 1.3,
  },
} as const;

export const spacingTokens = {
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '24px',
  space6: '32px',
  space7: '48px',
  space8: '64px',
} as const;

export const radiusTokens = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '999px',
} as const;

export const elevationTokens = {
  elevation0: 'none',
  elevation1: '0 1px 2px rgba(0, 0, 0, 0.08)',
  elevation2: '0 4px 12px rgba(0, 0, 0, 0.12)',
  elevation3: '0 8px 24px rgba(0, 0, 0, 0.16)',
} as const;

export const colorTokens = {
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    700: '#3F3F46',
    900: '#18181B',
  },
  primary: {
    500: '#0D9488',
    700: '#0F766E',
  },
  semantic: {
    evidence: '#64748B',      // Slate
    government: '#1E3A8A',    // Indigo
    community: '#7C3AED',     // Violet
    aiAssistance: '#D97706',  // Amber
    success: '#15803D',       // Muted Green
    warning: '#B45309',       // Deep Amber
    danger: '#B91C1C',        // Red
  },
} as const;

export const motionTokens = {
  duration: {
    fast: '120ms',
    base: '200ms',
    slow: '320ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
} as const;

export type ColorTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'evidence'
  | 'government'
  | 'community'
  | 'ai'
  | 'success'
  | 'warning'
  | 'danger';
