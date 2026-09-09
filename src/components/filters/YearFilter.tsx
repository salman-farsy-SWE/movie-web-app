"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckboxItem } from "@/components/filters/CheckboxItem";

import { YEAR_OPTIONS } from "@/lib/tmdb";

interface YearFilterProps {
  selectedYears?: string[];
  onToggleYear?: (year: string) => void;
  className?: string;
}

export function YearFilter({ selectedYears = [], onToggleYear, className }: YearFilterProps) {
  const [openYear, setOpenYear] = useState<string | null>(null);

  const isYearSelected = (y: string) => selectedYears.includes(y);

  return (
    <div className={cn("flex flex-col py-3 sm:py-3.5 border-b border-black/[0.07] dark:border-white/[0.07] last:border-b-0", className)}>
      <h3 className="font-inter font-semibold text-xs sm:text-sm tracking-wide uppercase text-black/90 dark:text-white/90 mb-2 sm:mb-2.5">
        Year
      </h3>

      <div className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center">
        {Object.keys(YEAR_OPTIONS).map((decade) => {
          const yearsInDecade = YEAR_OPTIONS[decade as keyof typeof YEAR_OPTIONS];
          const hasSelectedInDecade = yearsInDecade.some((y) => selectedYears.includes(String(y)));

          return (
            <Popover
              key={decade}
              open={openYear === decade}
              onOpenChange={(v) => setOpenYear(v ? decade : null)}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs sm:text-[13px] lg:text-sm font-inter transition-all duration-150 border cursor-pointer select-none",
                    hasSelectedInDecade
                      ? "bg-light-nav/10 border-light-nav/35 text-light-nav font-medium dark:bg-trails-red/15 dark:border-trails-red/50 dark:text-trails-red"
                      : "border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white",
                    openYear === decade && !hasSelectedInDecade && "bg-black/5 dark:bg-white/5 text-black dark:text-white border-black/10 dark:border-white/10"
                  )}
                >
                  <span>{decade}</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-150 opacity-70",
                      openYear === decade && "rotate-180"
                    )}
                  />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                side="bottom"
                sideOffset={4}
                className="year-popover p-2 border border-black/10 dark:border-white/10 bg-light-dropdown dark:bg-[#252525] rounded-lg shadow-xl min-w-[160px] z-50 animate-in fade-in-0 zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-2 gap-1">
                  {yearsInDecade.map((y) => {
                    const strY = String(y);
                    return (
                      <CheckboxItem
                        key={y}
                        id={`year-${y}`}
                        label={strY}
                        checked={isYearSelected(strY)}
                        onCheckedChange={() => onToggleYear?.(strY)}
                        className="px-2 py-1 justify-start"
                      />
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}

        <CheckboxItem
          id="year-all"
          label="Before 1970"
          checked={isYearSelected("Before 1970")}
          onCheckedChange={() => onToggleYear?.("Before 1970")}
        />
      </div>
    </div>
  );
}