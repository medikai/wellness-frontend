// Wellness Design Tokens
// This file contains all design system constants for consistent usage across modules

export const colors = {
  // Primary Colors
  primary: '#3B92F6',
  secondary: '#22355E',
  accent: '#F87360',
  
  // Neutral Colors
  neutral: {
    light: '#F8F9FA',
    medium: '#6B7280',
    dark: '#2C4A52',
  },
  
  // Health Theme Colors
  teal: {
    primary: '#4CAF9D',
    light: '#E6F7F5',
    dark: '#2D7D6B',
  },
  
  // Orange Colors
  orange: {
    primary: '#F58220',
    light: '#FEF3E7',
    dark: '#D46A08',
  },
  
  // Base Colors
  white: '#FFFFFF',
  background: '#FDFDFD',
  foreground: '#2C4A52',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '21px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
    mono: 'var(--font-geist-mono), "Fira Code", monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: '8px 16px',
      md: '12px 24px',
      lg: '16px 32px',
    },
  },
  card: {
    padding: '16px',
    borderRadius: '12px',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  input: {
    height: '40px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
  },
} as const;

// Grid system
export const grid = {
  columns: 12,
  gap: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
} as const;

// Animation tokens
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;