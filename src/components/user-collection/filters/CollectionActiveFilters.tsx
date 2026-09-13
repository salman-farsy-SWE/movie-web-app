"use client";

import { X, RotateCcw } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseFilterParamArray, isFilterActive, getBasePage } from "@/lib/tmdb";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";

interface CollectionActiveFiltersProps {
  isListView?: boolean;
}

const SORT_LABELS: Record<string, string> = {
  "latest-added": "Recently Added",
  "your-rating-desc": "Your Rating (High to Low)",
  "your-rating-asc": "Your Rating (Low to High)",
  rating: "Rating (High to Low)",
  "rating-asc": "Rating (Low to High)",
  latest: "Release Date (Newest)",
  "release-asc": "Release Date (Oldest)",
  "title-asc": "Title A-Z",
  "title-desc": "Title Z-A",
  "items-desc": "Most Items",
  "items-asc": "Fewest Items",
};

export function CollectionActiveFilters({ isListView = false }: CollectionActiveFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();

  const sortBy = searchParams.get("sort_by") || "";
  const mediaFilter = searchParams.get("media") || "all";
  const yearFilter = parseFilterParamArray(searchParams.get("year"));
  const ratingFilter = parseFilterParamArray(searchParams.get("rating"));

  const isVisibilityActive = isListView && mediaFilter && mediaFilter !== "all";
  const isMediaFilterActive = !isListView && mediaFilter && mediaFilter !== "all";
  const hasActiveFilters =
    isVisibilityActive ||
    isMediaFilterActive ||
    yearFilter.length > 0 ||
    ratingFilter.length > 0;
  const isSortActive = !hasActiveFilters && Boolean(sortBy);
  const hasAnyActive = isSortActive || hasActiveFilters;

  if (!hasAnyActive) return null;

  const handleClearAll = () => {
    const returnPage = getBasePage(pathname, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort_by");
    params.delete("media");
    params.delete("year");
    params.delete("rating");
    if (returnPage > 1) {
      params.set("page", String(returnPage));
    } else {
      params.delete("page");
    }
    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
  };

  const handleRemoveParam = (paramKey: string, specificValue?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (specificValue && (paramKey === "year" || paramKey === "rating")) {
      const currentValues = parseFilterParamArray(params.get(paramKey));
      const filtered = currentValues.filter((v) => v !== specificValue);
      if (filtered.length > 0) {
        params.set(paramKey, filtered.join(","));
      } else {
        params.delete(paramKey);
      }
    } else {
      params.delete(paramKey);
      if (paramKey === "q") params.delete("search");
    }

    if (!isFilterActive(params) && !params.get("sort_by") && !params.get("q") && !params.get("search")) {
      const returnPage = getBasePage(pathname, 1);
      if (returnPage > 1) {
        params.set("page", String(returnPage));
      } else {
        params.delete("page");
      }
    }

    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5 px-2 xl:px-0">
      <span className="text-xs font-inter text-black/50 dark:text-white/50 font-medium select-none">
        Active:
      </span>

      {isVisibilityActive && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 capitalize select-none">
          <span>Visibility: {mediaFilter}</span>
          <button
            type="button"
            onClick={() => handleRemoveParam("media")}
            className="hover:text-trails-red transition-colors cursor-pointer"
            aria-label="Remove visibility filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {isMediaFilterActive && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 capitalize select-none">
          <span>Media: {mediaFilter === "tv_shows" || mediaFilter === "tv" ? "TV Shows" : "Movies"}</span>
          <button
            type="button"
            onClick={() => handleRemoveParam("media")}
            className="hover:text-trails-red transition-colors cursor-pointer"
            aria-label="Remove media filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {yearFilter.map((year) => (
        <span
          key={year}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 select-none"
        >
          <span>Year: {year}</span>
          <button
            type="button"
            onClick={() => handleRemoveParam("year", year)}
            className="hover:text-trails-red transition-colors cursor-pointer"
            aria-label={`Remove year ${year} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {ratingFilter.map((rating) => (
        <span
          key={rating}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 select-none"
        >
          <span>Rating: {rating}+ ⭐</span>
          <button
            type="button"
            onClick={() => handleRemoveParam("rating", rating)}
            className="hover:text-trails-red transition-colors cursor-pointer"
            aria-label={`Remove rating ${rating} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {isSortActive && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-light-nav/10 dark:bg-trails-red/15 border border-light-nav/20 dark:border-trails-red/20 text-light-nav dark:text-trails-red font-medium select-none">
          <span>Sort: {SORT_LABELS[sortBy] || sortBy}</span>
          <button
            type="button"
            onClick={() => handleRemoveParam("sort_by")}
            className="hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Remove sort"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={handleClearAll}
        className="inline-flex items-center gap-1 text-xs font-inter font-medium text-black/60 hover:text-trails-red dark:text-white/60 dark:hover:text-trails-red px-2 py-0.5 rounded transition-colors cursor-pointer select-none"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear all</span>
      </button>
    </div>
  );
}
