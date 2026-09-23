"use client";

import Image from "next/image";
import { directions, wedding } from "@/data/wedding";
import { naverMapSearchUrl, tmapSearchUrl } from "@/lib/navigation";
import { useToast } from "@/context/ToastContext";
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
];

export default function DirectionsSection() {
  const { showToast } = useToast();
  const venueName = wedding.venueName;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(directions.parkingAddress);
      showToast("주소가 복사되었어요");
    } catch {
      showToast("복사에 실패했어요");
    }
  };

  return (
    <section className="px-6 py-20">
      <Reveal className="mb-6 text-center">
        <p className="font-serif text-lg text-neutral-700">오시는 길</p>
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

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
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

        <div className="rounded-xl bg-white/70 p-4 shadow-sm">
          <p className="mb-2 font-mono text-[11px] tracking-widest text-accent">주차안내</p>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-neutral-600">{directions.parkingAddress}</p>
            <button
              type="button"
              onClick={copyAddress}
              className="flex-shrink-0 rounded-md bg-rose-300 px-3 py-1.5 text-xs font-medium text-white active:scale-95"
            >
              복사하기
            </button>
          </div>

          {directions.parkingNotes.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {directions.parkingNotes.map((note, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-neutral-400" />
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </section>
  );
}
