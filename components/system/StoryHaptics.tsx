"use client";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const NODE_SELECTOR = "[data-story-node]";

/**
 * Mobile: 10ms vibration when a new story node takes focus in the viewport.
 */
export function StoryHaptics() {
  const isMobile = useIsMobile();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!isMobile) return;
    if (typeof navigator === "undefined" || !navigator.vibrate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = document.querySelectorAll<HTMLElement>(NODE_SELECTOR);
    if (nodes.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || e.intersectionRatio < 0.45) continue;
          const el = e.target as HTMLElement;
          const id = el.getAttribute("data-story-node") ?? el.id;
          if (!id) continue;
          if (last.current === null) {
            last.current = id;
            return;
          }
          if (last.current === id) continue;
          last.current = id;
          navigator.vibrate(10);
        }
      },
      { threshold: [0.45, 0.6] },
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [isMobile]);

  return null;
}
