"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, CV_URL } from "@/lib/site";
import { TextHover } from "@/components/ui/TextHover";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.1] bg-black/68 backdrop-blur-xl"
          : "border-b border-white/[0.08] bg-black/42 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-95"
        >
          <TextHover
            text="VED"
            className="font-serif text-xl font-semibold tracking-wider"
            letterClassName="text-foreground/90"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] uppercase tracking-[0.25em] transition-colors duration-200"
              >
                <TextHover
                  text={link.label}
                  letterClassName="text-muted/70"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* CV Button — gold gradient border */}
        <a
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block"
        >
          <div
            className="rounded-full p-[1px]"
            style={{
              background:
                "linear-gradient(135deg, #d4af37 0%, #3a2d0a 50%, #c9a227 100%)",
            }}
          >
            <span className="flex items-center gap-2 rounded-full bg-background px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent transition-colors duration-300 hover:bg-accent/10">
              Download CV
            </span>
          </div>
        </a>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-[5px] md:hidden"
        >
          <span
            className={`block h-[1px] w-6 bg-foreground/70 transition-all duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[1px] w-4 bg-foreground/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-[1px] w-6 bg-foreground/70 transition-all duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.05] bg-black/80 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-0 px-6 pb-6 pt-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-[11px] uppercase tracking-[0.3em] text-muted/70 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4">
                <a
                  href={CV_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] uppercase tracking-[0.25em] text-accent"
                >
                  Download CV →
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
