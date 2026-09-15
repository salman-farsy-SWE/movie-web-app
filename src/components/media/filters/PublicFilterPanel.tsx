"use client";

import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/shared/filters/FilterSection";
import { PublicYearFilter } from "@/components/media/filters/PublicYearFilter";
import { CheckboxItem } from "@/components/shared/filters/CheckboxItem";
import { IoIosStar } from "react-icons/io";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/shared/filters/RadioItem";
import {
  FILTER_COUNTRIES,
  FILTER_LANGUAGES,
  FILTER_RATINGS,
  FILTER_DURATIONS,
  TRENDING_MEDIA_OPTIONS,
  TRENDING_TIME_WINDOW_OPTIONS,
  getMediaFilterOptions,
  getGenresByContext,
  normalizeMovieFilter,
  countActiveFilters,
  parseFilterParamArray,
  saveBasePage,
  getBasePage,
  isFilterActive,
} from "@/lib/tmdb";
import type { FilterContextType } from "@/types";
import { RotateCcw } from "lucide-react";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";

interface PublicFilterPanelProps {
  open: boolean;
  onClose?: () => void;
  context?: FilterContextType;
  pageType?: string;
  param?: string;
}

export function PublicFilterPanel(props: PublicFilterPanelProps) {
  return (
    <Suspense fallback={null}>
      <PublicFilterPanelWrapper {...props} />
    </Suspense>
  );
}

function PublicFilterPanelWrapper(props: PublicFilterPanelProps) {
  const searchParams = useSearchParams();
  return <PublicFilterPanelContent key={searchParams.toString()} {...props} />;
}

