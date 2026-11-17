"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";

/** Wraps a button/link so it is gently pulled toward the cursor (fine pointers only). */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const area = outer.current;
      const el = inner.current;
      if (!area || !el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.5)" });
        const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.5)" });
        const move = (e: PointerEvent) => {
          const r = area.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * strength);
          y((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        area.addEventListener("pointermove", move);
        area.addEventListener("pointerleave", leave);
        return () => {
          area.removeEventListener("pointermove", move);
          area.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: outer, dependencies: [strength] },
  );

  return (
    <div ref={outer} className={`-m-3 inline-block p-3 ${className}`}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
