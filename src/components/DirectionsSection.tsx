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
    // 네이버 지도 SDK가 "Client ID가 이 도메인에 등록되어 있지 않음" 등 인증에 실패했을 때
    // 자동으로 호출해주는 콜백입니다. 이걸 미리 등록해두면, 인증 실패처럼 브라우저 콘솔에
    // 별다른 에러 없이 조용히 실패하는 경우에도 원인을 정확히 알 수 있습니다.
    navermap_authFailure?: () => void;
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

  // 네이버 지도 SDK 스크립트가 로드되기 전에 인증 실패 콜백을 먼저 등록해둡니다.
  // (스크립트보다 늦게 등록하면 실패 시점에 콜백이 아직 없어서 조용히 무시될 수 있습니다.)
  useEffect(() => {
    window.navermap_authFailure = () => {
      // eslint-disable-next-line no-console
      console.error(
        "[네이버지도] 인증 실패: Client ID가 잘못되었거나, 지금 보고 있는 이 도메인이 " +
          "네이버클라우드 콘솔의 '서비스 환경(Web 서비스 URL)'에 등록되어 있지 않습니다."
      );
      setMapFailed(true);
    };
  }, []);

  // 지도를 그릴 때 위도/경도를 직접 입력하지 않고, 네이버 Geocoding API에 실제 주소
  // 텍스트(searchQuery)를 넘겨서 정확한 좌표를 그때그때 받아옵니다. 좌표를 사람이 직접
  // 입력하면 오타 등으로 엉뚱한 위치가 표시될 위험이 있어, 이 방식이 더 안전합니다.
  useEffect(() => {
    if (!sdkReady || !mapElRef.current) return;

    let cancelled = false;
    let attempts = 0;

    // next/script의 onReady는 maps.js 본 파일이 실행 완료된 시점에 불리는데, submodules로
    // 함께 요청한 geocoder 기능은 그 직후 아주 잠깐의 시간차를 두고 내부적으로 붙는
    // 경우가 있습니다. 그래서 naver.maps.Service가 없다고 바로 실패 처리하지 않고,
    // 최대 3초(150ms × 20번) 정도는 잠깐씩 기다렸다가 다시 확인해봅니다.
    const tryGeocode = () => {
      if (cancelled) return;
      const naver = window.naver;

      if (!naver?.maps?.Service) {
        attempts += 1;
        if (attempts > 20) {
          // eslint-disable-next-line no-console
          console.error("[네이버지도] Service(geocoder) 모듈이 끝내 준비되지 않았습니다.", naver);
          setMapFailed(true);
          return;
        }
        window.setTimeout(tryGeocode, 150);
        return;
      }

      naver.maps.Service.geocode(
        { query: directions.searchQuery },
        (status: string, response: any) => {
          if (cancelled) return;
          if (status !== naver.maps.Service.Status.OK) {
            // eslint-disable-next-line no-console
            console.error("[네이버지도] geocode 실패, status:", status, "response:", response);
            setMapFailed(true);
            return;
          }
          const result = response.v2.addresses[0];
          if (!result || !mapElRef.current) {
            // eslint-disable-next-line no-console
            console.error("[네이버지도] 검색 결과가 없습니다:", response);
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
    };

    tryGeocode();
    return () => {
      cancelled = true;
    };
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
        onError={(e) => {
          // eslint-disable-next-line no-console
          console.error("[네이버지도] 스크립트 자체를 불러오지 못했습니다:", e);
          setMapFailed(true);
        }}
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
