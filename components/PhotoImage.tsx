"use client";

import { useCallback, useState } from "react";
import { site } from "@/lib/site";

/** The portrait. If /faris.jpg is missing or fails, a designed "FN" placeholder is shown instead. */
export default function PhotoImage({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  // Catches images that already failed before hydration (onError would never fire).
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={site.photoAlt}
        className={`grid place-items-center bg-[linear-gradient(145deg,#FF6B57_0%,#c4503f_35%,#141C3F_100%)] ${className}`}
      >
        <span className="text-[clamp(4rem,12vw,7rem)] font-light tracking-[-0.06em] text-cream/95">
          {site.monogram}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={site.photo}
      alt={site.photoAlt}
      width={960}
      height={1280}
      draggable={false}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
