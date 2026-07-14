"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { GoldEmberField } from "@/components/canvas/particles/GoldEmberField";
import { colors, loadingSceneTiming, sceneProgress } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";

/**
 * Scene 1 — Loading. Auto-plays regardless of scroll (light ignition +
 * ember convergence into the seal), then fades as the user scrolls past
 * it into Scene 2 — see CameraRig for the camera hand-off (this scene no
 * longer touches the camera itself, now that there's a Scene 2 to hand
 * off to) and lib/constants.ts's `sceneProgress` for the shared fade
 * window both this component and FlowerScene key off of.
 */
export function LoadingScene() {
  const lightRef = useRef<THREE.PointLight>(null);
  const convergeProgressRef = useRef(0);
  const igniteAmountRef = useRef(0);
  const fadeRef = useRef(1);
  const { prefersReducedMotion } = useReducedMotion();
  const { progressRef: scrollProgressRef } = useScrollTimeline();

  useEffect(() => {
    if (prefersReducedMotion) {
      convergeProgressRef.current = 1;
      igniteAmountRef.current = 1.2;
      return;
    }

    const tl = gsap.timeline();

    tl.to(
      igniteAmountRef,
      {
        current: 1.2,
        duration: loadingSceneTiming.igniteDuration,
        delay: loadingSceneTiming.igniteDelay,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      convergeProgressRef,
      {
        current: 1,
        duration: loadingSceneTiming.convergeDuration,
        ease: "power2.out",
      },
      loadingSceneTiming.igniteDelay * 0.5
    );

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion]);

  useFrame(() => {
    // A discrete, scroll-position-driven cross-fade (not an autoplaying
    // loop) reads as an acceptable exception under reduced motion — it's
    // a direct consequence of the user's own scroll input, the same way a
    // reduced-motion site is still allowed to change sections on scroll.
    const fade =
      1 -
      THREE.MathUtils.smoothstep(
        scrollProgressRef.current,
        sceneProgress.loadingFadeStart,
        sceneProgress.loadingFadeEnd
      );
    fadeRef.current = fade;
    if (lightRef.current) {
      lightRef.current.intensity = igniteAmountRef.current * fade;
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0, 2.5]}
        color={colors.light400}
        intensity={0}
        distance={8}
        decay={2}
      />
      <ambientLight intensity={0.04} color={colors.charcoal900} />
      <GoldEmberField progress={convergeProgressRef} fadeOut={fadeRef} />
    </>
  );
}
