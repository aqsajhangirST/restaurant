"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { DustMoteOverlay } from "@/components/gallery/DustMoteOverlay";
import { easings } from "@/lib/constants";
import type { GalleryImageData } from "@/types";


interface GalleryLightboxProps {
  images: GalleryImageData[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const SWIPE_THRESHOLD = 80;

/**
 * Scene 9's full-bleed lightbox. Per the storyboard: opens via an iris
 * (circular clip-path) rather than a plain fade/scale, holds the sparse
 * dust-mote layer, and supports swipe between images — drag horizontally
 * to move prev/next, drag down far enough to dismiss, mirroring a native
 * photo-viewer gesture set rather than requiring the on-screen arrows.
 */
export function GalleryLightbox({ images, openIndex, onClose, onNavigate }: GalleryLightboxProps) {
  const isOpen = openIndex !== null;
  const current = isOpen ? images[openIndex] : null;

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    onNavigate((openIndex + 1) % images.length);
  }, [openIndex, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    onNavigate((openIndex - 1 + images.length) % images.length);
  }, [openIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, goNext, goPrev]);

  const handleDragEnd = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.y > SWIPE_THRESHOLD * 1.5 && Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      onClose();
      return;
    }
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(75% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.6, ease: easings.bloom }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/95 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={onClose}
        >
          <DustMoteOverlay />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="absolute right-5 top-5 rounded-full p-2 text-ivory-300 hover:text-ivory-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full p-2 text-ivory-300 hover:text-ivory-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400 sm:block"
          >
            <ChevronLeft size={28} strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full p-2 text-ivory-300 hover:text-ivory-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400 sm:block"
          >
            <ChevronRight size={28} strokeWidth={1.25} />
          </button>

          <motion.div
            key={current.id}
            drag
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex aspect-[4/3] w-full max-w-xl cursor-grab items-center justify-center rounded-lg bg-gradient-to-br from-charcoal-800 to-charcoal-950 active:cursor-grabbing"
          >
            <div className="absolute inset-0">
              <Image
                src={current.src}
                alt={current.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>

            <span className="relative z-10 px-6 text-center font-body text-xs uppercase tracking-[0.2em] text-charcoal-500">
              {current.caption}
            </span>
          </motion.div>


          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm text-ivory-300">
            {current.caption}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
