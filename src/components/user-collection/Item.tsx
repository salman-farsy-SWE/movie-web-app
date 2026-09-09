"use client";

import { TableItem } from "@/types/items";
import { TableRow } from "@/components/user-collection/TableRow";

interface FavoriteItemsProps {
  headers?: string[];
  data?: TableItem[];
  emptyMessage?: string;
  isLoading?: boolean;
  currentListId?: string | number;
  pageType?: "favorite" | "watchlist" | "rating" | "list";
  onClear?: () => void;
}

export function Item({
  headers = ["Poster", "Name", "Rating", "Media", "Released", ""],
  data = [],
  emptyMessage = "No items found in this collection.",
  isLoading = false,
  currentListId,
  pageType,
  onClear,
}: FavoriteItemsProps) {
  const items = data;

  const isRatingView = headers.some(
    (h) => h.toLowerCase() === "your rating"
  );

  return (
    <div className="w-full mt-6 sm:mt-8 md:mt-10">
      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-[76px_minmax(220px,1.6fr)_120px_130px_110px_48px] lg:grid-cols-[84px_minmax(260px,1.6fr)_140px_150px_120px_52px] items-center gap-4 lg:gap-6 px-5 sm:px-6 py-3.5 mb-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 font-inter font-medium text-xs lg:text-[13px] text-light-table-heading-font dark:text-table-heading-font uppercase tracking-wider select-none">
        <div className="text-center">{headers[0] || "Poster"}</div>
        <div className="text-left pl-1">{headers[1] || "Title"}</div>
        <div className="text-center">
          {headers[2] || (isRatingView ? "Your Rating" : "Rating")}
        </div>
        <div className="text-center">
          {headers[3] || "Media"}
        </div>
        <div className="text-center">{headers[4] || "Released"}</div>
        <div />
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-light-genre-font dark:text-genre-font font-inter text-sm md:text-base">
          <div className="w-6 h-6 border-2 border-trails-red border-t-transparent rounded-full animate-spin" />
          <span>Loading items ...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-light-genre-font dark:text-genre-font font-inter text-sm md:text-base">
          <p>{emptyMessage}</p>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="mt-1 h-8 px-4 rounded-full text-xs font-inter font-medium text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-2">
          {items.map((item, i) => (
            <TableRow
              key={item.id || `${item.name}-${i}`}
              item={item}
              isFirst={i === 0}
              isLast={i === items.length - 1}
              isRatingView={isRatingView}
              currentListId={currentListId}
              pageType={pageType}
            />
          ))}
        </div>
      )}
    </div>
  );
}