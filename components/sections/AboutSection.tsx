"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* ─── Carousel data ───────────────────────────────────────────────────── */
const SLIDES = [
  { src: "/images/ved1.jpeg", caption: "Warm Reception" },
  { src: "/images/ved6.jpeg", caption: "Floor Review" },
  { src: "/images/ved7.jpeg", caption: "Tailored Style" },
  { src: "/images/ved2.jpeg", caption: "Deep Search" },
  { src: "/images/ved8.jpeg", caption: "Vendor Dinner" },
  { src: "/images/ved3.jpeg", caption: "Global Synergy" },
  { src: "/images/ved9.jpeg", caption: "Peak Pursuit" },
  { src: "/images/ved4.jpeg", caption: "Storm Standing" },
  { src: "/images/ved5.jpeg", caption: "Partner Table" },
] as const;

const N = SLIDES.length;

/* ─── Position table: index 0 = far-left … 4 = far-right, 2 = center ── */
const POS: {
  dx: number;
  ry: number;
  sc: number;
  op: number;
  zi: number;
}[] = [
    { dx: -370, ry: 52, sc: 0.57, op: 0.07, zi: 1 },
    { dx: -205, ry: 38, sc: 0.76, op: 0.20, zi: 2 },
    { dx: 0,    ry: 0,  sc: 1.00, op: 1.00, zi: 5 },
    { dx: 205,  ry: -38, sc: 0.76, op: 0.20, zi: 2 },
    { dx: 370,  ry: -52, sc: 0.57, op: 0.07, zi: 1 },
  ];

const CARD_W = 420;
const CARD_H = 370;

function relativePos(i: number, center: number): number {
  let d = (i - center + N) % N;
  if (d > Math.floor(N / 2)) d -= N;
  return d;
}

