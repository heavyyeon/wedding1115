"use client";

import { HTMLAttributes, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number; // ms
};

export default function Reveal({ children, delay = 0, className = "", style, ...rest }: RevealProps) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
