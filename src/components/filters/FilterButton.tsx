"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

import { isFilterActive } from "@/lib/tmdb";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
}

export function FilterButton(props: FilterButtonProps) {
  return (
    <Suspense fallback={<FilterButtonBase {...props} />}>
      <FilterButtonWithParams {...props} />
    </Suspense>
  );
}

function FilterButtonBase({
  onClick,
  className,
  isActive,
}: FilterButtonProps & { isActive?: boolean }) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "filter-btn xl:w-[113px] xl:h-[37px] lg:w-[109px] lg:h-[35px] sm:w-[100px] sm:h-[33px] w-[90px] h-[31px] flex items-center justify-center gap-1.5 transition-colors duration-75 font-inter font-medium xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] bg-light-dropdown dark:bg-dropdown hover:bg-light-dropdown/95 dark:hover:bg-dropdown/95",
        isActive
          ? "text-light-nav dark:text-trails-red font-semibold border border-light-nav/35 dark:border-trails-red/40"
          : "text-dark/85 hover:text-dark dark:text-white/85 dark:hover:text-white",
        className
      )}
    >
      <SlidersHorizontal className="w-3.5 h-3.5 opacity-70 shrink-0" />
      <span>Filter</span>
    </Button>
  );
}

function FilterButtonWithParams(props: FilterButtonProps) {
  const searchParams = useSearchParams();
  const isActive = isFilterActive(searchParams);

  return <FilterButtonBase {...props} isActive={isActive} />;
}






