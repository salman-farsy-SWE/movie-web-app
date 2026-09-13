"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";
import { getBasePage, saveBasePage, isFilterActive } from "@/lib/tmdb";

export function CollectionVisibilityTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();

  const mediaFilter = searchParams.get("media") || "all";
  const urlPage = Number(searchParams.get("page")) || 1;

  const handleVisibilityChange = (visibility: "all" | "public" | "private") => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (visibility === "all") {
      params.delete("media");
      if (!isFilterActive(params) && !params.get("sort_by") && !params.get("q") && !params.get("search")) {
        const returnPage = getBasePage(pathname, 1);
        if (returnPage > 1) {
          params.set("page", String(returnPage));
        }
      }
    } else {
      if (!isFilterActive(searchParams) && !searchParams.get("sort_by") && !searchParams.get("q") && !searchParams.get("search")) {
        saveBasePage(pathname, urlPage);
      }
      params.set("media", visibility);
      params.delete("sort_by");
    }
    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex items-center p-[2px] sm:p-[2.5px] bg-light-dropdown dark:bg-dropdown xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] select-none">
      <div className="flex items-center gap-0.5 p-0.5 bg-white/70 dark:bg-dark xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px] text-[11px] sm:text-[12px] font-inter shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)] dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={() => handleVisibilityChange("all")}
          className={cn(
            "px-2 sm:px-2.5 py-1 rounded-[3px] transition-all duration-150 cursor-pointer",
            mediaFilter === "all" || !mediaFilter
              ? "bg-light-dropdown dark:bg-dropdown text-light-nav dark:text-white font-semibold shadow-xs"
              : "text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white font-medium"
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => handleVisibilityChange("public")}
          className={cn(
            "px-2 sm:px-2.5 py-1 rounded-[3px] transition-all duration-150 cursor-pointer",
            mediaFilter === "public"
              ? "bg-light-dropdown dark:bg-dropdown text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
              : "text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white font-medium"
          )}
        >
          Public
        </button>
        <button
          type="button"
          onClick={() => handleVisibilityChange("private")}
          className={cn(
            "px-2 sm:px-2.5 py-1 rounded-[3px] transition-all duration-150 cursor-pointer",
            mediaFilter === "private"
              ? "bg-light-dropdown dark:bg-dropdown text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
              : "text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white font-medium"
          )}
        >
          Private
        </button>
      </div>
    </div>
  );
}
