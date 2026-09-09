"use client";

import { createContext, useContext, useState } from "react";
import type { CollectionMediaItem } from "@/stores/useUserCollectionsStore";

type RatingContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetMedia: CollectionMediaItem | null;
  setTargetMedia: React.Dispatch<React.SetStateAction<CollectionMediaItem | null>>;
  openRating: (item?: CollectionMediaItem) => void;
};

const RatingContext = createContext<RatingContextType | null>(null);

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [targetMedia, setTargetMedia] = useState<CollectionMediaItem | null>(null);

  const openRating = (item?: CollectionMediaItem) => {
    if (item) {
      setTargetMedia(item);
    }
    setOpen(true);
  };

  return (
    <RatingContext.Provider value={{ open, setOpen, targetMedia, setTargetMedia, openRating }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRating() {
  const ctx = useContext(RatingContext);
  if (!ctx) throw new Error("useRating must be used inside RatingProvider");
  return ctx;
}