"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PetalField } from "@/components/canvas/particles/PetalField";
import { FogVolume } from "@/components/canvas/particles/FogVolume";
import { colors, sceneProgress } from "@/lib/constants";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";

/**
 * Scene 2 — Flowers. Petals open, wind stirs the loose ones across frame,
 * fog rolls in low and keeps thickening into Scene 3, and a cool pink rim
 * light joins Scene 1's warm key — the cool/warm contrast the whole
 * brand's lighting is built on (design-system.md §8, three-scene-plan.md
 * §4 RimBloomLight). The rim light keeps intensifying a little further
 * into Scene 3, per the storyboard's "pink rim intensifies" beat there.
 *
 * No camera or mount/unmount logic lives here — CameraRig owns the
 * camera, and ExperienceCanvas keeps every scene mounted simultaneously
 * the whole time, blending via this progress math (three-scene-plan.md
 * §10, "nothing pops in").
 */
export function FlowerScene() {
  const rimLightRef = useRef<THREE.PointLight>(null);
  const openProgressRef = useRef(0);
  const fogOpacityRef = useRef(0);
  const { progressRef: scrollProgressRef } = useScrollTimeline();

  useFrame(() => {
    const scroll = scrollProgressRef.current;

    const openSpan = sceneProgress.flowersEnd - sceneProgress.flowersStart;
    const openLocal = THREE.MathUtils.clamp(
      (scroll - sceneProgress.flowersStart) / openSpan,
      0,
      1
    );
    openProgressRef.current = openLocal;

    // Fog keeps rolling in through Scene 3's opening stretch rather than
    // capping the moment petals finish opening.
    const fogEnd = sceneProgress.treeStart + 0.2;
    fogOpacityRef.current = THREE.MathUtils.smoothstep(
      scroll,
      sceneProgress.flowersStart,
      fogEnd
    );

    if (rimLightRef.current) {
      const treeBoost = THREE.MathUtils.clamp(
        (scroll - sceneProgress.treeStart) / 0.3,
        0,
        1
      );
      rimLightRef.current.intensity = openLocal * 0.7 + treeBoost * 0.35;
    }
  });

  return (
    <>
      <pointLight
        ref={rimLightRef}
        position={[-1.5, 0.6, -1.2]}
        color={colors.bloom500}
        intensity={0}
        distance={7}
        decay={2}
      />
      <PetalField openProgress={openProgressRef} />
      <FogVolume opacity={fogOpacityRef} />
    </>
  );
}
