"use client";

import { useContext } from "react";
import { AudioContext } from "@/providers/AudioProvider";

/** Mute/unmute state for the experience's ambient sound design (storyboard
 *  §Scene 1: music toggle, opt-in, never forces itself back on). */
export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio must be used within <AudioProvider>");
  }
  return ctx;
}
