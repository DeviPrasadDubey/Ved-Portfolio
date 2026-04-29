"use client";

import { useSyncExternalStore } from "react";

const query = "(max-width: 767px)";

function subscribe(onStoreChange: () => void) {
  const m = window.matchMedia(query);
  m.addEventListener("change", onStoreChange);
  return () => m.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(query).matches;
}

function getServerSnapshot() {
  return false;
}

/** <768px — hero stack, fit accordion, no form tilt. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
