"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { directions, wedding } from "@/data/wedding";
import { naverMapSearchUrl, tmapSearchUrl } from "@/lib/navigation";
import { useToast } from "@/context/ToastContext";
import Reveal from "@/components/Reveal";

// 네이버 지도 JS SDK는 window.naver 전역 객체로 로드됩니다. 타입 정의 패키지를 따로 설치하지
// 않았으므로(불필요한 의존성을 늘리지 않기 위해) any로 최소한만 선언해서 씁니다.
declare global {
  interface Window {
    naver: any;
  }
}

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
  const mapElRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  // 지도를 그릴 때 위도/경도를 직접 입력하지 않고, 네이버 Geocoding API에 실제 주소
  // 텍스트(searchQuery)를 넘겨서 정확한 좌표를 그때그때 받아옵니다. 좌표를 사람이 직접
  // 입력하면 오타 등으로 엉뚱한 위치가 표시될 위험이 있어, 이 방식이 더 안전합니다.
  useEffect(() => {
    if (!sdkReady || !mapElRef.current) return;
    const naver = window.naver;
    if (!naver?.maps?.Service) {
      setMapFailed(true);
      return;
    }

    naver.maps.Service.geocode(
      { query: directions.searchQuery },
      (status: string, response: any) => {
        if (status !== naver.maps.Service.Status.OK) {
          setMapFailed(true);
          return;
        }
        const result = response.v2.addresses[0];
        if (!result || !mapElRef.current) {
          setMapFailed(true);
          return;
        }

        const center = new naver.maps.LatLng(Number(result.y), Number(result.x));
        const map = new naver.maps.Map(mapElRef.current, {
          center,
          zoom: 17,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
        });
        new naver.maps.Marker({ position: center, map });
      }
    );
  }, [sdkReady]);

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
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${directions.naverMapClientId}&submodules=geocoder`}
        strategy="afterInteractive"
        onReady={() => setSdkReady(true)}
        onError={() => setMapFailed(true)}
      />

      <Reveal className="mb-6 text-center">
        <p className="font-serif text-lg text-neutral-700">오시는 길</p>
        <p className="mt-3 text-sm font-medium text-neutral-800">{venueName}</p>
        <p className="mt-1 text-xs text-neutral-500">{wedding.address}</p>
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <div className="relative h-52 w-full overflow-hidden rounded-xl bg-neutral-100">
          {/* 실제 움직이는/확대 가능한 네이버 지도입니다. SDK 로드나 주소 검색이 실패하면
              대신 안내 문구를 보여줍니다(지도 자체가 깨진 채로 보이는 것을 막기 위함). */}
          <div ref={mapElRef} className="h-full w-full" />
          {mapFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 px-4 text-center text-xs text-neutral-400">
              지도를 불러오지 못했어요. 아래 "네이버지도" 버튼으로 확인해주세요.
            </div>
          )}
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
            <p className="mb-2 text-sm font-semibold text-rose-300">지하철</p>
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
          <p className="mb-2 text-sm font-semibold text-rose-300">주차안내</p>

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
