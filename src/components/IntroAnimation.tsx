"use client";

import { useEffect, useMemo, useState } from "react";

type Petal = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
};

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.6 + Math.random() * 1.8,
    size: 8 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 60,
  }));
}

// 페이지 진입 시 약 2.5초 동안 꽃잎이 떨어지고 리본이 펼쳐지는 인트로 연출.
// 연출이 끝나면 스스로 사라져 이후 콘텐츠의 스크롤을 가립니다.
export default function IntroAnimation() {
  const [phase, setPhase] = useState<"ribbon" | "petals" | "done">("ribbon");
  const petals = useMemo(() => makePetals(18), []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("petals"), 500);
    const t2 = setTimeout(() => setPhase("done"), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[70] mx-auto flex max-w-mobile items-center justify-center overflow-hidden bg-base transition-opacity duration-700"
      aria-hidden="true"
    >
      {/* 리본 스트립 */}
      <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
        <div className="h-[2px] w-3/5 origin-center animate-ribbonReveal bg-accent" />
        <p className="animate-fadeInUp font-serif text-sm tracking-[0.3em] text-neutral-500 [animation-delay:0.6s]">
          WE ARE GETTING MARRIED
        </p>
        <div className="h-[2px] w-3/5 origin-center animate-ribbonReveal bg-accent [animation-delay:0.15s]" />
      </div>

      {/* 꽃잎 */}
      {phase === "petals" &&
        petals.map((p, i) => (
          <span
            key={i}
            className="absolute top-0 block rounded-[60%_40%_70%_30%/50%_60%_40%_50%] bg-accent/70"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.8,
              animation: `petalFall ${p.duration}s ease-in ${p.delay}s forwards`,
              // 살짝 좌우로 흩날리는 느낌을 주기 위한 커스텀 프로퍼티
              // (petalFall 키프레임은 수직 낙하만 담당하므로 transform은 translate 조합으로 보정)
              transform: `translateX(${p.drift}px)`,
            }}
          />
        ))}
    </div>
  );
}
