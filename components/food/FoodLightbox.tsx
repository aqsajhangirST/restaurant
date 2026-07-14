"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { easings } from "@/lib/constants";
import type { MenuItemData } from "@/types";

interface FoodLightboxProps {
  dish: MenuItemData | null;
  onClose: () => void;
}

/**
 * Tap-to-expand for the Scene 7 carousel, per the storyboard's Food scene
 * interaction note. A minimal modal, not the full Gallery lightbox
 * (Scene 9) — that one handles multi-image swipe; this one just gives a
 * single dish more room.
 */
export function FoodLightbox({ dish, onClose }: FoodLightboxProps) {
  useEffect(() => {
    if (!dish) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dish, onClose]);

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/90 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={dish.name}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: easings.bloom }}
            className="relative w-full max-w-lg rounded-xl border border-gold-500/20 bg-charcoal-900 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-ivory-300 hover:text-ivory-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

           <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-charcoal-800 to-charcoal-950">
            <img
              src={dish.image}
              alt={dish.name}
              className="h-full w-full object-cover"
            />
          </div>

            <h3 className="mt-5 font-display text-2xl text-ivory-50">{dish.name}</h3>
            <p className="mt-2 font-body text-sm text-ivory-300">{dish.description}</p>
            <span className="mt-3 inline-block font-body text-base text-gold-300">{dish.price}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
