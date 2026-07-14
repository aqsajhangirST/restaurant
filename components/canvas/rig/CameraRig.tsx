"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { masterCameraPath, masterLookAtPath, AUTOPLAY_PROGRESS_CAP } from "@/lib/curves";

/**
 * Single camera authority for the Scenes 1-4 continuous take
 * (three-scene-plan.md §3, §10). Blends two progress sources — whichever
 * is further along wins, so the hand-off is always seamless:
 *
 * - `autoplayProgress`: ramps 0 -> AUTOPLAY_PROGRESS_CAP over ~3s on load,
 *   reproducing Scene 1's original push-in without waiting for a scroll.
 * - real scroll progress (from ScrollTimelineProvider): takes over the
 *   moment the user scrolls past wherever autoplay has reached.
 *
 * When reduced motion is preferred, scroll-linked camera movement is
 * itself the effect being asked for less of (see accessibility-strategy.md)
 * — this rig just settles on the current path's final frame instead of
 * continuously repositioning as the user scrolls.
 */
export function CameraRig() {
  const { camera } = useThree();
  const { progressRef: scrollProgressRef } = useScrollTimeline();
  const autoplayProgressRef = useRef(0);
  const { prefersReducedMotion } = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      autoplayProgressRef.current = AUTOPLAY_PROGRESS_CAP;
      return;
    }

    const tween = gsap.to(autoplayProgressRef, {
      current: AUTOPLAY_PROGRESS_CAP,
      duration: 3,
      ease: "power2.out",
    });

    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  useFrame(() => {
    if (prefersReducedMotion) {
      camera.position.copy(masterCameraPath.getPointAt(1));
      camera.lookAt(masterLookAtPath.getPointAt(1));
      return;
    }

    const progress = THREE.MathUtils.clamp(
      Math.max(autoplayProgressRef.current, scrollProgressRef.current),
      0,
      1
    );
    camera.position.copy(masterCameraPath.getPointAt(progress));
    camera.lookAt(masterLookAtPath.getPointAt(progress));
  });

  return null;
}
