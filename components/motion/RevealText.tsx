"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/constants";

interface RevealTextProps {
  text: string;
  /** Plain HTML tag for the outer wrapper — kept as a real intrinsic
   *  element (not a dynamic `motion.*` lookup) so this stays simple to
   *  type-check regardless of framer-motion version. */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  wordClassName?: string;
  /** Stagger start offset, in seconds. */
  delay?: number;
  visible: boolean;
}

/**
 * Word-level stagger reveal: each word blurs in from a soft haze to full
 * focus — the "bloom-reveal" catalog entry from design-system.md. Never a
 * typewriter, never a bounce.
 */
export function RevealText({
  text,
  as: Tag = "span",
  className,
  wordClassName,
  delay = 0,
  visible,
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <Tag className={cn("inline-flex flex-wrap justify-center", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn("mr-[0.28em] inline-block will-change-transform", wordClassName)}
          initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
          animate={
            visible
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : { opacity: 0, filter: "blur(6px)", y: 8 }
          }
          transition={{
            duration: 0.7,
            ease: easings.bloom,
            delay: visible ? delay + i * 0.05 : 0,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
