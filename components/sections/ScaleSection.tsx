"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VED_IMPACT_METRICS, VED_MILESTONES } from "@/lib/ved-content";

export function ScaleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const midY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const fgY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const parallaxNudge = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background py-36"
    >
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 scale-110"
      >
        <div
          className="h-full w-full bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('/supply-map.png')" }}
        />
      </motion.div>

      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="h-full w-full opacity-[0.03]"
          style={{
            backgroundImage:
              "url('/logistics-route.png'), radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,164,76,0.15), transparent)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative mx-auto max-w-7xl px-6"
      >
        <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-muted/40">
          The Scale · Node 03
        </p>

        <motion.div style={{ y: fgY }} className="mb-16 select-none">
          <h2
            className="bg-clip-text text-transparent"
            style={{
              fontSize: "min(16vw, 12rem)",
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              WebkitTextFillColor: "transparent",
              backgroundImage:
                "url('/logistics-route.png'), linear-gradient(120deg, #c9a44c, #8b6914 60%, #c9a44c)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            SCALE
          </h2>
        </motion.div>

        <div className="mb-16 max-w-2xl border-l-2 border-accent/30 pl-6">
          <h3 className="mb-3 font-serif text-2xl font-semibold text-foreground/90 md:text-3xl">
            Abercrombie &amp; Fitch — South Asia region
          </h3>
          <p className="leading-relaxed text-muted/75">
            $200M+ program volume, 20+ India · 15+ Bangladesh · 15+ Sri Lanka
            factory relationships — heritage denim, active, accessories — with
            capacity plans that avoid overloading any single gate.
          </p>
        </div>

        <motion.div
          style={{ y: parallaxNudge }}
          className="mb-20 grid border-y border-white/[0.1] sm:grid-cols-2 lg:grid-cols-4"
        >
          {VED_IMPACT_METRICS.map((m) => (
            <div
              key={m.label}
              className="border-b border-white/[0.08] py-8 text-left sm:border-b-0 sm:border-r sm:last:border-r-0 sm:last:border-b-0"
            >
              <p
                className="font-serif text-3xl font-bold text-accent md:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {m.value}
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/75">
                {m.label}
              </p>
              <p className="mt-1 text-[9px] leading-snug text-muted/55">
                {m.sub}
              </p>
            </div>
          ))}
        </motion.div>

        <div>
          <p className="mb-8 text-[9px] uppercase tracking-[0.4em] text-muted/50">
            Milestones &amp; hard credentials
          </p>
          <ul className="divide-y divide-white/[0.08]">
            {VED_MILESTONES.map((m) => (
              <li key={m.name} className="flex flex-col gap-1 py-6 first:pt-0 md:flex-row md:items-baseline md:gap-12">
                <span className="shrink-0 text-[9px] uppercase tracking-[0.35em] text-accent/70">
                  {m.label}
                </span>
                <p className="font-serif text-lg text-foreground/90 md:text-xl">
                  {m.name}
                </p>
                <p className="md:ml-auto md:max-w-xs md:text-right text-sm text-muted/60">
                  {m.context}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
