import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B8860B", // Dark Goldenrod
          light: "#DAA520",
          dark: "#8B4513",
        },
        secondary: {
          DEFAULT: "#4B3621", // Dark Brown
          light: "#5D4037",
          dark: "#2D1B0D",
        },
        accent: {
          DEFAULT: "#FFD700", // Gold
          light: "#FFFACD",
          dark: "#DAA520",
        },
        cream: {
          DEFAULT: "#FDF5E6", // Old Lace
          light: "#FFFFFF",
          dark: "#F5F5DC",
        },
        dark: {
          DEFAULT: "#1A1A1A",
          light: "#333333",
          dark: "#000000",
        }
      },
      fontFamily: {
        premium: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
