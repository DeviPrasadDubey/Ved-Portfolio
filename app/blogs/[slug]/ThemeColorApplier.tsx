"use client";
import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemeColorApplier({ color }: { color?: string }) {
  useThemeColor(color);
  return null;
}
