"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

function ScrollDrivenReturnPct({
  progress,
}: {
  progress: import("framer-motion").MotionValue<number>;
}) {
  const [label, setLabel] = useState("18.0");
  const reduce = useReducedMotion();

  useMotionValueEvent(progress, "change", (v) => {
    const t = 18 * (1 - v) + 7.8 * v;
    setLabel(t.toFixed(1));
  });

  useEffect(() => {
    if (reduce) {
      setLabel("7.8");
    }
  }, [reduce, progress]);

  if (reduce) {
    return (
      <span className="font-tabular-nums" aria-label="7.8 percent return rate">
        7.8
      </span>
    );
  }
  return <span className="font-tabular-nums tracking-tighter">{label}</span>;
}

export function LogicMask() {
  const ref = useRef<HTMLDivElement>(null);
  const counterBlockRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: counterProgress } = useScroll({
    target: counterBlockRef,
    offset: ["start end", "end start"],
  });
  const reduce = useReducedMotion();

  const tNorm = useTransform(
    counterProgress,
    [0, 0.2, 0.55, 0.9, 1],
    [0, 0, 1, 1, 1],
  );

  const sublabelOpacity = useTransform(tNorm, [0, 0.2], [0, 1]);
  const motionOpacity = useTransform(
    tNorm,
    [0, 0.1, 0.55, 0.85, 1],
    [0, 1, 1, 0.85, 0.25],
  );
  const giantScale = useTransform(
    tNorm,
    [0, 0.2, 1],
    [reduce ? 0.5 : 0.4, 1, reduce ? 0.5 : 0.45],
  );
  const giantBlur = useTransform(
    tNorm,
    [0, 0.2, 0.55, 0.7],
    reduce ? [0, 0, 0, 0] : [2, 0, 0, 1],
  );

  const filterStr = useTransform(
    giantBlur,
    (b) => (reduce ? "none" : `blur(${b}px)`),
  );

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.9, 1],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const statY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={ref}
      id="impact"
      className="blueprint-grid relative overflow-hidden bg-background"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-5"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(201,164,76,0.6) 0%, transparent 60%)",
        }}
      />

      <div
        ref={counterBlockRef}
        className="relative h-[min(150vh,1400px)] w-full"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
          <motion.p
            className="mb-4 text-[9px] uppercase tracking-[0.5em] text-muted/50"
            style={{ opacity: sublabelOpacity }}
          >
            RPR success returns · Snapdeal fashion
          </motion.p>
          <div className="relative flex flex-col items-center">
            <motion.div
              className="select-none"
              style={{
                scale: giantScale,
                filter: filterStr,
                opacity: motionOpacity,
              }}
            >
              <h2
                className="font-serif font-black leading-none tracking-tight text-[#c9a44c]"
                style={{ fontSize: "min(52vw, 20rem)", lineHeight: 0.85 }}
                aria-label="Return rate from eighteen to seven point eight percent"
              >
                <ScrollDrivenReturnPct progress={tNorm} />
                <span className="align-super text-foreground/20 text-[0.35em]">%</span>
              </h2>
            </motion.div>
            <motion.p
              className="mt-4 max-w-md text-center text-xs uppercase tracking-[0.35em] text-muted/45"
              style={{ opacity: sublabelOpacity }}
            >
              18% baseline → 7.8% as systems landed — the number moves, not the
              slide deck
            </motion.p>
          </div>
        </div>
      </div>

      <motion.div
        style={{ opacity: sectionOpacity }}
        className="relative mx-auto max-w-7xl px-6 pb-32"
      >
        <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-muted/40">
          The Logic · Node 02
        </p>

        <div className="mb-6 flex items-end gap-3">
          <span className="font-serif text-4xl text-muted/35 line-through decoration-accent/50 md:text-5xl">
            18%
          </span>
          <span className="text-2xl text-muted/30">→</span>
          <span className="font-serif text-4xl text-accent md:text-5xl">7.8%</span>
        </div>

        <motion.div style={{ y }} className="grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-serif text-2xl font-semibold text-foreground/90">
              Return rate · platform scale
            </h3>
            <p className="leading-relaxed text-muted/70">
              A measured drop in successful returns and customer-facing
              performance — from vendor accountability, ISO size discipline,
              and digital color alignment, not from hero slides.
            </p>
          </div>

          <ol className="space-y-0">
            {[
              {
                n: "01",
                title: "Root Cause Audit",
                body: "A majority of returns: “not as described.” Size chart drift across vendors before standardisation.",
              },
              {
                n: "02",
                title: "ISO Size Protocol",
                body: "ISO 4416:1981 baselines extended across 300+ fashion suppliers.",
              },
              {
                n: "03",
                title: "Vendor Scorecard",
                body: "Non-conformance tied to listing and program allocation so behavior changed at the P&L.",
              },
            ].map((step, i) => (
              <li
                key={step.n}
                className={`border-l-2 border-accent/25 py-4 pl-5 ${
                  i < 2 ? "border-b border-b-white/[0.04]" : ""
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent/60">
                  {step.n} · {step.title}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted/65">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          style={{ y: statY }}
          className="mt-20 grid grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-4"
        >
          {[
            { v: "300+", l: "Vendors in program" },
            { v: "→7.8%", l: "Return floor achieved" },
            { v: "18 mo", l: "Execution window" },
            { v: "Lakhs", l: "Sellers · ecosystem" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-background/95 px-6 py-5 text-left md:px-8 md:py-6"
            >
              <p className="font-serif text-2xl font-bold text-accent md:text-3xl">
                {s.v}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-muted/50">
                {s.l}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
