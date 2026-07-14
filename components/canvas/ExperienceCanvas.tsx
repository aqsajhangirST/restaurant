"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { CameraRig } from "@/components/canvas/rig/CameraRig";
import { LoadingScene } from "@/components/canvas/scenes/LoadingScene";
import { FlowerScene } from "@/components/canvas/scenes/FlowerScene";
import { TreeScene } from "@/components/canvas/scenes/TreeScene";
import { RestaurantScene } from "@/components/canvas/scenes/RestaurantScene";
import { AmbientAccentScene } from "@/components/canvas/scenes/AmbientAccentScene";
import { SpotlightScene } from "@/components/canvas/scenes/SpotlightScene";
import { GoldEmberField } from "@/components/canvas/particles/GoldEmberField";
import { endingEmberConverge, endingEmberFade } from "@/lib/sceneRefs";

/**
 * The single persistent WebGL canvas for the whole experience (see
 * project-architecture.md §"One persistent canvas"). Every scene built so
 * far is mounted the entire time — nothing pops in or out — each one's
 * internal progress math (driven by CameraRig's shared scroll timeline,
 * or — for Scenes 12-14 — their own independent progress refs, see
 * lib/sceneRefs.ts) handles fading itself in and out of visibility/
 * relevance.
 *
 * The second <GoldEmberField> below is Scene 14's "final soft
 * re-convergence on the seal" — the exact same scatter-to-seal shader
 * Scene 1 uses, reused rather than rebuilt (per this codebase's existing
 * "reuse the shared accent" precedent — see AmbientAccentScene), just
 * given its own progress/fadeOut refs so it stays invisible and unformed
 * until Ending scrolls into view.
 *
 * `frameloop` stays "always" rather than switching to "demand" once the
 * camera take settles (as project-architecture.md originally sketched):
 * AmbientAccentScene's drifting dust and the tail of FlowerScene's petal
 * wind are deliberately still animating during Scenes 5+, so there's
 * always something that needs a fresh frame. A future optimization could
 * detect when every ambient effect has fully settled and switch modes
 * then — not worth the complexity yet at this scene count.
 *
 * Audit fix: this used to only fall back to StaticFallback when
 * `tier === "low"`, which meant the *default* first-render state
 * ("unknown", before usePerformanceTier's effect resolves) fell through
 * to the full WebGL Canvas — so a genuinely low-power device would
 * briefly mount the heavy Canvas anyway, then tear it down a frame later
 * once the heuristic caught up. Checking `tier !== "high"` instead means
 * the fail-safe direction is correct: nothing heavy mounts until the
 * device is confirmed capable, at the cost of a one-frame delay before
 * capable devices see the Canvas — the safer trade for a performance gate.
 */
export function ExperienceCanvas() {
  const tier = usePerformanceTier();

  if (tier !== "high") {
    return <StaticFallback />;
  }

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.1, far: 100, position: [0, 0, 5.6] }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <LoadingScene />
          <FlowerScene />
          <TreeScene />
          <RestaurantScene />
          <AmbientAccentScene />
          <SpotlightScene />
          <GoldEmberField progress={endingEmberConverge} fadeOut={endingEmberFade} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Low-power fallback: same warm/dark mood, zero WebGL cost. This gets
 * replaced with a pre-rendered video loop of the real camera move in a
 * later pass (performance-strategy.md); a CSS glow is enough for now.
 */
function StaticFallback() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-charcoal-00"
      aria-hidden="true"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(255,227,176,0.16), transparent 55%)",
      }}
    />
  );
}
