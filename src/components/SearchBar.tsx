"use client";

import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="xl:w-[350px] xl:h-[39px] lg:w-[340px] lg:h-[37px] md:w-[330px] md:h-[35px] sm:w-[310px] sm:h-[33px] w-[280px] h-[31px] flex items-center xl:gap-[5px] lg:gap-[4px] md:gap-[3px] gap-[2px] xl:pl-[13px] lg:pl-[12px] md:pl-[11px] pl-[9px] bg-search shadow-[inset_0.5px_0.5px_2px_rgba(0,0,0,0.25),inset_-0.5px_-0.5px_2px_rgba(0,0,0,0.25)] xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px]">
      
      <IoSearch className="xl:w-[24px] xl:h-[24px] lg:w-[23px] lg:h-[23px] md:w-[22px] md:h-[22px] sm:w-[20px] sm:h-[20px] w-[19px] h-[19px] text-light-search-font" />

      <Input
        placeholder="Search"
        className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-inter font-normal lg:text-[16px] md:text-[15px] text-[14px] text-black placeholder:font-light placeholder:text-light-search-font h-full p-0"
      />
      
    </div>
  );
}