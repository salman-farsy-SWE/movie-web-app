"use client";

import { createContext, useContext, useState } from "react";

type RatingContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RatingContext = createContext<RatingContextType | null>(null);

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <RatingContext.Provider value={{ open, setOpen }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRating() {
  const ctx = useContext(RatingContext);
  if (!ctx) throw new Error("useRating must be used inside RatingProvider");
  return ctx;
}