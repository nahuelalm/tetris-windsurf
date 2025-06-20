/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff00',
        secondary: '#00cc00',
        background: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
