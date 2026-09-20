/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      /**
       * The palette is a single foreground over a single background, so both
       * themes are one pair of variables swapped in globals.css. Anything that
       * used to be white-on-black is now ink-on-canvas and flips for free.
       */
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
      },
      gridTemplateColumns: {
        30: "repeat(30, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        18: "repeat(18, minmax(0, 1fr))",
      },
      fontFamily: {
        caveat: ['var(--font-caveat)', "cursive"],
        poppins: ['var(--font-poppins)', "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
