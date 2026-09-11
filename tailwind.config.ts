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
        petalFall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0" },
        },
        ribbonReveal: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.9s ease-out forwards",
        petalFall: "petalFall linear forwards",
        ribbonReveal: "ribbonReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
