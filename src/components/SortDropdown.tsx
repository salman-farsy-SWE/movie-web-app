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
        <div className="w-[126px] h-[37px] flex justify-center items-center bg-light-dropdown hover:bg-light-dropdown/95 cursor-pointer">
          <div className="w-[114px] h-[25px] flex items-center justify-center gap-[10px] text-sm">
            <BiFilterAlt className="w-[15px] h-[15px] text-black" />

            <div className="flex items-center gap-[2px] text-dark font-inter">
              Sort by
              <ChevronDown
                className={cn(
                  "w-[19px] h-[19px] stroke-[1.6] transition-transform duration-150",
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
        className="p-0 border-none bg-transparent w-[126px]
        data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
      >
        <div className="w-[126px] h-fit bg-light-dropdown border-t-2 border-dropdown-underline shadow-[1px_1.5px_3px_rgba(0,0,0,0.25)] pt-[8px] pb-[10px]">
          <div className="flex flex-col gap-[2px] font-poppins text-sm font-normal text-black/70">
            {sortBy.map((item) => (
              <div
                key={item}
                onClick={() => setOpen(false)}
                className="w-[126px] h-[27px] pl-[20px] flex items-center hover:bg-light-dropdown-hover transition-all duration-150 ease-in-out cursor-pointer hover:text-black"
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