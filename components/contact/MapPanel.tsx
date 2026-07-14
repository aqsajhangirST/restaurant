"use client";

import { MapPin } from "lucide-react";

interface MapPanelProps {
  mapQuery: string;
}

/**
 * Storyboard's "map is interactive (pan/zoom) or a static styled map
 * image linking out, whichever performs better" — this build takes the
 * static-image option, and deliberately doesn't embed a live map pinned
 * to a specific lat/long: there's no confirmed exact street address yet,
 * only the neighborhood (F-6, Islamabad), and rendering a precisely-
 * pinned map would assert a location that hasn't actually been verified.
 * Instead, the panel is a styled placeholder plus a real Google Maps
 * search link, letting Google's own search resolve the location rather
 * than a fabricated coordinate.
 */
export function MapPanel({ mapQuery }: MapPanelProps) {
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-gold-ink/25 bg-gradient-to-br from-ivory-100 to-ivory-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-700 sm:aspect-video"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <MapPin size={28} strokeWidth={1.25} className="text-gold-ink" />
        <span className="font-body text-sm text-charcoal-700">
          Map pin pending a confirmed address
        </span>
        <span className="font-body text-xs uppercase tracking-[0.2em] text-gold-ink underline underline-offset-4 group-hover:text-gold-700">
          Search on Google Maps
        </span>
      </div>
    </a>
  );
}
