"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 요소가 뷰포트에 들어오면 한 번만 true 로 바뀌는 IntersectionObserver 훅.
 * Reveal 컴포넌트에서 스크롤 진입 fadeIn 애니메이션 트리거로 사용합니다.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.2
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
