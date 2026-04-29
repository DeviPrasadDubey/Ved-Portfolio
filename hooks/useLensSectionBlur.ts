"use client";
import type { RefObject } from "react";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Fade-through-blur: soft at section edges, sharp in the "focus" band.
 */
export function useLensSectionBlur(ref: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const blurPx = useTransform(
    scrollYProgress,
    [0, 0.1, 0.22, 0.75, 0.9, 1],
    reduce ? [0, 0, 0, 0, 0, 0] : [6, 2, 0, 0, 2.5, 6],
  );

  return useTransform(blurPx, (b) => `blur(${b}px)`);
}
