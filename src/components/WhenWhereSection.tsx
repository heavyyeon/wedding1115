"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/data/wedding";
import { getDDayLabel } from "@/lib/dday";
import Reveal from "@/components/Reveal";

export default function WhenWhereSection() {
  // 서버/클라이언트 시간대 불일치로 인한 hydration mismatch를 피하기 위해
  // D-Day는 클라이언트에서만 계산합니다.
  const [ddayLabel, setDdayLabel] = useState<string | null>(null);

  useEffect(() => {
    setDdayLabel(getDDayLabel());
  }, []);

  return (
    <section className="bg-accent px-8 py-20 text-neutral-900">
      <Reveal className="flex flex-col items-center gap-6 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-800/70">
          WHEN &amp; WHERE
        </p>

        <div className="font-mono text-3xl tracking-widest">
          {ddayLabel ?? " "}
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-serif text-lg">{wedding.displayDate}</p>
          <p className="text-sm text-neutral-800/80">{wedding.venueName}</p>
        </div>

        <p className="text-xs text-neutral-800/70">{wedding.address}</p>
      </Reveal>
    </section>
  );
}
