/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: { xs: "380px" },
      textColor: {
        accent: "var(--text-accent)",
        dark: "#1e1e1e",
        "dark-invert": "var(--dark-invert)",
        subtle: "#6f6f6f",
        "subtle-invert": "var(--subtle-invert)",
        "subtle-white": "#ffffffd1",
        "subtle-white-invert": "var(--subtle-white-invert)",
      },
      colors: {
        accent: "#046b46",
        "black-invert": "rgb(var(--black-invert) / <alpha-value>)",
      },
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        "roboto-mono": ['"Roboto Mono"', "monospace"],
        "roboto-slab": ['"Roboto Slab"', "serif"],
      },
      listStyleType: {
        "lower-latin": "lower-latin",
      },
      animation: {
        blink: "cursor-blink 1s steps(1) infinite",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("exclusive-hover", "&:hover:not(:has(.hover-exclude:hover))");
      addVariant("targeted-hover", "&:has(.hover-target:hover)");
    }),
  ],
};
