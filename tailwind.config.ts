import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#f2f8ed", // 기본 배경 (연한 민트/연두)
        accent: "#a8d96c", // 강조 섹션 배경 (WhenWhere, Account)
        paper: "#ffffff", // 흰 배경 섹션 (Invitation)
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        mono: ["var(--font-space-mono)", "Space Mono", "monospace"],
      },
      maxWidth: {
        mobile: "480px",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.9s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
