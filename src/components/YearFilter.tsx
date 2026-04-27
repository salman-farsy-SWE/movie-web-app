"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckboxItem } from "./CheckboxItem";

const yearOptions = {
  "2020s": Array.from({ length: 10 }, (_, i) => 2020 + i),
  "2010s": Array.from({ length: 10 }, (_, i) => 2010 + i),
  "2000s": Array.from({ length: 10 }, (_, i) => 2000 + i),
  "1990s": Array.from({ length: 10 }, (_, i) => 1990 + i),
  "1980s": Array.from({ length: 10 }, (_, i) => 1980 + i),
  "1970s": Array.from({ length: 10 }, (_, i) => 1970 + i),
};

export function YearFilter() {
  const [openYear, setOpenYear] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <h2 className="font-inter font-medium text-[18px]">Year</h2>

      <div className="mt-[8px] pl-[9px] flex flex-wrap gap-x-[10px] gap-y-[7px]">
        {Object.keys(yearOptions).map((year) => (
          <Popover
            key={year}
            open={openYear === year}
            onOpenChange={(v) => setOpenYear(v ? year : null)}
          >
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "w-[77px] h-[26px] flex items-center justify-center gap-[4px] bg-white cursor-pointer",
                  openYear === year
                    ? "shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]"
                    : "shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)]"
                )}
              >
                <span className="font-inter text-[16px]">{year}</span>

                <ChevronDown
                  className={cn(
                    "w-[14px] h-[14px] transition-transform duration-150",
                    openYear === year && "rotate-180"
                  )}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={0}
              alignOffset={0}
              avoidCollisions={false}
              collisionPadding={0}
              style={{ transform: "none" }}
              className="year-popover p-0 border-none bg-transparent w-[77px]">
              <div
                className="
    w-[77px] h-[353px]
    border-t-2 border-dropdown-underline
    bg-light-dropdown
    shadow-[1px_0_3px_rgba(0,0,0,0.25),1px_1.5px_3px_rgba(0,0,0,0.25)]
  "
              >
                <div className="pt-[10px] pl-[10px] flex flex-col gap-[10px]">
                  {yearOptions[year as keyof typeof yearOptions].map((y) => (
                    <CheckboxItem key={y} id={`year-${y}`} label={String(y)} />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}

        <CheckboxItem id="year-all" label="Before 1970" />
      </div>
    </div>
  );
}