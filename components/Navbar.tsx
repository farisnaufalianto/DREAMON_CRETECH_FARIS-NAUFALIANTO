"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import ScrollLink from "./ScrollLink";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const { user, loading, openLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  // Active section tracking
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Solid bar after the first scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Animated active indicator (transform only: x + scaleX)
  useGSAP(
    () => {
      const ul = list.current;
      const ind = indicator.current;
      if (!ul || !ind) return;
      gsap.set(ind, { transformOrigin: "0% 50%" });
      const place = (animate: boolean) => {
        const a = ul.querySelector<HTMLElement>(`[data-id="${active}"]`);
        if (!a) return;
        const pad = 16;
        gsap.to(ind, {
          x: a.offsetLeft + pad,
          scaleX: Math.max(1, a.offsetWidth - pad * 2),
          opacity: 1,
          duration: animate && placed.current ? 0.55 : 0,
          ease: "power3.out",
          overwrite: true,
        });
        placed.current = true;
      };
      place(true);
      const onResize = () => place(false);
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: list, dependencies: [active] },
  );

  const userArea = loading ? (
    <span className="inline-block h-9 w-20" aria-hidden="true" />
  ) : user ? (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} />
      <span className="max-w-[8rem] truncate text-sm text-cream/90">{user.firstName || user.username}</span>
      <button
        type="button"
        onClick={logout}
        className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-3.5 py-1.5 text-sm text-cream transition-colors hover:border-coral hover:text-coral-soft"
      >
        <LogOut size={14} aria-hidden="true" />
        Logout
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={openLogin}
      className="rounded-full border border-coral/70 px-5 py-2 text-sm text-cream transition-colors hover:bg-coral hover:text-ink"
    >
      Login
    </button>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-cream/10 bg-ink/85" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between">
        <ScrollLink
          id="home"
          aria-label={`${site.name}, back to top`}
          className="text-xl font-medium tracking-[-0.04em] text-cream"
        >
          {site.monogram}
          <span className="text-coral">.</span>
        </ScrollLink>

        <nav aria-label="Primary" className="hidden md:block">
          <ul ref={list} className="relative flex items-center">
            {nav.map((n) => (
              <li key={n.id}>
                <ScrollLink
                  id={n.id}
                  data-id={n.id}
                  aria-current={active === n.id ? "true" : undefined}
                  className={`block px-4 py-2 text-[0.95rem] transition-colors ${
                    active === n.id ? "text-cream" : "text-cream/60 hover:text-cream"
                  }`}
                >
                  {n.label}
                </ScrollLink>
              </li>
            ))}
            <span
              ref={indicator}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-px bg-coral opacity-0"
            />
          </ul>
        </nav>

        <div className="hidden md:block">{userArea}</div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 bottom-0 top-[4.5rem] bg-ink/95 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex h-full flex-col justify-between py-10">
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.id}>
                <ScrollLink
                  id={n.id}
                  onNavigate={() => setOpen(false)}
                  className={`block py-2 text-4xl font-light tracking-[-0.03em] ${
                    active === n.id ? "text-coral-soft" : "text-cream"
                  }`}
                >
                  {n.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-cream/10 pt-6">
            {loading ? null : user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar user={user} size={36} />
                  <span className="truncate text-cream">{user.firstName || user.username}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 text-cream"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLogin();
                }}
                className="w-full rounded-full bg-coral px-6 py-3.5 text-lg font-medium text-ink"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
