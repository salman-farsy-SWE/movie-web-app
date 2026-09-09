"use client";

import { useState } from "react";
import { CheckboxItem } from "@/components/filters/CheckboxItem";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FilterSection({
  title,
  items,
  renderItem,
  children,
  className,
  initialLimit,
  selectedItems = [],
}: {
  title: string;
  items?: string[];
  renderItem?: (item: string) => React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  initialLimit?: number;
  selectedItems?: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldCollapse = Boolean(initialLimit && items && items.length > initialLimit);

  // When collapsed, show initial items plus any selected items that would otherwise be hidden
  const visibleItems = items
    ? shouldCollapse && !isExpanded
      ? items.filter((item, idx) => idx < initialLimit! || selectedItems.includes(item))
      : items
    : [];

  const hiddenCount = items && initialLimit ? Math.max(0, items.length - initialLimit) : 0;

  return (
    <div
      className={cn(
        "flex flex-col py-3 sm:py-3.5 border-b border-black/[0.07] dark:border-white/[0.07] last:border-b-0",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <h3 className="font-inter font-semibold text-xs sm:text-sm tracking-wide uppercase text-black/90 dark:text-white/90">
          {title}
        </h3>
        {shouldCollapse && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 font-inter text-xs text-black/60 dark:text-white/60 hover:text-black/85 dark:hover:text-white/85 transition-colors duration-150 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>+{hiddenCount} more</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {(visibleItems.length > 0 || children) && (
        <div className="flex flex-wrap gap-x-1 sm:gap-x-1.5 gap-y-1 sm:gap-y-1.5 items-center">
          {visibleItems.map((item) =>
            renderItem ? (
              renderItem(item)
            ) : (
              <CheckboxItem key={item} id={`${title}-${item}`} label={item} />
            )
          )}
          {children}
        </div>
      )}
    </div>
  );
}