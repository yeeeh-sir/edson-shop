/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffdf2',
          100: '#fff7d6',
          200: '#f6e7a7',
          300: '#e8cd67',
          400: '#f5c542',
          500: '#d4af37',
          600: '#a67c00',
          700: '#8a6500',
          800: '#684c00',
          900: '#3f2d00',
          950: '#171717',
        },
        accent: {
          50: '#fffdf2',
          100: '#fff7d6',
          200: '#f6e7a7',
          300: '#f5c542',
          400: '#ffd700',
          500: '#d4af37',
          600: '#a67c00',
          700: '#8a6500',
          800: '#684c00',
        },
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 8px 24px -6px rgb(166 124 0 / 0.10)',
        lift: '0 24px 48px -12px rgb(0 0 0 / 0.22)',
        glow: '0 0 0 4px rgb(212 175 55 / 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'slide-in-right': 'slide-in-right 0.3s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};