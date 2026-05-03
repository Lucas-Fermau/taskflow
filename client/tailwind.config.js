/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dde8ff',
          200: '#c2d4ff',
          300: '#9bb6ff',
          400: '#728eff',
          500: '#4f6aff',
          600: '#3a4ff5',
          700: '#2f3edb',
          800: '#2932af',
          900: '#272f8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
