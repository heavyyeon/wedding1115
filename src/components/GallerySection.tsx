"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gallery } from "@/data/wedding";
import Reveal from "@/components/Reveal";

// 스와이프로 인정할 최소 이동 거리(px). 값을 낮출수록 조금만 밀어도 바로 넘어갑니다.
const SWIPE_THRESHOLD = 20;
// 다음/이전 사진으로 슬라이드되는 애니메이션 시간(ms). 나가는 동작과 들어오는 동작 각각에
// 적용되므로 실제 체감 시간은 이 값의 약 2배입니다. 너무 0에 가까우면 오히려 뚝 끊기는
// 느낌이 나서, 빠르면서도 "슬라이드"로 보이는 값으로 맞췄습니다.
const ANIM_MS = 130;
// 사진이 화면 밖으로 완전히 나갔다고 볼 수 있는 이동 거리(px). 카드 최대 폭(420px)보다
// 넉넉하게 잡아서, 다음 사진으로 바뀌는 순간이 화면 밖에서 일어나 안 보이게 합니다.
const EXIT_OFFSET = 480;

const photos = Array.from(
  { length: gallery.count },
  (_, i) => `${gallery.basePath}/${i + 1}.${gallery.extension}`
);

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // 드래그/슬라이드 애니메이션에 쓰는 값들
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionOn, setTransitionOn] = useState(true);
  const isAnimatingRef = useRef(false);

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));

  // 지금 보고 있는 사진의 "바로 다음/이전" 사진만 미리 최적화 요청을 보내둡니다.
  // (Vercel의 이미지 최적화는 그 사진을 그 크기로 처음 요청받을 때 한 번 축소/압축하고,
  // 그 뒤로는 캐시에서 바로 나갑니다. 그래서 한 번도 열어본 적 없는 사진은 처음 열 때만
  // 살짝 느리고, 그다음부터는 누가 봐도 빠릅니다. 여기서 다음/이전 사진을 미리 한 번
  // "예열"해두면, 순서대로 넘길 때는 항상 이미 준비된 상태라 빠르게 느껴집니다.)
  const prevIndex =
    activeIndex === null ? null : (activeIndex - 1 + photos.length) % photos.length;
  const nextIndex = activeIndex === null ? null : (activeIndex + 1) % photos.length;

  // direction 1 = 다음 사진, -1 = 이전 사진.
  // 1) 현재 사진을 화면 밖으로 슬라이드 아웃 → 2) 화면 밖에 있는 동안 사진을 교체하고
  // 반대편 화면 밖으로 순간 이동(트랜지션 꺼둔 채라 안 보임) → 3) 중앙으로 슬라이드 인.
  const runSlide = (direction: 1 | -1) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    setTransitionOn(true);
    setDragX(direction === 1 ? -EXIT_OFFSET : EXIT_OFFSET);

    window.setTimeout(() => {
      if (direction === 1) showNext();
      else showPrev();

      setTransitionOn(false);
      setDragX(direction === 1 ? EXIT_OFFSET : -EXIT_OFFSET);

      // 트랜지션을 끈 채로 반대편으로 순간 이동시킨 상태가 실제로 한 번 그려지도록
      // 프레임을 넘긴 뒤에야 다시 트랜지션을 켜고 중앙(0)으로 슬라이드 인합니다.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionOn(true);
          setDragX(0);
          window.setTimeout(() => {
            isAnimatingRef.current = false;
          }, ANIM_MS);
        });
      });
    }, ANIM_MS);
  };

  // 사진 위에서 왼쪽/오른쪽으로 스와이프하면 이전/다음 사진으로 넘어갑니다.
  // 터치 중에는 손가락 움직임을 그대로 따라가게 해서 반응이 즉각적으로 느껴집니다.
  const onTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingRef.current) return;
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

    if (deltaX <= -SWIPE_THRESHOLD) {
      runSlide(1); // 왼쪽으로 스와이프 → 다음 사진
    } else if (deltaX >= SWIPE_THRESHOLD) {
      runSlide(-1); // 오른쪽으로 스와이프 → 이전 사진
    } else {
      setDragX(0); // 임계값 미달 → 제자리로 스냅
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
          className="fixed inset-0 z-[80] mx-auto flex max-w-mobile flex-col items-center justify-center overflow-hidden bg-black/90 px-4"
          onClick={close}
        >
          <div
            className="relative h-[70vh] w-full max-w-[420px] touch-pan-y select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              transform: `translateX(${dragX}px)`,
              transition: isDragging || !transitionOn ? "none" : `transform ${ANIM_MS}ms ease-out`,
            }}
          >
            {/*
              next/image를 써서 원본 파일(수 MB짜리 PNG일 수 있음)을 그대로 내려받지 않고,
              Vercel이 화면 크기에 맞게 자동으로 축소/압축(webp 등)해서 내려주도록 했습니다.
              이전에 일반 <img> 태그로 원본을 직접 불러오던 것보다 로딩이 훨씬 빨라집니다.
            */}
            <Image
              src={photos[activeIndex]}
              alt={`갤러리 사진 ${activeIndex + 1}`}
              fill
              sizes="420px"
              className="object-contain"
              draggable={false}
              priority
            />
          </div>

          {/*
            PC(마우스)에서도 좌우로 넘길 수 있도록 사진 양옆에 화살표 버튼을 추가했습니다.
            버튼 크기를 화살표 글자보다 훨씬 크게(h-14 w-14) 잡아서, 화살표를 정확히
            클릭하지 않고 그 근처만 눌러도 바로 넘어가도록 했습니다.
          */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              runSlide(-1);
            }}
            aria-label="이전 사진"
            className="absolute left-1 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center text-3xl text-white/70 transition active:scale-90 active:text-white sm:left-3"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              runSlide(1);
            }}
            aria-label="다음 사진"
            className="absolute right-1 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center text-3xl text-white/70 transition active:scale-90 active:text-white sm:right-3"
          >
            ›
          </button>

          {/* 화면에는 보이지 않지만, 바로 다음/이전 사진을 같은 크기로 미리 요청해서
              최적화 캐시를 예열해둡니다. */}
          <div className="hidden" aria-hidden="true">
            {prevIndex !== null && (
              <Image src={photos[prevIndex]} alt="" fill sizes="420px" priority />
            )}
            {nextIndex !== null && (
              <Image src={photos[nextIndex]} alt="" fill sizes="420px" priority />
            )}
          </div>

          <div className="mt-6 flex items-center gap-8 text-white">
            <button
              type="button"
              onClick={() => runSlide(-1)}
              aria-label="이전 사진"
              className="text-2xl"
            >
              ‹
            </button>
            <span className="font-mono text-xs tracking-widest">
              {activeIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => runSlide(1)}
              aria-label="다음 사진"
              className="text-2xl"
            >
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
