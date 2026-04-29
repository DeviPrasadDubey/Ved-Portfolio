"use client";
import { motion, LayoutGroup } from "framer-motion";

const ROWS: {
  layoutId: string;
  label: string;
  value: string;
  target: string;
}[] = [
  {
    layoutId: "soul-units",
    label: "Cumulative quality impact",
    value: "30,000,000+ units",
    target: "scale",
  },
  {
    layoutId: "soul-returns",
    label: "Return optimization",
    value: "18% → 7.8%",
    target: "impact",
  },
  {
    layoutId: "soul-footprint",
    label: "Global footprint",
    value: "4 countries · 50+ factories",
    target: "expertise",
  },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function DataSoulFooter() {
  return (
    <LayoutGroup>
      <footer
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-gradient-to-t from-background via-background/95 to-background/20 pb-[env(safe-area-inset-bottom,0px)] pt-2"
        aria-label="Cumulative quality impact"
      >
        <div className="pointer-events-auto mx-auto flex max-w-6xl flex-col gap-1 px-2 sm:px-6">
          <p className="sr-only sm:not-sr-only sm:mb-0.5 sm:text-[7px] sm:uppercase sm:tracking-[0.4em] sm:text-muted/40">
            Data soul · live counters
          </p>
          <ul className="grid grid-cols-3 gap-0.5 sm:gap-2">
            {ROWS.map((r) => (
              <li key={r.target} className="min-w-0">
                <motion.button
                  type="button"
                  layout
                  layoutId={r.layoutId}
                  onClick={() => scrollToId(r.target)}
                  data-magnetic
                  className="flex w-full min-h-[3.25rem] flex-col items-center justify-center rounded border border-white/[0.07] bg-black/50 px-1 py-1 text-center transition-colors hover:border-accent/45 hover:bg-white/[0.05] sm:min-h-0 sm:px-2 sm:py-2.5"
                >
                  <span className="max-w-full truncate text-[5px] uppercase leading-tight tracking-[0.18em] text-muted/45 sm:mb-0.5 sm:text-[7px] sm:tracking-[0.25em]">
                    {r.label}
                  </span>
                  <span
                    className="mt-0.5 font-mono text-[6px] leading-tight text-accent/95 [text-wrap:balance] sm:mt-1 sm:text-[8px] md:text-[9px]"
                    title={`Scroll to #${r.target}`}
                  >
                    {r.value}
                  </span>
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </LayoutGroup>
  );
}
