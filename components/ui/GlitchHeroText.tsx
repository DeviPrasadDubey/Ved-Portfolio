"use client";
import { useReducedMotion } from "framer-motion";

/**
 * Technical clip-path "jitter" on hover (0.2s) for hero kinetic type.
 * No extra motion values — pure CSS; pairs with the lens cursor.
 */
export function GlitchHeroText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <span className={className}>{children}</span>;
  }
  return (
    <span
      className={`hero-glitch-wrap group inline-block [contain:paint] ${className}`}
    >
      <span className="hero-glitch-inner block will-change-transform">
        {children}
      </span>
    </span>
  );
}
