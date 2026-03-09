import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Spiritual palette (light-mode prayer experience) ────────
        cream: {
          50:  '#fdfcf9',
          100: '#faf8f3', // primary background
          200: '#f3efe5',
        },
        ink: {
          900: '#2d2926', // primary text
          700: '#4a4540',
          500: '#7a7370',
          300: '#b8b3ae',
        },
        olive: {
          700: '#5c6b3a',
          600: '#6d7f44',
          500: '#8a9e55',
          100: '#f0f3e8',
        },
        gold: {
          700: '#7a6020',
          600: '#9a7b2e',
          500: '#b8952e',
          100: '#fdf6e3',
        },

        // ── CAFOD brand tokens (exact values from cafod.org.uk CSS) ─
        // --color-cafod-blue-core: #222544 (dark navy/indigo)
        // --color-cafod-green-core: #a2c617 (lime green)
        // --color-cafod-emergency-red-core: #ff0024
        cafod: {
          navy:        '#222544', // primary brand — nav bg, primary buttons
          'navy-dark': '#151728', // hover/active state
          'navy-mid':  '#2b2450', // dark blue variant
          green:       '#a2c617', // accent — active tab, highlights, wave svg
          'green-dark':'#8ea924', // hover state for green
          red:         '#ff0024', // emergency appeals CTA
          'red-dark':  '#e80021',
          grey:        '#e9e9e9', // borders, subtle backgrounds
        },
      },
      fontFamily: {
        // Nunito Sans — CAFOD's brand font (loaded via Google Fonts in index.html)
        cafod: [
          'Nunito Sans',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        // Prayer text — system serif, no web font download
        serif: [
          'Palatino Linotype',
          'Book Antiqua',
          'Palatino',
          'Georgia',
          'serif',
        ],
        // UI chrome — system sans
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      maxWidth: {
        prayer: '42rem',
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(45,41,38,0.08), 0 1px 3px 0 rgba(45,41,38,0.05)',
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
}

export default config satisfies Config
