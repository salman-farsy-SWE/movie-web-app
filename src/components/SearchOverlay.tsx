"use client";

import { useSearch } from "@/contexts/SearchContext";
import { SearchBox } from "@/components/SearchBox";
import { useEffect } from "react";

export function SearchOverlay() {
  const { open, setOpen } = useSearch();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverflowX = document.body.style.overflowX;
    const originalOverflowY = document.body.style.overflowY;

    if (open) {
      window.scrollTo(0, 0);
      document.body.style.overflowX = "hidden";
      document.body.style.overflowY = "scroll";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overflowX = originalOverflowX;
      document.body.style.overflowY = originalOverflowY;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center xl:pt-11 lg:pt-9 md:pt-7 pt-5 bg-light-screen-shadow/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <SearchBox />
      </div>
    </div>
  );
}