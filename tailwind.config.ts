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
        ceramic: {
          50: "#FDFBF7",
          100: "#F7F2EB",
          200: "#EFE6DC",
          300: "#E2D4C3",
          400: "#C8B39B",
          500: "#A68F74",
          600: "#877056",
          700: "#675440",
          800: "#4B3D2F",
          900: "#2D241C",
        },
        terracotta: {
          50: "#FDF6F3",
          100: "#FAECE6",
          200: "#F3D5C7",
          300: "#E9B49E",
          400: "#DC8967",
          500: "#C85A32",
          600: "#AF4723",
          700: "#8E3517",
          800: "#722A13",
          900: "#521D0D",
        },
        charcoal: {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#6D6D6D",
          600: "#4F4F4F",
          700: "#383838",
          800: "#242220",
          900: "#171513",
          950: "#0E0D0C",
        },
        sage: {
          50: "#F5F7F5",
          100: "#E7EBE6",
          200: "#D2DDD0",
          300: "#B4C6B1",
          400: "#8FA88B",
          500: "#6B8B67",
          600: "#546E50",
          700: "#42563F",
          800: "#344432",
          900: "#273326",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(23, 21, 19, 0.05)",
        card: "0 4px 12px 0 rgba(23, 21, 19, 0.06), 0 1px 2px 0 rgba(23, 21, 19, 0.04)",
        elevated: "0 12px 28px -4px rgba(23, 21, 19, 0.10), 0 4px 8px -2px rgba(23, 21, 19, 0.05)",
      },
      borderRadius: {
        editorial: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
