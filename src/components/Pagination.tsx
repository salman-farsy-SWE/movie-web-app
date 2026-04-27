"use client";

import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage?: number;
};

export function Pagination({ currentPage = 1 }: PaginationProps) {
  const pages = [1, 2, 3, 4, 17, 18]; 

  return (
    <div className="mt-[40px] w-full flex items-center h-fit justify-end">
      <div className="flex items-center gap-[16px] mr-[87px]">

        <button
          disabled
          className={cn(
            "group w-[96px] h-[30px] rounded-[3px] flex items-center justify-end pr-[7px] border text-[14px] font-inter",
            "border-pagination_disable text-pagination_disable"
          )}
        >
          <HiArrowLongLeft className="w-[14px] h-[14px] mr-[4px] text-pagination_disable transition-[color,transform] duration-150 group-hover:-translate-x-[3px]" />
          Previous
        </button>

        {pages.slice(0, 4).map((page) => (
          <PageButton
            key={page}
            page={page}
            active={page === currentPage}
          />
        ))}

        <div className="flex items-center justify-center">
          <span className="text-[16px] font-inter tracking-wide">...</span>
        </div>

        {pages.slice(4).map((page) => (
          <PageButton
            key={page}
            page={page}
            active={page === currentPage}
          />
        ))}

        <button
          className={cn(
            "group w-[74px] h-[30px] rounded-[3px] flex items-center justify-start pl-[7px] border text-[14px] font-inter border-black text-black hover:text-black/75 hover:border-black/75 transition-colors duration-150"
          )}
        >
          Next
          <HiArrowLongRight className="w-[14px] h-[14px] ml-[4px] text-black group-hover:text-black/75 transition-[color,transform] group-hover:translate-x-[3px]" />
        </button>

      </div>
    </div>
  );
}


function PageButton({
  page,
  active,
}: {
  page: number;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "min-w-[30px] h-[30px] px-[6px] rounded-[3px] flex items-center justify-center text-[14px] font-inter border",
        active
          ? "bg-black text-white font-medium border-none hover:text-white/90 hover:bg-black/90 transition-colors duration-150"
          : "bg-transparent text-black border-black hover:text-black/75 hover:border-black/75 transition-colors duration-150"
      )}
    >
      {page}
    </button>
  );
}