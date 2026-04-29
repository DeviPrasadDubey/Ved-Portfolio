"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ROLES = [
  {
    id: "qm",
    title: "Quality Manager",
    short: "QM",
    description:
      "Leading quality systems for multi-brand retail operations. Managing vendor QMS, audit frameworks, and production control across garments, footwear, and home textiles. Building cross-functional teams aligned to buyer expectations and market compliance requirements. Driving inline-to-final inspection protocols, CAPA workflows, and lab test matrices from the factory floor up.",
  },
  {
    id: "qd",
    title: "Quality Director",
    short: "QD",
    description:
      "Driving strategic quality vision across regional supply chains. Setting QMS architecture, KPI frameworks, and escalation protocols at an organisational level. Partnering with sourcing and merchandising leadership to embed quality at the point of order allocation — not just inspection. Reporting into C-suite with full data-backed risk and compliance narratives.",
  },
  {
    id: "rqd",
    title: "Regional Quality Director (APAC)",
    short: "RQD",
    description:
      "Overseeing quality performance across India, Sri Lanka, Bangladesh, China, and Indonesia. Managing multi-country audit programs, buying agency QA networks, and factory development pipelines. Full accountability for South Asia + APAC brand quality outcomes, including social compliance (SA8000, SEDEX), regulatory files, and end-customer incident prevention.",
  },
  {
    id: "som",
    title: "Sourcing Operations Manager",
    short: "SOM",
    description:
      "Integrating quality and procurement strategy to drive sustainable sourcing decisions. Vendor development, capacity planning, costing alignment, and risk-based factory allocation. Turning quality data into sourcing decisions — reducing return rates, improving landed margins, and scaling trusted factory partnerships across South and South-East Asia.",
  },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

export function FitInSection() {
  const [activeId, setActiveId] = useState<RoleId>("qm");

  const activeRole = ROLES.find((r) => r.id === activeId)!;

  return (
    <section
      id="fit-in"
      className="relative overflow-hidden bg-background py-14 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* header */}
        <div className="mb-3">
          <SectionHeading title="WHERE I FIT IN" />
        </div>
        <motion.p
          className="mb-8 max-w-xl text-sm leading-relaxed text-muted/60 md:mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Select a role to see how my experience maps to its responsibilities.
        </motion.p>

        {/* role selector buttons */}
        <motion.div
          className="mb-0 grid grid-cols-1 gap-px border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 md:grid-cols-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
        >
          {ROLES.map((role) => {
            const isActive = role.id === activeId;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveId(role.id)}
                className="relative cursor-pointer bg-background/95 px-4 py-4 text-left transition-colors duration-200 md:px-5 md:py-5"
                style={{
                  borderBottom: isActive
                    ? "2px solid rgba(212,175,55,0.7)"
                    : "2px solid transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="role-bg"
                    className="absolute inset-0 bg-accent/[0.05]"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <p
                  className="relative text-[8px] uppercase tracking-[0.45em] transition-colors duration-200"
                  style={{
                    color: isActive
                      ? "rgba(212,175,55,0.75)"
                      : "rgba(212,175,55,0.3)",
                  }}
                >
                  {role.short}
                </p>
                <p
                  className="relative mt-1 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors duration-200 md:tracking-[0.22em]"
                  style={{
                    color: isActive
                      ? "rgba(245,245,245,0.92)"
                      : "rgba(245,245,245,0.45)",
                  }}
                >
                  {role.title}
                </p>
              </button>
            );
          })}
        </motion.div>

        {/* description box */}
        <div
          className="border border-t-0 border-white/[0.06] bg-white/[0.015]"
          style={{ minHeight: 180 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              className="px-4 py-6 md:px-10 md:py-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex gap-4 md:gap-10">
                {/* left accent */}
                <div className="shrink-0 pt-1">
                  <div className="h-full w-px bg-gradient-to-b from-accent/50 to-transparent" />
                </div>
                {/* content */}
                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-[0.4em] text-accent/65">
                    {activeRole.short} · Role Scope
                  </p>
                  <h3 className="mb-3 font-serif text-xl font-semibold text-foreground/90">
                    {activeRole.title}
                  </h3>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted/70">
                    {activeRole.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
