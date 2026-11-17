"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Custom cursor, only on fine-pointer devices without reduced motion. */
export default function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduce;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    document.documentElement.classList.add("has-cursor");

    gsap.set([d, r], { opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power2.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power2.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      gsap.to([d, r], { opacity: 1, duration: 0.2, overwrite: "auto" });
    };
    const onOver = (e: PointerEvent) => {
      const hot = (e.target as HTMLElement | null)?.closest("a,button,[role='button'],input,textarea,[data-cursor]");
      gsap.to(r, { scale: hot ? 1.9 : 1, duration: 0.3, ease: "power3.out" });
      gsap.to(d, { scale: hot ? 0.4 : 1, duration: 0.3, ease: "power3.out" });
    };
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
      <div ref={ring} className="fixed left-0 top-0 -ml-5 -mt-5 h-10 w-10 rounded-full border border-coral/70" />
      <div ref={dot} className="fixed left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-coral" />
    </div>
  );
}
