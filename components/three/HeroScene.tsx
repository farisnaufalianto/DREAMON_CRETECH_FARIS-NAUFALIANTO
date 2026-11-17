"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import PhotoCard3D, { type PointerState } from "./PhotoCard3D";
import FloatingShapes from "./FloatingShapes";

/**
 * Transparent R3F canvas over the CSS atmosphere.
 * Lighting only (no HDR / Environment files, so no network requests).
 */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const progress = useRef(0);
  const [active, setActive] = useState(true);

  // Pause rendering when the hero is out of view + track the mouse
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // ScrollTrigger drives the progress ref: the card rotates and drifts away as the visitor leaves the hero
  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={host} role="img" aria-label={site.photoAlt} className="absolute inset-0 animate-[fade-in_0.9s_ease-out_both]">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 7], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} color="#F5EEE6" />
        {/* cream rim light */}
        <pointLight position={[-3, 2.2, -2]} intensity={40} color="#F5EEE6" distance={12} decay={2} />
        {/* coral key light */}
        <pointLight position={[3, -1.5, 3]} intensity={26} color="#FF6B57" distance={10} decay={2} />
        <Suspense fallback={null}>
          <PhotoCard3D pointer={pointer} progress={progress} />
          <FloatingShapes pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
