"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { PointerState } from "./PhotoCard3D";

type Vec3 = [number, number, number];

/** Moves its children with the mouse at a given depth factor (parallax). */
function Parallax({
  pointer,
  depth,
  position,
  children,
}: {
  pointer: RefObject<PointerState>;
  depth: number;
  position: Vec3;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = THREE.MathUtils.damp(g.position.x, position[0] + pointer.current.x * depth, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, position[1] + pointer.current.y * depth, 3, dt);
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function GlassSphere({ r, color = "#F5EEE6" }: { r: number; color?: string }) {
  return (
    <mesh>
      <sphereGeometry args={[r, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.55}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.05}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function FloatingShapes({ pointer }: { pointer: RefObject<PointerState> }) {
  return (
    <>
      {/* distorted coral icosahedron */}
      <Parallax pointer={pointer} depth={0.5} position={[-1.7, 1.25, 0.7]}>
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1}>
          <mesh>
            <icosahedronGeometry args={[0.38, 1]} />
            <MeshDistortMaterial color="#FF6B57" distort={0.4} speed={1.6} roughness={0.25} metalness={0.1} />
          </mesh>
        </Float>
      </Parallax>

      {/* thin cream torus */}
      <Parallax pointer={pointer} depth={-0.35} position={[1.6, 1.45, -0.5]}>
        <Float speed={1.6} rotationIntensity={2} floatIntensity={0.8}>
          <mesh rotation={[1.1, 0.4, 0]}>
            <torusGeometry args={[0.52, 0.022, 16, 80]} />
            <meshStandardMaterial color="#F5EEE6" roughness={0.4} metalness={0.3} />
          </mesh>
        </Float>
      </Parallax>

      {/* small glass spheres */}
      <Parallax pointer={pointer} depth={0.7} position={[1.55, -1.2, 0.8]}>
        <Float speed={1.8} floatIntensity={1.2}>
          <GlassSphere r={0.2} />
        </Float>
      </Parallax>
      <Parallax pointer={pointer} depth={-0.6} position={[-1.6, -1.05, 0.4]}>
        <Float speed={2.2} floatIntensity={1}>
          <GlassSphere r={0.13} color="#FF8A73" />
        </Float>
      </Parallax>
      <Parallax pointer={pointer} depth={0.3} position={[0.35, 1.9, -0.9]}>
        <Float speed={1.4} floatIntensity={0.8}>
          <GlassSphere r={0.09} />
        </Float>
      </Parallax>
    </>
  );
}
