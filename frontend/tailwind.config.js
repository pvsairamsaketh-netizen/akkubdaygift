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
          50: '#faf7f2',
          100: '#f5efe4',
          200: '#ebdccb',
          300: '#dec2aa',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
