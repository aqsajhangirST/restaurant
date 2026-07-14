"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { colors } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PetalFieldProps {
  /** 0 = closed/unformed, 1 = fully opened and drifting. Ref-driven so
   *  this updates every frame without a React re-render, matching
   *  GoldEmberField's convention. */
  openProgress: { current: number };
  count?: number;
  radius?: number;
}

interface PetalSeed {
  seed: number;
  basePos: THREE.Vector3;
  scale: number;
  rotation: number;
  driftSpeed: number;
}

/** A simple tapered teardrop silhouette, built from two bezier curves —
 *  reads as a petal without needing an image asset (same approach as
 *  GoldEmberField's procedural seal). */
function buildPetalGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.18, 0.08, 0.16, 0.42, 0, 0.6);
  shape.bezierCurveTo(-0.16, 0.42, -0.18, 0.08, 0, 0);
  return new THREE.ShapeGeometry(shape, 8);
}

/** Bakes a soft two-tone gradient (bloom-300 base -> bloom-700 tip) as
 *  vertex colors, so the material can stay a plain MeshBasicMaterial with
 *  no texture and no custom shader. */
function applyGradientVertexColors(geometry: THREE.ShapeGeometry) {
  const colorA = new THREE.Color(colors.bloom300);
  const colorB = new THREE.Color(colors.bloom700);
  const position = geometry.attributes.position;
  const colorArray = new Float32Array(position.count * 3);

  for (let i = 0; i < position.count; i++) {
    const t = THREE.MathUtils.clamp(position.getY(i) / 0.6, 0, 1);
    const c = colorA.clone().lerp(colorB, t);
    colorArray[i * 3] = c.r;
    colorArray[i * 3 + 1] = c.g;
    colorArray[i * 3 + 2] = c.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
}

export function PetalField({ openProgress, count = 260, radius = 2.2 }: PetalFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { prefersReducedMotion } = useReducedMotion();

  const geometry = useMemo(() => {
    const geo = buildPetalGeometry();
    applyGradientVertexColors(geo);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  const seeds = useMemo<PetalSeed[]>(() => {
    const arr: PetalSeed[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        seed: Math.random(),
        basePos: new THREE.Vector3(
          (Math.random() - 0.5) * radius * 2,
          Math.random() * radius * 1.4 - radius * 0.4,
          (Math.random() - 0.5) * radius * 1.2
        ),
        scale: 0.4 + Math.random() * 0.7,
        rotation: Math.random() * Math.PI * 2,
        driftSpeed: 0.15 + Math.random() * 0.25,
      });
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const p = seeds[i];
      const staggered = THREE.MathUtils.clamp(
        (openProgress.current - p.seed * 0.35) / 0.65,
        0,
        1
      );
      const eased = 1 - Math.pow(1 - staggered, 3);

      // Gentle pseudo curl-noise from layered sines — cheap, dependency-free,
      // and enough to read as "wind" at this particle count. A real
      // simplex-noise curl field is a reasonable upgrade path later, not a
      // requirement at this scope.
      const windX = prefersReducedMotion ? 0 : Math.sin(t * p.driftSpeed + p.seed * 12.9) * 0.35;
      const windY = prefersReducedMotion ? 0 : Math.cos(t * p.driftSpeed * 0.7 + p.seed * 7.2) * 0.12;
      const windZ = prefersReducedMotion ? 0 : Math.sin(t * p.driftSpeed * 0.5 + p.seed * 4.1) * 0.25;
      const fall = prefersReducedMotion ? 0 : t * 0.02;

      dummy.position.set(
        p.basePos.x + windX * eased,
        p.basePos.y + (windY - fall) * eased,
        p.basePos.z + windZ * eased
      );
      dummy.rotation.set(0, 0, p.rotation + (prefersReducedMotion ? 0 : t * 0.05 * p.driftSpeed));
      dummy.scale.setScalar(p.scale * eased);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}
