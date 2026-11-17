"use client";

import { ArrowUp } from "lucide-react";
import ScrollLink from "./ScrollLink";

export default function BackToTop() {
  return (
    <ScrollLink
      id="home"
      className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/80 transition-colors hover:border-coral hover:text-coral-soft"
    >
      Back to top
      <ArrowUp size={14} aria-hidden="true" />
    </ScrollLink>
  );
}
