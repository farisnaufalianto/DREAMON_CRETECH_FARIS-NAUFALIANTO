"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

/**
 * Fluted-glass atmosphere: slowly drifting blurred blobs under a ribbed (striped) glass overlay.
 * `contained` reuses it softly inside a section (no mouse, no scroll parallax).
 */
export default function Atmosphere({ contained = false }: { contained?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        if (contained) return;
        gsap.to(layer.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      });

      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        if (contained) return;
        const blobs = gsap.utils.toArray<HTMLElement>("[data-blob]", root.current);
        const movers = blobs.map((el) => ({
          depth: Number(el.dataset.depth ?? 40),
          x: gsap.quickTo(el, "x", { duration: 1.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.8, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.depth);
            m.y(ny * m.depth);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [contained] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={`pointer-events-none inset-0 overflow-hidden ${contained ? "absolute" : "fixed z-0"}`}
      style={
        contained
          ? {
              opacity: 0.75,
              maskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
            }
          : undefined
      }
    >
      <div
        ref={layer}
        className={`absolute inset-x-0 ${contained ? "inset-y-0" : "-top-[12vh] -bottom-[12vh]"}`}
      >
        {/* big coral glow */}
        <div
          data-blob
          data-depth="70"
          className="absolute -right-[16vw] -top-[10vh] aspect-square w-[78vw] max-w-[1200px]"
        >
          <div
            className="blob drift-a"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,107,87,0.62), rgba(255,107,87,0.22) 55%, rgba(255,107,87,0) 100%)",
            }}
          />
        </div>
        {/* navy mass */}
        <div
          data-blob
          data-depth="-50"
          className="absolute -bottom-[14vh] -left-[14vw] aspect-square w-[72vw] max-w-[1100px]"
        >
          <div
            className="blob drift-b"
            style={{ background: "radial-gradient(closest-side, rgba(28,38,86,0.95), rgba(20,28,63,0) 100%)" }}
          />
        </div>
        {/* steel haze */}
        <div data-blob data-depth="40" className="absolute left-[18vw] top-[28vh] aspect-square w-[42vw] max-w-[720px]">
          <div
            className="blob drift-c"
            style={{ background: "radial-gradient(closest-side, rgba(91,106,154,0.32), rgba(91,106,154,0) 100%)" }}
          />
        </div>
        {/* soft coral accent */}
        <div data-blob data-depth="-90" className="absolute bottom-[4vh] left-[38vw] aspect-square w-[28vw] max-w-[480px]">
          <div
            className="blob drift-a"
            style={{ background: "radial-gradient(closest-side, rgba(255,138,115,0.26), rgba(255,138,115,0) 100%)" }}
          />
        </div>
      </div>
      <div className="flutes" />
    </div>
  );
}
