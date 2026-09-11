"use client";

import { useState } from "react";
import Image from "next/image";
import { gallery } from "@/data/wedding";
import Reveal from "@/components/Reveal";

const photos = Array.from(
  { length: gallery.count },
  (_, i) => `${gallery.basePath}/${i + 1}.${gallery.extension}`
);

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));

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
            className="relative flex max-h-[80vh] w-full max-w-[420px] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIndex]}
              alt={`갤러리 사진 ${activeIndex + 1}`}
              className="max-h-[80vh] w-auto max-w-full object-contain"
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
