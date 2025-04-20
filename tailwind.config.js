/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        sand: '#fdfaf3',
        emerald: {
          600: '#059669',
          700: '#047857'
        },
        gold: {
          400: '#facc15',
          500: '#eab308'
        }
      },
      fontFamily: {
        arabic: ['Scheherazade New', 'serif']
      }
    }
  },
  plugins: []
};
