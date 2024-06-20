/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./windows/**/*.{html,js}", "./js/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
