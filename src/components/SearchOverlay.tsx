"use client";

import { useSearch } from "@/contexts/SearchContext";
import { SearchBox } from "@/components/SearchBox";
import { useEffect } from "react";

export function SearchOverlay() {
  const { open, setOpen } = useSearch();

  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-light-screen-shadow/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <SearchBox />
      </div>
    </div>
  );
}