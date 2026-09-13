"use client";

import { Search } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  className?: string;
}

export function SearchTrigger({ className }: SearchTriggerProps) {
  const setOpen = useUIStore((state) => state.setSearchOpen);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Search"
      className={cn(
        "group flex items-center justify-start",
        "gap-1.5 sm:gap-2",
        "xl:w-[96px] lg:w-[86px] md:w-[76px] sm:w-[70px] w-[64px]",
        "border-b-2 border-white/80 hover:border-white",
        "pb-1 sm:pb-1.5",
        "text-left bg-transparent",
        "cursor-pointer select-none",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80 rounded-t-sm",
        className
      )}
    >
      <Search
        className="xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] sm:w-[19px] sm:h-[19px] w-[18px] h-[18px] text-white/85 group-hover:text-white shrink-0 transition-colors duration-150"
      />
      <span
        className="xl:text-[15px] lg:text-sm sm:text-[13px] text-[12px] text-nav-search group-hover:text-white font-medium leading-none transition-colors duration-150"
      >
        Search
      </span>
    </button>
  );
}
