"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { colors } from "@/lib/constants";

interface GoldEmberFieldProps {
  /** 0 = scattered embers, 1 = fully converged into the seal silhouette.
   *  Passed as a ref (not a prop value) so the parent's GSAP timeline can
   *  update it every frame without triggering a React re-render. */
  progress: { current: number };
  /** 1 = fully visible, 0 = fully faded — driven by scroll progress once
   *  the user scrolls past Scene 1, releasing into Scene 2 (see
   *  LoadingScene). Optional so this component still works standalone. */
  fadeOut?: { current: number };
  count?: number;
  radius?: number;
}

/**
 * Procedurally approximates the Bayroute seal's circular badge silhouette:
 * an outer ring, an inner ring, and a small radial mark at center standing
 * in for the bird/crest glyph. This is a deliberate placeholder shape, not
 * a literal trace of the real logo — swap it for `sampleSilhouetteFromImage`
 * (below) once the restaurant supplies a high-resolution seal asset to
 * sample real silhouette points from.
 */
function buildSealTargets(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    let x = 0;
    let y = 0;

    if (t < 0.55) {
      const angle = (t / 0.55) * Math.PI * 2;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else if (t < 0.85) {
      const localT = (t - 0.55) / 0.3;
      const angle = localT * Math.PI * 2;
      x = Math.cos(angle) * radius * 0.62;
      y = Math.sin(angle) * radius * 0.62;
    } else {
      const localT = (t - 0.85) / 0.15;
      const angle = localT * Math.PI * 2;
      const r = radius * 0.18 * (0.4 + 0.6 * Math.abs(Math.sin(localT * Math.PI * 3)));
      x = Math.cos(angle) * r;
      y = Math.sin(angle) * r;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * radius * 0.05;
  }
  return positions;
}

/** Embers begin scattered through a soft sphere volume so they can drift
 *  inward toward the seal from every direction, per storyboard Scene 1. */
function buildScatterPositions(count: number, spread: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = spread * (0.4 + Math.random() * 0.6);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.4;
  }
  return positions;
}

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;
  attribute vec3 aTarget;
  attribute float aSeed;
  varying float vAlpha;

  float easeOutCubic(float x) {
    return 1.0 - pow(1.0 - x, 3.0);
  }

  void main() {
    float staggered = clamp((uProgress - aSeed * 0.25) / 0.75, 0.0, 1.0);
    float eased = easeOutCubic(staggered);

    vec3 pos = mix(position, aTarget, eased);
    pos.x += sin(uTime * 0.6 + aSeed * 6.2831) * 0.02 * (1.0 - eased);
    pos.y += cos(uTime * 0.5 + aSeed * 6.2831) * 0.02 * (1.0 - eased);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z) * 60.0;
    vAlpha = 0.35 + 0.65 * eased;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uFade;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d);
    if (glow <= 0.001) discard;
    vec3 color = mix(uColorA, uColorB, vAlpha);
    gl_FragColor = vec4(color, glow * vAlpha * uFade);
  }
`;

export function GoldEmberField({
  progress,
  fadeOut,
  count = 900,
  radius = 1.6,
}: GoldEmberFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { scatter, target, seeds } = useMemo(() => {
    const seedArray = new Float32Array(count);
    for (let i = 0; i < count; i++) seedArray[i] = Math.random();
    return {
      scatter: buildScatterPositions(count, radius * 2.4),
      target: buildSealTargets(count, radius),
      seeds: seedArray,
    };
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uSize: { value: 3.2 },
      uTime: { value: 0 },
      uFade: { value: 1 },
      uColorA: { value: new THREE.Color(colors.gold700) },
      uColorB: { value: new THREE.Color(colors.gold300) },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uProgress.value = progress.current;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uFade.value = fadeOut ? fadeOut.current : 1;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[scatter, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[target, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}
