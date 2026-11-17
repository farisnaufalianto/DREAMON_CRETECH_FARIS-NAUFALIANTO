"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { projects, type Project } from "@/lib/site";
import ProjectVisual from "./ProjectVisual";
import ProjectPanel from "./ProjectPanel";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pinned section, scrolling moves the projects horizontally
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const t = track.current;
        const p = pin.current;
        if (!t || !p) return;
        const distance = () => Math.max(0, t.scrollWidth - p.clientWidth);
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: p,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar.current, { scaleX: self.progress });
            },
          },
        });
      });

      // Mobile / tablet / reduced motion: vertical layout with simple reveals
      mm.add(`(max-width: 1023px), (prefers-reduced-motion: reduce)`, () => {
        if (!window.matchMedia(MOTION_OK).matches) return;
        gsap.utils.toArray<HTMLElement>("[data-project]", root.current).forEach((el) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const radius = ["rounded-[2.5rem]", "rounded-tr-[6rem] rounded-bl-[6rem] rounded-tl-2xl rounded-br-2xl"];

  return (
    <section ref={root} id="projects" className="relative">
      <div
        ref={pin}
        className="flex flex-col justify-center py-24 lg:motion-safe:h-[100svh] lg:motion-safe:overflow-hidden lg:motion-safe:py-0"
      >
        <div
          ref={track}
          className="container-x flex flex-col gap-24 lg:motion-safe:max-w-none lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-20 lg:motion-safe:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:motion-safe:after:block lg:motion-safe:after:w-px lg:motion-safe:after:shrink-0 lg:motion-safe:after:content-['']"
        >
          {/* intro */}
          <div className="lg:motion-safe:w-[28rem] lg:motion-safe:shrink-0">
            <h2 className="text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[0.95] tracking-[-0.045em]">Projects</h2>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-cream/70">
              Personal projects where I experiment, learn, and improve my development skills.
            </p>
            <div className="mt-10 hidden h-[2px] w-56 bg-cream/10 lg:motion-safe:block">
              <div ref={bar} className="h-full origin-left bg-coral" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>

          {projects.map((project, i) => (
            <article
              key={project.id}
              data-project
              className="group flex w-full flex-col gap-8 lg:motion-safe:w-[62rem] lg:motion-safe:max-w-[86vw] lg:motion-safe:shrink-0 lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-12"
            >
              <div
                className={`relative aspect-[4/3] w-full overflow-hidden border border-cream/10 bg-navy lg:motion-safe:w-[56%] ${radius[i % radius.length]}`}
              >
                <div className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
                  <ProjectVisual kind={project.visual} title={project.title} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,107,87,0.28),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <div className="lg:motion-safe:w-[44%]">
                <h3 className="text-[clamp(1.8rem,3.2vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">
                  {project.title}
                </h3>
                <p className="mt-4 leading-relaxed text-cream/70">{project.short}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {project.tech.map((t) => (
                    <li key={t} className="rounded-full border border-cream/20 px-3.5 py-1 text-sm text-cream/85">
                      {t}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-coral px-6 py-3 text-[0.95rem] text-cream transition-colors hover:bg-coral hover:text-ink"
                >
                  View Project
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && <ProjectPanel project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
