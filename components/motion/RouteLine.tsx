"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The thin gold line that "draws" itself down the Menu section as the
 * user scrolls through it — the route/journey framing from the
 * storyboard's Scene 6 direction, connecting category stops. Scoped to
 * this one section via Framer Motion's own scroll hooks rather than
 * another global GSAP ScrollTrigger instance: this is a per-section
 * decoration, not part of the master camera timeline, so it uses the
 * lighter of the two scroll tools in the stack (project-architecture.md
 * reserves GSAP+ScrollTrigger for the one master timeline).
 */
export function RouteLine({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-y-0 left-4 hidden w-4 sm:block", className)}
    >
      <svg viewBox="0 0 4 100" preserveAspectRatio="none" className="h-full w-full">
        <motion.line
          x1="2"
          y1="0"
          x2="2"
          y2="100"
          stroke="var(--color-gold-ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
