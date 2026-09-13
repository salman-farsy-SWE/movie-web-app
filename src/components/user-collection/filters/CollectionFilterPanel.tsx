"use client";

import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/shared/filters/FilterSection";
import { CheckboxItem } from "@/components/shared/filters/CheckboxItem";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/shared/filters/RadioItem";
import { PublicYearFilter } from "@/components/media/filters/PublicYearFilter";
import { IoIosStar } from "react-icons/io";
import { RotateCcw } from "lucide-react";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";
import { parseFilterParamArray, isFilterActive, saveBasePage, getBasePage } from "@/lib/tmdb";
import type { FilterContextType } from "@/types";

const COLLECTION_MEDIA_OPTIONS = [
  { id: "collection-media-all", value: "all", label: "All" },
  { id: "collection-media-movies", value: "movies", label: "Movies" },
  { id: "collection-media-tv-shows", value: "tv_shows", label: "TV Shows" },
];

const FILTER_RATINGS = ["3", "4", "5", "6", "7", "8", "9"];

interface CollectionFilterPanelProps {
  open: boolean;
  onClose?: () => void;
  context?: FilterContextType;
}

export function CollectionFilterPanel(props: CollectionFilterPanelProps) {
  return (
    <Suspense fallback={null}>
      <CollectionFilterPanelWrapper {...props} />
    </Suspense>
  );
}

function CollectionFilterPanelWrapper(props: CollectionFilterPanelProps) {
  const searchParams = useSearchParams();
  return <CollectionFilterPanelContent key={searchParams.toString()} {...props} />;
}

function CollectionFilterPanelContent({
  open,
  onClose,
  context = "collection",
}: CollectionFilterPanelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();

  const currentMedia = searchParams.get("media") || "all";
  const [media, setMedia] = useState<string>(currentMedia);
  const [selectedYears, setSelectedYears] = useState<string[]>(
    parseFilterParamArray(searchParams.get("year"))
  );
  const [selectedRatings, setSelectedRatings] = useState<string[]>(
    parseFilterParamArray(searchParams.get("rating"))
  );

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const totalActiveFilters =
    (media && media !== "all" ? 1 : 0) +
    selectedYears.length +
    selectedRatings.length;

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const urlPage = Number(searchParams.get("page")) || 1;

    if (totalActiveFilters === 0) {
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
      onClose?.();
      return;
    }

    if (!isFilterActive(searchParams) && !searchParams.get("sort_by") && !searchParams.get("q") && !searchParams.get("search")) {
      saveBasePage(pathname, urlPage);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("sort_by");

    if (media && media !== "all") {
      params.set("media", media);
    } else {
      params.delete("media");
    }

    if (selectedYears.length > 0) {
      params.set("year", selectedYears.join(","));
    } else {
      params.delete("year");
    }

    if (selectedRatings.length > 0) {
      params.set("rating", selectedRatings.join(","));
    } else {
      params.delete("rating");
    }

    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
    onClose?.();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setMedia("all");
    setSelectedYears([]);
    setSelectedRatings([]);

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
            <FilterSection title="Media">
              <RadioGroup
                value={media}
                onValueChange={setMedia}
                className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center"
              >
                {COLLECTION_MEDIA_OPTIONS.map((item) => (
                  <RadioItem
                    key={item.id}
                    id={item.id}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </RadioGroup>
            </FilterSection>

            <PublicYearFilter
              selectedYears={selectedYears}
              onToggleYear={(y) => toggleItem(selectedYears, setSelectedYears, y)}
            />

            <FilterSection
              title={context === "rating" ? "Rating (Min Score)" : "Rating"}
              items={FILTER_RATINGS}
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
