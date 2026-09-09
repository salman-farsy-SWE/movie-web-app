"use client";

import { Suspense } from "react";
import { PosterCard } from "@/components/media/PosterCard";
import { rowItems, type MovieItem } from "@/data/mock-home";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getSortOptionsByContext,
  normalizeSortOption,
  parseFilterParams,
  deduplicateByTitleAndId,
  isFilterActive,
  getBasePage,
  type FilterContextType,
} from "@/lib/tmdb";
import { X, Film, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PostersGridProps {
  basePath: string;
  items?: MovieItem[] | { id: string | number; title: string; image?: string | null }[];
  context?: FilterContextType;
}

export function PostersGrid(props: PostersGridProps) {
  return (
    <Suspense fallback={<PostersGridFallback {...props} />}>
      <PostersGridContent {...props} />
    </Suspense>
  );
}

function PostersGridFallback({ basePath, items }: PostersGridProps) {
  const baseItems = items !== undefined ? items : rowItems;
  const displayMovies = deduplicateByTitleAndId(baseItems).slice(0, 24);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] max-w-[1440px] w-full flex justify-center flex-wrap xl:gap-[24px] lg:gap-[23px] gap-[22px]">
        {displayMovies.map((movie) => {
          const resolvedMediaType: "movie" | "tv" =
            "mediaType" in movie && movie.mediaType
              ? (movie.mediaType as "movie" | "tv")
              : basePath?.startsWith("/tv-shows")
              ? "tv"
              : "movie";
          return (
            <PosterCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image}
              mediaType={resolvedMediaType}
              basePath={basePath}
            />
          );
        })}
      </div>
    </div>
  );
}

