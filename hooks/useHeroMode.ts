"use client";

import { useSyncExternalStore } from "react";

export type HeroMode = "pending" | "3d" | "tilt" | "static";

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
      webglSupport = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(hover: hover) and (pointer: fine)",
  "(min-width: 768px)",
];

function subscribe(cb: () => void) {
  const list = QUERIES.map((q) => window.matchMedia(q));
  list.forEach((m) => m.addEventListener("change", cb));
  return () => list.forEach((m) => m.removeEventListener("change", cb));
}

function getSnapshot(): HeroMode {
  const [reduce, fine, wide] = QUERIES.map((q) => window.matchMedia(q).matches);
  if (!fine || !wide) return "static"; // touch / small screens
  if (reduce || !hasWebGL()) return "tilt"; // 2D CSS tilt card
  return "3d";
}

/** Decides how the hero portrait is rendered. "pending" on the server / first paint. */
export function useHeroMode(): HeroMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => "pending" as HeroMode);
}
