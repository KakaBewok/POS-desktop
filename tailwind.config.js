/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./windows/**/*.{html,js}",
    "./assets/js/**/*.{html,js}",
    "./modals/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
