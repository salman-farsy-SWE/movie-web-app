"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BiFilterAlt } from "react-icons/bi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const sortBy = [
  "Popularity",
  "Latest",
  "Rating",
  "Most Rated",
  "Title A-Z",
  "Title Z-A",
];

export function SortDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="xl:w-[126px] xl:h-[37px] lg:w-[122px] lg:h-[35px] sm:w-[110px] sm:h-[33px] w-[100px] h-[31px] flex justify-center items-center bg-light-dropdown hover:bg-light-dropdown/95 dark:bg-dropdown dark:hover:bg-dropdown/95 cursor-pointer">
          <div
            className={cn(
              "xl:w-[114px] xl:h-[25px] lg:w-[111px] lg:h-[23px] sm:w-[99px] sm:h-[21px] w-[88px] h-[20px] flex items-center justify-center lg:gap-[10px] gap-[8px] xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] p-[2px] dark:bg-dark dark:hover:bg-dark/95",
              open
                ? "shadow-[inset_0_0.5px_1.5px_rgba(0,0,0,0.25)]"

                : "shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)]"
            )}
          >
            <BiFilterAlt className="xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] text-sortby-font hover:text-sortby-font/95 dark:text-white dark:hover:text-white/95" />

            <div className="flex items-center gap-[2px] text-sortby-font hover:text-sortby-font/95 dark:text-white dark:hover:text-white/95 font-inter">
              Sort by
              <ChevronDown
                className={cn(
                  "xl:w-[19px] xl:h-[19px] lg:w-[17px] lg:h-[17px] sm:w-[15px] sm:h-[15px] w-[13px] h-[13px] lg:stroke-[1.6] stroke-[1.3] transition-transform duration-150",
                  open && "rotate-180"
                )}
              />
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={0}
        alignOffset={0}
        className="p-0 border-none bg-transparent xl:w-[125.5px] lg:w-[122px] sm:w-[110px] w-[100px]
        data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
      >
        <div className="h-fit bg-light-dropdown dark:bg-dropdown border-t-2 border-dropdown-underline dark:border-profile-dropdown-username drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)]">
          <div className="flex flex-col gap-[2px] font-poppins xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] font-normal text-black/85 dark:text-white/85">
            {sortBy.map((item) => (
              <div
                key={item}
                onClick={() => setOpen(false)}
                className="flex items-center xl:h-[27px] lg:h-[26px] md:h-[24px] sm:h-[23px] h-[22px] xl:pl-[20px] lg:pl-[19px] sm:pl-[18px] pl-[16px] lg:py-4 md:py-[15px] sm:py-[14px] py-[13px] hover:bg-light-dropdown-hover dark:hover:bg-dropdown-hover transition-all duration-150 ease-in-out cursor-pointer hover:text-black dark:hover:text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}