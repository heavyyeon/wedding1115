"use client";

// ─────────────────────────────────────────────────────────────
// 이 페이지는 네이버 지도 API 문제를 진단하기 위한 "임시 테스트 페이지"입니다.
// 실제 청첩장 페이지가 아니고, 화면에 표시되는 위치도 예식장이 아니라
// 서울시청(누구나 아는 공개 예제 좌표)입니다.
//
// 목적: Geocoding(주소 검색)을 거치지 않고 Dynamic Map(지도 자체)만 단독으로
// 띄워봐서, "지도 렌더링 자체는 되는지 / 안 되는지"를 확인하기 위함입니다.
//
// 확인이 끝나면 이 파일(src/app/map-test/page.tsx)은 삭제하셔도 됩니다.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { directions } from "@/data/wedding";

declare global {
  interface Window {
    naver: any;
    navermap_authFailure?: () => void;
  }
}

// 서울시청 좌표. 네이버/카카오 등 지도 API 예제 문서에도 흔히 쓰이는
// 공개적으로 잘 알려진 테스트용 좌표입니다 (예식장 주소와 무관).
const TEST_LAT = 37.5665;
const TEST_LNG = 126.978;

export default function MapTestPage() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (line: string) => setLog((prev) => [...prev, line]);

  useEffect(() => {
    window.navermap_authFailure = () => {
      addLog("❌ navermap_authFailure 콜백 호출됨 (Client ID/도메인 인증 실패)");
    };
  }, []);

  useEffect(() => {
    if (!sdkReady || !mapElRef.current) return;
    addLog("✅ SDK 스크립트 onReady 발생");

    try {
      const center = new window.naver.maps.LatLng(TEST_LAT, TEST_LNG);
      const map = new window.naver.maps.Map(mapElRef.current, {
        center,
        zoom: 15,
      });
      new window.naver.maps.Marker({ position: center, map });
      addLog("✅ Dynamic Map 객체 생성 성공 (지도가 아래에 보여야 합니다)");
    } catch (err) {
      addLog(`❌ Dynamic Map 생성 중 예외 발생: ${String(err)}`);
    }
  }, [sdkReady]);

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${directions.naverMapClientId}`}
        strategy="afterInteractive"
        onReady={() => setSdkReady(true)}
        onError={(e) => addLog(`❌ 스크립트 로드 자체 실패: ${String(e)}`)}
      />

      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        지도 API 진단 테스트 (실제 청첩장 페이지 아님)
      </h1>
      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        아래 지도는 예식장 위치가 아니라 서울시청(공개 테스트 좌표)입니다. Geocoding(주소 검색) 없이
        Dynamic Map만 단독으로 띄워서, 지도 렌더링 자체가 되는지 확인하는 용도입니다.
      </p>

      <div
        ref={mapElRef}
        style={{ width: "100%", maxWidth: 480, height: 320, background: "#eee" }}
      />

      <div style={{ marginTop: 16, fontSize: 12, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        <strong>진단 로그:</strong>
        {log.length === 0 && <div>(아직 로그 없음 — 스크립트 로딩 대기 중)</div>}
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
