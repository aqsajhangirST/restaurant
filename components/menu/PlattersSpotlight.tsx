"use client";

import { motion } from "framer-motion";
import { easings } from "@/lib/constants";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import type { PlatterData } from "@/types";

/**
 * Platters get their own wider, distinctly-bordered treatment — the
 * "group experience" called out separately from individual dishes, per
 * the storyboard's Scene 6 direction and design-system.md's Platter Card
 * entry (wider format, serves-N badge, gold border brightens on hover).
 */
export function PlattersSpotlight({ platters }: { platters: PlatterData[] }) {
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-gold-ink/25 bg-gradient-to-b from-ivory-100 to-ivory-50 p-6 sm:p-10"
    >
      <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-ink">
        For the table
      </p>
      <h3 className="mt-2 font-display text-2xl text-charcoal-900 sm:text-3xl">
        Platters
      </h3>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {platters.map((platter, i) => (
          <motion.div
            key={platter.id}
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: easings.bloom, delay: i * 0.08 }}
            className="group rounded-xl border border-gold-ink/20 bg-ivory-50 p-5 transition-colors hover:border-gold-ink/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-display text-lg text-charcoal-900">{platter.name}</h4>
                <span className="mt-1 inline-block rounded-full bg-charcoal-900/5 px-2.5 py-0.5 font-body text-[11px] uppercase tracking-[0.15em] text-charcoal-500">
                  {platter.servings}
                </span>
              </div>
              <span className="whitespace-nowrap font-body text-sm font-semibold text-gold-ink">
                {platter.price}
              </span>
            </div>
            <p className="mt-3 font-body text-sm leading-relaxed text-charcoal-500">
              {platter.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
