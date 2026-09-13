"use client";

import { useState } from "react";
import { PublicSortDropdown } from "@/components/media/sort/PublicSortDropdown";
import { PublicFilterPanel } from "@/components/media/filters/PublicFilterPanel";
import { FilterButton } from "@/components/shared/filters/FilterButton";
import { PostersGrid } from "@/components/media/PostersGrid";
import { PublicPagination } from "@/components/media/pagination/PublicPagination";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PublicSearchBar } from "@/components/media/search/PublicSearchBar";
import { SearchMediaTypeTabs } from "@/components/media/search/SearchMediaTypeTabs";
import { TrendingFilterTabs } from "@/components/media/filters/TrendingFilterTabs";
import { PersonsGrid } from "@/components/media/PersonsGrid";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { MovieItem, Person, MediaType, SearchMediaType, FilterContextType } from "@/types";
import { resolveGenreDef, isFilterActive } from "@/lib/tmdb";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";
import { useSmartBack } from "@/hooks/useSmartBack";

interface MediaPageProps {
  param?: string;
  type: MediaType;
  showSearch?: boolean;
  searchQuery?: string;
  searchMediaType?: SearchMediaType;
  trendingMedia?: string;
  trendingTimeWindow?: string;
  param2?: string;
  children?: React.ReactNode;
  hidePagination?: boolean;
  isMovie?: boolean;
  items?: MovieItem[];
  personItems?: Person[];
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
}

export function MediaPage({
  param,
  type,
  showSearch,
  searchQuery,
  searchMediaType,
  trendingMedia,
  trendingTimeWindow,
  param2,
  children,
  hidePagination,
  isMovie,
  items,
  personItems,
  currentPage,
  totalPages,
  totalResults,
}: MediaPageProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isPending } = useSortFilterTransition();
  const { goBack } = useSmartBack();

  const hasActiveFilters = isFilterActive(searchParams);

  useClickOutsideClose({
    enabled: filterOpen,
    selectors: [".filter-container", ".filter-btn", ".year-popover"],
    onClose: () => setFilterOpen(false),
  });

  const hasParam = Boolean(param);
  const hasParam2 = Boolean(param2);

  const isPersonsList =
    (pathname === "/trending/persons" || param === "persons") && !hasParam2;

  const isPersonDetails =
    (pathname.startsWith("/trending/persons/") || (param === "persons" && hasParam2)) &&
    !isPersonsList;

  const isPosterDetails =
    type === "movie" || type === "tv"
      ? hasParam
      : hasParam && hasParam2;

  const shouldHideControls =
    type === "search" ||
    isPersonDetails ||
    isPosterDetails ||
    showSearch;

  const filterContext: FilterContextType = (() => {
    if (
      type === "movie" ||
      (type === "trending" && param === "movies") ||
      (type === "top-rated" && param === "movies")
    ) {
      return "movie";
    }
    if (
      type === "tv" ||
      (type === "trending" && param === "tv-shows") ||
      (type === "top-rated" && param === "tv-shows")
    ) {
      return "tv";
    }
    if (type === "genre") return "genre";
    if (type === "trending") return "trending";
    return "mixed";
  })();

  const basePath = (() => {
    switch (type) {
      case "movie":
        return "/movies";
      case "tv":
        return "/tv-shows";
      case "genre":
        return `/genres/${slugify(param || "")}`;
      case "trending":
        return `/trending/${slugify(param || "")}`;
      case "top-rated":
        return `/top-rated/${slugify(param || "")}`;
      case "search":
        return "/search";
      default:
        return "/";
    }
  })();

  const getPageTitle = () => {
    if (isPersonsList) {
      return searchQuery ? `Trending Persons - Results for "${searchQuery}"` : "Trending Persons";
    }
    if (type === "tv") return "TV Shows";
    if (type === "movie") return "Movies";
    if (type === "genre") {
      return resolveGenreDef(param || "")?.canonical || param?.replace(/-/g, " ");
    }
    if (type === "trending") {
      return "Trending " + (param === "tv-shows" ? "TV Shows" : param?.replace(/-/g, " "));
    }
    if (type === "top-rated") {
      return "Top Rated " + (param === "tv-shows" ? "TV Shows" : param?.replace(/-/g, " "));
    }
    if (type === "search") {
      if (searchQuery) return `Search - Results for "${searchQuery}"`;
      if (param) return `Search - Results for "${param.replace(/-/g, " ")}"`;
      return "Search Results";
    }
    return "";
  };

  return (
    <section className="container-1440 mt-[72px]">
      <div className="flex justify-between items-center xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2">
        {isPersonDetails || isPosterDetails ? (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => goBack(basePath)}
            className="group flex items-center gap-[4px] cursor-pointer select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trails-red rounded-md text-left"
          >
            <ChevronLeft className="w-[28px] h-[28px] text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90 transition-transform duration-200 group-hover:-translate-x-1" />
            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] text-[25px] md:font-medium font-normal text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90">
              {isPersonDetails
                ? "Person Details"
                : isMovie
                ? "Movie Details"
                : "TV Shows Details"}
            </h1>
          </button>
        ) : (
          <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] md:font-medium font-normal text-black dark:text-white capitalize">
              {getPageTitle()}
            </h1>
            {type === "search" && totalResults !== undefined && (
              <span className="font-inter text-xs sm:text-sm md:text-base text-black/60 dark:text-white/60 font-normal whitespace-nowrap">
                ({totalResults.toLocaleString()} {totalResults === 1 ? "result" : "results"})
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px]">
          {isPersonsList ? (
            <>
              <PublicSearchBar placeholder="Search persons..." searchType="person" syncWithUrl />
              <TrendingFilterTabs
                param={param}
                currentTimeWindow={trendingTimeWindow}
                searchQuery={searchQuery}
              />
            </>
          ) : isPersonDetails ? (
            <PublicSearchBar
              placeholder="Search persons..."
              searchType="person"
              defaultValue={searchQuery || ""}
            />
          ) : isPosterDetails || showSearch ? (
            <PublicSearchBar
              placeholder="Search movies, TV shows..."
              defaultValue={searchQuery || ""}
            />
          ) : type === "search" ? (
            <SearchMediaTypeTabs query={searchQuery} currentType={searchMediaType || "all"} />
          ) : type === "trending" ? (
            <TrendingFilterTabs
              param={param}
              currentMedia={trendingMedia}
              currentTimeWindow={trendingTimeWindow}
            />
          ) : (
            <>
              {type !== "top-rated" && (
                <PublicSortDropdown context={filterContext} />
              )}
              {type !== "top-rated" && (
                <FilterButton
                  onClick={() => setFilterOpen((prev) => !prev)}
                  isActive={hasActiveFilters}
                />
              )}
            </>
          )}
        </div>
      </div>

      {(hasParam || (hasParam && hasParam2)) ? (
        <Breadcrumb subRoute={param} type={type} subRoute2={param2} />
      ) : null}

      {!shouldHideControls && type !== "top-rated" && type !== "trending" && (
        <PublicFilterPanel
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          context={filterContext}
          pageType={type}
          param={param}
        />
      )}

      {children ? (
        children
      ) : isPersonsList ? (
        <PersonsGrid basePath={basePath} items={personItems} searchQuery={searchQuery} isLoading={isPending} />
      ) : (
        <PostersGrid basePath={basePath} items={items} context={filterContext} isLoading={isPending} />
      )}

      {!hidePagination && totalPages !== undefined && totalPages > 1 && (
        <PublicPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </section>
  );
}