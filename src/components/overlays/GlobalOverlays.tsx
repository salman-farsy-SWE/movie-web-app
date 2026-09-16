"use client";

import dynamic from "next/dynamic";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";

const RatingOverlay = dynamic(
  () => import("@/components/overlays/RatingOverlay").then((mod) => mod.RatingOverlay),
  { ssr: false }
);

const ListOverlay = dynamic(
  () => import("@/components/overlays/ListOverlay").then((mod) => mod.ListOverlay),
  { ssr: false }
);

export function GlobalOverlays() {
  return (
    <>
      <SearchOverlay />
      <RatingOverlay />
      <ListOverlay />
    </>
  );
}

