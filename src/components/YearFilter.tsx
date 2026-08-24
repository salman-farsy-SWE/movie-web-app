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
      <h2 className="font-inter font-medium xl:text-[18px] lg:text-[17px] sm:text-[16px] text-[15px]">Year</h2>

      <div className="xl:mt-[8px] lg:mt-[7px] sm:mt-[6px] mt-[4px] xl:pl-[9px] lg:pl-[8px] sm:pl-[7px] pl-[6px] flex flex-wrap sm:gap-x-[10px] gap-x-[9px] sm:gap-y-[7px] gap-y-[6px]">
        {Object.keys(yearOptions).map((year) => (
          <Popover
            key={year}
            open={openYear === year}
            onOpenChange={(v) => setOpenYear(v ? year : null)}
          >
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "xl:w-[77px] xl:h-[26px] lg:w-[75px] lg:h-[23px] sm:w-[73px] w-[68px] h-[21px] flex items-center justify-center lg:gap-[4px] sm:gap-[3px] gap-[2px] bg-white cursor-pointer",
                  openYear === year
                    ? "shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]"
                    : "shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)]"
                )}
              >
                <span className="font-inter xl:text-[16px] lg:text-[15px] sm:text-[14px] text-[13px]">{year}</span>

                <ChevronDown
                  className={cn(
                    "lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] transition-transform duration-150",
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
              className="year-popover p-0 border-none bg-transparent xl:w-[77px] lg:w-[75px] sm:w-[73px] w-[68px] h-fit">
              <div
                className="
    border-t-2 border-dropdown-underline
    bg-light-dropdown
    shadow-[1px_0_3px_rgba(0,0,0,0.25),1px_1.5px_3px_rgba(0,0,0,0.25)]
  "
              >
                <div className="xl:py-[12px] lg:py-[11px] sm:py-[9px] py-[8px] lg:pl-[10px] sm:pl-[11px] pl-[9px] flex flex-col lg:gap-[15px] sm:gap-[13px] gap-[11px]">
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