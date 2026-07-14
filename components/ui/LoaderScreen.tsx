"use client";

import { useEffect, useState } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { loadingSceneTiming } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";

/**
 * DOM-side companion to LoadingScene (the 3D ember/seal convergence).
 * Kept separate from the WebGL scene so this layer — wordmark, tagline,
 * toggle, scroll cue — can be reasoned about without a WebGL context, per
 * project-architecture.md.
 *
 * Timing is driven by the shared `loadingSceneTiming` constants rather
 * than a live callback from the 3D layer, so the DOM and canvas land in
 * sync declaratively without bridging refs across the two.
 *
 * The wordmark, tagline, and scroll cue all fade out the moment the user
 * actually starts scrolling — Scene 4 introduces its own small wordmark
 * (RestaurantIntro) once the room resolves, and showing both at once would
 * read as a mistake, not a callback. The music toggle is the one thing
 * that stays — it's a persistent utility, not a Scene 1 flourish.
 *
 * Navigation is intentionally absent from this page entirely during
 * Scene 1 — not just visually hidden — per design-system.md §11: hiding
 * it is a content decision, so screen readers and keyboard users don't
 * land on dead nav links before there's anywhere to navigate to.
 */
export function LoaderScreen() {
  const { prefersReducedMotion } = useReducedMotion();
  const hasScrolled = useScrollThreshold(0.035);
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setWordmarkVisible(true);
      setTaglineVisible(true);
      setChromeVisible(true);
      return;
    }

    const timers = [
      setTimeout(() => setWordmarkVisible(true), loadingSceneTiming.wordmarkDelay * 1000),
      setTimeout(() => setTaglineVisible(true), loadingSceneTiming.taglineDelay * 1000),
      setTimeout(() => setChromeVisible(true), loadingSceneTiming.chromeRevealDelay * 1000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <RevealText
        as="h1"
        text="BAYROUTE"
        visible={wordmarkVisible && !hasScrolled}
        className="font-display text-3xl font-semibold tracking-[0.35em] text-ivory-50 sm:text-4xl"
      />

      <RevealText
        as="p"
        text="Taste the Bay"
        visible={taglineVisible && !hasScrolled}
        delay={0.1}
        className="font-script text-3xl text-gold-300 sm:text-4xl"
      />

      <MusicToggle visible={chromeVisible} />
      <ScrollIndicator visible={chromeVisible && !hasScrolled} />
    </div>
  );
}
