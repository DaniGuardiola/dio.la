/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: { xs: "380px" },
      textColor: {
        dark: "#1e1e1e",
        subtle: "#8a8a8a",
        "subtle-white": "#ffffffd1",
      },
      colors: { accent: "#046b46" },
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        "roboto-mono": ['"Roboto Mono"', "monospace"],
        "roboto-slab": ['"Roboto Slab"', "serif"],
      },
    },
  },
  plugins: [],
};
