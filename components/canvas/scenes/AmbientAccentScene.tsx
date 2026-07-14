"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";
import { sceneProgress } from "@/lib/constants";

interface AmbientAccentSceneProps {
  count?: number;
}

/**
 * The one shared, cheap 3D layer for content scenes (three-scene-plan.md
 * §2, §5 DustMotes) — deliberately "dumb": a sparse field of soft points
 * drifting slowly upward, opacity capped low, no scene-specific logic.
 * Reused across Scenes 5/7/9/12/13 rather than a bespoke accent per scene.
 * Fades in once the continuous camera take (Scenes 1-4) has settled, so it
 * never competes with anything happening during that take.
 */
export function AmbientAccentScene({ count = 140 }: AmbientAccentSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { prefersReducedMotion } = useReducedMotion();
  const { progressRef: scrollProgressRef } = useScrollTimeline();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 6 - 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    return arr;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#ffe3b0",
        size: 0.02,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((state) => {
    const fadeIn = THREE.MathUtils.smoothstep(
      scrollProgressRef.current,
      sceneProgress.restaurantEnd - 0.05,
      sceneProgress.restaurantEnd
    );
    material.opacity = fadeIn * 0.3;

    if (prefersReducedMotion || !pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i) + 0.0015;
      posAttr.setY(i, y > 5 ? -1 : y);
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}
