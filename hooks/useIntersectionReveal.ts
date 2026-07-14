"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionRevealOptions {
  threshold?: number;
  /** Reveal once and stay revealed (default), or toggle back off when the
   *  element scrolls out of view. */
  once?: boolean;
}

/**
 * Lightweight reveal-on-scroll for Scenes 5+ DOM sections — intentionally
 * simpler and cheaper than GSAP ScrollTrigger, since these sections need a
 * one-time (or simple enter/exit) reveal rather than a scrubbed timeline
 * (project-architecture.md's hooks table). Scenes 1-4 use the master
 * scroll-progress ref instead; this hook is for everything after the
 * continuous camera take ends.
 */
export function useIntersectionReveal<T extends HTMLElement>({
  threshold = 0.25,
  once = true,
}: UseIntersectionRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}
