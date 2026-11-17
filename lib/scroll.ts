import { gsap } from "@/lib/gsap";

/** Smooth anchor navigation (instant when the visitor prefers reduced motion). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.to(window, {
    duration: reduce ? 0 : 1.2,
    scrollTo: { y: el, autoKill: true },
    ease: "power3.inOut",
    overwrite: "auto",
  });
  history.replaceState(null, "", `#${id}`);
}
