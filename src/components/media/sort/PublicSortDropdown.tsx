"use client";

import { Suspense, useState } from "react";
import { ChevronDown, Check, ArrowUpDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getSortOptionsByContext,
  normalizeSortOption,
  isFilterActive,
  saveBasePage,
  getBasePage,
  clearFilterParams,
} from "@/lib/tmdb";
import type { MovieSortOption, FilterContextType } from "@/types";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";

interface PublicSortDropdownProps {
  context?: FilterContextType;
}

export function PublicSortDropdown({ context = "movie" }: PublicSortDropdownProps) {
  return (
    <Suspense
      fallback={
        <div className="xl:w-[126px] xl:h-[37px] lg:w-[122px] lg:h-[35px] sm:w-[110px] sm:h-[33px] w-[100px] h-[31px] p-[2px] sm:p-[2.5px] flex items-center justify-center bg-light-dropdown dark:bg-dropdown xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] select-none">
          <div className="w-full h-full flex items-center justify-center lg:gap-[8px] gap-[6px] xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] font-inter font-medium text-dark/85 dark:text-white/85 bg-white/70 dark:bg-dark dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)] shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)] xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px]">
            <ArrowUpDown className="xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] opacity-80 shrink-0" />
            <span>Sort by</span>
            <ChevronDown className="xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] opacity-70 shrink-0" />
          </div>
        </div>
      }
    >
      <PublicSortDropdownContent context={context} />
    </Suspense>
  );
}

function PublicSortDropdownContent({ context = "movie" }: PublicSortDropdownProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigateWithTransition } = useSortFilterTransition();

  const sortOptions = getSortOptionsByContext(context);
  const currentSortParam = searchParams.get("sort_by");
  const hasActiveFilters = isFilterActive(searchParams);

  const isSortActive = !hasActiveFilters && currentSortParam !== null;
  const currentSortValue = isSortActive
    ? normalizeSortOption(currentSortParam)
    : null;

  const handleClearSort = () => {
    const returnPage = getBasePage(pathname, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sort_by");
    if (returnPage > 1) {
      params.set("page", String(returnPage));
    } else {
      params.delete("page");
    }
    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  };

  const handleSelectSort = (sortValue: MovieSortOption) => {
    const urlPage = Number(searchParams.get("page")) || 1;

    if (isSortActive && currentSortValue === sortValue) {
      handleClearSort();
      return;
    }

    if (!isSortActive && !hasActiveFilters && !searchParams.get("q") && !searchParams.get("search")) {
      saveBasePage(pathname, urlPage);
    }

    const params = new URLSearchParams(searchParams.toString());
    clearFilterParams(params);
    params.delete("page");
    params.set("sort_by", sortValue);
    const query = params.toString();
    navigateWithTransition(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Sort options"
          className={cn(
            "group xl:w-[126px] xl:h-[37px] lg:w-[122px] lg:h-[35px] sm:w-[110px] sm:h-[33px] w-[100px] h-[31px] p-[2px] sm:p-[2.5px] flex items-center justify-center bg-light-dropdown hover:bg-light-dropdown/90 dark:bg-dropdown dark:hover:bg-dropdown/90 xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] transition-all duration-150 cursor-pointer select-none",
            open && "ring-1 ring-black/15 dark:ring-white/20"
          )}
        >
          <div
            className={cn(
              "w-full h-full flex items-center justify-center lg:gap-[8px] gap-[6px] xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] font-inter font-medium xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px] transition-all duration-150",
              "bg-white/70 hover:bg-white dark:bg-dark dark:hover:bg-dark/95",
              isSortActive
                ? "text-light-nav dark:text-trails-red font-semibold"
                : "text-dark/85 group-hover:text-dark dark:text-white/85 dark:group-hover:text-white",
              open
                ? "dark:shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.12)]"
                : "dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)] shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)]"
            )}
          >
            <ArrowUpDown
              className={cn(
                "xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] shrink-0 transition-colors duration-150",
                isSortActive
                  ? "text-light-nav dark:text-trails-red opacity-100"
                  : "opacity-75 group-hover:opacity-100"
              )}
            />

            <span className="leading-none">Sort by</span>

            <ChevronDown
              className={cn(
                "xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] shrink-0 transition-transform duration-200 opacity-70 group-hover:opacity-100",
                open && "rotate-180"
              )}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={6}
        alignOffset={0}
        className="p-0 border border-black/10 dark:border-white/10 min-w-[165px] sm:min-w-[195px] xl:min-w-[210px] w-auto max-w-[260px] z-30 rounded-lg sm:rounded-xl overflow-hidden bg-light-dropdown dark:bg-dropdown drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
      >
        <div className="border-t-2 border-light-nav dark:border-trails-red py-1.5 px-1 flex flex-col gap-0.5">
          <div className="flex flex-col font-poppins text-[11px] sm:text-[12px] lg:text-[13px]">
            {sortOptions.map((item) => {
              const isActive = currentSortValue !== null && item.value === currentSortValue;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleSelectSort(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 sm:py-2 rounded-md transition-all duration-150 ease-in-out cursor-pointer text-left select-none",
                    isActive
                      ? "text-light-nav dark:text-trails-red font-medium bg-light-nav/10 dark:bg-trails-red/15"
                      : "text-black/80 hover:text-black dark:text-white/85 dark:hover:text-white hover:bg-light-dropdown-hover dark:hover:bg-dropdown-hover"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-light-nav dark:text-trails-red shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
