"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryImageData } from "@/types";


interface GalleryGridProps {
  images: GalleryImageData[];
  /** Gates the reveal animation — passed down from a single
   *  useIntersectionReveal call in GallerySection so the grid only starts
   *  settling into place once it actually enters view, not the instant
   *  the page mounts (the grid sits far down the scroll). */
  revealed: boolean;
  onOpen: (index: number) => void;
}

const ASPECT_CLASS: Record<GalleryImageData["aspect"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
};

/**
 * CSS-columns masonry (no layout library) — per the storyboard's Scene 9
 * note ("grid-reveal — images settle into a masonry layout, each one
 * fading/lifting into place a beat after the last").
 */
export function GalleryGrid({ images, revealed, onOpen }: GalleryGridProps) {
  return (
    <div className="columns-2 gap-4 sm:columns-3">
      {images.map((image, index) => (
        <GalleryItem
          key={image.id}
          image={image}
          index={index}
          revealed={revealed}
          onOpen={() => onOpen(index)}
        />
      ))}
    </div>
  );
}

function GalleryItem({
  image,
  index,
  revealed,
  onOpen,
}: {
  image: GalleryImageData;
  index: number;
  revealed: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${image.caption}`}
      style={
        revealed
          ? { animationDelay: `${(index % 6) * 90}ms` }
          : undefined
      }
      className={cn(
        "group relative mb-4 block w-full overflow-hidden rounded-xl break-inside-avoid",
        "border border-ivory-300/50",
        "shadow-lg",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-700",
        revealed
          ? "animate-[fade-lift_0.6s_ease-out_forwards]"
          : "opacity-0",
        ASPECT_CLASS[image.aspect]
      )}
    >
      {/* Image */}
      <Image
        src={image.src}
        alt={image.caption}
        fill
        priority={index < 4}
        sizes="(max-width:640px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/35" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-4 transition-transform duration-500 group-hover:translate-y-0">
        <p className="text-sm text-white font-medium">
          {image.caption}
        </p>
      </div>
    </button>
  );
}