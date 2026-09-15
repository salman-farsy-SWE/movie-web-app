"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { YEAR_OPTIONS } from "@/lib/tmdb/filters";
import { cn } from "@/lib/utils";

interface PublicYearFilterProps {
  selectedYears: string[];
  onToggleYear: (year: string) => void;
  onClearYears?: () => void;
}

export function PublicYearFilter({
  selectedYears,
  onToggleYear,
  onClearYears,
}: PublicYearFilterProps) {
  const decades = Object.keys(YEAR_OPTIONS) as Array<keyof typeof YEAR_OPTIONS>;
  const [openDecade, setOpenDecade] = useState<string | null>(null);

  const isBefore1970Selected =
    selectedYears.includes("Before 1970") || selectedYears.includes("before-1970");

  const handleClear = () => {
    if (onClearYears) {
      onClearYears();
    } else {
      selectedYears.forEach((y) => onToggleYear(y));
    }
  };

  return (
    <div className="py-3 sm:py-3.5 border-b border-black/[0.08] dark:border-white/[0.08]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-poppins text-xs sm:text-sm font-semibold text-black dark:text-white uppercase tracking-wider">
          Year
        </h3>
        {selectedYears.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] sm:text-xs font-inter font-medium text-light-nav dark:text-trails-red hover:underline cursor-pointer select-none"
          >
            Clear
          </button>
        )}
      </div>

      {/* Decade buttons in a row; clicking one opens a dropdown with that decade's years */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {decades.map((decade) => {
          // Ensure years are in ascending order
          const yearsInDecade = [...YEAR_OPTIONS[decade]].sort((a, b) => Number(a) - Number(b));
          const selectedInDecade = yearsInDecade.filter((y) =>
            selectedYears.includes(String(y))
          );
          const hasSelected = selectedInDecade.length > 0;
          const isOpen = openDecade === decade;

          return (
            <Popover
              key={decade}
              open={isOpen}
              onOpenChange={(open) => setOpenDecade(open ? decade : null)}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`${decade} filter dropdown`}
                  className={cn(
                    "year-popover px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-inter rounded-md transition-all select-none cursor-pointer flex items-center gap-1.5 border",
                    hasSelected
                      ? "bg-light-nav dark:bg-trails-red text-white font-semibold border-light-nav dark:border-trails-red shadow-2xs"
                      : "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-black/75 hover:text-black dark:text-white/75 dark:hover:text-white border-transparent",
                    isOpen && !hasSelected && "ring-1 ring-black/20 dark:ring-white/20 bg-black/10 dark:bg-white/10"
                  )}
                >
                  <span>{decade}</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 opacity-70 transition-transform duration-200 shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                side="bottom"
                sideOffset={6}
                className="year-popover p-2 sm:p-2.5 border border-black/10 dark:border-white/10 w-44 sm:w-48 z-40 rounded-xl bg-white dark:bg-dropdown shadow-xl dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-black/[0.06] dark:border-white/[0.06] px-1">
                  <span className="font-poppins text-xs font-semibold text-black dark:text-white">
                    {decade}
                  </span>
                  {hasSelected && (
                    <button
                      type="button"
                      onClick={() => {
                        selectedInDecade.forEach((y) => onToggleYear(String(y)));
                      }}
                      className="text-[11px] font-inter text-light-nav dark:text-trails-red hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Single column of years in ascending order with fully selectable buttons and thin scrollbar */}
                <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.2)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                  {yearsInDecade.map((year) => {
                    const yearStr = String(year);
                    const isSelected = selectedYears.includes(yearStr);
                    return (
                      <button
                        key={yearStr}
                        type="button"
                        onClick={() => onToggleYear(yearStr)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-inter text-left transition-colors cursor-pointer select-none",
                          isSelected
                            ? "text-light-nav dark:text-trails-red font-medium bg-light-nav/10 dark:bg-trails-red/15"
                            : "text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                            isSelected
                              ? "bg-light-nav dark:bg-trails-red border-light-nav dark:border-trails-red text-white"
                              : "border-black/30 dark:border-white/30 bg-transparent"
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{yearStr}</span>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}

        {/* Before 1970 single toggle button */}
        <button
          type="button"
          onClick={() => onToggleYear("Before 1970")}
          className={cn(
            "year-popover px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-inter rounded-md transition-all select-none cursor-pointer flex items-center gap-1 border",
            isBefore1970Selected
              ? "bg-light-nav dark:bg-trails-red text-white font-semibold border-light-nav dark:border-trails-red shadow-2xs"
              : "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-black/75 hover:text-black dark:text-white/75 dark:hover:text-white border-transparent"
          )}
        >
          <span>Before 1970</span>
          {isBefore1970Selected && <Check className="w-3.5 h-3.5 shrink-0" />}
        </button>
      </div>
    </div>
  );
}
