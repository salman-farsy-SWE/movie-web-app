"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useList } from "@/contexts/ListContext";
import { useRating } from "@/contexts/RatingContext";

type SearchContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { setOpen: setListOpen } = useList();
  const { setOpen: setRatingOpen } = useRating();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setListOpen(false);
        setRatingOpen(false);
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setListOpen, setRatingOpen]);

  useEffect(() => {
    if (open) {
      setListOpen(false);
      setRatingOpen(false);
    }
  }, [open, setListOpen, setRatingOpen]);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
}