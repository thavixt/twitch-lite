/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hintedgray': {
          1: '#18181b',
        },
      }
    },
  },
  plugins: [],
}

