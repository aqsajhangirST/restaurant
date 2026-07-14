"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { easings } from "@/lib/constants";

/**
 * Scene 8 — Chef. The most restrained scene in the whole build, on
 * purpose (storyboard: "meant to be read, not played with") — a single
 * portrait, a name, a quote, near-black background, one slow push-in and
 * nothing else.
 *
 * Name, title, and quote below are clearly-labeled placeholders, not a
 * fabricated identity — putting invented words in a specific named
 * person's mouth for a real business would be actively misleading if this
 * ever shipped unedited. Same honesty pattern as the "photography
 * pending" placeholders elsewhere: real copy goes here once the
 * restaurant supplies it.
 */
export function ChefSection() {
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const { prefersReducedMotion } = useReducedMotion();

  return (
    <section
      aria-label="From the kitchen"
      className="relative bg-charcoal-950 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        ref={ref}
        className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:gap-14 sm:text-left"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, ease: easings.bloom }}
          className="w-40 shrink-0 sm:w-56"
        >
          <motion.div
            className="aspect-[3/4] overflow-hidden rounded-lg border border-gold-500/15 bg-gradient-to-b from-charcoal-800 to-charcoal-950"
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-full items-center justify-center p-4 text-center font-body text-[10px] uppercase tracking-[0.2em] text-charcoal-500">
              <img src="/images/Gallery/chef.avif" alt="Chef" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </motion.div>

        <div>
          <RevealText
            as="p"
            text="The Kitchen"
            visible={isVisible}
            className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
          />
          <RevealText
            as="p"
            text="Head Chef — name pending"
            visible={isVisible}
            delay={0.08}
            className="mt-3 font-display text-2xl text-ivory-50 sm:text-3xl"
          />
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, ease: easings.bloom, delay: 0.2 }}
            className="mt-6 max-w-md font-display text-lg italic leading-relaxed text-ivory-300 sm:text-xl"
          >
            &ldquo;Bayroute isn&apos;t one cuisine pretending to be many — it&apos;s one kitchen
            that happens to cook several well. Every dish still has to earn its
            place on that route.&rdquo;
          </motion.blockquote>
          <p className="mt-3 font-body text-[11px] uppercase tracking-[0.2em] text-charcoal-500">
            Draft quote — pending the chef&apos;s own words
          </p>
        </div>
      </div>
    </section>
  );
}
