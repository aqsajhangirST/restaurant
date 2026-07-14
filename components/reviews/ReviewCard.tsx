"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { easings } from "@/lib/constants";
import type { ReviewData } from "@/types";

interface ReviewCardProps {
  review: ReviewData;
  index: number;
  visible: boolean;
}

/** Four off-frame corners to drift in from, cycled by index — the
 *  storyboard's "drift in from off-frame corners, settle with a soft
 *  bounce-free ease," reusing the flower/petal motion vocabulary rather
 *  than a generic fade-up card entrance. */
const CORNER_OFFSETS = [
  { x: -60, y: -40 },
  { x: 60, y: -40 },
  { x: -60, y: 40 },
  { x: 60, y: 40 },
];

export function ReviewCard({ review, index, visible }: ReviewCardProps) {
  const offset = CORNER_OFFSETS[index % CORNER_OFFSETS.length];

  return (
    <motion.figure
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={
        visible
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{
        duration: 0.8,
        ease: easings.bloom,
        delay: visible ? index * 0.12 : 0,
      }}
      className="relative rounded-xl border border-gold-500/15 bg-charcoal-800/60 p-6"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 left-5 font-display text-6xl text-bloom-500/20"
      >
        &ldquo;
      </span>

      <div className="relative flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star
            key={starIndex}
            size={14}
            strokeWidth={1.5}
            className={starIndex < review.rating ? "fill-gold-500 text-gold-500" : "text-charcoal-500"}
          />
        ))}
      </div>
      <span className="sr-only">{review.rating} out of 5 stars</span>

      <blockquote className="relative mt-4 font-display text-lg italic leading-relaxed text-ivory-100">
        &ldquo;{review.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-4 font-body text-xs uppercase tracking-[0.2em] text-charcoal-500">
        {review.occasion}
      </figcaption>
    </motion.figure>
  );
}
