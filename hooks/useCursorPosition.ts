"use client";
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function useCursorPosition() {
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  const x = useSpring(rawX, { damping: 25, stiffness: 320, mass: 0.4 });
  const y = useSpring(rawY, { damping: 25, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return { x, y, rawX, rawY };
}
