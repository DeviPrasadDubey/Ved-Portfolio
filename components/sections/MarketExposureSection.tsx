"use client";
import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import {
  EXPOSURE_MARKETS,
  PRODUCTION_MARKETS,
  ALL_MARKETS,
  type Mode,
  type MarketEntry,
} from "@/lib/market-data";

const Globe3D = dynamic(
  () => import("@/components/background/Globe3D").then((m) => ({ default: m.Globe3D })),
  { ssr: false },
);
const MARKET_SECTION_IN_VIEW_THRESHOLD = 0.35;

function AnimatedNumericValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  const match = value.match(/^(\$?)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numberPart = match?.[2];
  const suffix = match?.[3] ?? "";
  const parsed = numberPart ? Number(numberPart) : NaN;
  const decimals = numberPart?.includes(".") ? numberPart.split(".")[1]?.length ?? 0 : 0;

  useEffect(() => {
    if (!inView || Number.isNaN(parsed)) return;
    if (reduce) {
      const frame = requestAnimationFrame(() => setCount(parsed));
      return () => cancelAnimationFrame(frame);
    }

    const duration = 2000;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setCount(parsed * eased);
      if (p < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, parsed, reduce]);

  if (!match || Number.isNaN(parsed)) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

/* ─── Empty state panel ────────────────────────────────────────────────── */
function EmptyPanel({ mode }: { mode: Mode }) {
  const isProd = mode === "production";
  const stats = isProd
    ? [{ val: "4", lbl: "Countries" }, { val: "50+", lbl: "Factories" }, { val: "APAC", lbl: "Region" }]
    : [{ val: "11", lbl: "Markets" }, { val: "$200M+", lbl: "Managed" }, { val: "9+", lbl: "Regions" }];

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full min-h-[280px] flex-col justify-between py-2"
    >
      <div>
        <div className="mb-2 h-px w-12" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.55), transparent)" }} />
        <p className="text-[9px] uppercase tracking-[0.48em] text-muted/38">
          {isProd ? "APAC Production Network" : "Global Brand Partnerships"}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-bold leading-snug text-foreground/90">
          {isProd
            ? <>Handled Production<br />Operations across<br />APAC Region</>
            : <>Delivering Quality<br />Across 11 Global<br />Markets</>
          }
        </h3>
        <p className="mt-4 max-w-[340px] text-[13px] leading-[1.85] text-muted/50">
          {isProd
            ? "End-to-end oversight across India, Bangladesh, China & Sri Lanka — 50+ factory partnerships with AQL inspections, social compliance, and LEAN consultancy."
            : "Eleven years building quality frameworks across Americas, Europe, West Asia, South Asia and APAC — factory floors to global boardrooms."
          }
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6">
        {stats.map(({ val, lbl }) => (
          <div key={lbl} className="relative overflow-hidden rounded-sm border border-zinc-500/35 bg-accent/5 px-3 py-2">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 20%, rgba(212,175,55,0.12), rgba(212,175,55,0.03) 48%, transparent 78%)",
              }}
              animate={{ opacity: [0.22, 0.48, 0.22], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="relative overflow-hidden font-serif text-2xl font-bold leading-none text-accent">
              <AnimatedNumericValue value={val} />
            </p>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <p className="mt-1.5 text-[7.5px] uppercase tracking-[0.3em] text-muted/36">{lbl}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.14))" }} />
        <p className="text-[8.5px] uppercase tracking-[0.38em] text-muted/28">Click a marker to explore</p>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.14), transparent)" }} />
      </div>
    </motion.div>
  );
}

