import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Page background — warm cream/linen
        cream: {
          50:  '#fdfcf9',
          100: '#faf8f3', // primary background
          200: '#f3efe5',
        },
        // Warm dark for body text
        ink: {
          900: '#2d2926', // primary text
          700: '#4a4540',
          500: '#7a7370',
          300: '#b8b3ae',
        },
        // Muted olive/green accent — liturgical green, season badge
        olive: {
          700: '#5c6b3a',
          600: '#6d7f44',
          500: '#8a9e55',
          100: '#f0f3e8',
        },
        // Warm gold for primary CTA
        gold: {
          700: '#7a6020',
          600: '#9a7b2e',
          500: '#b8952e',
          100: '#fdf6e3',
        },
      },
      fontFamily: {
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
        prayer: '42rem', // ~672px — comfortable prose reading width
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
