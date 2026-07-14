"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { colors } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FogVolumeProps {
  /** 0 = clear, 1 = fully rolled in. Ref-driven, per the field's usual
   *  convention in this codebase. */
  opacity: { current: number };
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5 + sin(uTime * 0.08) * 0.08, 0.35);
    float d = distance(vUv, center);
    float falloff = smoothstep(0.55, 0.05, d);
    gl_FragColor = vec4(uColor, falloff * uOpacity * 0.5);
  }
`;

/**
 * Two large soft planes standing in for the storyboard's rolling fog — no
 * volumetric rendering, just a shaped alpha gradient drifting slowly, per
 * three-scene-plan.md's FogVolume entry. Positioned low in frame so it
 * reads as ground fog rather than an overlay across the whole scene.
 */
export function FogVolume({ opacity }: FogVolumeProps) {
  const materialRefA = useRef<THREE.ShaderMaterial>(null);
  const materialRefB = useRef<THREE.ShaderMaterial>(null);
  const { prefersReducedMotion } = useReducedMotion();

  const uniformsA = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(colors.charcoal700) },
    }),
    []
  );
  const uniformsB = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(colors.bloom900) },
    }),
    []
  );

  useFrame((state) => {
    const t = prefersReducedMotion ? 0 : state.clock.elapsedTime;
    if (materialRefA.current) {
      materialRefA.current.uniforms.uTime.value = t;
      materialRefA.current.uniforms.uOpacity.value = opacity.current;
    }
    if (materialRefB.current) {
      materialRefB.current.uniforms.uTime.value = t * 0.8 + 10;
      materialRefB.current.uniforms.uOpacity.value = opacity.current * 0.7;
    }
  });

  return (
    <>
      <mesh position={[0, -1.4, -1]}>
        <planeGeometry args={[9, 4]} />
        <shaderMaterial
          ref={materialRefA}
          transparent
          depthWrite={false}
          uniforms={uniformsA}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <mesh position={[0.6, -1.1, -0.4]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[7, 3.2]} />
        <shaderMaterial
          ref={materialRefB}
          transparent
          depthWrite={false}
          uniforms={uniformsB}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
}
