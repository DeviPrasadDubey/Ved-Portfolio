"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function LensCursor() {
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { damping: 28, stiffness: 350, mass: 0.4 });
  const y = useSpring(rawY, { damping: 28, stiffness: 350, mass: 0.4 });

  const [size, setSize] = useState(28);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive =
        el.closest("a, button, [role=button], input, textarea, label") ||
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        window.getComputedStyle(el).cursor === "pointer";
      setSize(isInteractive ? 56 : 28);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [rawX, rawY, visible]);

  return (
    <>
      {/* Outer ring — mix-blend-mode: difference */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-white"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          width: size,
          height: size,
          boxShadow: `0 0 20px var(--cursor-glow)`,
        }}
        animate={{ width: size, height: size }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white"
        style={{
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          width: 4,
          height: 4,
        }}
      />
    </>
  );
}
