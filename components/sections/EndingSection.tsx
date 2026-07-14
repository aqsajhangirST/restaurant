"use client";

import { useEffect } from "react";
import { ArrowUp, Instagram } from "lucide-react";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo } from "@/lib/cms";
import { gsap } from "@/lib/gsap";
import {
  endingDimProgress,
  endingEmberConverge,
  endingEmberFade,
} from "@/lib/sceneRefs";

const INSTAGRAM_URL = "https://www.instagram.com/bayroute_f6/";

/**
 * Scene 14 — Ending. Per the storyboard: "symmetric exit — mirror Scene 1
 * in reverse, leave the user with the seal, not a UI dead-end." The full
 * spec asks for a genuine reverse camera dolly back out through Scenes
 * 1-4's space; that would mean re-authoring the master CatmullRomCurve3
 * that only spans Scenes 1-4 today (lib/curves.ts) and reflowing every
 * earlier scene's pacing — out of scope for a single incremental scene
 * per the "phase by phase" build plan. This scene instead delivers the
 * two most legible pieces of the reverse-mirror on their own timeline:
 * the Scene 4 pendant lights extinguishing (endingDimProgress, read by
 * RestaurantScene) and the Scene 1 ember convergence replaying on the
 * seal (the second GoldEmberField instance in ExperienceCanvas). A true
 * reverse camera move is a good candidate for a later, dedicated pass.
 *
 * No real logo/seal image or restaurant-supplied closing copy exists yet,
 * so the "seal" here is the same procedural ember-convergence shape
 * Scene 1 uses (not a fabricated image), and the footer's legal line is
 * generic copyright boilerplate using the restaurant's own real name —
 * not an invented registration or entity detail.
 */
export function EndingSection() {
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const { prefersReducedMotion } = useReducedMotion();
  const contact = getContactInfo();
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!isVisible) return;

    if (prefersReducedMotion) {
      endingDimProgress.current = 1;
      endingEmberFade.current = 1;
      endingEmberConverge.current = 1;
      return;
    }

    const tl = gsap.timeline();
    tl.to(endingDimProgress, { current: 1, duration: 1.8, ease: "power2.in" }, 0);
    tl.to(endingEmberFade, { current: 1, duration: 1.4, ease: "power1.out" }, 0.6);
    tl.to(endingEmberConverge, { current: 1, duration: 2.2, ease: "power2.out" }, 1.0);

    return () => {
      tl.kill();
    };
  }, [isVisible, prefersReducedMotion]);

  const handleBackToStart = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <section
      aria-label="Closing"
      className="relative flex min-h-screen flex-col items-center justify-center bg-charcoal-950 px-6 py-24 text-center sm:px-10"
    >
      <div ref={ref} className="flex flex-col items-center">
        <RevealText
          as="h2"
          text="Thank You for Taking the Route."
          visible={isVisible}
          className="max-w-lg font-display text-3xl text-ivory-50 sm:text-4xl"
        />
        <RevealText
          as="p"
          text="Taste the Bay"
          visible={isVisible}
          delay={0.1}
          className="mt-4 font-script text-3xl text-gold-300 sm:text-4xl"
        />

        <button
          type="button"
          onClick={handleBackToStart}
          className="mt-10 flex items-center gap-2 rounded-full border border-gold-500/30 px-5 py-2.5 font-body text-xs uppercase tracking-[0.2em] text-ivory-300 transition-colors hover:border-gold-500/60 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
        >
          <ArrowUp size={14} strokeWidth={1.75} />
          Back to the beginning
        </button>
      </div>

      <footer className="mt-24 flex flex-col items-center gap-3 border-t border-charcoal-700 pt-8 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-body text-sm text-ivory-300 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
        >
          <Instagram size={16} strokeWidth={1.5} />
          @bayroute_f6
        </a>
        <p className="font-body text-xs text-charcoal-500">{contact.address}</p>
        <p className="font-body text-xs text-charcoal-500">
          Premium taste, unforgettable experience.
        </p>
        <p className="mt-2 font-body text-[11px] uppercase tracking-[0.15em] text-charcoal-700">
          &copy; {year} Bayroute. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
