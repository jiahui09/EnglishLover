export const designTokens = {
  colors: {
    primary: '--color-primary',
    backgroundPage: '--color-bg-page',
    backgroundSurface: '--color-bg-surface',
    textMain: '--color-text-main',
    textMuted: '--color-text-muted',
    success: '--color-success',
    warning: '--color-warning',
    error: '--color-error',
    info: '--color-info',
  },
  spacing: {
    xs: '--space-1',
    sm: '--space-2',
    md: '--space-4',
    lg: '--space-6',
    xl: '--space-8',
  },
  radius: {
    sm: '--radius-sm',
    md: '--radius-md',
    lg: '--radius-lg',
    xl: '--radius-xl',
  },
  shadow: {
    card: '--shadow-card',
    popover: '--shadow-popover',
  },
  breakpoint: {
    sm: '--breakpoint-sm',
    md: '--breakpoint-md',
    lg: '--breakpoint-lg',
    xl: '--breakpoint-xl',
  },
} as const;

export type DesignTokenCategory = keyof typeof designTokens;
