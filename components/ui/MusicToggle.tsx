"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/constants";

interface MusicToggleProps {
  visible: boolean;
  className?: string;
}

/**
 * Scene 1's music toggle: opt-in ambient sound, never forced. Appears
 * once the seal has resolved (per storyboard), invites rather than
 * autoplays. No audio file is wired up yet in this phase — see
 * AudioProvider's `registerAudioElement`, intended for the actual ambient
 * track once the restaurant supplies one.
 */
export function MusicToggle({ visible, className }: MusicToggleProps) {
  const { isEnabled, toggle } = useAudio();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isEnabled ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={isEnabled}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: easings.bloom }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className={cn(
        "fixed right-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-gold-500/30 bg-charcoal-900/55 backdrop-blur-sm",
        "text-gold-300 transition-colors duration-[220ms] hover:border-gold-500/60",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-400",
        className
      )}
    >
      {isEnabled ? (
        <Volume2 size={18} strokeWidth={1.5} />
      ) : (
        <VolumeX size={18} strokeWidth={1.5} />
      )}
    </motion.button>
  );
}
