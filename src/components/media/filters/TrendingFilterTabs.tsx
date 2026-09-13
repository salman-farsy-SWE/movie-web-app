"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";
import { getBasePage, saveBasePage, isFilterActive } from "@/lib/tmdb";

interface TrendingFilterTabsProps {
  param?: string;
  currentMedia?: string;
  currentTimeWindow?: string;
  searchQuery?: string;
}

export function TrendingFilterTabs({
  param,
  currentMedia = "all",
  currentTimeWindow = "week",
  searchQuery,
}: TrendingFilterTabsProps) {
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();
  const isTodayOrWeek = param === "today" || param === "this-week";
  const isMoviesOrTvOrPersons =
    param === "movies" || param === "tv-shows" || param === "persons";
  const urlPage = Number(searchParams.get("page")) || 1;
  const currentPath = `/trending/${param}`;

  if (isTodayOrWeek) {
    const mediaTabs = [
      { label: "All", value: "all" },
      { label: "Movies", value: "movies" },
      { label: "TV Shows", value: "tv_shows" },
    ];

    const normalizedMedia =
      currentMedia === "movies" || currentMedia === "movie"
        ? "movies"
        : currentMedia === "tv_shows" || currentMedia === "tv"
        ? "tv_shows"
        : "all";

    const getHref = (mediaVal: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (mediaVal !== "all") {
        if (!isFilterActive(searchParams) && !searchParams.get("sort_by") && !searchParams.get("q")) {
          saveBasePage(currentPath, urlPage);
        }
        params.set("media", mediaVal);
        params.delete("page");
      } else {
        params.delete("media");
        const returnPage = getBasePage(currentPath, 1);
        if (returnPage > 1) {
          params.set("page", String(returnPage));
        } else {
          params.delete("page");
        }
      }
      const qs = params.toString();
      return qs ? `/trending/${param}?${qs}` : `/trending/${param}`;
    };

    return (
      <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-light-dropdown/60 dark:bg-dropdown/60 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5">
        {mediaTabs.map((tab) => {
          const isActive = normalizedMedia === tab.value;
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

  if (isMoviesOrTvOrPersons) {
    const timeTabs = [
      { label: "Today", value: "day" },
      { label: "This Week", value: "week" },
    ];

    const normalizedTime =
      currentTimeWindow === "day" || currentTimeWindow === "today"
        ? "day"
        : "week";

    const getHref = (timeVal: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("q", searchQuery);
      } else {
        params.delete("q");
      }
      if (timeVal !== "week") {
        if (!isFilterActive(searchParams) && !searchParams.get("sort_by") && !searchParams.get("q")) {
          saveBasePage(currentPath, urlPage);
        }
        params.set("time_window", timeVal);
        params.delete("page");
      } else {
        params.delete("time_window");
        if (!searchQuery) {
          const returnPage = getBasePage(currentPath, 1);
          if (returnPage > 1) {
            params.set("page", String(returnPage));
          } else {
            params.delete("page");
          }
        }
      }
      const qs = params.toString();
      return qs ? `/trending/${param}?${qs}` : `/trending/${param}`;
    };

    return (
      <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-light-dropdown/60 dark:bg-dropdown/60 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5">
        {timeTabs.map((tab) => {
          const isActive = normalizedTime === tab.value;
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

  return null;
}