/* ─── 3D Coverflow ───────────────────────────────────────────────────── */
function Coverflow() {
  const [center, setCenter] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setCenter((p) => (p + 1) % N), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function prev() { setCenter((p) => (p - 1 + N) % N); }
  function next() { setCenter((p) => (p + 1) % N); }

  const cardW = isMobile ? 290 : CARD_W;
  const cardH = isMobile ? 300 : CARD_H;
  const positions = isMobile
    ? [
        { dx: -120, ry: 25, sc: 0.82, op: 0.14, zi: 1 },
        { dx: -65, ry: 15, sc: 0.9, op: 0.3, zi: 2 },
        { dx: 0, ry: 0, sc: 1.0, op: 1.0, zi: 5 },
        { dx: 65, ry: -15, sc: 0.9, op: 0.3, zi: 2 },
        { dx: 120, ry: -25, sc: 0.82, op: 0.14, zi: 1 },
      ]
    : POS;

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <div
        className="relative overflow-visible"
        style={{ width: cardW, height: cardH + 38, perspective: 1000, maxWidth: "100%" }}
      >
        {SLIDES.map((slide, i) => {
          const rel = relativePos(i, center);
          const visible = Math.abs(rel) <= 2;
          const clamp = Math.max(-2, Math.min(2, rel));
          const p = positions[clamp + 2];

          return (
            <motion.div
              key={slide.src}
              className="absolute cursor-pointer"
              style={{
                width: cardW,
                height: cardH,
                left: "50%",
                top: 0,
                transformStyle: "preserve-3d",
                zIndex: visible ? p.zi : 0,
              }}
              animate={
                reduce
                  ? { opacity: rel === 0 ? 1 : 0 }
                  : {
                    x: p.dx - cardW / 2,
                    rotateY: p.ry,
                    scale: p.sc,
                    opacity: visible ? p.op : 0,
                  }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
                opacity: { duration: 0.35 },
              }}
              onClick={() => setCenter(i)}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                style={{
                  boxShadow:
                    rel === 0
                      ? "0 32px 90px -16px rgba(0,0,0,0.88), 0 0 0 1px rgba(212,175,55,0.22)"
                      : "0 12px 32px -8px rgba(0,0,0,0.55)",
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.caption}
                  fill
                  sizes={`(max-width: 768px) 100vw, ${cardW}px`}
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                {rel === 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: "1px solid rgba(212,175,55,0.30)" }}
                  />
                )}
              </div>

              {rel === 0 && (
                <motion.p
                  className="mt-3 text-center text-[11px] uppercase tracking-[0.32em]"
                  style={{ color: "rgba(245,245,245,0.78)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {slide.caption}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* controls */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={prev}
          className="text-sm text-accent/40 transition-colors hover:text-accent/80"
          aria-label="Previous"
        >
          ‹
        </button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCenter(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: center === i ? 24 : 8,
              background:
                center === i
                  ? "rgba(212,175,55,0.85)"
                  : "rgba(212,175,55,0.22)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
        <button
          onClick={next}
          className="text-sm text-accent/40 transition-colors hover:text-accent/80"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ─── About section ──────────────────────────────────────────────────── */
export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background pb-20 pt-12 md:pb-28 md:pt-16"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />

      {/* ── Section header ── */}
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <SectionHeading title="STORY" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 md:flex-row md:items-start md:gap-[5%] md:px-6">

        {/* ── LEFT — editorial text column ── */}
        <div className="w-full md:w-[46%]">


          {/* thin accent rule */}
          <motion.div
            className="mb-9 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.06) 60%, transparent 100%)",
              width: 72,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* body paragraphs — each with a subtle left accent */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="border-l border-accent/20 pl-4 text-sm leading-[1.9] text-muted/65 text-justify hyphens-auto">
              Eleven years across factory floors, compliance audits, and global
              boardrooms have shaped one conviction — exceptional teams are the
              backbone of every supply chain. I work at the intersection of
              operational grit and high-level strategy, building the people and
              the processes that move global markets.
            </p>

            <p className="border-l border-white/[0.08] pl-4 text-sm leading-[1.9] text-muted/60 text-justify hyphens-auto">
              My career began in Merchandising: mastering T&amp;A management,
              PO execution, and post-shipment relations from the ground up. From
              yarn count to final AQL pass — that floor-level precision is the
              lens through which I lead today.
            </p>

            <p className="border-l border-white/[0.08] pl-4 text-sm leading-[1.9] text-muted/60 text-justify hyphens-auto">
              The results followed:{" "}
              <span className="text-accent/85 font-medium">
                directing A&amp;F&apos;s $200M South Asia program
              </span>
              ; rebuilding Snapdeal&apos;s QMS to move bad ratings from{" "}
              <span className="text-accent/85 font-medium">20–25% → 15–18%</span>{" "}
              and cut returns from{" "}
              <span className="text-accent/85 font-medium">8–10% → 3–5%</span>
              ; opening Geo-Chem inspection offices in Bangladesh &amp; China; and
              launching HQTS&apos;s LEAN consultancy from a blank page.
            </p>

            <p className="border-l border-white/[0.08] pl-4 text-sm leading-[1.9] text-muted/50 italic text-justify hyphens-auto">
              Supply chain is a relationship business. Whether on a factory floor
              in Colombo or in a global boardroom — I don&apos;t just manage data.
              I lead the people who make it possible.
            </p>
          </motion.div>

          {/* metrics strip */}
          <motion.div
            className="mt-9 grid grid-cols-2 gap-y-4 border-t border-white/[0.07] pt-6 md:grid-cols-4 md:gap-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.32 }}
          >
            {[
              { value: "11+", label: "Years" },
              { value: "9", label: "Markets" },
              { value: "50+", label: "Factories" },
              { value: "3–5%", label: "Returns RPR" },
            ].map(({ value, label }, idx) => (
              <div
                key={label}
                className="pr-4"
                style={{
                  borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  paddingLeft: idx > 0 ? 16 : 0,
                }}
              >
                <p className="font-serif text-[1.35rem] font-bold text-accent leading-none">
                  {value}
                </p>
                <p className="mt-1.5 text-[7.5px] uppercase tracking-[0.3em] text-muted/40">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT — Coverflow ── */}
        <motion.div
          className="flex w-full justify-center overflow-hidden pt-8 md:w-[54%] md:pt-20"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <Coverflow />
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
    </section>
  );
}
