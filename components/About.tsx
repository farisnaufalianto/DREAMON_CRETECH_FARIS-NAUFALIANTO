"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { about } from "@/lib/site";
import SplitWords from "./SplitWords";

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span data-w>{w}</span>{" "}
        </span>
      ))}
    </>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Scroll-scrubbed word-by-word highlight (first two paragraphs)
        gsap.utils.toArray<HTMLElement>("[data-scrub]", root.current).forEach((p) => {
          gsap.fromTo(
            p.querySelectorAll("[data-w]"),
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 50%", scrub: true },
            },
          );
        });

        // Remaining paragraphs reveal in sequence
        const seq = gsap.utils.toArray<HTMLElement>("[data-seq]", root.current);
        gsap.set(seq, { opacity: 0, y: 36 });
        ScrollTrigger.batch(seq, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: "power3.out", overwrite: true }),
        });

        // Closing statement
        gsap.from("[data-closing-word]", {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-closing]", start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const closingWords = about.closing.split(" ").length;

  return (
    <section ref={root} id="about" className="relative py-28 md:py-44">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <p className="text-cream/60">About me</p>
              <h2 className="mt-4 text-[clamp(2rem,3.6vw,3.4rem)] font-light leading-[1.05] tracking-[-0.035em]">
                {about.greeting}
              </h2>
            </div>
          </div>

          <div className="space-y-14 md:col-span-8">
            {about.scrubbed.map((p) => (
              <p
                key={p}
                data-scrub
                className="text-[clamp(1.35rem,2.4vw,2.2rem)] font-light leading-[1.28] tracking-[-0.02em]"
              >
                <Words text={p} />
              </p>
            ))}
            <div className="max-w-2xl space-y-7">
              {about.sequence.map((p) => (
                <p key={p} data-seq className="text-[1.05rem] leading-[1.75] text-cream/70">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div data-closing className="mt-28 md:mt-40">
          <SplitWords
            as="p"
            wordAttr="data-closing-word"
            text={about.closing}
            accentFrom={closingWords - 5}
            className="block max-w-5xl text-[clamp(2.4rem,7vw,6.4rem)] font-light leading-[1] tracking-[-0.04em]"
          />
        </div>
      </div>
    </section>
  );
}
