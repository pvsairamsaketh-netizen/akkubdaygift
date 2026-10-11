/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        blush: {
          50: '#fff5f7',
          100: '#feeaf0',
          200: '#fed6e2',
          300: '#fdb5ca',
          400: '#fa83a6',
          500: '#f25181',
          600: '#de2e65',
          700: '#bc1e4d',
          800: '#9b1c43',
          900: '#821c3c',
        },
        cream: {
          50: '#fefcf8',
          100: '#fdf8ef',
          200: '#faedd7',
          300: '#f5deb9',
          400: '#eec693',
          500: '#e5ab6b',
        },
        champagne: {
          50: '#fbf8f3',
          100: '#f6efe3',
          200: '#ebdccb',
          300: '#dfc2a6',
          400: '#caa37e',
          500: '#b8895b',
        },
        cherry: {
          50: '#fff1f2',
          100: '#ffe4e8',
          200: '#fecdd6',
          500: '#e11d48',
          700: '#9f1239',
          800: '#700c25',
          900: '#4c0519',
          950: '#2d030f',
        },
        burgundy: {
          800: '#4a0e1c',
          900: '#330813',
          950: '#1e050b',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'breathe': 'warmBreathe 5s ease-in-out infinite',
        'soft-glow': 'softGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.12)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        warmBreathe: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        softGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(244, 63, 94, 0.35))' },
          '50%': { filter: 'drop-shadow(0 0 24px rgba(244, 63, 94, 0.65))' },
        }
      }
    },
  },
  plugins: [],
}
