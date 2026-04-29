"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ERAS = [
  {
    id: "mectech",
    period: "2014 – Feb 2017",
    company: "Mectech International",
    role: "Merchandiser",
    location: "Gurugram, India",
    color: "#22d3ee",
    highlight: null,
    points: [
      "Started career in merchandising — mastered the full commercial lifecycle of a product.",
      "T&A management, production follow-up, sampling, PO execution, and post-shipment customer relations.",
      "Costing, order allocation, and cross-functional delivery coordination.",
      "Built foundational knowledge of garment manufacturing, vendor communication, and buyer expectations.",
    ],
  },
  {
    id: "geochem",
    period: "Feb 2017 – Dec 2020",
    company: "Geo-Chem Laboratories Pvt. Ltd.",
    role: "Inspector → Sr. Inspector → Dy Technical Manager",
    location: "Gurugram, India",
    color: "#22d3ee",
    highlight: null,
    points: [
      "Joined as Quality Inspector; promoted to Sr Inspector (6 months) and Dy Technical Manager.",
      "Started inspection / audit offices in Bangladesh and China — recruited local inspectors and auditors.",
      "Categories: Garments · Footwear · Fabric · Home Textiles · Electronics · Cosmetics.",
      "Brands served: Woolworths (AU) · Walmart (USA) · Bel&Bo (Belgium) · Amazon · Flipkart · Mufti.",
      "Built SOPs, manuals, and training programs for inspectors, auditors, and factory teams.",
    ],
  },
  {
    id: "hqts",
    period: "Dec 2020 – Nov 2021",
    company: "HQTS Group",
    role: "Quality & Compliance Manager",
    location: "Gurugram, India",
    color: "#D4AF37",
    highlight: null,
    points: [
      "Quality, Compliance, and Audit Head — India office.",
      "30+ inspectors, supervisors, and technical managers across India, Pakistan, Sri Lanka, Turkey, West Asia, EU.",
      "ISO 17020 compliance · Social audits for Bunzl (Sedex & SA8000 basis).",
      "Built a consultancy division for LEAN, Kaizen, data-driven QMS, RCA tools, and CAPA.",
    ],
  },
  {
    id: "snapdeal",
    period: "Nov 2021 – Jun 2024",
    company: "Snapdeal",
    role: "Manager — Quality Assurance",
    location: "Gurugram, India",
    color: "#D4AF37",
    highlight: "18% → 7.8%",
    highlightLabel: "Customer Return Rate",
    points: [
      "Marketplace phase: deep-dived data — selected low-performing sellers by return rates, bad reviews %, and avg sales.",
      "Executed CAP via portal corrections, on-site audits at seller premises, lab claim testing, and seller/manufacturer CAP.",
      "Reduced customer return ratio from 18% to 7.8% in fashion across 300+ vendors.",
      "Private-label phase: Built quality org from zero across garments, footwear, homes (hard & soft), electronics accessories, fashion accessories, cosmetics.",
      "Team: 6 QA/Dy Managers, 5–6 QCs, 10–12 Warehouse QCs · Private-label bad ratings 8–10% vs. platform avg 15–18%.",
      "Machate Raho Award 2024 (Acevector Ltd.) — milestone of excellence.",
    ],
  },
  {
    id: "anf",
    period: "Jun 2024 – Present",
    company: "Abercrombie & Fitch",
    role: "Quality Head – South Asia",
    location: "Gurugram, India",
    color: "#D4AF37",
    highlight: "$200M+",
    highlightLabel: "Program Value",
    points: [
      "Directing the South Asia quality program — India, Sri Lanka, Bangladesh.",
      "Managing 350+ dedicated QA staff via buying agent network across the region.",
      "Full accountability for product quality, compliance, and vendor performance on a $200M+ annual program.",
      "Factory development, risk-based sourcing decisions, and long-term brand partnership management.",
      "Social compliance oversight: CTPAT, SA8000, SEDEX across multi-country factory network.",
    ],
  },
] as const;

function EraCard({
  era,
}: {
  era: (typeof ERAS)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative ml-4 rounded-none border border-white/[0.07] bg-white/[0.025] p-4 md:ml-8 md:p-8"
    >
      {/* connector dot */}
      <div
        className="absolute -left-7 top-7 h-3 w-3 rounded-full border-2 md:-left-11 md:top-8"
        style={{
          borderColor: era.color,
          backgroundColor: "#050505",
          boxShadow: `0 0 12px ${era.color}55`,
        }}
      />

      {/* header */}
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.42em]"
            style={{ color: era.color + "aa" }}
          >
            {era.period}
          </p>
          <h3 className="mt-1 font-serif text-lg font-bold text-foreground md:text-2xl">
            {era.company}
          </h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-muted/60">
            {era.role}
          </p>
        </div>
        {"highlight" in era && era.highlight && (
          <div className="mt-3 shrink-0 border border-accent/30 bg-accent/8 px-4 py-2 text-center md:mt-0">
            <p className="font-serif text-3xl font-black text-accent">
              {era.highlight}
            </p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-muted/55">
              {era.highlightLabel}
            </p>
          </div>
        )}
      </div>

      {/* points */}
      <ul className="space-y-2">
        {era.points.map((pt) => (
          <li key={pt} className="flex gap-2.5 text-[13px] leading-relaxed text-muted/80 md:text-sm">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40" />
            {pt}
          </li>
        ))}
      </ul>

      {/* bottom accent */}
      <div
        className="mt-5 h-px w-full opacity-20"
        style={{
          background: `linear-gradient(90deg,${era.color},transparent)`,
        }}
      />
    </motion.div>
  );
}

export function TransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  /* progress line fills as you scroll through the section */
  const lineH = useTransform(scrollYProgress, [0.05, 0.85], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="transformation"
      data-story-node="story"
      className="section-rhythm relative bg-background"
    >
      {/* section label */}
      <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6 md:pb-10">
        <SectionHeading title="TRANSFORMATION" />
        <motion.p
          className="mt-3 max-w-xl text-sm leading-relaxed text-muted/65"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          Merchandising → inspections → compliance → e-commerce QA → enterprise leadership.
          A decade of building the operational depth that powers the A&amp;F South Asia program today.
        </motion.p>
      </div>

      {/* timeline */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative">
          {/* vertical rail */}
          <div className="absolute left-0 top-0 h-full w-px bg-white/[0.06]">
            <motion.div
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-accent via-accent/60 to-transparent"
              style={{ height: lineH }}
            />
          </div>

          {/* era cards */}
          <div className="space-y-10 pb-8">
            {ERAS.map((era) => (
              <EraCard key={era.id} era={era} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
