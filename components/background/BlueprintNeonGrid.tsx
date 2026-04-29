"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Reacting “neon” blueprint grid — parallax on scroll, token-light (single pass).
 * Kept in code-review-graph: depends only on HomePage layout order.
 */
export function BlueprintNeonGrid() {
  const { scrollY } = useScroll();
  const y1 = useSpring(useTransform(scrollY, [0, 2000], [0, 120]), {
    stiffness: 80,
    damping: 28,
  });
  const x1 = useSpring(useTransform(scrollY, [0, 2000], [0, -40]), {
    stiffness: 80,
    damping: 28,
  });
  const opacity = useTransform(scrollY, [0, 400], [0.12, 0.22]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -left-[10%] top-0 h-[120%] w-[120%]"
        style={{ y: y1, x: x1, opacity }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 75%)",
          }}
        />
      </motion.div>
    </div>
  );
}
