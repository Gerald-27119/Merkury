/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        "1/10": "10%",
      },
      colors: {
        mainBlue: "#191970",
        darkText: "#E5E5E5",
        darkBg: "#0F0F10",
        darkBgSoft: "#1B1C1D",
        darkBgMuted: "#323539",
        darkBorder: "#939394",
        // darkText: "#222222",
        // darkBg: "#F7F7F7",
        // darkBgSoft: "#FFFFFF",
        // darkBgMuted: "#F2F2F2",
        // darkBorder: "#FBFDFF",
      },
      keyframes: {
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        slideInFromLeft: "slideInFromLeft 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
