"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The lightbox-only dust-mote layer from the storyboard's Scene 9 note
 * ("inside the lightbox, a very sparse dust-mote layer over the full-bleed
 * image only"). Pure CSS/DOM, not the WebGL AmbientAccentScene — the
 * lightbox is a fixed overlay above everything, including the persistent
 * canvas, so it gets its own lightweight version rather than reaching into
 * the 3D layer. Positions are deterministic (index-derived, not
 * Math.random) so server and client render the same markup — a plain
 * DOM component like this one is SSR'd, unlike the R3F particle systems.
 */
export function DustMoteOverlay() {
  const { prefersReducedMotion } = useReducedMotion();
  if (prefersReducedMotion) return null;

  const motes = Array.from({ length: 10 });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 5) * 1.4;
        const duration = 8 + (i % 4) * 2;
        return (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-light-400/40"
            style={{ left: `${left}%`, bottom: "-5%" }}
            animate={{ y: ["0%", "-620%"], opacity: [0, 0.5, 0] }}
            transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}
