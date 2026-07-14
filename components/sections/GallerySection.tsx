"use client";

import { useState } from "react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { RevealText } from "@/components/motion/RevealText";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { getGalleryImages } from "@/lib/cms";

/**
 * Scene 9 — Gallery. Per the storyboard: "immerse again in the physical
 * space — reinforce 'you need to be here'" after Chef's quiet close-up.
 * Transition in fades from Chef's dark portrait (handled by this
 * section's own charcoal background matching ChefSection's, so there's no
 * hard cut); transition out (the grid receding as Reviews' quote cards
 * drift in) belongs to Scene 10 and isn't built yet.
 */
export function GallerySection() {
  const images = getGalleryImages();
  const { ref, isVisible } = useIntersectionReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="gallery"
      aria-label="Gallery"
      className="relative bg-charcoal-900 px-6 py-20 sm:px-10 sm:py-28"
    >
      <div ref={ref} className="mx-auto max-w-2xl text-center">
        <RevealText
          as="p"
          text="A Closer Look"
          visible={isVisible}
          className="font-body text-xs uppercase tracking-[0.3em] text-gold-300"
        />
        <RevealText
          as="h2"
          text="You Need to Be Here"
          visible={isVisible}
          delay={0.08}
          className="mt-3 font-display text-4xl text-ivory-50 sm:text-5xl"
        />
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <GalleryGrid images={images} revealed={isVisible} onOpen={setOpenIndex} />
      </div>

      <GalleryLightbox
        images={images}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