function PostersGridContent({ basePath, items, context = "movie" }: PostersGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortParam = searchParams.get("sort_by");
  const normalized = sortParam ? normalizeSortOption(sortParam) : null;
  const sortOptions = getSortOptionsByContext(context);
  const activeSortOption = normalized
    ? sortOptions.find((opt) => opt.value === normalized)
    : null;

  const filterParams = parseFilterParams(searchParams);

  const handleRemoveSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort_by");
    // Return to the page where it was
    const returnPage = getBasePage(pathname, 1);
    if (returnPage > 1) {
      params.set("page", String(returnPage));
    } else {
      params.delete("page");
    }
    const newQuery = params.toString();
    router.push(newQuery ? `${pathname}?${newQuery}` : pathname);
  };

  const handleRemoveFilter = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!valueToRemove) {
      params.delete(key);
    } else {
      const currentValues = (params.get(key) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const updated = currentValues.filter((v) => v !== valueToRemove);
      if (updated.length > 0) {
        params.set(key, updated.join(","));
      } else {
        params.delete(key);
      }
    }

    if (!isFilterActive(params)) {
      // All filters removed - return to the saved base page
      const returnPage = getBasePage(pathname, 1);
      if (returnPage > 1) {
        params.set("page", String(returnPage));
      } else {
        params.delete("page");
      }
    } else {
      params.delete("page");
    }

    const newQuery = params.toString();
    router.push(newQuery ? `${pathname}?${newQuery}` : pathname);
  };

  const handleClearAll = () => {
    const returnPage = getBasePage(pathname, 1);
    router.push(returnPage > 1 ? `${pathname}?page=${returnPage}` : pathname);
  };

  const totalBadges =
    (activeSortOption ? 1 : 0) +
    (filterParams.media && filterParams.media !== "all" ? 1 : 0) +
    (filterParams.genres?.length || 0) +
    (filterParams.countries?.length || 0) +
    (filterParams.languages?.length || 0) +
    (filterParams.years?.length || 0) +
    (filterParams.ratings?.length || 0) +
    (filterParams.durations?.length || 0);

  const baseItems = items !== undefined ? items : rowItems;
  const displayMovies = deduplicateByTitleAndId(baseItems).slice(0, 24);
  const hasActiveBadges = totalBadges > 0;

  return (
    <div className="w-full flex flex-col items-center">
      {hasActiveBadges && (
        <div className="w-full max-w-[1440px] flex flex-wrap items-center gap-2 xl:mt-[24px] lg:mt-[22px] md:mt-[20px] sm:mt-[18px] mt-[16px] xl:mb-[10px] lg:mb-[8px] md:mb-[6px] mb-[4px] xl:px-0 lg:px-2 px-1">
          {activeSortOption && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150">
              <span className="text-black/50 dark:text-white/50">Sort:</span>
              <span className="font-medium text-black dark:text-white">{activeSortOption.label}</span>
              <button
                type="button"
                onClick={handleRemoveSort}
                aria-label={`Remove ${activeSortOption.label} sort`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {filterParams.media && filterParams.media !== "all" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150">
              <span className="text-black/50 dark:text-white/50">Media:</span>
              <span className="font-medium text-black dark:text-white capitalize">
                {filterParams.media.replace(/_/g, " ")}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("media")}
                aria-label="Remove media filter"
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {filterParams.genres?.map((genre) => (
            <div
              key={`genre-${genre}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150"
            >
              <span className="text-black/50 dark:text-white/50">Genre:</span>
              <span className="font-medium text-black dark:text-white">{genre}</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("genre", genre)}
                aria-label={`Remove ${genre} genre filter`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filterParams.countries?.map((country) => (
            <div
              key={`country-${country}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150"
            >
              <span className="text-black/50 dark:text-white/50">Country:</span>
              <span className="font-medium text-black dark:text-white">{country}</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("country", country)}
                aria-label={`Remove ${country} country filter`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filterParams.languages?.map((lang) => (
            <div
              key={`lang-${lang}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150"
            >
              <span className="text-black/50 dark:text-white/50">Language:</span>
              <span className="font-medium text-black dark:text-white">{lang}</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("language", lang)}
                aria-label={`Remove ${lang} language filter`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filterParams.years?.map((year) => (
            <div
              key={`year-${year}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150"
            >
              <span className="text-black/50 dark:text-white/50">Year:</span>
              <span className="font-medium text-black dark:text-white">{year}</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("year", year)}
                aria-label={`Remove ${year} year filter`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filterParams.ratings?.map((rating) => (
            <div
              key={`rating-${rating}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150"
            >
              <span className="text-black/50 dark:text-white/50">Rating:</span>
              <span className="font-medium text-black dark:text-white">{rating}+ ⭐</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("rating", rating)}
                aria-label={`Remove ${rating}+ rating filter`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filterParams.durations?.map((duration) => (
            <div
              key={`duration-${duration}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-light-dropdown dark:bg-dropdown text-black/85 dark:text-white/85 text-xs sm:text-[13px] font-inter rounded-md border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in-50 duration-150"
            >
              <span className="text-black/50 dark:text-white/50">Duration:</span>
              <span className="font-medium text-black dark:text-white">{duration} min</span>
              <button
                type="button"
                onClick={() => handleRemoveFilter("duration", duration)}
                aria-label={`Remove ${duration} duration filter`}
                className="ml-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {totalBadges > 1 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-inter text-light-nav dark:text-trails-red hover:underline font-medium cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {displayMovies.length === 0 ? (
        <div className="w-full max-w-[1440px] flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-light-dropdown dark:bg-dropdown border border-black/10 dark:border-white/10 flex items-center justify-center mb-4 text-black/50 dark:text-white/50">
            <Film className="w-7 h-7" />
          </div>
          <h3 className="font-akshar text-2xl font-medium text-black dark:text-white mb-2">
            No items found
          </h3>
          <p className="font-inter text-sm text-black/60 dark:text-white/60 max-w-md mb-6">
            {hasActiveBadges
              ? "We couldn't find any items matching your selected filters."
              : "We couldn't find any items matching your search."}
          </p>
          {hasActiveBadges && (
            <Button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 h-9 px-5 font-inter text-sm bg-light-nav hover:bg-light-nav/90 dark:bg-trails-red dark:hover:bg-trails-red/90 text-white rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "max-w-[1440px] w-full flex justify-center flex-wrap xl:gap-[24px] lg:gap-[23px] gap-[22px] xl:px-0 lg:px-2 px-1",
            hasActiveBadges
              ? "mt-2 sm:mt-3"
              : "xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px]"
          )}
        >
          {displayMovies.map((movie) => {
            const resolvedMediaType: "movie" | "tv" =
              "mediaType" in movie && movie.mediaType
                ? (movie.mediaType as "movie" | "tv")
                : context === "tv" || basePath?.startsWith("/tv-shows")
                ? "tv"
                : "movie";
            return (
              <PosterCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.image}
                mediaType={resolvedMediaType}
                basePath={basePath}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
