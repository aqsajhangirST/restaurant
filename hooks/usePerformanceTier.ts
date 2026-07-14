"use client";

import { useEffect, useState } from "react";
import type { PerformanceTier } from "@/types";

/**
 * One-time heuristic run on mount to decide whether the full WebGL
 * experience should render, or whether ExperienceCanvas should fall back to
 * a static/video treatment (per performance-strategy: mobile and low-power
 * devices get a lighter experience, never a struggling one).
 *
 * Heuristic, not a benchmark: checks device memory, logical CPU cores, and
 * a coarse GPU renderer-string sniff for known low-power signatures. Good
 * enough to gate a design decision; not meant to be precise.
 */
export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const nav = window.navigator as Navigator & {
        deviceMemory?: number;
        hardwareConcurrency?: number;
      };

      const lowMemory = (nav.deviceMemory ?? 8) <= 2;
      const lowCores = (nav.hardwareConcurrency ?? 8) <= 2;

      let weakGpu = false;
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl && "getExtension" in gl) {
          const dbgInfo = (gl as WebGLRenderingContext).getExtension(
            "WEBGL_debug_renderer_info"
          );
          if (dbgInfo) {
            const renderer = String(
              (gl as WebGLRenderingContext).getParameter(
                dbgInfo.UNMASKED_RENDERER_WEBGL
              )
            ).toLowerCase();
            weakGpu = /swiftshader|llvmpipe|software/.test(renderer);
          }
        } else if (!gl) {
          weakGpu = true;
        }
      } catch {
        // If we can't even probe WebGL, treat it as a low-power signal.
        weakGpu = true;
      }

      setTier(lowMemory || lowCores || weakGpu ? "low" : "high");
    } catch {
      setTier("unknown");
    }
  }, []);

  return tier;
}
