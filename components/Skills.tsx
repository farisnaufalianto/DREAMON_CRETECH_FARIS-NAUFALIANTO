"use client";

import { useRef } from "react";
import { BarChart3, Bug, Code, GitBranch, Layers, Send } from "lucide-react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { skills } from "@/lib/site";
import { useReveal } from "@/hooks/useReveal";

const TOOL_ICONS = { code: Code, git: GitBranch, layers: Layers, chart: BarChart3, send: Send, bug: Bug } as const;

/* 1. Magnetic hover tag cloud */
function TagCloud({ items }: { items: readonly string[] }) {
  const box = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = box.current;
        if (!el) return;
        const tags = gsap.utils.toArray<HTMLElement>("[data-tag]", el);
        const movers = tags.map((t) => ({
          x: gsap.quickTo(t, "x", { duration: 0.5, ease: "power3.out" }),
          y: gsap.quickTo(t, "y", { duration: 0.5, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const b = el.getBoundingClientRect();
          tags.forEach((t, i) => {
            // layout position (ignores the transform) so the pull doesn't feed back on itself
            const cx = b.left + t.offsetLeft + t.offsetWidth / 2;
            const cy = b.top + t.offsetTop + t.offsetHeight / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
            movers[i].x(dx * pull * 0.4);
            movers[i].y(dy * pull * 0.4);
          });
        };
        const reset = () => movers.forEach((m) => (m.x(0), m.y(0)));
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", reset);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", reset);
        };
      });
      return () => mm.revert();
    },
    { scope: box },
  );

  return (
    <div ref={box} data-stagger className="relative flex flex-wrap gap-4 py-4">
      {items.map((t) => (
        <span
          key={t}
          data-tag
          data-cursor
          className="inline-block rounded-full border border-cream/20 px-8 py-3 text-[clamp(1.6rem,3.6vw,3.2rem)] font-light tracking-[-0.03em] transition-colors duration-300 hover:border-coral hover:bg-coral hover:text-ink"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/* 2. Expanding stacked list */
function StackedList({ items }: { items: readonly string[] }) {
  const box = useRef<HTMLUListElement>(null);
  const ROW = 68;
  const EXTRA = 44;

  const activate = (index: number | null) => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = el.querySelectorAll<HTMLElement>("[data-row]");
    const labels = el.querySelectorAll<HTMLElement>("[data-label]");
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    const d = reduce ? 0 : 0.5;
    gsap.to(rows, { y: (i) => (index !== null && i > index ? EXTRA : 0), duration: d, ease: "power3.out", overwrite: "auto" });
    gsap.to(labels, {
      x: (i) => (i === index ? 20 : 0),
      scale: (i) => (i === index ? 1.12 : 1),
      transformOrigin: "left center",
      duration: d,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(lines, { scaleX: (i) => (i === index ? 1 : 0), duration: d, ease: "power3.out", overwrite: "auto" });
    el.querySelectorAll<HTMLElement>("[data-row]").forEach((r, i) => r.setAttribute("data-active", String(i === index)));
  };

  return (
    <ul
      ref={box}
      data-reveal
      className="relative"
      style={{ height: items.length * ROW + EXTRA }}
      onPointerLeave={() => activate(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) activate(null);
      }}
    >
      {items.map((t, i) => (
        <li
          key={t}
          data-row
          data-active="false"
          className="group absolute inset-x-0 border-t border-cream/15"
          style={{ top: i * ROW, height: ROW }}
        >
          <button
            type="button"
            data-cursor
            onPointerEnter={() => activate(i)}
            onFocus={() => activate(i)}
            className="flex h-full w-full items-center text-left"
          >
            <span
              data-label
              className="inline-block text-[clamp(1.6rem,3vw,2.6rem)] font-light tracking-[-0.03em] transition-colors duration-300 group-data-[active=true]:text-coral-soft"
            >
              {t}
            </span>
          </button>
          <span
            data-line
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-coral"
            style={{ transform: "scaleX(0)" }}
          />
        </li>
      ))}
    </ul>
  );
}

/* 3. Tool grid with hover glow */
function ToolTile({ name, icon, shape }: { name: string; icon: keyof typeof TOOL_ICONS; shape: string }) {
  const tile = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const Icon = TOOL_ICONS[icon];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = tile.current;
        if (!el) return;
        const x = gsap.quickTo(glow.current, "x", { duration: 0.4, ease: "power3.out" });
        const y = gsap.quickTo(glow.current, "y", { duration: 0.4, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x(e.clientX - r.left - r.width / 2);
          y(e.clientY - r.top - r.height / 2);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: tile },
  );

  return (
    <div
      ref={tile}
      className={`group relative overflow-hidden border border-cream/12 bg-navy/60 p-5 transition-colors duration-300 hover:border-coral/60 ${shape}`}
    >
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          ref={glow}
          className="h-44 w-44 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(255,107,87,0.5), rgba(255,107,87,0))" }}
        />
      </div>
      <Icon size={22} className="relative text-coral-soft" aria-hidden="true" />
      <p className="relative mt-8 text-[1.05rem] text-cream">{name}</p>
    </div>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  const shapes = [
    "rounded-2xl",
    "rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md",
    "rounded-2xl",
    "rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-md rounded-br-md",
    "rounded-2xl",
    "rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md",
  ];

  return (
    <section ref={root} id="skills" className="relative py-28 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12">
          <h2 data-reveal className="text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.95] tracking-[-0.045em] md:col-span-6">
            My Skills
          </h2>
          <p data-reveal className="text-lg leading-relaxed text-cream/70 md:col-span-5 md:col-start-8 md:pt-4">
            {skills.intro}
          </p>
        </div>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-32">
          {/* Frontend: magnetic tag cloud */}
          <div className="grid gap-6 md:grid-cols-12">
            <h3 data-reveal className="text-xl text-cream md:col-span-4">
              {skills.frontend.title}
            </h3>
            <div className="md:col-span-8">
              <TagCloud items={skills.frontend.items} />
            </div>
          </div>

          {/* Programming & Database: expanding stacked list */}
          <div className="grid gap-6 md:grid-cols-12">
            <h3 data-reveal className="text-xl text-cream md:col-span-4 md:order-2 md:col-start-9 md:text-right">
              {skills.backend.title}
            </h3>
            <div className="md:col-span-7 md:order-1">
              <StackedList items={skills.backend.items} />
            </div>
          </div>

          {/* Tools: grid with hover glow */}
          <div className="grid gap-6 md:grid-cols-12">
            <h3 data-reveal className="text-xl text-cream md:col-span-4">
              {skills.tools.title}
            </h3>
            <div data-stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-8">
              {skills.tools.items.map((tool, i) => (
                <ToolTile key={tool.name} name={tool.name} icon={tool.icon} shape={shapes[i % shapes.length]} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
