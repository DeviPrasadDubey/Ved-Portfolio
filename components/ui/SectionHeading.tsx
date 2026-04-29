"use client";
import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Shared section heading with:
 *  - Letter-by-letter reveal from bottom (useInView, fires immediately on enter)
 *  - 3D tilt following cursor (spring)
 *  - Gold colour + glow on hover (JS-driven inline style, no CSS conflicts)
 */
export function SectionHeading({ title, as: Tag = "h2" }: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  /* amount:0 fires the moment even 1px of the element enters the viewport */
  const inView = useInView(containerRef, { once: true, amount: 0 });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent) {
    if (reduce || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -7,
      y: ((e.clientX - r.left) / r.width - 0.5) * 10,
    });
  }

  /* build character array — spaces are spacers, non-spaces get stagger delay */
  let nonSpaceIdx = 0;
  const chars = title.split("").map((ch) => {
    if (ch === " ") return { ch, delay: 0, isSpace: true };
    return { ch, delay: nonSpaceIdx++ * 0.025, isSpace: false };
  });

  const shouldAnimate = inView || reduce;

  return (
    <div
      ref={containerRef}
      className="cursor-default"
      style={{
        display: "inline-block",
        perspective: 900,
        filter: hovered && !reduce
          ? "drop-shadow(0 0 20px rgba(212,175,55,0.22))"
          : "none",
        transition: "filter 0.35s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
    >
      <motion.div
        animate={reduce ? {} : { rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        style={{ transformStyle: "preserve-3d", display: "inline-block" }}
      >
        <Tag className="font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
          {chars.map(({ ch, delay, isSpace }, i) => {
            if (isSpace) {
              return (
                <span key={i} style={{ display: "inline-block", width: "0.3em" }} />
              );
            }
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                }}
              >
                <motion.span
                  style={{
                    display: "inline-block",
                    /* JS-driven colour — avoids any Tailwind CSS specificity conflict */
                    color: hovered ? "#D4AF37" : "rgba(245,245,245,0.95)",
                    transition: "color 0.22s ease",
                  }}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={
                    shouldAnimate
                      ? { y: 0, opacity: 1 }
                      : { y: "110%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.55,
                    delay: shouldAnimate ? delay : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
        </Tag>
      </motion.div>
    </div>
  );
}
