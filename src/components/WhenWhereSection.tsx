"use client";

import { useEffect, useState } from "react";
import { couple, wedding } from "@/data/wedding";
import { getCalendarDaysRemaining, getCountdownParts, pad2 } from "@/lib/countdown";
import MonthCalendar from "@/components/MonthCalendar";
import Reveal from "@/components/Reveal";

const weddingDate = new Date(
  wedding.year,
  wedding.month - 1,
  wedding.day,
  wedding.hour,
  wedding.minute
);

function daysRemainingLabel(daysRemaining: number) {
  if (daysRemaining > 0) return `${daysRemaining}일 남았습니다`;
  if (daysRemaining === 0) return "바로 오늘입니다";
  return `${Math.abs(daysRemaining)}일 지났습니다`;
}

export default function WhenWhereSection() {
  // 서버/클라이언트 시간 불일치로 인한 hydration mismatch를 피하기 위해
  // 실제 값은 클라이언트에서 useEffect로만 채웁니다.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = now ? getCountdownParts(weddingDate, now) : null;
  const daysRemaining = now ? getCalendarDaysRemaining(weddingDate, now) : null;

  return (
    <section className="bg-white px-6 py-20 text-neutral-800">
      <Reveal className="mx-auto flex max-w-[320px] flex-col items-center gap-6 text-center">
        <div>
          <p className="font-mono text-xl tracking-wider text-neutral-900">
            {wedding.year}.{pad2(wedding.month)}.{pad2(wedding.day)}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            {wedding.dayOfWeekLabel} {wedding.hour < 12 ? "오전" : "오후"}{" "}
            {wedding.hour > 12 ? wedding.hour - 12 : wedding.hour}시{" "}
            {wedding.minute === 0 ? "" : `${wedding.minute}분`}
          </p>
          <p className="mt-1 text-sm text-neutral-400">{wedding.venueName}</p>
        </div>

        <div className="h-px w-full bg-neutral-200" />

        <div className="w-full">
          <MonthCalendar year={wedding.year} month={wedding.month} highlightDay={wedding.day} />
        </div>

        <div className="h-px w-full bg-neutral-200" />

        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.25em] text-neutral-400">
            DAYS&nbsp;&nbsp;&nbsp;HOUR&nbsp;&nbsp;&nbsp;MIN&nbsp;&nbsp;&nbsp;SEC
          </p>
          <p className="font-mono text-2xl tracking-widest text-neutral-800">
            {countdown ? (
              <>
                {pad2(countdown.days)} : {pad2(countdown.hours)} :{" "}
                {pad2(countdown.minutes)} :{" "}
                <span className="text-rose-300">{pad2(countdown.seconds)}</span>
              </>
            ) : (
              "-- : -- : -- : --"
            )}
          </p>
        </div>

        <p className="text-sm text-neutral-500">
          {couple.groom.name}, {couple.bride.name}의 결혼식이{" "}
          {daysRemaining !== null ? daysRemainingLabel(daysRemaining) : ""}.
        </p>
      </Reveal>
    </section>
  );
}
