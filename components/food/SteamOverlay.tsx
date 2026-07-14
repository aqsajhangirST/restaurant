"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A restrained steam cue for hot dishes only (karahi, steak, wok mains) —
 * three soft blurred wisps drifting upward and dissipating, pure CSS/DOM,
 * not WebGL, since Scene 7 is a 2D-forward scene per the storyboard
 * ("Camera: none"). No texture asset needed — same procedural approach as
 * the 3D particle systems elsewhere in the build.
 */
export function SteamOverlay() {
  const { prefersReducedMotion } = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 overflow-hidden"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 h-24 w-10 rounded-full bg-white/25 blur-md"
          style={{ left: `${28 + i * 22}%` }}
          animate={{ y: [0, -140], opacity: [0, 0.5, 0], scaleX: [1, 1.4] }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.3,
          }}
        />
      ))}
    </div>
  );
}
