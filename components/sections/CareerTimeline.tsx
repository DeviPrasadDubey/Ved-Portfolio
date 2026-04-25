"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VED_CAREER_SECTIONS } from "@/lib/ved-content";

export function CareerTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="relative bg-background py-32">
      <motion.div
        style={{ opacity }}
        className="mx-auto max-w-5xl px-6"
      >
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-muted/40">
          The Journey
        </p>
        <h2 className="mb-16 font-serif text-4xl font-semibold text-foreground/90 md:text-5xl">
          11 Years. 5 Chapters. <br />
          <span className="italic text-accent/80">No filler.</span>
        </h2>

        <motion.div style={{ y }} className="relative">
          <div className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-accent/40 via-accent/10 to-transparent md:left-[7.5rem]" />

          <ol className="space-y-0">
            {VED_CAREER_SECTIONS.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="relative border-b border-white/[0.06] py-10 pl-6 md:flex md:gap-8 md:pl-0"
              >
                <div className="shrink-0 md:w-28 md:pt-1 md:text-right">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-muted/50">
                    {item.period}
                  </span>
                </div>
                <div className="absolute left-[-4px] top-10 h-2 w-2 rounded-full bg-accent/70 ring-4 ring-background md:relative md:left-auto md:top-auto md:mt-1.5 md:shrink-0" />
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-baseline gap-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground/90">
                      {item.role}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-accent/70">
                      {item.company}
                    </span>
                  </div>
                  <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-muted/40">
                    {item.location}
                  </p>
                  <p className="text-sm leading-relaxed text-muted/75">
                    {item.description}
                  </p>
                  {item.achievement && (
                    <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-foreground/80">
                      <span className="font-serif text-sm font-bold text-accent">
                        {item.achievement}
                      </span>
                      <span className="ml-2 text-muted/55">
                        — {item.achievementLabel}
                      </span>
                    </p>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </section>
  );
}
