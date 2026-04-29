"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

const MAGNET_PAD = 56;
const MAGNET_MAX_DIST = 140;
const MAGNET_STRENGTH = 0.32;

function applyMagneticPull(clientX: number, clientY: number) {
  if (typeof document === "undefined")
    return { x: clientX, y: clientY };
  const nodes = document.querySelectorAll<HTMLElement>(
    "a[href], button:not([disabled]), [data-magnetic]",
  );
  let best: { cx: number; cy: number; d: number; r: number } | null = null;
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const exp = {
      l: r.left - MAGNET_PAD,
      t: r.top - MAGNET_PAD,
      w: r.width + MAGNET_PAD * 2,
      h: r.height + MAGNET_PAD * 2,
    };
    if (
      clientX < exp.l ||
      clientX > exp.l + exp.w ||
      clientY < exp.t ||
      clientY > exp.t + exp.h
    )
      continue;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.hypot(clientX - cx, clientY - cy);
    if (!best || d < best.d) best = { cx, cy, d, r: Math.max(r.width, r.height) / 2 };
  }
  if (!best) return { x: clientX, y: clientY };
  const falloff = Math.max(0, 1 - best.d / (MAGNET_MAX_DIST + best.r));
  const t = falloff * falloff * MAGNET_STRENGTH;
  return {
    x: clientX + (best.cx - clientX) * t,
    y: clientY + (best.cy - clientY) * t,
  };
}

/**
 * Inversion-lens cursor: ultra-snappy spring (stiff 1200 / damp 40), mix-blend
 * difference. Pulls toward interactive centers when nearby ("magnetic").
 * Disabled on touch / mobile.
 */
export function CustomCursor() {
  const isMobile = useIsMobile();
  const [finePointer, setFinePointer] = useState(true);
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { stiffness: 1200, damping: 40, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 1200, damping: 40, mass: 0.1 });

  const [size, setSize] = useState(28);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const set = () => setFinePointer(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const active = !isMobile && finePointer;

  useEffect(() => {
    if (!active) return;
    const onMove = (e: MouseEvent) => {
      const p = applyMagneticPull(e.clientX, e.clientY);
      rawX.set(p.x);
      rawY.set(p.y);
      if (!visible) setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = !!el.closest(
        "a, button, [role=button], input, textarea, label, [data-cursor=\"pointer\"]",
      );
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
  }, [active, rawX, rawY, visible]);

  if (!active) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-white will-change-transform"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          width: size,
          height: size,
          boxShadow: "0 0 24px var(--cursor-glow)",
        }}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 1010, damping: 35, mass: 0.2 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white will-change-transform"
        style={{
          x,
          y,
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
