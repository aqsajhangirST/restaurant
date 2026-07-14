"use client";

import { motion } from "framer-motion";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";
import { sceneProgress } from "@/lib/constants";
import { easings } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
] as const;

/**
 * Minimal glass nav bar (design-system.md §11): absent for Scenes 1-3
 * entirely — not just hidden — and fades in once the establishing shot in
 * Scene 4 has mostly resolved.
 *
 * Audit fix: these were placeholder `<span>`s until every Scene 5+ section
 * existed (there was nowhere to send a click). Now that About/Menu/
 * Gallery/Reservation all exist with matching `id`s, every link/pill here
 * is a real in-page anchor — no route change needed, since `/` already
 * contains the full experience. Smooth in-page scrolling for these comes
 * from the global `scroll-behavior: smooth` rule in globals.css (which
 * itself yields to prefers-reduced-motion, same as everything else).
 */
export function Nav() {
  const visible = useScrollThreshold(sceneProgress.restaurantStart + 0.25);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease: easings.bloom }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className={cn(
        "fixed inset-x-0 top-0 z-20 flex items-center justify-between",
        "border-b border-gold-500/15 bg-charcoal-900/55 px-6 py-4 backdrop-blur-sm",
        "sm:px-10"
      )}
    >
      <span className="font-display text-sm tracking-[0.3em] text-ivory-50">
        BAYROUTE
      </span>

      <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-body text-xs uppercase tracking-[0.2em] text-ivory-300 transition-colors hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        href="#reservation"
        className="rounded-full border border-gold-500/40 px-4 py-1.5 font-body text-xs uppercase tracking-[0.2em] text-gold-300 transition-colors hover:bg-gold-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400"
      >
        Reserve
      </a>
    </motion.header>
  );
}
