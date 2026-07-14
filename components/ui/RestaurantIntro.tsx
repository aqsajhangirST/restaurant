"use client";

import { RevealText } from "@/components/motion/RevealText";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";
import { sceneProgress } from "@/lib/constants";

/**
 * Scene 4's DOM overlay: the wordmark reappears small and settled next to
 * the first real content heading, once the establishing shot has come
 * mostly into view — per storyboard Scene 4's copy beat. This is a fixed
 * overlay (like LoaderScreen), not a document-flow section.
 *
 * It fades back out once the user scrolls into Scene 5 (AboutSection) —
 * without that, this fixed-position text would sit on top of real
 * document-flow content forever, since it has no height of its own to
 * naturally scroll away.
 */
export function RestaurantIntro() {
  const hasEntered = useScrollThreshold(sceneProgress.restaurantStart + 0.12);
  const hasLeft = useScrollThreshold(0.97);
  const visible = hasEntered && !hasLeft;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-10 flex flex-col items-center gap-2 px-6 text-center">
      <RevealText
        as="p"
        text="Bayroute · Taste the Bay"
        visible={visible}
        className="font-display text-lg tracking-[0.15em] text-gold-300 sm:text-xl"
      />
      <RevealText
        as="p"
        text="Islamabad's route to fusion, taken slowly."
        visible={visible}
        delay={0.15}
        className="font-body text-sm text-ivory-300 sm:text-base"
        wordClassName="mr-[0.22em]"
      />
    </div>
  );
}
