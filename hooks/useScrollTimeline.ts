"use client";

import { useContext } from "react";
import { ScrollTimelineContext } from "@/providers/ScrollTimelineProvider";

/**
 * The shared "how far through the experience" hook (project-architecture.md
 * §"Hooks"). Returns a ref, not a reactive value — read `.current` inside
 * a useFrame or effect, don't expect re-renders when it changes.
 */
export function useScrollTimeline() {
  const ctx = useContext(ScrollTimelineContext);
  if (!ctx) {
    throw new Error(
      "useScrollTimeline must be used within <ScrollTimelineProvider>"
    );
  }
  return ctx;
}
