"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Project } from "@/lib/site";
import { useModalA11y } from "@/hooks/useModalA11y";
import ProjectVisual from "./ProjectVisual";

/** In-page project detail panel (glass). Mounted only while a project is selected. */
export default function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useModalA11y(true, onClose, panel);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-backdrop]", { opacity: 0, duration: 0.35 });
        gsap.from(panel.current, { xPercent: 12, opacity: 0, duration: 0.6, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="fixed inset-0 z-[70]">
      <div data-backdrop onClick={onClose} className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto border-l border-cream/15 bg-navy/60 p-6 backdrop-blur-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-coral hover:text-coral-soft"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="mt-6 aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-cream/10">
          <ProjectVisual kind={project.visual} title={project.title} />
        </div>

        <h3 id="project-title" className="mt-8 text-[clamp(1.7rem,3vw,2.3rem)] font-light leading-[1.1] tracking-[-0.03em]">
          {project.title}
        </h3>
        <p className="mt-4 leading-relaxed text-cream/75">{project.description}</p>

        <p className="mt-8 text-sm text-cream/55">Built with</p>
        <ul className="mb-10 mt-3 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full border border-coral/50 px-4 py-1.5 text-sm text-cream">
              {t}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-auto self-start rounded-full bg-coral px-7 py-3 font-medium text-ink transition-colors hover:bg-coral-soft"
        >
          Close
        </button>
      </div>
    </div>
  );
}
