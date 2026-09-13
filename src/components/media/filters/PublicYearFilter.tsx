"use client";

import { useState } from "react";
import { CheckboxItem } from "@/components/shared/filters/CheckboxItem";
import { YEAR_OPTIONS } from "@/lib/tmdb/filters";
import { cn } from "@/lib/utils";

interface PublicYearFilterProps {
  selectedYears: string[];
  onToggleYear: (year: string) => void;
}

export function PublicYearFilter({
  selectedYears,
  onToggleYear,
}: PublicYearFilterProps) {
  const decades = Object.keys(YEAR_OPTIONS) as Array<keyof typeof YEAR_OPTIONS>;
  const [activeDecade, setActiveDecade] = useState<keyof typeof YEAR_OPTIONS>(decades[0]);

  return (
    <div className="py-3 sm:py-3.5 border-b border-black/[0.08] dark:border-white/[0.08]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-poppins text-xs sm:text-sm font-semibold text-black dark:text-white uppercase tracking-wider">
          Year
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {/* Decade selection tabs */}
        <div className="flex flex-wrap gap-1">
          {decades.map((decade) => {
            const isSelected = decade === activeDecade;
            const hasSelectedInDecade = YEAR_OPTIONS[decade].some((y) =>
              selectedYears.includes(String(y))
            );

            return (
              <button
                key={decade}
                type="button"
                onClick={() => {
                  setActiveDecade(decade);
                }}
                className={cn(
                  "px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-inter rounded-md transition-colors select-none cursor-pointer flex items-center gap-1",
                  isSelected
                    ? "bg-light-nav dark:bg-trails-red text-white font-semibold shadow-2xs"
                    : "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-black/75 dark:text-white/75"
                )}
              >
                <span>{decade}</span>
                {hasSelectedInDecade && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Years in active decade */}
        <div className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center mt-1">
          {YEAR_OPTIONS[activeDecade].map((year) => {
            const yearStr = String(year);
            return (
              <CheckboxItem
                key={yearStr}
                id={`year-${yearStr}`}
                label={yearStr}
                checked={selectedYears.includes(yearStr)}
                onCheckedChange={() => onToggleYear(yearStr)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