/* ─── Market detail panel ──────────────────────────────────────────────── */
function MarketPanel({ market, onClose }: { market: MarketEntry; onClose: () => void }) {
  const isProd = market.mode === "production";

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-sm"
      style={{
        background: "rgba(8,8,12,0.9)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: `1px solid ${market.color}28`,
        boxShadow: `0 32px 80px -20px rgba(0,0,0,0.72), 0 0 0 1px ${market.color}10`,
      }}
    >
      {/* Top colour stripe */}
      <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${market.color}, transparent)` }} />

      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${market.color}0d, transparent 58%)` }}
      />

      {/* Header */}
      <div className="relative flex shrink-0 items-start justify-between px-6 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <p className="mb-1 text-[8px] uppercase tracking-[0.48em]" style={{ color: `${market.color}88` }}>
            {market.region}{isProd && " · Production Operations"}
          </p>
          <h3 className="font-serif text-[1.55rem] font-bold leading-tight" style={{ color: market.color }}>
            {market.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-0.5 cursor-pointer rounded px-1.5 py-1 text-lg leading-none text-muted/30 transition-colors hover:text-muted/70"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Brand list */}
      <div className="relative flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {market.brands.map((b, i) => (
          <motion.div
            key={b.name}
            className="flex gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 + i * 0.065, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: market.color }} />
            <div>
              <p className="text-[13px] font-medium leading-snug text-foreground/88">{b.name}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted/46">{b.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative shrink-0 px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-[8px] uppercase tracking-[0.38em] text-muted/26">
          {isProd
            ? "50+ factory partnerships · AQL & social compliance"
            : "11+ years · Global quality leadership"
          }
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Globe canvas fallback ────────────────────────────────────────────── */
function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-[9px] uppercase tracking-[0.42em] text-muted/28">Loading globe…</p>
    </div>
  );
}

