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
    <section className="px-6 py-20">
      <Reveal className="mb-8 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-neutral-400">GALLERY</p>
        <p className="mt-2 font-serif text-lg text-neutral-700">우리의 순간들</p>
      </Reveal>

      <Reveal className="grid grid-cols-3 gap-1.5">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="relative aspect-square overflow-hidden rounded-md bg-white/50"
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
            className="relative aspect-[3/4] w-full max-w-[380px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[activeIndex]}
              alt={`갤러리 사진 ${activeIndex + 1}`}
              fill
              sizes="380px"
              className="object-contain"
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
