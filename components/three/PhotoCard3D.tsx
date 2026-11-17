"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, useTexture } from "@react-three/drei";
import { site } from "@/lib/site";

export type PointerState = { x: number; y: number };

const H = 3.0; // card height in world units
const BEZEL = 0.1;
const DEPTH = 0.22;
const MAX_TILT = THREE.MathUtils.degToRad(15);

export default function PhotoCard3D({
  pointer,
  progress,
}: {
  pointer: RefObject<PointerState>;
  progress: RefObject<number>;
}) {
  const texture = useTexture(site.photo, (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });

  // Keep the photo's real aspect ratio (never stretched)
  const img = texture.image as { width: number; height: number };
  const aspect = img && img.width && img.height ? img.width / img.height : 3 / 4;
  const photoH = H - BEZEL * 2;
  const photoW = photoH * aspect;
  const W = photoW + BEZEL * 2;

  const group = useRef<THREE.Group>(null);
  const cursorLight = useRef<THREE.PointLight>(null);

  useEffect(() => {
    return () => {
      texture.dispose();
      useTexture.clear(site.photo);
    };
  }, [texture]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const damp = THREE.MathUtils.damp;
    const m = pointer.current;
    const p = progress.current;

    // Damped tilt toward the mouse (max ~15deg) + scroll-driven rotate/drift away
    g.rotation.y = damp(g.rotation.y, m.x * MAX_TILT + p * 1.5, 4, dt);
    g.rotation.x = damp(g.rotation.x, -m.y * MAX_TILT + p * 0.3, 4, dt);
    g.position.x = damp(g.position.x, p * 1.0, 3, dt);
    g.position.y = damp(g.position.y, p * 1.8, 3, dt);
    g.position.z = damp(g.position.z, -p * 1.6, 3, dt);

    // Coral highlight that follows the cursor
    const l = cursorLight.current;
    if (l) {
      l.position.x = damp(l.position.x, m.x * 2.8, 6, dt);
      l.position.y = damp(l.position.y, m.y * 2.4, 6, dt);
    }
  });

  return (
    <>
      <pointLight ref={cursorLight} color="#FF6B57" intensity={30} distance={9} decay={2} position={[0, 0, 2.6]} />
      <group ref={group}>
        <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.55} floatingRange={[-0.08, 0.08]}>
          <group>
            {/* thick glass-like slab */}
            <RoundedBox args={[W, H, DEPTH]} radius={0.12} smoothness={4} creaseAngle={0.4}>
              <meshPhysicalMaterial
                color="#141C3F"
                roughness={0.18}
                metalness={0.25}
                clearcoat={1}
                clearcoatRoughness={0.08}
                reflectivity={0.6}
              />
            </RoundedBox>
            {/* the photo, on the front face */}
            <mesh position={[0, 0, DEPTH / 2 + 0.004]}>
              <planeGeometry args={[photoW, photoH]} />
              <meshStandardMaterial
                map={texture}
                emissiveMap={texture}
                emissive="#ffffff"
                emissiveIntensity={0.5}
                roughness={0.55}
                metalness={0}
              />
            </mesh>
            {/* glass sheen over the photo */}
            <mesh position={[0, 0, DEPTH / 2 + 0.012]}>
              <planeGeometry args={[photoW, photoH]} />
              <meshPhysicalMaterial
                color="#F5EEE6"
                transparent
                opacity={0.07}
                clearcoat={1}
                roughness={0}
                depthWrite={false}
              />
            </mesh>
          </group>
        </Float>
      </group>
    </>
  );
}
