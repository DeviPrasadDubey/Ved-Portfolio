"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readTime?: string;
  publishedAt?: string;
  themeColor?: string;
  featured?: boolean;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  readTime,
  publishedAt,
  themeColor,
  featured,
}: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    damping: 30,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    damping: 30,
    stiffness: 200,
  });

  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const accent = themeColor ?? "#c9a44c";
  const dateStr = publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(publishedAt))
    : null;

  return (
    <Link href={`/blogs/${slug}`} className="block">
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300"
      >
        {/* Mouse spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(280px circle at ${spotlightX} ${spotlightY}, ${accent}18, transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{
            background: `radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), ${accent}12, transparent 70%)`,
          }}
        />

        {featured && (
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.3em]"
            style={{
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}44`,
            }}
          >
            Featured
          </span>
        )}

        <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted/50">
          {category && <span>{category}</span>}
          {dateStr && (
            <>
              <span className="opacity-40">·</span>
              <span>{dateStr}</span>
            </>
          )}
          {readTime && (
            <>
              <span className="opacity-40">·</span>
              <span>{readTime}</span>
            </>
          )}
        </div>

        <h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-foreground/90 transition-colors group-hover:text-accent">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-muted/70">{excerpt}</p>

        <div
          className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] transition-colors"
          style={{ color: accent }}
        >
          Read essay
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
}
