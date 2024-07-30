/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chessGreen: '#5C946E',
        chessDark: '#2b2b2b',
        chessLight: '#FFFFFF',
        chessDark2 : "#3D423F",
        chessLightGray: '#f4f4f4'

      },
    },
  },
  plugins: [],
}