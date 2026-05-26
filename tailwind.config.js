/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E6F7EF",   // background
        accent: "#000000",    // black
        soft: "#ffffff",      // white
        border: "#d1d5db",
        textMain: "#111827",
      },
      fontFamily: {
        serif: ["Calisto MT", "serif"],
      },
    },
  },
  plugins: [],
};