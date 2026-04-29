"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* ─── Animated counter ────────────────────────────────────────────────── */
function Counter({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const frame = requestAnimationFrame(() => setCount(target));
      return () => cancelAnimationFrame(frame);
    }
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setCount(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

/* ─── Defect rate drop visual ─────────────────────────────────────────── */
function DropBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  const beforeH = 120;
  const afterH = 72;

  return (
    <div ref={ref} className="mx-auto max-w-sm">
      <div className="mb-5 flex items-end justify-center gap-4 md:gap-8">
        {/* Before bar */}
        <div className="flex flex-col items-center gap-2">
          <p className="relative overflow-hidden font-serif text-3xl font-black text-muted/60 md:text-4xl">
            <Counter target={18} suffix="%" duration={2000} />
          </p>
          <div className="flex h-[128px] w-12 flex-col justify-end md:w-16">
            <motion.div
              className="relative w-full overflow-hidden rounded-sm"
              style={{ background: "rgba(212,175,55,0.28)" }}
              initial={{ height: 0 }}
              animate={inView ? { height: reduce ? beforeH : beforeH } : { height: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-muted/45">Before · Returns</p>
        </div>

        {/* Arrow */}
        <div className="mb-6 pb-2 text-2xl text-accent/40">→</div>

        {/* After bar — fixed chart height so 7.8% column + glow stays visible */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="relative overflow-hidden font-serif text-3xl font-black md:text-4xl"
            style={{
              color: "#D4AF37",
              textShadow:
                "0 0 28px rgba(212,175,55,0.55), 0 0 12px rgba(255,230,160,0.35)",
            }}
          >
            <Counter target={7.8} suffix="%" duration={2000} decimals={1} />
          </p>
          <div className="relative flex h-[128px] w-12 flex-col justify-end md:w-16">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[130%] max-w-[5.5rem] -translate-x-1/2 rounded-full"
              style={{
                height: afterH + 28,
                background: "rgba(212,175,55,0.5)",
                filter: "blur(18px)",
              }}
              initial={{ opacity: 0 }}
              animate={
                inView
                  ? { opacity: [0.35, 0.75, 0.35] }
                  : { opacity: 0 }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="relative z-[1] w-full overflow-hidden rounded-sm border border-accent/55 shadow-[0_0_26px_rgba(212,175,55,0.5),inset_0_1px_0_rgba(255,248,220,0.4)]"
              style={{
                background:
                  "linear-gradient(to top, #7a6218 0%, #D4AF37 35%, #f2e4a8 70%, #fffcef 100%)",
              }}
              initial={{ height: 0, opacity: 0.5 }}
              animate={
                inView
                  ? { height: reduce ? afterH : afterH, opacity: 1 }
                  : { height: 0, opacity: 0.5 }
              }
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            />
          </div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-accent/75">
            After · Strategically Reduced
          </p>
        </div>
      </div>

      {/* reduction badge */}
      <motion.div
        className="mx-auto w-fit border border-accent/22 px-4 py-1.5"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <p className="text-[9px] uppercase tracking-[0.4em] text-accent/80">
          Customer Return Rate · Snapdeal Marketplace · Driven Down Strategically
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Metric card ─────────────────────────────────────────────────────── */
const METRICS = [
  { prefix: "$", target: 200, suffix: "M+", label: "Program Value", sub: "A&F South Asia" },
  { prefix: "", target: 30, suffix: "M+", label: "Units / Year", sub: "India · SL · BD" },
  { prefix: "", target: 50, suffix: "+", label: "Factory Gates", sub: "Active partnerships" },
  { prefix: "", target: 350, suffix: "+", label: "Dedicated Staff", sub: "Buying agent network" },
] as const;

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* header */}
        <div className="mb-12 md:mb-16">
          <SectionHeading title="IMPACT" />
        </div>

        {/* hero stat */}
        <motion.div
          className="mb-14 md:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          <DropBar />
        </motion.div>

        {/* divider */}
        <div className="mb-10 h-px bg-gradient-to-r from-transparent via-accent/18 to-transparent md:mb-16" />

        {/* metric counters grid */}
        <div className="grid grid-cols-2 gap-px border border-zinc-600/35 bg-accent/4 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              className="relative overflow-hidden border border-zinc-500/35 bg-accent/5 px-4 py-5 md:px-6 md:py-6"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 18%, rgba(212,175,55,0.12), rgba(212,175,55,0.03) 48%, transparent 80%)",
                }}
                animate={{ opacity: [0.24, 0.5, 0.24], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
              />
              <p className="relative overflow-hidden font-serif text-3xl font-bold text-accent">
                <Counter
                  prefix={m.prefix}
                  target={m.target}
                  suffix={m.suffix}
                  duration={2000}
                />
              </p>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/75">
                {m.label}
              </p>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.22em] text-muted/45">
                {m.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
