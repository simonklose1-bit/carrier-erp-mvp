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
        "erp-navy": {
          DEFAULT: "#0B1F6B",
          light: "#1a3080",
          dark: "#07154a",
        },
        "accent": {
          DEFAULT: "#F4E04D",
          dark: "#d4c030",
        },
        "erp-skyblue": "#4F8FE8",
      },
    },
  },
  plugins: [],
};

export default config;
