"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";
import type { SearchMediaType } from "@/types";

interface SearchMediaTypeTabsProps {
  query?: string;
  currentType?: SearchMediaType;
}

export function SearchMediaTypeTabs({
  query,
  currentType = "all",
}: SearchMediaTypeTabsProps) {
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();
  const tabs: { label: string; value: SearchMediaType }[] = [
    { label: "All", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "TV Shows", value: "tv" },
  ];

  const getHref = (typeVal: SearchMediaType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    if (typeVal !== "all") {
      params.set("type", typeVal);
    } else {
      params.delete("type");
    }
    params.delete("page");
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-light-dropdown/60 dark:bg-dropdown/60 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5">
      {tabs.map((tab) => {
        const isActive = currentType === tab.value;
        const href = getHref(tab.value);
        return (
          <Link
            key={tab.value}
            href={href}
            onClick={(e) => {
              if (!isActive) {
                e.preventDefault();
                navigateWithTransition(href);
              }
            }}
            className={cn(
              "px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-inter font-medium rounded-md transition-all duration-150 select-none",
              isActive
                ? "bg-light-nav dark:bg-trails-red text-white shadow-sm font-semibold"
                : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
