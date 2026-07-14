"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/constants";

interface ScrollIndicatorProps {
  visible: boolean;
  className?: string;
}

/**
 * Thin line + pulsing dot, per storyboard Scene 1: appears only after the
 * ember convergence completes, inviting the scroll that will eventually
 * carry the user into Scene 2. Purely decorative (aria-hidden) — it never
 * becomes the only way to discover that the page scrolls.
 */
export function ScrollIndicator({ visible, className }: ScrollIndicatorProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -6 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.7, ease: easings.bloom, delay: visible ? 0.2 : 0 }}
      className={cn(
        "pointer-events-none fixed bottom-9 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3",
        className
      )}
    >
      <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold-300/70">
        Scroll
      </span>
      <div className="relative h-12 w-px overflow-hidden bg-gold-500/20">
        <motion.span
          className="absolute left-0 top-0 h-3 w-px bg-gold-300"
          animate={{ y: [0, 36, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
