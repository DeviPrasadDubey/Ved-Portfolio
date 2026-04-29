"use client";
import { useEffect } from "react";

export function useThemeColor(color?: string) {
  useEffect(() => {
    if (!color || !/^#[0-9a-fA-F]{6}$/.test(color)) return;

    document.documentElement.style.setProperty("--color-accent", color);

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    document.documentElement.style.setProperty(
      "--cursor-glow",
      `rgba(${r},${g},${b},0.55)`,
    );

    return () => {
      document.documentElement.style.removeProperty("--color-accent");
      document.documentElement.style.removeProperty("--cursor-glow");
    };
  }, [color]);
}
