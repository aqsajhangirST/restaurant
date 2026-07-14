"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { colors, sceneProgress } from "@/lib/constants";
import { useScrollTimeline } from "@/hooks/useScrollTimeline";

interface BranchSeed {
  curve: THREE.CatmullRomCurve3;
  radius: number;
}

/**
 * Procedurally builds a small cluster of branch arms radiating up and out
 * from a low trunk point — a stylized stand-in for the canopy's real
 * structure, not a literal tree render. Same "procedural, not photoreal"
 * approach as GoldEmberField's seal and PetalField's petals: no asset
 * required, swap for a real modeled/scanned canopy asset later if wanted.
 */
function buildBranches(count: number): BranchSeed[] {
  const branches: BranchSeed[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const reach = 1.6 + Math.random() * 1.4;
    const rise = 2.2 + Math.random() * 1.6;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.4, 0),
      new THREE.Vector3(
        Math.cos(angle) * reach * 0.35,
        rise * 0.4,
        Math.sin(angle) * reach * 0.35
      ),
      new THREE.Vector3(
        Math.cos(angle) * reach * 0.7,
        rise * 0.75,
        Math.sin(angle) * reach * 0.7
      ),
      new THREE.Vector3(Math.cos(angle) * reach, rise, Math.sin(angle) * reach),
    ]);
    branches.push({ curve, radius: 0.05 + Math.random() * 0.03 });
  }
  return branches;
}

function Branch({
  seed,
  growProgress,
}: {
  seed: BranchSeed;
  growProgress: { current: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(seed.curve, 24, seed.radius, 6, false),
    [seed]
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: colors.rosewood700,
        roughness: 0.85,
        metalness: 0,
      }),
    []
  );

  useFrame(() => {
    if (!meshRef.current) return;
    // "Grows" by scaling up from the base rather than animating geometry —
    // cheap, and reads fine at this scale/distance.
    meshRef.current.scale.setScalar(THREE.MathUtils.clamp(growProgress.current, 0.001, 1));
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

/**
 * Scene 3 — Tree. The petals from Scene 2 are revealed as part of one
 * cascading canopy: branches grow in as the camera cranes up and back
 * (CameraRig), and a handful of small warm points appear scattered through
 * the structure — proto-bulbs foreshadowing Scene 4's real pendant lights
 * (three-scene-plan.md §4 MultiPendantLights), each igniting in a light
 * stagger rather than all at once.
 */
export function TreeScene() {
  const branches = useMemo(() => buildBranches(7), []);
  const growProgressRef = useRef(0);
  const bulbRefs = useRef<Array<THREE.PointLight | null>>([]);
  const { progressRef: scrollProgressRef } = useScrollTimeline();

  const bulbPositions = useMemo(
    () => branches.slice(0, 5).map((b) => b.curve.getPointAt(0.92)),
    [branches]
  );

  useFrame(() => {
    const span = sceneProgress.treeEnd - sceneProgress.treeStart;
    const local = THREE.MathUtils.clamp(
      (scrollProgressRef.current - sceneProgress.treeStart) / span,
      0,
      1
    );
    growProgressRef.current = local;

    bulbRefs.current.forEach((light, i) => {
      if (!light) return;
      const stagger = THREE.MathUtils.clamp((local - i * 0.08) / 0.4, 0, 1);
      light.intensity = stagger * 0.5;
    });
  });

  return (
    <>
      {branches.map((seed, i) => (
        <Branch key={i} seed={seed} growProgress={growProgressRef} />
      ))}
      {bulbPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={colors.light200} />
          </mesh>
          <pointLight
            ref={(el) => {
              bulbRefs.current[i] = el;
            }}
            color={colors.light400}
            intensity={0}
            distance={2.2}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}
