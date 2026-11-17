"use client";

import type { ComponentProps } from "react";
import { scrollToId } from "@/lib/scroll";

type Props = Omit<ComponentProps<"a">, "href"> & { id: string; onNavigate?: () => void };

/** Anchor with smooth GSAP scrolling. Falls back to a normal #hash link without JS. */
export default function ScrollLink({ id, onNavigate, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={`#${id}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        onNavigate?.();
        scrollToId(id);
      }}
    >
      {children}
    </a>
  );
}
