import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /** The desk the object rests on. */
        desk: '#DCDDE2',
        /** The object itself — held below the cards so glass reads as glass. */
        shell: '#EBECF0',
        panel: '#FCFCFD',
        line: 'rgba(10,10,11,0.09)',
        lineSoft: 'rgba(10,10,11,0.055)',
        ink: '#0A0A0B',
        muted: '#6E7076',
        soft: '#9A9CA3',
        faint: '#BFC1C7',
        signal: '#FF3B18',
      },
      /** Apple system stack only. No webfonts anywhere on the site. */
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        display: [
          'clamp(2.5rem, 6.4vw, 6rem)',
          { lineHeight: '1.02', letterSpacing: '-0.028em', fontWeight: '400' },
        ],
        title: [
          'clamp(1.75rem, 3.6vw, 3.25rem)',
          { lineHeight: '1.06', letterSpacing: '-0.024em', fontWeight: '400' },
        ],
        heading: [
          'clamp(1.125rem, 1.6vw, 1.5rem)',
          { lineHeight: '1.24', letterSpacing: '-0.018em', fontWeight: '500' },
        ],
        /** Card title — the reference sets it heavy, tight and large. */
        cardTitle: [
          'clamp(1.0625rem, 1.35vw, 1.3125rem)',
          { lineHeight: '1.22', letterSpacing: '-0.021em', fontWeight: '700' },
        ],
        lead: ['1.0625rem', { lineHeight: '1.58', letterSpacing: '-0.014em' }],
        body: ['0.9375rem', { lineHeight: '1.62', letterSpacing: '-0.01em' }],
        meta: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '-0.006em' }],
        micro: ['0.75rem', { lineHeight: '1.2', letterSpacing: '-0.004em' }],
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
        /**
         * A showcase turn, not a spin. The sweep is bounded so three faces
         * stay visible at every moment — a full rotation flattens the block
         * to a single face twice per cycle, which is what kills the volume.
         */
        showcase: {
          '0%, 100%': { transform: 'rotateX(-26deg) rotateY(26deg)' },
          '50%': { transform: 'rotateX(-16deg) rotateY(64deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'signal-pulse': 'signal-pulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        showcase: 'showcase 16s cubic-bezier(0.42,0,0.58,1) infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
