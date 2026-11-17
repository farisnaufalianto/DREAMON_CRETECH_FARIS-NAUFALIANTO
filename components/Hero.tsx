"use client";

import { useRef } from "react";
import { ArrowUpRight, BookOpen, Code, Download, Smartphone, Sparkles } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { hero } from "@/lib/site";
import SplitWords from "./SplitWords";
import HeroVisual from "./HeroVisual";
import Magnetic from "./Magnetic";
import ScrollLink from "./ScrollLink";

const ICONS = { code: Code, book: BookOpen, responsive: Smartphone, open: Sparkles } as const;

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from("[data-hero-status]", { y: 16, opacity: 0, duration: 0.8 })
          .from("[data-hero-word]", { yPercent: 115, duration: 1.2, stagger: 0.09 }, "-=0.5")
          .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.8")
          .from("[data-hero-visual]", { scale: 0.92, opacity: 0, y: 30, duration: 1.4 }, "-=1.2")
          .from("[data-hero-panel]", { y: 30, opacity: 0, duration: 1 }, "-=0.8")
          .from(
            "[data-hero-line]",
            { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: "power3.inOut" },
            "-=0.6",
          )
          .from("[data-hero-item]", { y: 14, opacity: 0, stagger: 0.08, duration: 0.7 }, "-=1.2");

        // copy fades and drifts up while the visitor scrolls away
        gsap.to("[data-hero-copy]", {
          yPercent: -10,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" className="relative flex min-h-[100svh] flex-col pt-24 md:pt-28">
      <div className="container-x grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div data-hero-copy>
          <p
            data-hero-status
            className="inline-flex items-center gap-3 rounded-full border border-cream/15 py-2 pl-4 pr-5 text-sm text-cream/85"
          >
            <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-coral" aria-hidden="true" />
            {hero.status}
          </p>

          <h1 className="mt-7 font-light leading-[0.92] tracking-[-0.045em]">
            <SplitWords
              as="span"
              wordAttr="data-hero-word"
              text={hero.line1}
              className="block text-[clamp(3.4rem,9.2vw,8.6rem)]"
            />
            <SplitWords
              as="span"
              wordAttr="data-hero-word"
              text={hero.line2}
              className="mt-3 block text-[clamp(1.9rem,4.6vw,4.2rem)] leading-[1] text-cream/85"
            />
          </h1>

          <p data-hero-fade className="mt-8 max-w-xl text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-cream/70">
            {hero.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-3">
            <div data-hero-fade>
              <Magnetic>
                <ScrollLink
                  id="projects"
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-coral-soft"
                >
                  View my projects
                  <ArrowUpRight size={18} aria-hidden="true" />
                </ScrollLink>
              </Magnetic>
            </div>
            <div data-hero-fade>
              <Magnetic>
                <ScrollLink
                  id="contact"
                  className="inline-flex items-center rounded-full border border-cream/25 px-7 py-3.5 text-[0.95rem] text-cream transition-colors hover:border-cream/60 hover:bg-cream/5"
                >
                  Contact me
                </ScrollLink>
              </Magnetic>
            </div>
            <div data-hero-fade>
              <Magnetic>
                <a
                  href="/CV-Faris-Naufalianto.pdf"
                  download="CV-Faris-Naufalianto.pdf"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 text-[0.95rem] text-cream transition-colors hover:border-coral hover:text-coral-soft"
                >
                  <Download size={17} aria-hidden="true" />
                  Download CV
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            data-hero-visual
            className="relative mx-auto aspect-[4/5]"
            style={{ width: "min(100%, 34rem, calc(62svh * 0.8))" }}
          >
            <HeroVisual />
          </div>

          <aside
            data-hero-panel
            aria-label="About this site"
            className="mx-auto mt-8 w-full max-w-[19rem] rounded-[1.4rem] border border-cream/15 bg-cream/[0.06] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:absolute lg:-bottom-3 lg:-left-12 lg:mx-0 lg:mt-0"
          >
            <dl className="space-y-4 text-sm">
              {hero.panel.map((row) => (
                <div key={row.label}>
                  <dt className="text-cream/55">{row.label}</dt>
                  <dd className="mt-0.5 text-cream">{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>

      <div className="container-x pb-8 pt-10">
        <div className="relative h-[2px] w-full bg-cream/10">
          <div
            data-hero-line
            className="absolute inset-0 origin-left bg-gradient-to-r from-coral via-coral to-transparent"
          />
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {hero.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.label} data-hero-item className="flex items-center gap-3 text-sm text-cream/75">
                <Icon size={16} className="shrink-0 text-coral-soft" aria-hidden="true" />
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}