"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { goal } from "@/lib/site";
import { useReveal } from "@/hooks/useReveal";

const PATH = "M20 310 C 240 310 300 200 500 200 S 780 50 980 50";
// node positions (percent of the 1000x360 viewBox) that sit on PATH
const NODES = [
  { left: "2%", top: "86.1%" },
  { left: "50%", top: "55.6%" },
  { left: "98%", top: "13.9%" },
] as const;

export default function Goals() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: a path that grows from bottom-left to top-right
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-path-box]", start: "top 72%", end: "bottom 45%", scrub: 0.6 },
        });
        tl.fromTo("[data-clip]", { scaleX: 0 }, { scaleX: 1, svgOrigin: "0 0", ease: "none", duration: 3 }, 0);
        NODES.forEach((_, i) => {
          const at = i === 0 ? 0 : i === 1 ? 1.4 : 2.7;
          tl.from(`[data-node="${i}"]`, { scale: 0, opacity: 0, duration: 0.3, ease: "back.out(2)" }, at);
          tl.from(`[data-label="${i}"]`, { y: 14, opacity: 0, duration: 0.4 }, at + 0.05);
        });
      });

      // Mobile: a vertical line that grows, steps reveal
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-vline]",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: { trigger: "[data-vbox]", start: "top 75%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.from("[data-vstep]", {
          y: 30,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: { trigger: "[data-vbox]", start: "top 75%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const labelPos = [
    { left: "2%", bottom: "calc(13.9% + 22px)" },
    { left: "50%", top: "calc(55.6% + 26px)", marginLeft: "-8rem" },
    { right: "2%", top: "calc(13.9% + 26px)", textAlign: "right" as const },
  ];

  return (
    <section ref={root} id="goals" className="relative py-28 md:py-40">
      <div className="container-x">
        <p data-reveal className="text-cream/60">
          Career goal
        </p>
        <h2
          data-reveal
          className="mt-5 max-w-5xl text-[clamp(1.8rem,4.2vw,3.8rem)] font-light leading-[1.12] tracking-[-0.035em]"
        >
          {goal.statement}
        </h2>

        {/* desktop path */}
        <div data-path-box className="relative mt-24 hidden aspect-[1000/380] w-full md:block">
          <svg viewBox="0 0 1000 360" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <clipPath id="grow-clip">
                <rect data-clip x="0" y="-40" width="1000" height="440" />
              </clipPath>
              <linearGradient id="grow-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#5B6A9A" />
                <stop offset="1" stopColor="#FF6B57" />
              </linearGradient>
            </defs>
            <path d={PATH} fill="none" stroke="#5B6A9A" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 9" vectorEffect="non-scaling-stroke" />
            <g clipPath="url(#grow-clip)">
              <path d={PATH} fill="none" stroke="url(#grow-grad)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          {NODES.map((n, i) => (
            <span
              key={i}
              data-node={i}
              aria-hidden="true"
              className={`absolute -ml-2.5 -mt-2.5 block h-5 w-5 rounded-full ring-8 ${
                i === 2 ? "bg-coral ring-coral/25" : "bg-cream ring-cream/10"
              }`}
              style={{ left: n.left, top: n.top }}
            />
          ))}

          {goal.steps.map((s, i) => (
            <div key={s.title} data-label={i} className="absolute w-64" style={labelPos[i]}>
              <h3 className="text-xl font-light tracking-[-0.02em] text-cream">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{s.text}</p>
            </div>
          ))}
        </div>

        {/* mobile path */}
        <div data-vbox className="relative mt-14 md:hidden">
          <div className="absolute bottom-2 left-[9px] top-2 w-px bg-cream/10" aria-hidden="true" />
          <div
            data-vline
            className="absolute bottom-2 left-[9px] top-2 w-px bg-gradient-to-b from-steel to-coral"
            aria-hidden="true"
          />
          <ol className="space-y-10">
            {goal.steps.map((s, i) => (
              <li key={s.title} data-vstep className="relative pl-10">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1 block h-[19px] w-[19px] rounded-full ${i === 2 ? "bg-coral" : "bg-cream"}`}
                />
                <h3 className="text-xl font-light text-cream">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
