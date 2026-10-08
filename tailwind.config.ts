import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#ffffff", // 기본 배경 (화이트)
        accent: "#a8d96c", // 강조 섹션 배경 (WhenWhere, Account)
        paper: "#ffffff", // 흰 배경 섹션 (Invitation)
        point: "#fc547a", // 핑크 포인트 컬러 (글씨·버튼·강조). 바꾸려면 이 한 줄만 수정하세요
      },
      // 글씨체를 Pretendard 하나로 통일했습니다. 기존에 font-serif / font-mono 로 지정된 곳
      // (섹션 제목, 숫자 등)도 모두 같은 Pretendard로 표시됩니다.
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
        serif: ["Pretendard", "-apple-system", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
        mono: ["Pretendard", "-apple-system", "Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
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
