"use client";

import { useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { demoAccount } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { useModalA11y } from "@/hooks/useModalA11y";

export default function LoginModal() {
  const { loginOpen } = useAuth();
  // The dialog is only mounted while open, so its form state resets every time.
  return loginOpen ? <LoginDialog /> : null;
}

function LoginDialog() {
  const { login, closeLogin } = useAuth();
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useModalA11y(true, closeLogin, panel);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-backdrop]", { opacity: 0, duration: 0.35 });
        gsap.from(panel.current, { y: 28, opacity: 0, scale: 0.97, duration: 0.55, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy.current) return;

    const next: { username?: string; password?: string } = {};
    if (!username.trim()) next.username = "Please enter your username.";
    if (!password) next.password = "Please enter your password.";
    setErrors(next);
    setFormError("");
    if (next.username) return userRef.current?.focus();
    if (next.password) return passRef.current?.focus();

    busy.current = true;
    setSubmitting(true);
    const result = await login(username.trim(), password);
    busy.current = false;
    if (!result.ok) {
      setSubmitting(false);
      setFormError(result.error);
    }
    // On success the provider closes the modal (this component unmounts).
  }

  function fillDemo() {
    setUsername(demoAccount.username);
    setPassword(demoAccount.password);
    setErrors({});
    setFormError("");
  }

  const input =
    "w-full rounded-xl border bg-ink/60 px-4 py-3 text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-coral-soft";

  return (
    <div ref={wrap} className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div data-backdrop onClick={closeLogin} className="absolute inset-0 bg-ink/75 backdrop-blur-sm" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative w-full max-w-md rounded-[1.75rem] border border-cream/15 bg-navy/60 p-7 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={closeLogin}
          aria-label="Close login"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-coral hover:text-coral-soft"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <h2 id="login-title" className="text-3xl font-light tracking-[-0.03em]">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-cream/65">Log in to see your name in the navigation. The portfolio stays open to everyone.</p>

        <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
          <div>
            <label htmlFor="login-username" className="mb-1.5 block text-sm text-cream/80">
              Username
            </label>
            <input
              ref={userRef}
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "login-username-error" : undefined}
              data-autofocus
              className={`${input} ${errors.username ? "border-coral" : "border-cream/15"}`}
            />
            {errors.username && (
              <p id="login-username-error" className="mt-1.5 text-sm text-coral-soft">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm text-cream/80">
              Password
            </label>
            <div className="relative">
              <input
                ref={passRef}
                id="login-password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                className={`${input} pr-12 ${errors.password ? "border-coral" : "border-cream/15"}`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-cream/70 hover:text-cream"
              >
                {show ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" className="mt-1.5 text-sm text-coral-soft">
                {errors.password}
              </p>
            )}
          </div>

          <div aria-live="polite" role="status" className="min-h-0">
            {formError && (
              <p className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-cream">{formError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 font-medium text-ink transition-colors hover:bg-coral-soft disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Logging in…
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-5">
          <p className="max-w-[14rem] text-xs leading-relaxed text-cream/55">
            Demo credentials for testing only (DummyJSON test account).
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="rounded-full border border-cream/25 px-4 py-2 text-sm text-cream transition-colors hover:border-coral-soft hover:text-coral-soft"
          >
            Use demo account
          </button>
        </div>
      </div>
    </div>
  );
}
