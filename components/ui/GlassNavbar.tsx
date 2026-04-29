"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/** Hover: slight zoom + each character shifts color in sequence (word-by-word feel on short labels). */
function NavAnimatedLabel({ label }: { label: string }) {
  const chars = label.split("");
  return (
    <motion.span
      className="inline-flex origin-center"
      initial="rest"
      whileHover="hover"
    >
      {chars.map((ch, i) => (
        <motion.span
          key={`${label}-${i}`}
          className="inline-block"
          variants={{
            rest: {
              color: "rgba(200, 200, 210, 0.52)",
              scale: 1,
              y: 0,
            },
            hover: {
              color: "#f5e6b8",
              scale: 1.14,
              y: -2,
              transition: {
                delay: i * 0.045,
                duration: 0.32,
                type: "spring",
                stiffness: 420,
                damping: 20,
              },
            },
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

const NAV_LINKS = [
  { label: "Story", href: "#gateway" },
  { label: "Impact", href: "#impact" },
  { label: "Fit-in", href: "#fit-in" },
  { label: "Contact", href: "#contact" },
] as const;

const RESUME_HREF = "/Ved-Resume.pdf";

export function GlassNavbar({ visible }: { visible: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 py-3 md:py-4"
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{
        background: "rgba(5,5,5,0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
        {/* wordmark */}
        <div className="flex items-center gap-2.5">
          <div
            className="h-px w-6"
            style={{
              background:
                "linear-gradient(90deg,rgba(212,175,55,0.7),rgba(212,175,55,0.2))",
            }}
          />
          <p className="font-serif text-sm font-semibold tracking-[0.22em] text-accent/88">
            Ved
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center border border-white/15 text-accent/85 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-lg leading-none">{menuOpen ? "×" : "☰"}</span>
        </button>

        {/* desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="inline-block origin-center text-[10px] uppercase tracking-[0.38em] transition-transform duration-200 ease-out hover:scale-110"
              >
                <NavAnimatedLabel label={l.label} />
              </Link>
            </li>
          ))}
          <li>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block origin-center border border-accent/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.38em] text-accent/75 transition-transform duration-200 hover:scale-105 hover:border-accent/65 hover:bg-accent/[0.07]"
            >
              <NavAnimatedLabel label="Resume" />
            </a>
          </li>
        </ul>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <motion.div
          className="border-t border-white/10 bg-[#060606f2] px-4 pb-5 pt-3 md:hidden"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={closeMenu}
                  className="block origin-center rounded border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.28em] transition-transform hover:scale-[1.03] hover:border-accent/35"
                >
                  <NavAnimatedLabel label={l.label} />
                </Link>
              </li>
            ))}
            <li>
              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="block origin-center rounded border border-accent/30 px-4 py-3 text-xs uppercase tracking-[0.28em] text-accent/80 transition-transform hover:scale-[1.02] hover:border-accent/65 hover:bg-accent/[0.07]"
              >
                <NavAnimatedLabel label="Resume" />
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}
