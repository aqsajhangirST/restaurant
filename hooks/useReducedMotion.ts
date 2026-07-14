"use client";

import { useContext } from "react";
import { ReducedMotionContext } from "@/providers/ReducedMotionProvider";

/**
 * Single source of truth for "should motion be reduced right now."
 * Combines the OS-level `prefers-reduced-motion` media query with an
 * in-app manual override, so a user who wants the calmer experience isn't
 * forced to change an OS setting to get it.
 *
 * Every ambient/parallax/particle system in the experience should read
 * this hook (directly or via a prop threaded down from it) and provide a
 * static fallback when it's true — see design-system.md §"Motion always
 * yields to prefers-reduced-motion."
 */
export function useReducedMotion() {
  const ctx = useContext(ReducedMotionContext);
  if (!ctx) {
    throw new Error(
      "useReducedMotion must be used within <ReducedMotionProvider>"
    );
  }
  return ctx;
}
