"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  useMotionValue,
  useTransform,
} from "framer-motion";

/* ─── Sticky avatar ─────────────────────────────────────────────────── */
function StickyAvatar({ visible, scrollDir }: { visible: boolean; scrollDir: number }) {
  const reduce = useReducedMotion();
  const tilt = useSpring(scrollDir * 8, { stiffness: 80, damping: 18 });
  return (
    <motion.div
      className="fixed left-4 top-[72px] z-50"
      initial={false}
      animate={visible ? { scale: 1, opacity: 1, x: 0 } : { scale: 0.6, opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <motion.div
        style={{
          rotateX: reduce ? 0 : tilt,
          transformStyle: "preserve-3d",
          width: 56,
          aspectRatio: "3 / 4",
          boxShadow: "0 8px 32px -8px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.22)",
        }}
        className="relative overflow-hidden rounded-sm"
      >
        <Image src="/ved-hero.png" alt="Ved Prakash Dwivedi" fill sizes="56px" style={{ objectFit: "cover", objectPosition: "center top" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </motion.div>
      <div className="mx-auto mt-0.5 h-px w-10 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <p className="mt-1 text-center text-[7px] uppercase tracking-[0.25em] text-accent/55">ved</p>
    </motion.div>
  );
}

/* ─── Animated stat counter ─────────────────────────────────────────── */
function StatCounter({ target, prefix = "", suffix = "", label, startDelay = 0, ready }: {
  target: number; prefix?: string; suffix?: string; label: string; startDelay?: number; ready: boolean;
}) {
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!ready) return;
    if (reduce) {
      const frame = requestAnimationFrame(() => setCount(target));
      return () => cancelAnimationFrame(frame);
    }
    const timer = setTimeout(() => {
      const duration = 1600;
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - (1 - p) ** 3;
        setCount(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, startDelay * 1000);
    return () => clearTimeout(timer);
  }, [ready, target, startDelay, reduce]);
  return (
    <div>
      <p className="font-serif text-2xl font-bold text-accent">{prefix}{count}{suffix}</p>
      <p className="mt-0.5 text-[8px] uppercase tracking-[0.22em] text-muted/45">{label}</p>
    </div>
  );
}

/* ─── Character reveal ───────────────────────────────────────────────── */
function CharReveal({ text, baseDelay = 0, charStagger = 0.042, className = "", ready }: {
  text: string; baseDelay?: number; charStagger?: number; className?: string; ready: boolean;
}) {
  const reduce = useReducedMotion();
  let charIdx = 0;
  return (
    <span className={`inline ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i} style={{ display: "inline-block", width: "0.28em" }} aria-hidden />;
        const delay = baseDelay + charIdx++ * charStagger;
        return (
          <span key={i} aria-hidden style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "115%", opacity: 0, filter: "blur(8px)" }}
              animate={(ready || reduce) ? { y: 0, opacity: 1, filter: "blur(0px)" } : { y: "115%", opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.58, delay, ease: [0.16, 1, 0.3, 1] }}
            >{ch}</motion.span>
          </span>
        );
      })}
    </span>
  );
}

/* ─── Hero section ──────────────────────────────────────────────────── */
export function HeroSection({ curtainLifted }: { curtainLifted: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [scrollDir, setScrollDir] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const lastProg = useRef(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const delta = v - lastProg.current;
      if (Math.abs(delta) > 0.001) setScrollDir(delta > 0 ? 1 : -1);
      lastProg.current = v;
      setAvatarVisible(v > 0.55);
    });
  }, [scrollYProgress]);

  // Mouse parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const imgX = useSpring(useTransform(rawX, [-1, 1], [-14, 14]), { stiffness: 55, damping: 18 });
  const imgY = useSpring(useTransform(rawY, [-1, 1], [-8, 8]), { stiffness: 55, damping: 18 });
  const txtX = useSpring(useTransform(rawX, [-1, 1], [8, -8]), { stiffness: 75, damping: 20 });
  const txtY = useSpring(useTransform(rawY, [-1, 1], [4, -4]), { stiffness: 75, damping: 20 });
  const statX = useSpring(useTransform(rawX, [-1, 1], [12, -12]), { stiffness: 90, damping: 22 });

  function handleMouseMove(e: React.MouseEvent) {
    if (reduce) return;
    rawX.set((e.clientX / window.innerWidth) * 2 - 1);
    rawY.set((e.clientY / window.innerHeight) * 2 - 1);
  }

  const ready = curtainLifted || (reduce ?? false);
  const shimmerDelay = 1.65;

  return (
    <section
      ref={sectionRef}
      id="gateway"
      className="relative min-h-screen overflow-hidden pt-[117px] md:h-screen md:pt-[29px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-8 px-4 pb-10 md:flex-row md:items-center md:gap-14 md:px-6 md:pb-0">

        {/* LEFT: Portrait — parallax outer wrapper + entrance inner wrapper */}
        <motion.div className="shrink-0" style={reduce ? {} : { x: imgX, y: imgY }}>
          <motion.div
            initial={{ x: "-75vw", opacity: 0 }}
            animate={ready ? { x: 0, opacity: 1 } : { x: "-75vw", opacity: 0 }}
            transition={{ type: "spring", stiffness: 55, damping: 22, delay: 0 }}
          >
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                width: "min(25rem, 78vw)",
                aspectRatio: "3 / 4",
                boxShadow: "0 72px 180px -56px rgba(0,0,0,0.88), 0 0 0 1px rgba(201,164,76,0.14)",
              }}
            >
              <Image src="/ved-hero.png" alt="Ved Prakash Dwivedi" fill priority sizes="(max-width:1024px) 40vw, 26rem" style={{ objectFit: "cover", objectPosition: "center top" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/52 via-transparent to-background/10" />
            </div>
            <div className="mx-auto mt-1.5 h-px w-3/4 bg-gradient-to-r from-transparent via-accent/42 to-transparent" />
          </motion.div>
        </motion.div>

        {/* RIGHT: Text — parallax outer wrapper */}
        <motion.div className="flex flex-1 flex-col text-left md:pl-24" style={reduce ? {} : { x: txtX, y: txtY }}>
          <motion.p
            className="mb-4 text-[9px] uppercase tracking-[0.35em] text-accent/62 md:tracking-[0.6em]"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.38, duration: 0.6 }}
          >
            Global Quality &amp; Supply Chain · 11+ Years
          </motion.p>

          <h1 className="font-serif font-black tracking-tight" style={{ fontSize: "clamp(2.1rem, 10vw, 6rem)", lineHeight: 0.92 }}>
            <span className="block" style={{ marginBottom: "0.06em" }}>
              <CharReveal text="Ved Prakash" baseDelay={0.48} charStagger={0.042} className="text-foreground/95" ready={ready} />
            </span>
            <span className="relative block" style={{ isolation: "isolate" }}>
              <CharReveal text="Dwivedi" baseDelay={0.68} charStagger={0.05} className="text-accent" ready={ready} />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 15%, rgba(212,175,55,0.55) 50%, transparent 85%)",
                  mixBlendMode: "screen",
                }}
                initial={{ x: "-110%", opacity: 0 }}
                animate={ready ? { x: "110%", opacity: [0, 1, 1, 0] } : { x: "-110%", opacity: 0 }}
                transition={{ duration: 0.85, delay: shimmerDelay, ease: "easeInOut" }}
              />
            </span>
          </h1>

          <motion.p
            className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted/55 md:tracking-[0.38em]"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.92, duration: 0.5 }}
          >
            Global Quality Leader · Supply Chain Excellence
          </motion.p>

          <motion.div
            className="mt-5 space-y-1.5 border-l-2 border-accent/28 pl-4"
            initial={{ opacity: 0, x: -14 }}
            animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
            transition={{ delay: 1.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.38em] text-muted/65">Senior Quality Specialist</p>
            <motion.p
              className="text-[10px] uppercase tracking-[0.33em]"
              initial={{ color: "rgba(212,175,55,0.38)" }}
              animate={ready ? { color: ["rgba(212,175,55,0.38)", "rgba(212,175,55,1)", "rgba(212,175,55,0.38)"] } : { color: "rgba(212,175,55,0.38)" }}
              transition={{ delay: 1.9, duration: 1.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
            >
              Abercrombie &amp; Fitch · India · SL · BD
            </motion.p>
          </motion.div>

          {/* Stats — foreground parallax layer */}
          <motion.div
            className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.15, duration: 0.5 }}
            style={reduce ? {} : { x: statX }}
          >
            <StatCounter target={11} suffix="+" label="Years Experience" startDelay={1.2} ready={ready} />
            <StatCounter target={9} suffix="+" label="Global Markets" startDelay={1.35} ready={ready} />
            <StatCounter target={20} suffix="+" label="Brand Partners" startDelay={1.5} ready={ready} />
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-muted/28 md:bottom-8 md:tracking-[0.52em]"
        animate={{ opacity: [0.22, 0.62, 0.22] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      >
        scroll
      </motion.p>
      <div className="hidden md:block">
        <StickyAvatar visible={avatarVisible} scrollDir={scrollDir} />
      </div>
    </section>
  );
}
