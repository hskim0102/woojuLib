import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러 (design_system.md 기준)
        primary: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          300: "#FCD34D",
          DEFAULT: "#F59E0B", // amber-500
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        secondary: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          DEFAULT: "#14B8A6", // teal-500
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
        },
        // 가족 구성원별 컬러
        member: {
          mom: "#FB7185", // rose-400 (샛별)
          dad: "#3B82F6", // blue-500 (호섭)
          son: "#8B5CF6", // violet-500 (우주)
          daughter: "#F472B6", // pink-400 (유주)
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Apple SD Gothic Neo", "sans-serif"],
        display: ["Gmarket Sans", "Pretendard", "sans-serif"],
      },
      borderRadius: {
        card: "1rem", // 16px (rounded-2xl)
        button: "0.5rem", // 8px (rounded-lg)
      },
    },
  },
  plugins: [],
};

export default config;
