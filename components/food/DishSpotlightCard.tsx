"use client";

import { motion } from "framer-motion";
import { SteamOverlay } from "@/components/food/SteamOverlay";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { MenuItemData } from "@/types";

interface DishSpotlightCardProps {
  dish: MenuItemData;
  onExpand: () => void;
}

/**
 * One card in Scene 7's horizontally-snapping carousel. The image area is
 * its own <button> (not wrapping the heading/price — a heading inside a
 * button isn't valid content per the HTML spec, so name/price/description
 * live as siblings below it instead). The slow scale loop stands in for
 * the storyboard's Ken-Burns pan until real dish photography exists to
 * apply it to.
 */
export function DishSpotlightCard({ dish, onExpand }: DishSpotlightCardProps) {
  const { prefersReducedMotion } = useReducedMotion();

  return (
    <div className="w-[85%] shrink-0 snap-center sm:w-[420px]">
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Expand ${dish.name}`}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl border border-gold-500/20 bg-gradient-to-br from-charcoal-800 to-charcoal-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
            <img
              src={dish.image}
              alt={dish.name}
              className="h-full w-full object-cover"
            />
        
        </motion.div>

        {dish.hot && <SteamOverlay />}

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent transition-opacity group-hover:opacity-80" />
      </button>

      <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
        <h3 className="font-display text-xl text-ivory-50">{dish.name}</h3>
        <span className="whitespace-nowrap font-body text-sm text-gold-300">{dish.price}</span>
      </div>
      <p className="mt-1 px-1 font-body text-sm text-ivory-300">{dish.description}</p>
    </div>
  );
}
