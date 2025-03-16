/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        "1/10": "10%",
      },
      fontFamily: {
        noto: ['"Noto Sans"', "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        moderustic: ["Moderustic", "sans-serif"],
      },
      colors: {
        mainBlue: "#4242f0",
        mainBlueDarker: "#0d0db5",
        darkText: "#E5E5E5",
        darkBg: "#0F0F10",
        darkBgSoft: "#1B1C1D",
        darkBgMuted: "#323539",
        darkBorder: "#939394",
        lightText: "#222222",
        lightBg: "#e4e3e3",
        lightBgSoft: "#FFFFFF",
        lightBgMuted: "#F2F2F2",
        lightBorder: "#FBFDFF",
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
