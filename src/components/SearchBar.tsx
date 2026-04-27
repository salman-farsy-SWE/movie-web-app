"use client";

import { IoSearch } from "react-icons/io5";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="w-[350px] h-[39px] flex items-center gap-[9px] pl-[13px] bg-search shadow-[inset_0.5px_0.5px_2px_rgba(0,0,0,0.25),inset_-0.5px_-0.5px_2px_rgba(0,0,0,0.25)] rounded-[7px]">
      
      <IoSearch className="w-[24px] h-[24px] text-light-search-font" />

      <Input
        placeholder="Search"
        className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-inter font-normal text-[16px] text-black/65 placeholder:font-light placeholder:text-light-search-font h-full p-0"
      />
      
    </div>
  );
}