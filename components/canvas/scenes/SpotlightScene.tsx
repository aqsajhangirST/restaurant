"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { colors } from "@/lib/constants";
import { contactWideningProgress, reservationSpotlightProgress } from "@/lib/sceneRefs";

/**
 * Scene 12 — Reservation's "ambient 3D accent reintroduced": a single
 * warm spotlight cone over a near-black field, evoking one lit table in
 * an otherwise dim room — the storyboard's "most 3D-lighting-as-
 * storytelling moment outside Scenes 1-4." AmbientAccentScene already
 * supplies the sparse warm dust motes for this and every other Scene 5+
 * section, so this component only adds the light itself.
 *
 * Also carries Scene 13 — Contact's continuation of the same light: per
 * the storyboard, the spotlight "widens and cools slightly" rather than
 * a second light appearing, so contactWideningProgress blends this same
 * spotLight's angle/penumbra/color toward a wider, cooler (more neutral
 * ivory, less amber) state as Contact scrolls into view.
 *
 * Driven by module-level refs (see lib/sceneRefs.ts) rather than the
 * master scroll timeline, since that timeline is pinned at 1 for the
 * entire page once the Scenes 1-4 scroll-stage ends — it can't tell
 * "user is at Reservation" apart from "user is at Contact." Reduced
 * motion doesn't disable this scene (it's a static light once lit, not an
 * animated effect) — the driving sections just snap their progress refs
 * to 1 immediately instead of tweening them.
 */
export function SpotlightScene() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const warmColor = useMemo(() => new THREE.Color(colors.light400), []);
  const coolColor = useMemo(() => new THREE.Color(colors.ivory50), []);
  const blendedColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!lightRef.current) return;
    const widen = contactWideningProgress.current;

    lightRef.current.intensity = reservationSpotlightProgress.current * 9;
    lightRef.current.angle = THREE.MathUtils.lerp(0.32, 0.58, widen);
    lightRef.current.penumbra = THREE.MathUtils.lerp(0.65, 0.85, widen);
    blendedColor.copy(warmColor).lerp(coolColor, widen * 0.6);
    lightRef.current.color.copy(blendedColor);
  });

  return (
    <>
      <primitive object={target} position={[0, -1.4, -0.6]} />
      <spotLight
        ref={lightRef}
        position={[0, 3.2, 1.4]}
        target={target}
        angle={0.32}
        penumbra={0.65}
        decay={2}
        distance={9}
        color={colors.light400}
        intensity={0}
      />
      <ambientLight intensity={0.015} color={colors.charcoal700} />
    </>
  );
}
