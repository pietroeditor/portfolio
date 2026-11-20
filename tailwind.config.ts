import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /** The void the object rests in. */
        desk: '#000000',
        /** The object itself — a shade off black so its edge is readable. */
        shell: '#08090C',
        panel: '#0E1014',
        line: 'rgba(255,255,255,0.11)',
        lineSoft: 'rgba(255,255,255,0.06)',
        ink: '#FFFFFF',
        muted: '#A6ABB8',
        soft: '#8A909E',
        faint: '#6B7280',
        /** The one accent. Everything that needs to carry reads in this. */
        glow: '#73C6FE',
        glowDeep: '#1D4ED8',
        signal: '#FF3B18',
      },
      fontFamily: {
        /** UI and body. */
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        /** Display only — the high-contrast serif the whole look rests on. */
        serif: ['"Instrument Serif"', 'ui-serif', '"Times New Roman"', 'Georgia', 'serif'],
      },
      fontSize: {
        display: [
          'clamp(2.75rem, 7vw, 6.5rem)',
          { lineHeight: '0.98', letterSpacing: '-0.025em', fontWeight: '400' },
        ],
        title: [
          'clamp(2.125rem, 4.6vw, 4rem)',
          { lineHeight: '1.02', letterSpacing: '-0.024em', fontWeight: '400' },
        ],
        heading: [
          'clamp(1.125rem, 1.6vw, 1.5rem)',
          { lineHeight: '1.24', letterSpacing: '-0.018em', fontWeight: '500' },
        ],
        /** Card title — sans, tight and heavy against the serif headings. */
        cardTitle: [
          'clamp(1.0625rem, 1.35vw, 1.3125rem)',
          { lineHeight: '1.22', letterSpacing: '-0.021em', fontWeight: '600' },
        ],
        lead: ['1.0625rem', { lineHeight: '1.58', letterSpacing: '-0.011em' }],
        body: ['0.9375rem', { lineHeight: '1.62', letterSpacing: '-0.008em' }],
        meta: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '-0.004em' }],
        micro: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.002em' }],
        /** All-caps section marker, the way the reference labels its blocks. */
        eyebrow: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.16em', fontWeight: '500' }],
      },
      spacing: {
        /**
         * The rest between sections. Applied as bottom padding only — two
         * stacked sections were doubling it into a hole.
         */
        bay: 'clamp(3.25rem, 5.6vw, 5.5rem)',
        block: 'clamp(1.5rem, 2.6vw, 2.5rem)',
        gutter: 'clamp(1.25rem, 3vw, 3rem)',
      },
      maxWidth: {
        prose: '52ch',
        shell: '96rem',
      },
      borderRadius: {
        card: '1rem',
        glass: '1.25rem',
      },
      transitionTimingFunction: {
        drift: 'cubic-bezier(0.22, 1, 0.36, 1)',
        cut: 'cubic-bezier(0.16, 0.9, 0.2, 1)',
      },
      keyframes: {
        'signal-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        /** The aurora breathing behind everything. */
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0.85' },
          '50%': { transform: 'translate3d(4%,-3%,0) scale(1.12)', opacity: '1' },
        },
      },
      animation: {
        'signal-pulse': 'signal-pulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 18s cubic-bezier(0.42,0,0.58,1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
