"use client";

import type { RefObject } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Section reveals. Any element with [data-reveal] fades/slides in once;
 * any element with [data-stagger] reveals its children in sequence.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]", scope.current).forEach((el) => {
          gsap.from(el, {
            y: 48,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-stagger]", scope.current).forEach((group) => {
          gsap.from(group.children, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
