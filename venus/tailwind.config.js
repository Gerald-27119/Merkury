/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "1/10": "10%",
      },
      colors: {
        gold: "#D4AF37",
        basalt: "#424448",
      },
    },
  },
  plugins: [],
};
