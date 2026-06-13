import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        surface: 'var(--color-bg-surface)',
        page: 'var(--color-bg-page)',
        muted: 'var(--color-bg-muted)',
        border: 'var(--color-border)',
        main: 'var(--color-text-main)',
        subtle: 'var(--color-text-subtle)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      borderRadius: {
        tokenSm: 'var(--radius-sm)',
        tokenMd: 'var(--radius-md)',
        tokenLg: 'var(--radius-lg)',
        tokenXl: 'var(--radius-xl)',
      },
      boxShadow: {
        tokenCard: 'var(--shadow-card)',
        tokenPopover: 'var(--shadow-popover)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
