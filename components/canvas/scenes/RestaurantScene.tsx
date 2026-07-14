"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { colors, sceneProgress } from "@/lib/constants";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";
import { endingDimProgress } from "@/lib/sceneRefs";

const PENDANT_COUNT = 6;

/**
 * Scene 4 — Restaurant. The canopy's proto-bulbs (Scene 3) resolve into
 * the room's real pendant lights, staggered on left-to-right, as a back
 * wall and floor fade in from black — the establishing shot the whole
 * continuous take (Scenes 1-4) has been building toward. Kept deliberately
 * abstract (two planes, no furniture modeling) — per the design
 * philosophy, real photography carries the room's detail once Scene 5+
 * exist; this 3D shell only needs to sell "we've arrived," not replace a
 * photograph.
 *
 * This is also where the master scroll-scrub take ends: past this scene's
 * range there is, for now, nowhere further for the camera to go, matching
 * the currently-available scroll track. Scene 5 extends both in the next
 * phase.
 *
 * These same bulbs also close the site out: Scene 14 (Ending) reads
 * endingDimProgress (lib/sceneRefs.ts) to extinguish them again in
 * reverse-staggered order — the rightmost bulb (last to light in Scene 4)
 * is first to go dark, mirroring the ignition sequence in reverse per the
 * storyboard's "symmetric exit."
 */
export function RestaurantScene() {
  const wallMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const floorMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const bulbRefs = useRef<Array<THREE.PointLight | null>>([]);
  const { progressRef: scrollProgressRef } = useScrollTimeline();

  const pendantPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < PENDANT_COUNT; i++) {
      const x = (i - (PENDANT_COUNT - 1) / 2) * 0.9;
      positions.push(new THREE.Vector3(x, 1.6, -2.4));
    }
    return positions;
  }, []);

  useFrame(() => {
    const span = sceneProgress.restaurantEnd - sceneProgress.restaurantStart;
    const local = THREE.MathUtils.clamp(
      (scrollProgressRef.current - sceneProgress.restaurantStart) / span,
      0,
      1
    );
    const dim = endingDimProgress.current;

    if (wallMaterialRef.current) {
      wallMaterialRef.current.opacity = local * (1 - dim);
    }
    if (floorMaterialRef.current) {
      floorMaterialRef.current.opacity = local * 0.9 * (1 - dim);
    }

    bulbRefs.current.forEach((light, i) => {
      if (!light) return;
      const stagger = THREE.MathUtils.clamp((local - i * 0.09) / 0.35, 0, 1);
      const reverseIndex = PENDANT_COUNT - 1 - i;
      const dimStagger = THREE.MathUtils.clamp((dim - reverseIndex * 0.12) / 0.4, 0, 1);
      light.intensity = stagger * (1 - dimStagger) * 1.1;
    });
  });

  return (
    <>
      <mesh position={[0, 1.2, -3]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial
          ref={wallMaterialRef}
          color={colors.charcoal800}
          roughness={0.85}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          ref={floorMaterialRef}
          color={colors.rosewood700}
          roughness={0.3}
          transparent
          opacity={0}
        />
      </mesh>

      {pendantPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshBasicMaterial color={colors.light200} />
          </mesh>
          <pointLight
            ref={(el) => {
              bulbRefs.current[i] = el;
            }}
            color={colors.light400}
            intensity={0}
            distance={4}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}