function PublicFilterPanelContent({
  open,
  onClose,
  context = "movie",
  pageType,
  param,
}: PublicFilterPanelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();

  const isTrending = pageType === "trending" || pathname.startsWith("/trending");

  const isTrendingTodayOrWeek =
    param === "today" ||
    param === "this-week" ||
    pathname === "/trending/today" ||
    pathname === "/trending/this-week";

  const isTrendingMoviesOrTv =
    param === "movies" ||
    param === "tv-shows" ||
    param === "persons" ||
    pathname === "/trending/movies" ||
    pathname === "/trending/tv-shows" ||
    pathname === "/trending/persons";

  const currentMediaParam = searchParams.get("media");
  const currentMedia = normalizeMovieFilter(currentMediaParam);
  const currentTimeWindowParam =
    searchParams.get("time_window") ||
    (currentMediaParam === "day" || currentMediaParam === "week"
      ? currentMediaParam
      : "week");

  const mediaOptions = isTrending
    ? isTrendingTodayOrWeek
      ? TRENDING_MEDIA_OPTIONS
      : TRENDING_TIME_WINDOW_OPTIONS
    : getMediaFilterOptions(context);
  const genreOptions = getGenresByContext(context);

  const [media, setMedia] = useState<string>(currentMedia);
  const [timeWindow, setTimeWindow] = useState<string>(currentTimeWindowParam);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    parseFilterParamArray(searchParams.get("genre"))
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    parseFilterParamArray(searchParams.get("country"))
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    parseFilterParamArray(searchParams.get("language"))
  );
  const [selectedYears, setSelectedYears] = useState<string[]>(
    parseFilterParamArray(searchParams.get("year"))
  );
  const [selectedRatings, setSelectedRatings] = useState<string[]>(
    parseFilterParamArray(searchParams.get("rating"))
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>(
    parseFilterParamArray(searchParams.get("duration"))
  );

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const totalActiveFilters = isTrending
    ? isTrendingTodayOrWeek
      ? media && media !== "all"
        ? 1
        : 0
      : timeWindow && timeWindow !== "week"
      ? 1
      : 0
    : countActiveFilters({
        media,
        genres: context === "genre" ? [] : selectedGenres,
        countries: selectedCountries,
        languages: selectedLanguages,
        years: selectedYears,
        ratings: selectedRatings,
        durations: selectedDurations,
      });

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const urlPage = Number(searchParams.get("page")) || 1;

    if (totalActiveFilters === 0) {
      const returnPage = getBasePage(pathname, 1);
      const params = new URLSearchParams();
      if (returnPage > 1) {
        params.set("page", String(returnPage));
      }
      const query = params.toString();
      navigateWithTransition(query ? `${pathname}?${query}` : pathname);
      onClose?.();
      return;
    }

    if (!isFilterActive(searchParams) && !searchParams.get("sort_by") && !searchParams.get("q") && !searchParams.get("search")) {
      saveBasePage(pathname, urlPage);
    }

    const params = new URLSearchParams();

    if (isTrending) {
      if (isTrendingTodayOrWeek) {
        if (media && media !== "all") {
          params.set("media", media);
        }
      } else if (isTrendingMoviesOrTv) {
        if (timeWindow && timeWindow !== "week") {
          params.set("time_window", timeWindow);
        }
      }
    } else {
      if (media && media !== "all") {
        params.set("media", media);
      }
      if (context !== "genre" && selectedGenres.length > 0) {
        params.set("genre", selectedGenres.join(","));
      }
      if (selectedCountries.length > 0) {
        params.set("country", selectedCountries.join(","));
      }
      if (selectedLanguages.length > 0) {
        params.set("language", selectedLanguages.join(","));
      }
      if (selectedDurations.length > 0) {
        params.set("duration", selectedDurations.join(","));
      }
      if (selectedYears.length > 0) {
        params.set("year", selectedYears.join(","));
      }
      if (selectedRatings.length > 0) {
        params.set("rating", selectedRatings.join(","));
      }
    }

    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
    onClose?.();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setMedia("all");
    setTimeWindow("week");
    setSelectedGenres([]);
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setSelectedYears([]);
    setSelectedRatings([]);
    setSelectedDurations([]);

    const returnPage = getBasePage(pathname, 1);
    const params = new URLSearchParams();
    if (returnPage > 1) {
      params.set("page", String(returnPage));
    }
    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
    onClose?.();
  };

  return (
    <div
      className={cn(
        "grid transition-all duration-300 ease-in-out w-full max-w-[1440px]",
        open
          ? "grid-rows-[1fr] opacity-100 my-4 sm:my-5"
          : "grid-rows-[0fr] opacity-0 my-0 pointer-events-none"
      )}
    >
      <div className="overflow-hidden">
        <form
          onSubmit={handleApplyFilter}
          className="filter-container w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 bg-white dark:bg-dropdown border border-black/10 dark:border-white/10 rounded-xl shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex flex-col"
        >
          <div className="flex flex-col w-full divide-y-0">
            {isTrending ? (
              <>
                {isTrendingTodayOrWeek ? (
                  <FilterSection title="Media">
                    <RadioGroup
                      value={media}
                      onValueChange={setMedia}
                      className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center"
                    >
                      {TRENDING_MEDIA_OPTIONS.map((item) => (
                        <RadioItem
                          key={item.id}
                          id={item.id}
                          value={item.value}
                          label={item.label}
                        />
                      ))}
                    </RadioGroup>
                  </FilterSection>
                ) : isTrendingMoviesOrTv ? (
                  <FilterSection title="Timeframe">
                    <RadioGroup
                      value={timeWindow}
                      onValueChange={setTimeWindow}
                      className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center"
                    >
                      {TRENDING_TIME_WINDOW_OPTIONS.map((item) => (
                        <RadioItem
                          key={item.id}
                          id={item.id}
                          value={item.value}
                          label={item.label}
                        />
                      ))}
                    </RadioGroup>
                  </FilterSection>
                ) : null}
              </>
            ) : (
              <>
                <FilterSection title="Media">
                  <RadioGroup
                    value={media}
                    onValueChange={setMedia}
                    className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center"
                  >
                    {mediaOptions.map((item) => (
                      <RadioItem
                        key={item.id}
                        id={item.id}
                        value={item.value}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </FilterSection>

                {context !== "genre" && (
                  <FilterSection
                    title="Genre"
                    items={genreOptions as unknown as string[]}
                    initialLimit={16}
                    renderItem={(item) => (
                      <CheckboxItem
                        key={item}
                        id={`genre-${item}`}
                        label={item}
                        checked={selectedGenres.includes(item)}
                        onCheckedChange={() => toggleItem(selectedGenres, setSelectedGenres, item)}
                      />
                    )}
                  />
                )}

                <FilterSection
                  title="Country"
                  items={FILTER_COUNTRIES as unknown as string[]}
                  initialLimit={16}
                  renderItem={(item) => (
                    <CheckboxItem
                      key={item}
                      id={`country-${item}`}
                      label={item}
                      checked={selectedCountries.includes(item)}
                      onCheckedChange={() => toggleItem(selectedCountries, setSelectedCountries, item)}
                    />
                  )}
                />

                <FilterSection
                  title="Language"
                  items={FILTER_LANGUAGES as unknown as string[]}
                  initialLimit={16}
                  renderItem={(item) => (
                    <CheckboxItem
                      key={item}
                      id={`language-${item}`}
                      label={item}
                      checked={selectedLanguages.includes(item)}
                      onCheckedChange={() => toggleItem(selectedLanguages, setSelectedLanguages, item)}
                    />
                  )}
                />

                <PublicYearFilter
                  selectedYears={selectedYears}
                  onToggleYear={(y) => toggleItem(selectedYears, setSelectedYears, y)}
                  onClearYears={() => setSelectedYears([])}
                />

                <FilterSection
                  title="Rating"
                  items={FILTER_RATINGS as unknown as string[]}
                  renderItem={(item) => (
                    <CheckboxItem
                      key={item}
                      id={`rating-${item}`}
                      checked={selectedRatings.includes(item)}
                      onCheckedChange={() => toggleItem(selectedRatings, setSelectedRatings, item)}
                    >
                      <IoIosStar className="w-4 h-4 text-fill-star inline-block shrink-0" />
                      <span>{item}+</span>
                    </CheckboxItem>
                  )}
                />

                <FilterSection
                  title="Duration"
                  items={FILTER_DURATIONS as unknown as string[]}
                  renderItem={(item) => (
                    <CheckboxItem
                      key={item}
                      id={`duration-${item}`}
                      label={`${item} min`}
                      checked={selectedDurations.includes(item)}
                      onCheckedChange={() => toggleItem(selectedDurations, setSelectedDurations, item)}
                    />
                  )}
                />
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 sm:pt-5 mt-2 border-t border-black/[0.08] dark:border-white/[0.08]">
            <div className="text-xs sm:text-sm text-black/60 dark:text-white/60 font-inter self-start sm:self-auto">
              {totalActiveFilters > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-light-nav dark:text-trails-red">
                  <span className="w-1.5 h-1.5 rounded-full bg-light-nav dark:bg-trails-red" />
                  {totalActiveFilters} {totalActiveFilters === 1 ? "filter" : "filters"} selected
                </span>
              ) : (
                <span>No filters selected</span>
              )}
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <Button
                type="button"
                onClick={handleReset}
                className="h-9 px-4 sm:px-5 inline-flex items-center justify-center gap-1.5 font-inter font-medium text-xs sm:text-sm bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white border border-black/15 dark:border-white/15 rounded-lg shadow-none transition-colors duration-150 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 opacity-70" />
                Reset
              </Button>

              <Button
                type="submit"
                className="h-9 px-5 sm:px-6 inline-flex items-center justify-center font-inter font-medium text-xs sm:text-sm bg-light-nav hover:bg-light-nav/90 dark:bg-trails-red dark:hover:bg-trails-red/90 text-white rounded-lg transition-colors duration-150 cursor-pointer"
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
