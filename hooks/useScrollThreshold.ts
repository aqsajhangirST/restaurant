"use client";

import { useEffect, useState } from "react";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";

/**
 * Turns the raw scroll-progress ref (read every frame, no re-renders) into
 * a single boolean DOM components can actually react to: "has the user
 * scrolled past this point yet." Polls via requestAnimationFrame but only
 * calls setState when the boolean's value actually flips — React bails
 * out of re-rendering on a same-value setState, so this stays cheap even
 * though the poll itself runs every frame.
 *
 * `hysteresis` avoids flicker right at the boundary (e.g. a user scrolling
 * back and forth exactly at the threshold) by requiring a small buffer
 * before flipping back to `false`.
 */
export function useScrollThreshold(threshold: number, hysteresis = 0.02) {
  const { progressRef } = useScrollTimeline();
  const [past, setPast] = useState(false);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      const p = progressRef.current;
      setPast((prev) => {
        if (p > threshold) return true;
        if (p < threshold - hysteresis) return false;
        return prev;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [threshold, hysteresis, progressRef]);

  return past;
}
