"use client";
import { motion } from "framer-motion";

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative border-t border-white/[0.05] bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-center md:flex-row md:px-6 md:text-left">
        {/* left: wordmark + copyright */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start md:gap-3">
          <div className="h-px w-5 bg-gradient-to-r from-accent/60 to-accent/10" />
          <p className="font-serif text-sm font-semibold uppercase tracking-[0.28em] text-accent/70">
            VPD
          </p>
          <span className="text-muted/20">·</span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted/35 md:tracking-[0.3em]">
            © 2025 Ved Prakash Dwivedi
          </p>
        </div>

        {/* right: back to top */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-muted/40 transition-colors hover:text-accent/75 md:tracking-[0.42em]"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ↑
          </motion.span>
          Back to top
        </motion.button>
      </div>
    </footer>
  );
}
