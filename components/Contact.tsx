"use client";

import { useRef } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/lib/site";
import { useReveal } from "@/hooks/useReveal";
import Atmosphere from "./Atmosphere";
import Magnetic from "./Magnetic";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  const links = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: <Mail size={20} aria-hidden="true" />, external: false },
    { label: "LinkedIn", value: "farisnaufalianto", href: site.linkedin, icon: <LinkedinIcon width={20} height={20} />, external: true },
    { label: "GitHub", value: "farisnaufalianto", href: site.github, icon: <GithubIcon width={20} height={20} />, external: true },
  ];

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-28 md:py-44">
      <Atmosphere contained />
      <div className="container-x relative">
        <h2
          data-reveal
          className="max-w-4xl text-[clamp(2.8rem,8vw,7.5rem)] font-light leading-[0.95] tracking-[-0.045em]"
        >
          Let’s build something together.
        </h2>
        <p data-reveal className="mt-7 max-w-md text-lg leading-relaxed text-cream/70">
          I’m open to opportunities. The easiest way to reach me is by email.
        </p>

        <div data-reveal className="mt-12">
          <Magnetic strength={0.25}>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-3 rounded-full bg-coral px-10 py-5 text-lg font-medium text-ink transition-colors hover:bg-coral-soft"
            >
              Get in touch
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </Magnetic>
        </div>

        <ul data-stagger className="mt-20 max-w-2xl divide-y divide-cream/12 border-y border-cream/12">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-coral-soft"
              >
                <span className="flex items-center gap-4">
                  <span className="text-coral-soft">{l.icon}</span>
                  <span className="text-cream/60 group-hover:text-coral-soft/80">{l.label}</span>
                </span>
                <span className="flex items-center gap-3 text-lg text-cream group-hover:text-coral-soft">
                  <span className="break-all text-right">{l.value}</span>
                  <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
