"use client";

import { Suspense, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { isFilterActive, saveBasePage } from "@/lib/tmdb";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

function getPaginationItems(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination(props: PaginationProps) {
  return (
    <Suspense fallback={null}>
      <PaginationContent {...props} />
    </Suspense>
  );
}

function PaginationContent({
  currentPage: propCurrentPage,
  totalPages = 1,
  onPageChange,
  className,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const rawCurrentPage = propCurrentPage ?? (isNaN(urlPage) || urlPage < 1 ? 1 : urlPage);
  const currentPage = Math.min(Math.max(1, rawCurrentPage), totalPages);

  useEffect(() => {
    // Only update the baseline page when neither filters, sort, nor search queries are active
    if (
      !isFilterActive(searchParams) &&
      !searchParams.get("sort_by") &&
      !searchParams.get("q") &&
      !searchParams.get("search")
    ) {
      saveBasePage(pathname, currentPage);
    }
  }, [pathname, searchParams, currentPage]);

  if (totalPages <= 1) {
    return null;
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = getPaginationItems(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn(
        "xl:mt-[48px] lg:mt-[44px] md:mt-[38px] sm:mt-[32px] mt-[28px] xl:mb-[24px] lg:mb-[20px] md:mb-[16px] sm:mb-[12px] mb-[8px] xl:px-0 sm:px-2 px-4 w-full flex items-center justify-center sm:justify-end select-none",
        className
      )}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Previous Button */}
        {isFirstPage ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Go to previous page"
            className="flex items-center justify-center gap-1 h-[32px] sm:h-[34px] lg:h-[36px] px-2.5 sm:px-3 rounded-[4px] bg-light-dropdown/50 dark:bg-dropdown/50 text-dark/35 dark:text-white/30 font-inter text-[12px] sm:text-[13px] lg:text-sm font-medium border border-black/5 dark:border-white/5 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Prev</span>
          </button>
        ) : (
          <Link
            href={createPageURL(currentPage - 1)}
            onClick={() => onPageChange?.(currentPage - 1)}
            aria-label="Go to previous page"
            className="group flex items-center justify-center gap-1 h-[32px] sm:h-[34px] lg:h-[36px] px-2.5 sm:px-3 rounded-[4px] bg-light-dropdown dark:bg-dropdown text-dark/85 dark:text-white/85 hover:bg-light-dropdown-hover dark:hover:bg-dropdown-hover hover:text-dark dark:hover:text-white font-inter text-[12px] sm:text-[13px] lg:text-sm font-medium border border-black/5 dark:border-white/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-nav dark:focus-visible:ring-trails-red"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5 text-dark/75 dark:text-white/75 group-hover:text-dark dark:group-hover:text-white" />
            <span className="hidden xs:inline">Prev</span>
          </Link>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          {pages.map((item, index) => {
            if (item === "...") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="w-[24px] sm:w-[28px] lg:w-[32px] h-[32px] sm:h-[34px] lg:h-[36px] flex items-center justify-center text-dark/45 dark:text-white/45 font-inter text-[13px] sm:text-sm select-none"
                >
                  •••
                </div>
              );
            }

            const isCurrent = item === currentPage;
            const isSecondary =
              !isCurrent &&
              item !== 1 &&
              item !== totalPages &&
              Math.abs(item - currentPage) > 1;

            return (
              <PageButton
                key={item}
                page={item}
                active={isCurrent}
                href={createPageURL(item)}
                onClick={() => onPageChange?.(item)}
                className={cn(isSecondary && "hidden sm:inline-flex")}
              />
            );
          })}
        </div>

        {/* Next Button */}
        {isLastPage ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Go to next page"
            className="flex items-center justify-center gap-1 h-[32px] sm:h-[34px] lg:h-[36px] px-2.5 sm:px-3 rounded-[4px] bg-light-dropdown/50 dark:bg-dropdown/50 text-dark/35 dark:text-white/30 font-inter text-[12px] sm:text-[13px] lg:text-sm font-medium border border-black/5 dark:border-white/5 cursor-not-allowed"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={createPageURL(currentPage + 1)}
            onClick={() => onPageChange?.(currentPage + 1)}
            aria-label="Go to next page"
            className="group flex items-center justify-center gap-1 h-[32px] sm:h-[34px] lg:h-[36px] px-2.5 sm:px-3 rounded-[4px] bg-light-dropdown dark:bg-dropdown text-dark/85 dark:text-white/85 hover:bg-light-dropdown-hover dark:hover:bg-dropdown-hover hover:text-dark dark:hover:text-white font-inter text-[12px] sm:text-[13px] lg:text-sm font-medium border border-black/5 dark:border-white/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-nav dark:focus-visible:ring-trails-red"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 text-dark/75 dark:text-white/75 group-hover:text-dark dark:group-hover:text-white" />
          </Link>
        )}
      </div>
    </nav>
  );
}

function PageButton({
  page,
  active,
  href,
  onClick,
  className,
}: {
  page: number;
  active?: boolean;
  href: string;
  onClick?: () => void;
  className?: string;
}) {
  if (active) {
    return (
      <span
        aria-current="page"
        aria-label={`Page ${page}, current page`}
        className={cn(
          "w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] lg:w-[36px] lg:h-[36px] rounded-[4px] flex items-center justify-center font-inter text-[12px] sm:text-[13px] lg:text-sm font-semibold select-none",
          "bg-light-nav dark:bg-trails-red text-white shadow-sm border border-light-nav/30 dark:border-trails-red/30",
          className
        )}
      >
        {page}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={`Go to page ${page}`}
      className={cn(
        "w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] lg:w-[36px] lg:h-[36px] rounded-[4px] flex items-center justify-center font-inter text-[12px] sm:text-[13px] lg:text-sm font-medium border border-black/5 dark:border-white/5 transition-all duration-150",
        "bg-light-dropdown dark:bg-dropdown text-dark/80 dark:text-white/80 hover:bg-light-dropdown-hover dark:hover:bg-dropdown-hover hover:text-dark dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-nav dark:focus-visible:ring-trails-red",
        className
      )}
    >
      {page}
    </Link>
  );
}