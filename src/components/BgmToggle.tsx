"use client";

import { useEffect, useRef, useState } from "react";
import { bgm } from "@/data/wedding";

// 브라우저 자동재생 정책 때문에 실제 "자동재생"은 사용자의 첫 터치/클릭 시점에 시작됩니다.
export default function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startOnFirstTouch = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // 자동재생이 차단되면 사용자가 버튼으로 직접 재생할 수 있도록 조용히 무시합니다.
          startedRef.current = false;
        });
    };

    window.addEventListener("pointerdown", startOnFirstTouch, { once: true });
    window.addEventListener("touchstart", startOnFirstTouch, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startOnFirstTouch);
      window.removeEventListener("touchstart", startOnFirstTouch);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
      startedRef.current = true;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={bgm.src} loop preload="auto" />
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 mx-auto flex max-w-mobile justify-end px-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "배경음악 끄기" : "배경음악 켜기"}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur transition active:scale-95"
        >
          <span className={`text-lg ${isPlaying ? "" : "opacity-40"}`}>
            {isPlaying ? "♫" : "♪"}
          </span>
        </button>
      </div>
    </>
  );
}
