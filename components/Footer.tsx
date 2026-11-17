import { nav, site } from "@/lib/site";
import BackToTop from "./BackToTop";
import ScrollLink from "./ScrollLink";
import { GithubIcon, LinkedinIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cream/10 bg-ink/80">
      <div className="container-x py-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div>
            <p className="text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none tracking-[-0.05em]">
              {site.monogram}
              <span className="text-coral">.</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Always learning, always building, and always looking for new challenges.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-cream/75">
            {nav.map((n) => (
              <ScrollLink key={n.id} id={n.id} className="transition-colors hover:text-coral-soft">
                {n.label}
              </ScrollLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-coral hover:text-coral-soft"
            >
              <LinkedinIcon width={18} height={18} />
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-coral hover:text-coral-soft"
            >
              <GithubIcon width={18} height={18} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-6 text-sm text-cream/55 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}. Built with Next.js, TypeScript, GSAP and Three.js.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
