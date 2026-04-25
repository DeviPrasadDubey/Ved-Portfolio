"use client";
import { useRef, useMemo } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function ZAxisHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const zScale = shouldReduce ? 0.2 : 1;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero band — most scroll motion happens 0…40%
  const t0 = 0.4;
  // Side text: flies past the camera (large negative Z) + lateral spread
  const textOpacity = useTransform(scrollYProgress, [0, t0], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, t0], [1, 0.35]);
  const visionX = useTransform(scrollYProgress, [0, t0], [0, -320 * zScale]);
  const impactX = useTransform(scrollYProgress, [0, t0], [0, 320 * zScale]);
  const visionZ = useTransform(
    scrollYProgress,
    [0, t0],
    [80 * zScale, -1200 * zScale],
  );
  const impactZ = useTransform(
    scrollYProgress,
    [0, t0],
    [80 * zScale, -1200 * zScale],
  );

  // Center portrait: physical layer — recedes slower = stays “in” the room longer
  const portraitZ = useTransform(
    scrollYProgress,
    [0, t0],
    [0, -420 * zScale],
  );
  const portraitScale = useTransform(scrollYProgress, [0, t0], [1, 0.9]);
  const portraitOpacity = useTransform(scrollYProgress, [0, t0 * 0.85], [1, 0]);
  const portraitRotateX = useTransform(
    scrollYProgress,
    [0, t0],
    [0, shouldReduce ? 0 : 4],
  );

  // Name block recedes with the scene
  const infoOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const nameZ = useTransform(scrollYProgress, [0, t0], [0, -900 * zScale]);

  const perspective = useMemo(
    () => (shouldReduce ? 2000 : 1200),
    [shouldReduce],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[min(280vh,3200px)]"
      id="story"
    >
      <div
        className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden"
        style={{
          perspective,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,164,76,0.04) 0%, transparent 70%)",
          }}
        />

        <div
          className="relative flex w-full max-w-[100vw] items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(0)", // new stacking for Safari
          }}
        >
          <motion.div
            style={{
              x: visionX,
              y: 0,
              z: visionZ,
              scale: textScale,
              opacity: textOpacity,
              transformPerspective: perspective,
            }}
            className="absolute left-[6vw] z-[1] select-none will-change-transform"
          >
            <span
              className="block font-serif font-bold leading-none tracking-widest text-foreground/[0.12]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              VISION
            </span>
          </motion.div>

          <motion.div
            style={{
              z: portraitZ,
              scale: portraitScale,
              opacity: portraitOpacity,
              rotateX: portraitRotateX,
              transformPerspective: perspective,
            }}
            className="relative z-10 shrink-0 will-change-transform"
          >
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                width: "min(26rem, 40vw)",
                aspectRatio: "3 / 4",
                boxShadow: "0 40px 100px -40px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,164,76,0.12)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(201,164,76,0.08) 0%, rgba(8,8,10,0.6) 100%)",
                }}
              />
              <Image
                src="/ved-hero-transparent.png"
                alt="Ved Prakash Dwivedi"
                fill
                priority
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div
            style={{
              x: impactX,
              z: impactZ,
              scale: textScale,
              opacity: textOpacity,
              transformPerspective: perspective,
            }}
            className="absolute right-[6vw] z-[1] select-none will-change-transform"
          >
            <span
              className="block font-serif font-bold leading-none tracking-widest text-foreground/[0.12]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              IMPACT
            </span>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: infoOpacity, z: nameZ, transformPerspective: perspective }}
          className="absolute bottom-[12vh] left-1/2 w-[min(100%,32rem)] -translate-x-1/2 text-center will-change-transform"
        >
          <p className="font-serif text-lg font-medium tracking-wider text-foreground/80">
            Ved Prakash Dwivedi
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.45em] text-muted/50">
            Global Quality &amp; Supply Chain Leader · 11+ Years
          </p>
          <p className="mt-6 text-[9px] uppercase tracking-[0.5em] text-muted/30">
            scroll ↓
          </p>
        </motion.div>
      </div>
    </div>
  );
}
