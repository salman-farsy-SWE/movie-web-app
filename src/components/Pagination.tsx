"use client";

import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage?: number;
};

export function Pagination({ currentPage = 1 }: PaginationProps) {
  const pages = [1, 2, 3, 4, 17, 18]; 

  return (
    <div className="mt-[55px] w-full flex items-center h-fit justify-end">
      <div className="flex items-center xl:gap-[16px] md:gap-[14px] sm:gap-[12px] gap-[11px] xl:mr-[0px] lg:mr-[16px] sm:mr-[14px] mr-3">

        <button
          disabled
          className={cn(
            "group lg:w-[96px] lg:h-[30px] md:w-[92px] md:h-[29px] sm:h-[28px] w-[84px] h-[26px] md:rounded-[3px] rounded-[2px] flex items-center justify-end md:pr-[7px] pr-[5px] border lg:text-[14px] md:text-[13px] text-[12px] font-inter",
            "border-pagination_disable text-pagination_disable"
          )}
        >
          <HiArrowLongLeft className="lg:w-[14px] lg:h-[14px] md:w-[13px] md:h-[13px] sm:w-[12px] sm:h-[12px] w-[11px] h-[11px] mr-[4px] text-pagination_disable" />
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
          <span className="lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-inter tracking-wide">...</span>
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
            "group lg:w-[72px] lg:h-[30px] md:w-[68px] md:h-[29px] sm:h-[28px] w-[62px] h-[26px] md:rounded-[3px] rounded-[2px] flex items-center justify-start md:pl-[7px] pl-[5px] border lg:text-[14px] md:text-[13px] text-[12px] font-inter border-black text-black hover:text-black/75 hover:border-black/75 transition-colors duration-150"
          )}
        >
          Next
          <HiArrowLongRight className="lg:w-[14px] lg:h-[14px] md:w-[13px] md:h-[13px] sm:w-[12px] sm:h-[12px] w-[11px] h-[11px] ml-[4px] text-black group-hover:text-black/75 transition-[color,transform] group-hover:translate-x-[3px]" />
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
        "lg:w-[30px] lg:h-[30px] md:w-[29px] md:h-[29px] sm:w-[28px] sm:h-[28px] w-[26px] h-[26px] md:rounded-[3px] rounded-[2px] flex items-center justify-center lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] font-inter border p-[2px] align-baseline",
        active
          ? "bg-black text-white font-medium border-none transition-colors duration-150"
          : "bg-transparent text-black border-black hover:text-black/75 hover:border-black/75 transition-colors duration-150"
      )}
    >
      {page}
    </button>
  );
}