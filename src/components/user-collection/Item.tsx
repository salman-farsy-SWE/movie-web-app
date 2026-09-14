"use client";

import { TableItem } from "@/types/items";
import { TableRow } from "@/components/user-collection/TableRow";

import { TableRowSkeleton } from "@/components/skeletons/TableSkeleton";

interface FavoriteItemsProps {
  headers?: string[];
  data?: TableItem[];
  emptyMessage?: string;
  isLoading?: boolean;
  currentListId?: string | number;
  isOwner?: boolean;
  pageType?: "favorite" | "watchlist" | "rating" | "list";
  totalCount?: number;
  onClear?: () => void;
}

export function Item({
  headers = ["Poster", "Name", "Rating", "Media", "Released", ""],
  data = [],
  emptyMessage = "No items found in this collection.",
  isLoading = false,
  currentListId,
  isOwner,
  pageType,
  totalCount,
  onClear,
}: FavoriteItemsProps) {
  const items = data;
  const count = totalCount !== undefined ? totalCount : items.length;

  const isRatingView = headers.some(
    (h) => h.toLowerCase() === "your rating"
  );

  return (
    <div className="w-full mt-6 sm:mt-8 md:mt-10">
      {/* Items Count Bar */}
      {!isLoading && (
        <div className="flex items-center justify-between mb-3.5 sm:mb-4 px-1 font-inter">
          <div className="flex items-center gap-2">
            <span className="lg:text-sm text-[13px] font-medium text-light-genre-font dark:text-genre-font">
              Total Items:
            </span>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full lg:text-sm md:text-[13px] text-xs font-semibold bg-black/5 dark:bg-white/10 text-black/85 dark:text-white/90 border border-black/10 dark:border-white/10">
              {count} {count === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>
      )}
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
        <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={`loading-row-${i}`} isRatingView={isRatingView} />
          ))}
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
              isOwner={isOwner}
              pageType={pageType}
            />
          ))}
        </div>
      )}
    </div>
  );
}