/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Bebas_Neue: ["Bebas Neue", "sans-serif"],
        Nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
