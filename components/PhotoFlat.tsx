"use client";

import { useRef } from "react";
import { gsap, useGSAP, FINE_POINTER } from "@/lib/gsap";
import PhotoImage from "./PhotoImage";

/**
 * 2D version of the hero portrait.
 * - "tilt": CSS 3D tilt toward the cursor + coral highlight (WebGL unavailable / reduced motion)
 * - "static": no pointer tracking, gentle floating (touch and small screens)
 */
export default function PhotoFlat({ mode }: { mode: "tilt" | "static" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (mode !== "tilt") return;
      const mm = gsap.matchMedia();
      mm.add(FINE_POINTER, () => {
        const clamp = gsap.utils.clamp(-1, 1);
        const rx = gsap.quickTo(card.current, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(card.current, "rotationY", { duration: 0.8, ease: "power3.out" });
        const gx = gsap.quickTo(glow.current, "x", { duration: 0.6, ease: "power3.out" });
        const gy = gsap.quickTo(glow.current, "y", { duration: 0.6, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = wrap.current?.getBoundingClientRect();
          if (!r) return;
          const nx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
          const ny = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
          ry(nx * 15);
          rx(-ny * 15);
          gx(nx * 140);
          gy(ny * 180);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: wrap, dependencies: [mode] },
  );

  return (
    <div ref={wrap} className="grid h-full w-full place-items-center [perspective:1100px]">
      <div className="float-y aspect-[3/4] h-[88%]">
        <div
          ref={card}
          className="relative h-full w-full overflow-hidden rounded-[2rem] border border-cream/20 bg-navy shadow-[0_50px_120px_-30px_rgba(255,107,87,0.45),0_30px_60px_-30px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]"
        >
          <PhotoImage className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div
              ref={glow}
              className="h-80 w-80 rounded-full mix-blend-screen"
              style={{ background: "radial-gradient(closest-side, rgba(255,107,87,0.5), rgba(255,107,87,0))" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cream/15 via-transparent to-ink/30" />
        </div>
      </div>
    </div>
  );
}
