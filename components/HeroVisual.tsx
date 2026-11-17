"use client";

import dynamic from "next/dynamic";
import { useHeroMode } from "@/hooks/useHeroMode";
import PhotoFlat from "./PhotoFlat";
import SceneBoundary from "./three/SceneBoundary";

// three.js is only downloaded on capable desktop devices, never on the server.
const HeroScene = dynamic(() => import("./three/HeroScene"), {
  ssr: false,
  loading: () => <PhotoFlat mode="static" />,
});

export default function HeroVisual() {
  const mode = useHeroMode();

  if (mode === "3d") {
    return (
      <SceneBoundary fallback={<PhotoFlat mode="tilt" />}>
        <HeroScene />
      </SceneBoundary>
    );
  }
  if (mode === "tilt") return <PhotoFlat mode="tilt" />;
  // "static" (touch / small) and "pending" (server + first paint) render the same markup
  return <PhotoFlat mode="static" />;
}
