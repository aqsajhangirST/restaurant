"use client";

import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { getReviews } from "@/lib/cms";

/**
 * Scene 10 — Reviews. Per the storyboard: "social proof, delivered with
 * the same 'bloom' motion language as the flowers — literally letting
 * quotes drift in like petals." Camera-less (2D layer), steady warm/
 * charcoal background, no particles beyond the cards' own entrance.
 *
 * content/reviews.json holds illustrative sample copy, not real submitted
 * guest reviews — same honesty pattern as ChefSection's placeholder quote
 * and the Gallery's "photography pending" frames. ReviewData intentionally
 * has no `name` field so nothing here reads as attributed to a specific,
 * identifiable guest who never wrote it. The disclaimer line at the
 * bottom makes this explicit rather than leaving it to be discovered.
 *
 * Five reviews ship here, under the storyboard's "more than 6" drag/
 * scroll threshold, so this stays a static grid — the optional horizontal
 * drag interaction is deferred until there's real content to justify it.
 */
export function ReviewsSection() {
  const reviews = getReviews();
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();

  return (
    <section
      aria-label="Guest reviews"
      className="relative bg-charcoal-900 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <RevealText
          as="p"
          text="What Guests Say"
          visible={isVisible}
          className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
        />
        <RevealText
          as="h2"
          text="Word on the Route"
          visible={isVisible}
          delay={0.08}
          className="mt-3 font-display text-4xl text-ivory-50 sm:text-5xl"
        />
      </div>

      <div
        ref={ref}
        className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} visible={isVisible} />
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-md text-center font-body text-[11px] uppercase tracking-[0.2em] text-charcoal-500">
        Sample reviews shown for layout — pending real guest reviews
      </p>
    </section>
  );
}
