/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1c6434",
        "secondary": "#6fb234",
      }
    },
  },
  plugins: [],
}
