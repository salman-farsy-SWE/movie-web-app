"use client";

import { useSearch } from "@/contexts/SearchContext";
import { SearchBox } from "@/components/overlays/SearchBox";
import { useEffect } from "react";

export function SearchOverlay() {
  const { open, setOpen } = useSearch();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverflowX = document.body.style.overflowX;
    const originalOverflowY = document.body.style.overflowY;

    if (open) {
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "scroll";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overflowX = originalOverflowX;
      document.body.style.overflowY = originalOverflowY;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-12 md:pt-14 lg:pt-16 pb-6 px-3 sm:px-4 bg-black/70 dark:bg-black/80 backdrop-blur-md transition-all duration-200 animate-in fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="flex justify-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <SearchBox />
      </div>
    </div>
  );
}