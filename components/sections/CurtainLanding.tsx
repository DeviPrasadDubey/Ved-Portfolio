"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props { onLift: () => void; }

/* ─── Animated silk-wave canvas ────────────────────────────────────── */
function SilkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = () => canvas.width;
    const h = () => canvas.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let t = 0;
    let raf: number;

    function draw() {
      ctx.clearRect(0, 0, w(), h());
      t += 0.006;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const freq = 0.0012 + i * 0.0007;
        const amp = 55 + i * 28;
        const phase = t * (0.7 + i * 0.18) + i * (Math.PI * 2 / 5);
        ctx.moveTo(0, h() * 0.5);
        for (let x = 0; x <= w(); x += 4) {
          const y = h() * 0.5 + amp * Math.sin(x * freq + phase) + (amp * 0.3) * Math.sin(x * freq * 2.1 + phase * 1.3);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w(), h());
        ctx.lineTo(0, h());
        ctx.closePath();
        const isGold = i % 2 === 0;
        ctx.fillStyle = isGold
          ? `rgba(212,175,55,${0.025 - i * 0.003})`
          : `rgba(30,30,30,${0.04 - i * 0.005})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden />;
}

export function CurtainLanding({ onLift }: Props) {
  const reduce = useReducedMotion();
  const [lifted, setLifted] = useState(false);
  const hasLifted = useRef(false);
  const onLiftRef = useRef(onLift);
  const reduceRef = useRef(reduce);
  useEffect(() => { onLiftRef.current = onLift; });
  useEffect(() => { reduceRef.current = reduce; }, [reduce]);

  function lift() {
    if (hasLifted.current) return;
    hasLifted.current = true;
    document.body.style.overflow = "";
    setLifted(true);
    setTimeout(() => onLiftRef.current(), reduceRef.current ? 0 : 180);
  }

  useEffect(() => {
    if (typeof history !== "undefined") history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (hasLifted.current) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", lift, { once: true, passive: true });
    window.addEventListener("touchstart", lift, { once: true, passive: true });
    window.addEventListener("keydown", lift, { once: true });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", lift);
      window.removeEventListener("touchstart", lift);
      window.removeEventListener("keydown", lift);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      animate={
        lifted
          ? { scale: 10, opacity: 0, filter: "blur(16px)" }
          : { scale: 1, opacity: 1, filter: "blur(0px)" }
      }
      transition={
        lifted
          ? { duration: reduce ? 0 : 0.82, ease: [0.55, 0, 0.1, 1] }
          : { duration: 0 }
      }
      style={{ pointerEvents: lifted ? "none" : "auto", transformOrigin: "center center" }}
    >
      {/* Silk wave background */}
      <SilkCanvas />

      {/* Central gold glow beam behind headline */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 55% 30% at 50% 50%, rgba(212,175,55,0.09) 0%, transparent 68%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: "2px",
          height: "40%",
          top: "30%",
          left: "50%",
          background: "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)",
          filter: "blur(8px)",
        }}
        animate={{ opacity: [0.3, 0.9, 0.3], scaleY: [0.8, 1.15, 0.8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* gold rule — top */}
      <motion.div
        className="relative mb-10 h-px w-24"
        style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.65),transparent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* headline */}
      <div className="relative text-center">
        <motion.p
          className="select-none font-serif font-black text-accent"
          style={{ fontSize: "clamp(2.6rem, 7.5vw, 6.5rem)", letterSpacing: "-0.025em", lineHeight: 1 }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Ved Dwivedi
        </motion.p>
        <motion.p
          className="select-none font-serif font-light italic text-foreground/55"
          style={{ fontSize: "clamp(1rem, 2.4vw, 2rem)", letterSpacing: "0.04em", lineHeight: 1.3, marginTop: "0.45em" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Leading with Perspective
        </motion.p>
      </div>

      {/* gold rule — bottom */}
      <motion.div
        className="relative mt-10 h-px w-24"
        style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.65),transparent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Enter button */}
      <motion.button
        type="button"
        onClick={lift}
        className="group relative mt-12 overflow-hidden border border-accent/35 px-10 py-3.5 transition-colors duration-300 hover:border-accent/70"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="absolute inset-0 -translate-x-full bg-accent/[0.09] transition-transform duration-500 group-hover:translate-x-0" aria-hidden />
        <span className="relative text-[11px] uppercase tracking-[0.55em] text-accent/80 transition-colors duration-300 group-hover:text-accent">
          Enter Portfolio
        </span>
      </motion.button>

      <motion.p
        className="relative mt-6 text-[9px] uppercase tracking-[0.48em] text-muted/32"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.18, 0.5] }}
        transition={{ delay: 1.4, duration: 3.2, repeat: Infinity }}
      >
        or scroll · press any key
      </motion.p>
    </motion.div>
  );
}
