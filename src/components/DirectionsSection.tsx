"use client";

import { useState } from "react";
import Image from "next/image";
import { directions, wedding } from "@/data/wedding";
import { kakaoNaviSearchUrl, naverMapSearchUrl, tmapSearchUrl } from "@/lib/navigation";
import Reveal from "@/components/Reveal";

const navApps = [
  {
    key: "naver",
    label: "네이버지도",
    className: "bg-[#03c75a] text-white",
    getHref: naverMapSearchUrl,
    external: true, // 일반 웹 링크라 새 탭으로 엽니다.
  },
  {
    key: "tmap",
    label: "티맵",
    className: "border border-neutral-200 bg-white text-neutral-800",
    getHref: tmapSearchUrl,
  },
  {
    key: "kakao",
    label: "카카오내비",
    className: "bg-[#fee500] text-neutral-900",
    getHref: kakaoNaviSearchUrl,
  },
];

export default function DirectionsSection() {
  const [guideOpen, setGuideOpen] = useState(false);
  const venueName = wedding.venueName;

  return (
    <section className="px-6 py-20">
      <Reveal className="mb-6 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-400">LOCATION</p>
        <p className="mt-2 font-serif text-lg text-neutral-700">오시는 길</p>
        <p className="mt-3 text-sm font-medium text-neutral-800">{venueName}</p>
        <p className="mt-1 text-xs text-neutral-500">{wedding.address}</p>
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <div className="relative h-52 w-full overflow-hidden rounded-xl bg-neutral-100">
          <Image
            src={directions.mapImage}
            alt={`${venueName} 위치 지도`}
            fill
            sizes="480px"
            className="object-cover"
          />
        </div>

        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="rounded-md border border-neutral-200 py-2.5 text-sm text-neutral-600 transition active:scale-[0.98]"
        >
          약도 이미지 보기
        </button>

        <div className="mt-4">
          <p className="mb-1 font-mono text-[11px] tracking-widest text-neutral-400">
            NAVIGATION
          </p>
          <p className="mb-3 text-xs text-neutral-400">
            원하시는 앱을 선택하시면 길안내가 시작됩니다.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {navApps.map((app) => (
              <a
                key={app.key}
                href={app.getHref(directions.searchQuery)}
                {...(app.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`rounded-md py-2.5 text-center text-xs font-medium transition active:scale-[0.98] ${app.className}`}
              >
                {app.label}
              </a>
            ))}
          </div>
        </div>

        {directions.subway.length > 0 && (
          <div className="mt-4 rounded-xl bg-white/70 p-4 shadow-sm">
            <p className="mb-2 font-mono text-[11px] tracking-widest text-accent">지하철</p>
            <ul className="flex flex-col gap-1.5">
              {directions.subway.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                  <span
                    className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.line} {s.desc}
                </li>
              ))}
            </ul>
            {directions.subwayWalk && (
              <p className="mt-2 text-xs text-neutral-400">· {directions.subwayWalk}</p>
            )}
          </div>
        )}

        {directions.bus.length > 0 && (
          <div className="rounded-xl bg-white/70 p-4 shadow-sm">
            <p className="mb-2 font-mono text-[11px] tracking-widest text-accent">버스</p>
            <ul className="flex flex-col gap-1.5">
              {directions.bus.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-neutral-400" />
                  {b.type} : {b.numbers}
                </li>
              ))}
            </ul>
            {directions.busShuttle && (
              <p className="mt-2 text-xs text-neutral-400">{directions.busShuttle}</p>
            )}
          </div>
        )}

        {directions.car && (
          <div className="rounded-xl bg-white/70 p-4 shadow-sm">
            <p className="mb-2 font-mono text-[11px] tracking-widest text-accent">자가용</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
              {directions.car}
            </p>
          </div>
        )}
      </Reveal>

      {guideOpen && (
        <div
          className="fixed inset-0 z-[90] mx-auto flex max-w-mobile items-center justify-center bg-black/80 p-6"
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="relative aspect-[3/4] w-full max-w-[380px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={directions.mapGuideImage}
              alt="약도"
              fill
              sizes="380px"
              className="rounded-lg object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setGuideOpen(false)}
            aria-label="닫기"
            className="absolute right-4 top-6 text-xl text-white/80"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
