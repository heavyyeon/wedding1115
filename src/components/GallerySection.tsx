"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gallery } from "@/data/wedding";
import Reveal from "@/components/Reveal";

// 스와이프로 인정할 최소 이동 거리(px). 값을 낮출수록 조금만 밀어도 바로 넘어갑니다.
const SWIPE_THRESHOLD = 20;
// 손을 뗀 뒤 다음/이전 사진으로 넘어가는 애니메이션 시간(ms). 0으로 두면 별도의 슬라이드
// 모션 없이 손을 떼는 즉시 다음 사진으로 바뀝니다(가장 빠르게 느껴지는 설정).
const SNAP_DURATION_MS = 0;

const photos = Array.from(
  { length: gallery.count },
  (_, i) => `${gallery.basePath}/${i + 1}.${gallery.extension}`
);

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  // 드래그 중 손가락을 따라 사진이 실시간으로 움직이도록 하는 값입니다.
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));

  // 사진 위에서 왼쪽/오른쪽으로 스와이프하면 이전/다음 사진으로 넘어갑니다.
  // 터치 중에는 손가락 움직임을 그대로 따라가게 해서 반응이 즉각적으로 느껴지고,
  // 손을 떼는 순간에만 짧게(SNAP_DURATION_MS) 스냅 애니메이션이 붙습니다.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setDragX(e.touches[0].clientX - touchStartX.current);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    setIsDragging(false);
    setDragX(0);
    if (deltaX <= -SWIPE_THRESHOLD) {
      showNext(); // 왼쪽으로 스와이프 → 다음 사진
    } else if (deltaX >= SWIPE_THRESHOLD) {
      showPrev(); // 오른쪽으로 스와이프 → 이전 사진
    }
  };

  return (
    <section className="pb-20">
      {/*
        CSS columns(masonry)는 사진을 세로로 먼저 쌓고 그다음 열로 넘어가는 방식이라
        1,2,3번이 화면상 순서와 어긋나 보이고, 사진 높이가 제각각이면 열 사이에 큰
        공백이 생길 수 있습니다. 그래서 순서가 항상 왼쪽→오른쪽, 위→아래로 유지되고
        빈 공간도 생기지 않는 grid(고정 칸) 방식으로 되돌리고, 대신 칸을 세로로 더
        길게(aspect-[3/4]) 잡아 사진이 작아 보이지 않도록 했습니다.
      */}
      <Reveal className="grid grid-cols-3 gap-0">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="relative aspect-[3/4] overflow-hidden bg-white/50"
          >
            <Image
              src={src}
              alt={`갤러리 사진 ${i + 1}`}
              fill
              sizes="160px"
              className="object-cover transition duration-300 active:scale-95"
            />
          </button>
        ))}
      </Reveal>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[80] mx-auto flex max-w-mobile flex-col items-center justify-center bg-black/90 px-4"
          onClick={close}
        >
          <div
            className="relative flex max-h-[80vh] w-full max-w-[420px] touch-pan-y items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              transform: `translateX(${dragX}px)`,
              transition: isDragging ? "none" : `transform ${SNAP_DURATION_MS}ms ease-out`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIndex]}
              alt={`갤러리 사진 ${activeIndex + 1}`}
              className="max-h-[80vh] w-auto max-w-full object-contain"
              draggable={false}
            />
          </div>

          <div className="mt-6 flex items-center gap-8 text-white">
            <button type="button" onClick={showPrev} aria-label="이전 사진" className="text-2xl">
              ‹
            </button>
            <span className="font-mono text-xs tracking-widest">
              {activeIndex + 1} / {photos.length}
            </span>
            <button type="button" onClick={showNext} aria-label="다음 사진" className="text-2xl">
              ›
            </button>
          </div>

          <button
            type="button"
            onClick={close}
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
