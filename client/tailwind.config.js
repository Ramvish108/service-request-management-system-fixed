/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#adc2ff',
          400: '#7594ff',
          500: '#3b5eff',
          600: '#1f3aff',
          700: '#0f24e6',
          800: '#0d1cb9',
          900: '#0e1d90',
        }
      }
    },
  },
  plugins: [],
}
