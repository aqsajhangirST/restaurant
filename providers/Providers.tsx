"use client";

import type { ReactNode } from "react";
import { ReducedMotionProvider } from "@/providers/ReducedMotionProvider";
import { AudioProvider } from "@/providers/AudioProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { ScrollTimelineProvider } from "@/providers/ScrollTimelineProvider";

/**
 * Composes every global provider in one place so `app/layout.tsx` stays
 * free of provider wiring. LenisProvider and ScrollTimelineProvider join
 * as of the Scene 2 phase, now that there's an actual scroll timeline
 * (Scenes 1-4's continuous camera take) to drive.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <AudioProvider>
        <LenisProvider>
          <ScrollTimelineProvider>{children}</ScrollTimelineProvider>
        </LenisProvider>
      </AudioProvider>
    </ReducedMotionProvider>
  );
}
