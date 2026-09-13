"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterSectionProps } from "@/types";

export function FilterSection<T = string>({
  title,
  items,
  initialLimit = 16,
  renderItem,
  children,
  className,
}: FilterSectionProps<T>) {
  const [showAll, setShowAll] = useState(false);

  const displayedItems = items
    ? showAll
      ? items
      : items.slice(0, initialLimit)
    : [];

  const hasMore = Boolean(items && items.length > initialLimit);

  return (
    <div className={cn("py-3 sm:py-3.5 border-b border-black/[0.08] dark:border-white/[0.08] last:border-b-0", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-poppins text-xs sm:text-sm font-semibold text-black dark:text-white uppercase tracking-wider">
          {title}
        </h3>
      </div>

      {children ? (
        children
      ) : (
        <>
          <div className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center">
            {displayedItems.map((item) => renderItem?.(item))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-2 text-xs sm:text-sm font-inter font-medium text-light-nav dark:text-trails-red hover:underline inline-flex items-center gap-1 cursor-pointer select-none"
            >
              <span>{showAll ? "Show less" : `Show more (+${(items?.length || 0) - initialLimit})`}</span>
              <ChevronDown
                className={cn("w-3.5 h-3.5 transition-transform duration-150", showAll && "rotate-180")}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
}

