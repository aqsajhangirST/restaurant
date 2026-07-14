"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Smooth-scroll instance wired into GSAP's ScrollTrigger via the standard
 * Lenis + GSAP integration recipe: Lenis drives the raf loop through
 * gsap.ticker (so both stay on one clock), and ScrollTrigger.update runs
 * on every Lenis scroll tick so scrub-driven timelines (the master camera
 * path) stay in sync with the smoothed scroll position rather than the
 * raw, jumpy native one.
 *
 * When reduced motion is preferred, we skip Lenis entirely and fall back
 * to native scrolling — smoothing/inertia is itself a motion effect some
 * users want turned off, not just the 3D consequences of it.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion } = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