/* ─── Section ──────────────────────────────────────────────────────────── */
export function MarketExposureSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionInView = useInView(sectionRef, { amount: MARKET_SECTION_IN_VIEW_THRESHOLD });
  const [mode, setMode] = useState<Mode>("exposure");
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [focusTick, setFocusTick] = useState(0);

  const selectedMarket = ALL_MARKETS.find((market) => market.id === selectedMarker) ?? null;
  const visibleModeMarkets = mode === "exposure" ? EXPOSURE_MARKETS : PRODUCTION_MARKETS;

  const handleCountryFocus = useCallback((id: string) => {
    setSelectedMarker(id);
    setIsRotating(false);
    setFocusTick((tick) => tick + 1);
  }, []);

  const handleResumeRotation = useCallback(() => {
    setSelectedMarker(null);
    setIsRotating(sectionInView);
  }, [sectionInView]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!sectionInView) {
        setIsRotating(false);
        return;
      }

      if (!selectedMarker) {
        setIsRotating(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [sectionInView, selectedMarker]);

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    setSelectedMarker(null);
    setIsRotating(sectionInView);
  }, [sectionInView]);

  return (
    <section ref={sectionRef} id="market-exposure" className="relative overflow-hidden bg-background py-12 md:h-screen md:py-0">

      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 900, height: 450, background: "radial-gradient(ellipse, rgba(212,175,55,0.075) 0%, rgba(212,175,55,0.02) 45%, transparent 68%)" }}
      />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col px-4 py-6 md:px-6 md:py-12">

        {/* ── Dual mode headings ── */}
        <div className="mb-4 flex shrink-0 flex-wrap items-baseline gap-2 md:mb-6 md:gap-6">
          <button
            type="button"
            onClick={() => handleModeChange("exposure")}
            className="cursor-pointer font-serif font-bold tracking-tight transition-all duration-500"
            style={{
              fontSize: "clamp(1.45rem, 2.6vw, 2.75rem)",
              lineHeight: 1,
              color: mode === "exposure" ? "#D4AF37" : "rgba(245,245,245,0.2)",
              textShadow: mode === "exposure"
                ? "0 0 64px rgba(212,175,55,0.55), 0 0 22px rgba(212,175,55,0.38), 0 0 6px rgba(212,175,55,0.55)"
                : "none",
            }}
          >
            Market Exposure
          </button>

          <span
            className="select-none font-light text-muted/20"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 2rem)" }}
            aria-hidden
          >
            ·
          </span>

          <button
            type="button"
            onClick={() => handleModeChange("production")}
            className="cursor-pointer font-serif font-bold tracking-tight transition-all duration-500"
            style={{
              fontSize: "clamp(1.45rem, 2.6vw, 2.75rem)",
              lineHeight: 1,
              color: mode === "production" ? "#D4AF37" : "rgba(245,245,245,0.2)",
              textShadow: mode === "production"
                ? "0 0 64px rgba(212,175,55,0.55), 0 0 22px rgba(212,175,55,0.38), 0 0 6px rgba(212,175,55,0.55)"
                : "none",
            }}
          >
            Production Operations
          </button>
        </div>

        {/* ── Main content: Globe (left) + Panel (right) ── */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:gap-12">

          {/* Globe column — 60% width on desktop */}
          <div className="flex min-h-0 flex-col lg:w-[54%]">
            <motion.div
              className="relative h-[52vh] min-h-[320px] overflow-hidden border border-white/[0.05] md:min-h-0 md:flex-1"
              style={{
                background: "linear-gradient(160deg, #040408 0%, #060810 50%, #040408 100%)",
                touchAction: "none",
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Suspense fallback={<GlobeFallback />}>
                <Globe3D
                  mode={mode}
                  selectedId={selectedMarker}
                  isRotating={isRotating}
                  sectionVisible={sectionInView}
                  focusTick={focusTick}
                  onMarkerClick={handleCountryFocus}
                  onBackgroundClick={handleResumeRotation}
                />
              </Suspense>

              <p className="absolute bottom-3 right-3 text-[8px] uppercase tracking-[0.2em] text-muted/20 md:right-4 md:tracking-[0.3em]">
                {isRotating ? "Auto rotating · click marker" : "Focused mode · click empty globe to resume"}
              </p>

              {!isRotating && (
                <button
                  type="button"
                  onClick={handleResumeRotation}
                  className="absolute left-3 top-3 border border-[#ff5a1f66] bg-black/55 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-[#ffb08a] transition-colors hover:border-[#ff5a1faa] hover:text-[#ffd5bf] md:left-4 md:top-4 md:tracking-[0.28em]"
                >
                  Resume Rotation
                </button>
              )}

              {/* Corner accent marks */}
              <div className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l border-t border-accent/20" />
              <div className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r border-t border-accent/20" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l border-accent/20" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b border-r border-accent/20" />
            </motion.div>

            {/* Chip navigation */}
            <div className="mt-3 grid shrink-0 auto-cols-fr grid-flow-col grid-rows-2 gap-2 pb-1">
              {visibleModeMarkets.map((market) => (
                <motion.button
                  key={market.id}
                  type="button"
                  onClick={() => handleCountryFocus(market.id)}
                  layout
                  className="cursor-pointer border px-3 py-2 text-[9px] uppercase tracking-[0.2em] transition-all duration-300 md:tracking-[0.28em] hover:brightness-110 hover:shadow-[0_0_22px_-6px_rgba(212,175,55,0.22)]"
                  style={{
                    borderColor: selectedMarker === market.id ? `${market.color}60` : "rgba(255,255,255,0.07)",
                    color: selectedMarker === market.id ? market.color : "rgba(245,245,245,0.42)",
                    background: selectedMarker === market.id ? `${market.color}0d` : "transparent",
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  {market.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Panel column — 40% width on desktop */}
          <div className="min-h-0 lg:w-[34%] lg:pl-8">
            <AnimatePresence mode="wait">
              {selectedMarket ? (
                <MarketPanel
                  key={selectedMarket.id}
                  market={selectedMarket}
                  onClose={handleResumeRotation}
                />
              ) : (
                <EmptyPanel key={`empty-${mode}`} mode={mode} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
