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
        navy: {
          DEFAULT: "#0B1F6B",
          light: "#1a3080",
          dark: "#07154a",
        },
        yellow: {
          DEFAULT: "#F4E04D",
          dark: "#d4c030",
        },
        skyblue: "#4F8FE8",
        success: "#1D9E75",
        warning: "#BA7517",
        danger: "#D85A30",
      },
      borderRadius: {
        pill: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
