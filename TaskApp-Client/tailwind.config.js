/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        surface: {
          950: '#0c0c0f',
          900: '#111116',
          800: '#18181f',
          700: '#22222c',
          600: '#2c2c38',
          500: '#3a3a4a',
          400: '#52526a',
          300: '#7a7a96',
          200: '#a8a8c0',
          100: '#d4d4e0',
          50:  '#f5f5fa',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        ok:   { 400: '#34d399', 500: '#10b981', 600: '#059669' },
        warn: { 400: '#fb923c', 500: '#f97316' },
        info: { 400: '#60a5fa', 500: '#3b82f6' },
        danger: { 400: '#f87171', 500: '#ef4444' },
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
