"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { couple } from "@/data/wedding";

// 문구 없이 메인 사진 한 장만 꽉 채우는 첫 화면입니다.
// 이름/날짜 문구가 필요하면 /public/main-photo.jpg 자체에 디자인해서 넣어주세요.
//
// 모바일 브라우저(특히 카카오톡/인스타그램 인앱 브라우저 등)는 스크롤 시 주소창이
// 접히면서 화면 높이(vh/dvh/svh 값)가 실시간으로 바뀌어, 사진 영역 크기가 "출렁"거리는
// 것처럼 보일 수 있습니다. CSS 단위 대신 최초 진입 시점의 실제 화면 높이(px)를
// 자바스크립트로 한 번 측정해 고정값으로 박아 넣어, 이후 스크롤/주소창 변화와
// 무관하게 항상 같은 크기를 유지하도록 했습니다.
export default function TitleCard() {
  const [heightPx, setHeightPx] = useState<number | null>(null);

  useEffect(() => {
    setHeightPx(window.innerHeight);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: heightPx ? `${heightPx}px` : "100svh" }}
    >
      <Image
        src="/main-photo.jpg"
        alt={`${couple.groom.name}, ${couple.bride.name}`}
        fill
        priority
        sizes="480px"
        className="object-cover"
      />
    </section>
  );
}
