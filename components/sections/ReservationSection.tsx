"use client";

import { useEffect } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { WhatsAppQuickBook } from "@/components/reservation/WhatsAppQuickBook";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";
import { reservationSpotlightProgress } from "@/lib/sceneRefs";

/**
 * Scene 12 — Reservation. Per the storyboard: "the emotional and
 * commercial climax — 'the table is ready for you.'" Deliberately the
 * highest-contrast scene on the page (near-black background, everything
 * else recedes) with the single spotlight cone reintroduced in the 3D
 * layer (SpotlightScene, mounted in ExperienceCanvas) — see lib/
 * sceneRefs.ts for why that light's reveal is driven by this section's
 * own intersection state rather than the pinned master scroll timeline.
 */
export function ReservationSection() {
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const { prefersReducedMotion } = useReducedMotion();

  useEffect(() => {
    if (!isVisible) return;
    if (prefersReducedMotion) {
      reservationSpotlightProgress.current = 1;
      return;
    }
    const tween = gsap.to(reservationSpotlightProgress, {
      current: 1,
      duration: 1.4,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <section
      id="reservation"
      aria-label="Reserve a table"
      className="relative bg-charcoal-950 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div ref={ref} className="mx-auto max-w-lg">
        <div className="text-center">
          <RevealText
            as="p"
            text="The Table Is Ready"
            visible={isVisible}
            className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
          />
          <RevealText
            as="h2"
            text="Reserve Your Table"
            visible={isVisible}
            delay={0.08}
            className="mt-3 font-display text-4xl text-ivory-50 sm:text-5xl"
          />
          <p className="mt-4 font-body text-sm text-ivory-300">
            A few details and we&apos;ll have a spot set for you.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <WhatsAppQuickBook />
          <ReservationForm />
        </div>
      </div>
    </section>
  );
}
