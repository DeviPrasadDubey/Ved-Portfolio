"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

type TextHoverProps = {
  text: string;
  className?: string;
  letterClassName?: string;
  as?: "span" | "div" | "p";
};

function useFinePointer() {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const u = () => setOk(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return ok;
}

/**
 * Letter-level hover: scale + gold as the pointer sweeps each glyph.
 * On touch / coarse pointer, renders plain text.
 */
export function TextHover({
  text,
  className = "",
  letterClassName = "text-muted/65",
  as: Tag = "span",
}: TextHoverProps) {
  const isMobile = useIsMobile();
  const fine = useFinePointer();
  const chars = text.split("");

  if (isMobile || !fine) {
    return (
      <Tag className={className} data-cursor="pointer">
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={`inline-flex flex-wrap items-baseline ${className}`}
      aria-label={text}
    >
      {chars.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={`sp-${i}`} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );
        }
        return (
          <motion.span
            key={`${ch}-${i}`}
            className={`inline-block font-inherit will-change-transform ${letterClassName}`}
            whileHover={{ scale: 1.3, color: "#D4AF37" }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.2 }}
          >
            {ch}
          </motion.span>
        );
      })}
    </Tag>
  );
}
