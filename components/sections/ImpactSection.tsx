"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* ─── Animated counter ────────────────────────────────────────────────── */
function Counter({
  target,
  prefix = "",
  suffix = "",
  duration = 1800,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
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
      setCount(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration, reduce]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ─── Defect rate drop visual ─────────────────────────────────────────── */
function DropBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className="mx-auto max-w-sm">
      <div className="mb-5 flex items-end justify-center gap-4 md:gap-8">
        {/* Before bar */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-serif text-3xl font-black text-muted/60 md:text-4xl">18%</p>
          <motion.div
            className="w-12 rounded-sm md:w-16"
            style={{ background: "rgba(212,175,55,0.25)" }}
            initial={{ height: 0 }}
            animate={inView ? { height: reduce ? 120 : 120 } : { height: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
          <p className="text-[9px] uppercase tracking-[0.35em] text-muted/45">Before · Returns</p>
        </div>

        {/* Arrow */}
        <div className="mb-6 pb-2 text-2xl text-accent/40">→</div>

        {/* After bar */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-serif text-3xl font-black text-accent md:text-4xl">7.8%</p>
          <motion.div
            className="w-12 rounded-sm bg-accent/70 md:w-16"
            initial={{ height: 0 }}
            animate={inView ? { height: reduce ? 52 : 52 } : { height: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />
          <p className="text-[9px] uppercase tracking-[0.35em] text-muted/45">After · Strategically Reduced</p>
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
        <div className="grid grid-cols-2 gap-px border border-white/[0.06] bg-white/[0.06] md:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              className="bg-background/95 px-4 py-5 md:px-6 md:py-6"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <p className="font-serif text-3xl font-bold text-accent">
                <Counter prefix={m.prefix} target={m.target} suffix={m.suffix} />
              </p>
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
