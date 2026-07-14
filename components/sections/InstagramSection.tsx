"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { InstagramGrid } from "@/components/instagram/InstagramGrid";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getInstagramPosts } from "@/lib/cms";
import { durations, easings } from "@/lib/constants";

const PROFILE_URL = "https://www.instagram.com/bayroute_f6/";

/**
 * Scene 11 — Instagram. Per the storyboard: "bridge the site to where
 * most guests actually discover the restaurant — treat the feed as
 * content, not an afterthought widget." Camera-less, steady lighting
 * carried over from Reviews, a framed glass panel with a gold hairline
 * border holding the grid, and a subtle parallax where the grid drifts at
 * a slightly different rate than the page scroll (not a big 3D-feeling
 * effect — just enough to read as alive).
 *
 * The whole panel gets the "slide-up reveal, duration-slow" transition-in
 * the storyboard calls for; the grid's own parallax is a separate,
 * continuous scroll-linked transform layered on top once the panel is in
 * view, both gated by prefers-reduced-motion.
 */
export function InstagramSection() {
  const posts = getInstagramPosts();
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const { prefersReducedMotion } = useReducedMotion();

  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section
      aria-label="Instagram"
      className="relative overflow-hidden bg-charcoal-900 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <RevealText
          as="p"
          text="@bayroute_f6"
          visible={isVisible}
          className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
        />
        <RevealText
          as="h2"
          text="Follow the Route"
          visible={isVisible}
          delay={0.08}
          className="mt-3 font-display text-4xl text-ivory-50 sm:text-5xl"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: durations.slow, ease: easings.bloom, delay: 0.2 }}
          className="mt-4 font-body text-sm text-ivory-300"
        >
          Most of what happens at Bayroute shows up here first.{" "}
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-300 underline underline-offset-4 hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
          >
            Give it a follow.
          </a>
        </motion.p>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: durations.slow, ease: easings.bloom, delay: 0.1 }}
        className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gold-500/25 bg-charcoal-800/40 p-3 backdrop-blur-sm sm:p-5"
      >
        <div ref={parallaxRef}>
          <motion.div style={{ y: prefersReducedMotion ? 0 : gridY }}>
            <InstagramGrid posts={posts} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
