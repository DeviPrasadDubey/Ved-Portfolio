"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  VED_FIT_ROLES,
  VED_FIT_NARRATIVE_ROLES,
  type FitWorldId,
} from "@/lib/ved-content";

const worldGradients: Record<
  FitWorldId,
  { image?: string; gradient: string; grid?: boolean }
> = {
  quality: {
    image: "/factory-blueprint.png",
    gradient:
      "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(20,16,8,0.85), rgba(8,8,10,0.95))",
  },
  strategy: {
    grid: true,
    gradient:
      "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(201,164,76,0.12), rgba(8,8,10,0.98))",
  },
  vendor: {
    image: "/supply-map.png",
    gradient:
      "radial-gradient(ellipse 90% 70% at 30% 50%, rgba(201,164,76,0.1), rgba(8,8,10,0.95))",
  },
};

export function FitSection() {
  const [active, setActive] = useState<FitWorldId>("quality");
  const w = worldGradients[active];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-background"
      id="fit"
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ background: w.gradient }}
          >
            {w.image && (
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `url('${w.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
            {w.grid && (
              <div
                className="absolute inset-0 opacity-[0.2]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(201, 164, 76, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(201, 164, 76, 0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32 md:py-40">
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-muted/50">
          Node 04 — Strategic Fit
        </p>
        <h2
          className="mb-3 max-w-3xl font-serif text-4xl font-semibold leading-tight text-foreground/95 md:text-5xl"
          style={{ fontFeatureSettings: '"lnum", "pnum"' }}
        >
          The Architecture of Fit
        </h2>
        <p className="mb-14 max-w-2xl text-sm leading-relaxed text-muted/70">
          Not a generic bio. Three roles the data already answers — pick one to
          re-tune the world behind this page.
        </p>

        <div className="grid gap-12 border-t border-white/[0.08] pt-12 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-4">
            <nav
              className="flex flex-col"
              aria-label="Role profile matcher"
            >
              {VED_FIT_ROLES.map((r) => {
                const isOn = r.id === active;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setActive(r.id)}
                    className="group border-b border-white/[0.06] py-5 text-left transition-colors"
                  >
                    <span
                      className={`text-[9px] uppercase tracking-[0.4em] ${isOn ? "text-accent" : "text-muted/40"}`}
                    >
                      {r.id === "quality" && "Operations · field"}
                      {r.id === "strategy" && "Data · platform"}
                      {r.id === "vendor" && "Network · development"}
                    </span>
                    <p
                      className={`mt-1 font-serif text-lg md:text-xl ${isOn ? "text-foreground" : "text-foreground/50"}`}
                    >
                      {r.title}
                    </p>
                    {isOn && (
                      <motion.div
                        layoutId="fit-underline"
                        className="mt-2 h-px w-12 bg-accent/80"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="min-h-[280px] border-l border-white/[0.08] pl-0 md:col-span-8 md:pl-14">
            <AnimatePresence mode="wait">
              {VED_FIT_ROLES.filter((r) => r.id === active).map((r) => (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-2xl font-medium text-foreground/95 md:text-3xl">
                    {r.headline}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-foreground/85">
                    {r.why}
                  </p>
                  <p className="mt-6 border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-muted/75">
                    {r.evidence}
                  </p>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-20 border-t border-dashed border-white/[0.1] pt-10">
          <p className="mb-6 text-[9px] uppercase tracking-[0.45em] text-muted/45">
            The same 11 years — other lenses
          </p>
          <ul className="space-y-8">
            {VED_FIT_NARRATIVE_ROLES.map((row) => (
              <li key={row.title} className="max-w-3xl">
                <p className="text-[10px] uppercase tracking-[0.28em] text-accent/80">
                  {row.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted/80">
                  {row.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
