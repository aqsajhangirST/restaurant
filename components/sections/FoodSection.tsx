"use client";

import { useState } from "react";
import { DishSpotlightCard } from "@/components/food/DishSpotlightCard";
import { FoodLightbox } from "@/components/food/FoodLightbox";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { getSpotlightDishes } from "@/lib/cms";
import type { MenuItemData } from "@/types";

/**
 * Scene 7 — Food. A sensory close-up, briefly returning to the cinematic
 * register after Menu's clean, scannable ivory background — hence the
 * crossfade back to charcoal here. One dish "spotlighted" at a time in a
 * horizontally-snapping carousel (native CSS scroll-snap, not a carousel
 * library), steam on the hot dishes only, tap to expand.
 *
 * Not yet implemented: the storyboard's brief sizzle/plating sound cue on
 * scroll-into-view for the top spotlight dishes — that needs a real SFX
 * asset the restaurant hasn't supplied yet (same situation as the ambient
 * track referenced in AudioProvider). The trigger point (this section
 * entering view) is already exactly where useIntersectionReveal fires
 * below, so wiring it in later is additive, not a rebuild.
 */
export function FoodSection() {
  const dishes = getSpotlightDishes();
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const [expandedDish, setExpandedDish] = useState<MenuItemData | null>(null);

  return (
    <section
      aria-label="Signature dishes"
      className="relative bg-charcoal-900 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div ref={ref} className="mx-auto max-w-2xl text-center">
        <RevealText
          as="p"
          text="Taste the Route"
          visible={isVisible}
          className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
        />
        <RevealText
          as="h2"
          text="A Few to Start With"
          visible={isVisible}
          delay={0.08}
          className="mt-3 font-display text-4xl text-ivory-50 sm:text-5xl"
        />
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:justify-center sm:px-0">
        {dishes.map((dish) => (
          <DishSpotlightCard key={dish.id} dish={dish} onExpand={() => setExpandedDish(dish)} />
        ))}
      </div>

      <FoodLightbox dish={expandedDish} onClose={() => setExpandedDish(null)} />
    </section>
  );
}
