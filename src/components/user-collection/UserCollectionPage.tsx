"use client";

import { useEffect, useMemo, useState } from "react";
import { SortDropdown } from "@/components/SortDropdown";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterButton } from "@/components/filters/FilterButton";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Item } from "@/components/user-collection/Item";
import { List } from "@/components/user-collection/List";
import { ChevronLeft, Lock, Globe, Share2, Pencil, Trash2, X, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { cn, slugify } from "@/lib/utils";
import { useUserCollectionsStore } from "@/stores/useUserCollectionsStore";
import { getTmdbListDetailsAction } from "@/actions/collections";
import type { TableItem } from "@/types/items";
import { useHydrated } from "@/hooks/useHydrated";
import { Button } from "@/components/ui/button";
import { ShareListModal } from "@/components/user-collection/ShareListModal";
import { DeleteListModal } from "@/components/user-collection/DeleteListModal";
import { useList } from "@/contexts/ListContext";
import { getSortOptionConfig, normalizeSortOption, parseFilterParamArray } from "@/lib/tmdb";

type MediaType = "favorite" | "watchlist" | "rating" | "list";

interface UserCollectionPageProps {
  param?: string;
  param2?: string;
  type: MediaType;
  hidePagination?: boolean;
}

const ITEMS_PER_PAGE = 10;
const LISTS_PER_PAGE = 16;

export function UserCollectionPage({
  param,
  param2,
  type,
  hidePagination,
}: UserCollectionPageProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isHydrated = useHydrated();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { openEdit } = useList();

  const favorites = useUserCollectionsStore((state) => state.favorites);
  const watchlist = useUserCollectionsStore((state) => state.watchlist);
  const ratings = useUserCollectionsStore((state) => state.ratings);
  const customLists = useUserCollectionsStore((state) => state.customLists);
  const updateListDetails = useUserCollectionsStore((state) => state.updateListDetails);
  const getListBySlugOrId = useUserCollectionsStore((state) => state.getListBySlugOrId);
  const deleteCustomList = useUserCollectionsStore((state) => state.deleteCustomList);
  const syncCustomListsFromTmdb = useUserCollectionsStore((state) => state.syncCustomListsFromTmdb);

  const hasParam = !!param;
  const hasParam2 = !!param2;
  const isListDetails = type === "list" && hasParam && hasParam2;

  const searchQuery = (searchParams.get("q") || searchParams.get("search") || "").toLowerCase().trim();
  const sortBy = searchParams.get("sort_by") || "";
  const pageParam = Number(searchParams.get("page")) || 1;
  const mediaFilter = searchParams.get("media") || "all";
  const yearFilter = parseFilterParamArray(searchParams.get("year"));
  const ratingFilter = parseFilterParamArray(searchParams.get("rating"));

  const [isLoading, setIsLoading] = useState(false);

  // Sync latest data in background on mount
  useEffect(() => {
    let isCancelled = false;

    const syncAction = async () => {
      try {
        setIsLoading(true);
        if (type === "favorite") {
          await useUserCollectionsStore.getState().syncFavoritesFromTmdb();
        } else if (type === "watchlist") {
          await useUserCollectionsStore.getState().syncWatchlistFromTmdb();
        } else if (type === "rating") {
          await useUserCollectionsStore.getState().syncRatingsFromTmdb();
        } else if (type === "list") {
          if (isListDetails && param2) {
            const rawListId = param2.replace(/^list-/, "");
            const res = await getTmdbListDetailsAction(rawListId);
            if (!isCancelled && res.success && res.list) {
              updateListDetails(res.list);
            }
          } else {
            await syncCustomListsFromTmdb();
          }
        }
      } catch (err) {
        console.warn("Collection background sync warning:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    syncAction();

    return () => {
      isCancelled = true;
    };
  }, [type, isListDetails, param2, syncCustomListsFromTmdb, updateListDetails]);

  useClickOutsideClose({
    enabled: filterOpen,
    selectors: [".filter-container", ".filter-btn", ".year-popover"],
    onClose: () => setFilterOpen(false),
  });

  // Process raw collection items
  const rawItems: TableItem[] = useMemo(() => {
    if (!isHydrated) return [];

    if (type === "favorite") {
      return favorites.map((item) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] || item.releaseDate : "—",
      }));
    }

    if (type === "watchlist") {
      return watchlist.map((item) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] || item.releaseDate : "—",
      }));
    }

    if (type === "rating") {
      return Object.values(ratings).map(({ rating, item }) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        yourRating: rating,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] || item.releaseDate : "—",
      }));
    }

    if (isListDetails && param2) {
      const foundList = getListBySlugOrId(param2) || customLists.find((l) => l.slug === param2 || String(l.id) === param2);
      const itemsToUse = foundList?.items || [];

      return itemsToUse.map((item) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] || item.releaseDate : "—",
      }));
    }

    return [];
  }, [isHydrated, type, favorites, watchlist, ratings, customLists, isListDetails, param2, getListBySlugOrId]);

  // Filter & Sort for Media Items
  const processedItems = useMemo(() => {
    let result = [...rawItems];

    if (mediaFilter && mediaFilter !== "all") {
      if (mediaFilter === "movie" || mediaFilter === "movies") {
        result = result.filter((item) => item.media === "Movie");
      } else if (mediaFilter === "tv" || mediaFilter === "tv_shows") {
        result = result.filter((item) => item.media === "TV Show");
      }
    }

    if (yearFilter.length > 0) {
      result = result.filter((item) => {
        const itemYear = item.released ? item.released.trim() : "";
        return yearFilter.some((y) => itemYear.includes(y) || itemYear === y);
      });
    }

    if (ratingFilter.length > 0) {
      const minThreshold = Math.min(...ratingFilter.map((r) => Number(r)).filter((n) => !isNaN(n)));
      if (!isNaN(minThreshold)) {
        result = result.filter((item) => {
          const score = item.yourRating ?? item.rating ?? 0;
          return score >= minThreshold;
        });
      }
    }

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery)
      );
    }

    if (sortBy) {
      if (sortBy === "your-rating-desc" || sortBy === "your_rating.desc") {
        result.sort((a, b) => (b.yourRating ?? 0) - (a.yourRating ?? 0));
      } else if (sortBy === "your-rating-asc" || sortBy === "your_rating.asc") {
        result.sort((a, b) => (a.yourRating ?? 0) - (b.yourRating ?? 0));
      } else if (sortBy === "rating" || sortBy === "rating-desc" || sortBy === "rating.desc" || sortBy === "vote_average.desc" || sortBy === "top-rated") {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === "rating-asc" || sortBy === "rating.asc" || sortBy === "vote_average.asc") {
        result.sort((a, b) => a.rating - b.rating);
      } else if (sortBy === "latest" || sortBy === "release-desc" || sortBy === "primary_release_date.desc" || sortBy === "release_date.desc" || sortBy === "now-playing") {
        result.sort((a, b) => (b.released || "").localeCompare(a.released || ""));
      } else if (sortBy === "release-asc" || sortBy === "primary_release_date.asc" || sortBy === "release_date.asc") {
        result.sort((a, b) => (a.released || "").localeCompare(b.released || ""));
      } else if (sortBy === "title-asc" || sortBy === "title.asc" || sortBy === "name.asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "title-desc" || sortBy === "title.desc" || sortBy === "name.desc") {
        result.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    return result;
  }, [rawItems, mediaFilter, yearFilter, ratingFilter, searchQuery, sortBy]);

  // Filter & Sort for Custom Lists Overview
  const processedLists = useMemo(() => {
    if (type !== "list" || isListDetails) return [];
    let result = [...customLists];

    if (mediaFilter && mediaFilter !== "all") {
      if (mediaFilter === "public") {
        result = result.filter((l) => !l.isPrivate);
      } else if (mediaFilter === "private") {
        result = result.filter((l) => l.isPrivate);
      }
    }

    if (searchQuery) {
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery) ||
          (l.description && l.description.toLowerCase().includes(searchQuery))
      );
    }

    if (sortBy) {
      if (sortBy === "title-asc" || sortBy === "title.asc") {
        result.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "title-desc" || sortBy === "title.desc") {
        result.sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortBy === "items-desc" || sortBy === "items.desc" || sortBy === "most-items") {
        result.sort((a, b) => (b.items?.length || 0) - (a.items?.length || 0));
      } else if (sortBy === "items-asc" || sortBy === "items.asc" || sortBy === "fewest-items") {
        result.sort((a, b) => (a.items?.length || 0) - (b.items?.length || 0));
      }
    }

    return result;
  }, [type, isListDetails, customLists, mediaFilter, searchQuery, sortBy]);

  // Pagination for Media Items (10 items per page)
  const totalPages = Math.max(1, Math.ceil(processedItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [processedItems, currentPage]);

  // Pagination for Custom Lists Overview (16 lists per page)
  const totalListPages = Math.max(1, Math.ceil(processedLists.length / LISTS_PER_PAGE));
  const currentListPage = Math.min(Math.max(1, pageParam), totalListPages);

  const paginatedLists = useMemo(() => {
    const start = (currentListPage - 1) * LISTS_PER_PAGE;
    return processedLists.slice(start, start + LISTS_PER_PAGE);
  }, [processedLists, currentListPage]);

  const isVisibilityFilter = type === "list" && !isListDetails;
  const isVisibilityActive = isVisibilityFilter && mediaFilter && mediaFilter !== "all";
  const isMediaFilterActive = !isVisibilityFilter && mediaFilter && mediaFilter !== "all";
  const isSortActive = !!sortBy;
  const hasActiveFilters = isVisibilityActive || isMediaFilterActive || yearFilter.length > 0 || ratingFilter.length > 0;
  const hasAnyActive = isSortActive || hasActiveFilters;

  let emptyMessage = "No items found in this collection.";
  if (type === "favorite") {
    emptyMessage = searchQuery
      ? `No favorite items matching "${searchQuery}".`
      : hasActiveFilters
      ? "No favorite items match your selected filters."
      : "You haven't added any favorite movies or TV shows yet.";
  } else if (type === "watchlist") {
    emptyMessage = searchQuery
      ? `No watchlist items matching "${searchQuery}".`
      : hasActiveFilters
      ? "No watchlist items match your selected filters."
      : "Your watchlist is currently empty.";
  } else if (type === "rating") {
    emptyMessage = searchQuery
      ? `No rated items matching "${searchQuery}".`
      : hasActiveFilters
      ? "No rated items match your selected filters."
      : "You haven't rated any movies or TV shows yet.";
  } else if (isListDetails) {
    emptyMessage = searchQuery
      ? `No items matching "${searchQuery}" in this list.`
      : hasActiveFilters
      ? "No items in this list match your selected filters."
      : "No items in this list yet.";
  } else if (type === "list") {
    emptyMessage = searchQuery
      ? `No lists matching "${searchQuery}".`
      : hasActiveFilters
      ? "No lists match your selected filters."
      : "You haven't created any lists yet.";
  }

  const currentList = useMemo(() => {
    if (!isListDetails || !param2) return null;
    return getListBySlugOrId(param2) || customLists.find((l) => l.slug === param2 || String(l.id) === param2) || null;
  }, [isListDetails, param2, customLists, getListBySlugOrId]);

  const listDisplayTitle = currentList?.title || (param2 ? param2.replace(/^list-/, "").replace(/-/g, " ") : "");
  const isListPrivate = currentList?.isPrivate ?? false;

  const pathname = usePathname();

  const handleConfirmDeleteFromDetails = () => {
    if (!currentList) return;
    const listId = currentList.id;
    setDeleteModalOpen(false);
    deleteCustomList(listId);
    router.push(`/${slugify(param)}/list`);
  };

  const filterContext = useMemo(() => {
    if (type === "rating") return "rating";
    if (type === "list" && !isListDetails) return "custom_lists";
    return "collection";
  }, [type, isListDetails]);

  const activeSortLabel = useMemo(() => {
    if (!sortBy) return "";
    const norm = normalizeSortOption(sortBy);
    const config = getSortOptionConfig(norm, filterContext);
    return config?.label || sortBy;
  }, [sortBy, filterContext]);

  const searchPlaceholder = useMemo(() => {
    if (type === "favorite") return "Search in favorites...";
    if (type === "watchlist") return "Search in watchlist...";
    if (type === "rating") return "Search in ratings...";
    if (isListDetails) return `Search in ${listDisplayTitle || "list"}...`;
    return "Search your lists...";
  }, [type, isListDetails, listDisplayTitle]);

  const handleVisibilityChange = (visibility: "all" | "public" | "private") => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (visibility === "all") {
      params.delete("media");
    } else {
      params.set("media", visibility);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("sort_by");
    params.delete("media");
    params.delete("year");
    params.delete("rating");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleRemoveParam = (paramKey: string, specificValue?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (specificValue && (paramKey === "year" || paramKey === "rating")) {
      const currentValues = parseFilterParamArray(params.get(paramKey));
      const filtered = currentValues.filter((v) => v !== specificValue);
      if (filtered.length > 0) {
        params.set(paramKey, filtered.join(","));
      } else {
        params.delete(paramKey);
      }
    } else {
      params.delete(paramKey);
      if (paramKey === "q") params.delete("search");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <section className="container-1440 mt-[72px]">
      {/* Share List Modal */}
      {isListDetails && (
        <ShareListModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          list={
            currentList || {
              id: param2,
              title: listDisplayTitle,
              slug: param2,
            }
          }
        />
      )}

      {/* Delete List Modal */}
      {isListDetails && currentList && (
        <DeleteListModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDeleteFromDetails}
          listTitle={currentList.title}
        />
      )}

      <div className="flex justify-between lg:items-center items-start xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2">
        {isListDetails ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap max-w-full">
            <div
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push(`/${slugify(param)}/list`);
                }
              }}
              className="group flex items-center gap-[4px] cursor-pointer select-none transition-colors duration-75"
            >
              <ChevronLeft className="w-[28px] h-[28px] text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90 shrink-0" />
              <h1 className="font-akshar text-[24px] sm:text-[28px] font-medium text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90 capitalize">
                List - {listDisplayTitle}
              </h1>
              {isHydrated && (
                <span className="font-inter text-xs sm:text-sm text-black/60 dark:text-white/60 font-normal whitespace-nowrap">
                  ({processedItems.length} {processedItems.length === 1 ? "item" : "items"})
                </span>
              )}
            </div>

            {/* List Privacy Tag & Actions */}
            <div className="flex items-center gap-2 pl-7 sm:pl-0 flex-wrap">
              {isListPrivate ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-inter font-medium select-none shadow-2xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-inter font-medium select-none shadow-2xs">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public</span>
                </span>
              )}

              {/* Edit List Option */}
              {currentList && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEdit(currentList)}
                  className="h-[28px] sm:h-[30px] px-2.5 sm:px-3 rounded-full border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black/85 dark:text-white/85 font-inter font-medium text-[11px] sm:text-xs flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer select-none"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              )}

              {/* Share List Option if Public */}
              {!isListPrivate && (
                <Button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="h-[28px] sm:h-[30px] px-3 sm:px-3.5 rounded-full bg-light-create-new-btn hover:bg-light-create-new-btn/90 dark:bg-create-new-btn dark:hover:bg-create-new-btn/90 text-white font-inter font-medium text-[11px] sm:text-xs flex items-center gap-1.5 border-none shadow-xs transition-all duration-150 active:scale-95 cursor-pointer select-none"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </Button>
              )}

              {/* Delete List Option */}
              {currentList && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeleteModalOpen(true)}
                  className="h-[28px] sm:h-[30px] px-2.5 rounded-full text-black/60 hover:text-trails-red dark:text-white/60 dark:hover:text-trails-red hover:bg-red-500/10 font-inter font-medium text-[11px] sm:text-xs flex items-center gap-1 transition-all duration-150 cursor-pointer select-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] font-medium text-black dark:text-white capitalize">
              {type === "favorite"
                ? "favorite item"
                : type === "watchlist"
                ? "watchlist item"
                : type === "rating"
                ? "my rating"
                : type === "list"
                ? "my lists"
                : ""}
            </h1>
            {isHydrated && (
              <span className="font-inter text-xs sm:text-sm md:text-base text-black/60 dark:text-white/60 font-normal whitespace-nowrap">
                (
                {type === "list" && !isListDetails
                  ? `${processedLists.length} ${processedLists.length === 1 ? "list" : "lists"}`
                  : `${processedItems.length} ${processedItems.length === 1 ? "item" : "items"}`}
                )
              </span>
            )}
          </div>
        )}

        <div className="flex lg:items-center items-end lg:justify-normal justify-center lg:flex-row flex-col">
          <div className="xl:mr-[30px] lg:mr-[25px] lg:mt-0 md:mt-6 mt-4 lg:order-1 order-2">
            <SearchBar syncWithUrl={true} placeholder={searchPlaceholder} />
          </div>

          <div className="flex items-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px] lg:order-2 order-1">
            <SortDropdown context={filterContext} />

            {type === "list" && !isListDetails ? (
              <div className="flex items-center p-[2px] sm:p-[2.5px] bg-light-dropdown dark:bg-dropdown xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] select-none">
                <div className="flex items-center gap-0.5 p-0.5 bg-white/70 dark:bg-dark xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px] text-[11px] sm:text-[12px] font-inter shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)] dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)]">
                  <button
                    type="button"
                    onClick={() => handleVisibilityChange("all")}
                    className={cn(
                      "px-2 sm:px-2.5 py-1 rounded-[3px] transition-all duration-150 cursor-pointer",
                      mediaFilter === "all" || !mediaFilter
                        ? "bg-light-dropdown dark:bg-dropdown text-light-nav dark:text-white font-semibold shadow-xs"
                        : "text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white font-medium"
                    )}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVisibilityChange("public")}
                    className={cn(
                      "px-2 sm:px-2.5 py-1 rounded-[3px] transition-all duration-150 cursor-pointer",
                      mediaFilter === "public"
                        ? "bg-light-dropdown dark:bg-dropdown text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                        : "text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white font-medium"
                    )}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVisibilityChange("private")}
                    className={cn(
                      "px-2 sm:px-2.5 py-1 rounded-[3px] transition-all duration-150 cursor-pointer",
                      mediaFilter === "private"
                        ? "bg-light-dropdown dark:bg-dropdown text-amber-600 dark:text-amber-400 font-semibold shadow-xs"
                        : "text-black/65 dark:text-white/65 hover:text-black dark:hover:text-white font-medium"
                    )}
                  >
                    Private
                  </button>
                </div>
              </div>
            ) : (
              <FilterButton onClick={() => setFilterOpen((prev) => !prev)} />
            )}
          </div>
        </div>
      </div>

      {!(type === "list" && !isListDetails) && (
        <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} context={filterContext} />
      )}

      {/* Active Filters & Sort Summary Bar */}
      {hasAnyActive && (
        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-5 px-2 xl:px-0">
          <span className="text-xs font-inter text-black/50 dark:text-white/50 font-medium select-none">
            Active:
          </span>

          {isVisibilityActive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 capitalize select-none">
              <span>Visibility: {mediaFilter}</span>
              <button
                type="button"
                onClick={() => handleRemoveParam("media")}
                className="hover:text-trails-red transition-colors cursor-pointer"
                aria-label="Remove visibility filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isMediaFilterActive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 capitalize select-none">
              <span>Media: {mediaFilter === "tv_shows" || mediaFilter === "tv" ? "TV Shows" : "Movies"}</span>
              <button
                type="button"
                onClick={() => handleRemoveParam("media")}
                className="hover:text-trails-red transition-colors cursor-pointer"
                aria-label="Remove media filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {yearFilter.map((year) => (
            <span
              key={year}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 select-none"
            >
              <span>Year: {year}</span>
              <button
                type="button"
                onClick={() => handleRemoveParam("year", year)}
                className="hover:text-trails-red transition-colors cursor-pointer"
                aria-label={`Remove year ${year} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {ratingFilter.map((rating) => (
            <span
              key={rating}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/85 dark:text-white/85 select-none"
            >
              <span>Rating: {rating}+ ⭐</span>
              <button
                type="button"
                onClick={() => handleRemoveParam("rating", rating)}
                className="hover:text-trails-red transition-colors cursor-pointer"
                aria-label={`Remove rating ${rating} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isSortActive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-inter bg-light-nav/10 dark:bg-trails-red/15 border border-light-nav/20 dark:border-trails-red/20 text-light-nav dark:text-trails-red font-medium select-none">
              <span>Sort: {activeSortLabel}</span>
              <button
                type="button"
                onClick={() => handleRemoveParam("sort_by")}
                className="hover:opacity-75 transition-opacity cursor-pointer"
                aria-label="Remove sort"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-xs font-inter font-medium text-black/60 hover:text-trails-red dark:text-white/60 dark:hover:text-trails-red px-2 py-0.5 rounded transition-colors cursor-pointer select-none"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {isListDetails && (
        <Breadcrumb type={type} subRoute2={listDisplayTitle} />
      )}

      {type === "list" && !isListDetails ? (
        <List basePath={`/${param}/list`} lists={paginatedLists} emptyMessage={emptyMessage} onClear={hasAnyActive ? handleClearAll : undefined} />
      ) : (
        <Item
          data={paginatedItems}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          onClear={hasAnyActive ? handleClearAll : undefined}
          currentListId={isListDetails ? (currentList?.id || param2) : undefined}
          pageType={type}
          headers={
            type === "rating"
              ? ["Poster", "Name", "Your Rating", "Media", "Released", ""]
              : ["Poster", "Name", "Rating", "Media", "Released", ""]
          }
        />
      )}

      {!hidePagination && (
        type === "list" && !isListDetails ? (
          processedLists.length > LISTS_PER_PAGE && totalListPages > 1 && (
            <Pagination currentPage={currentListPage} totalPages={totalListPages} />
          )
        ) : (
          processedItems.length > ITEMS_PER_PAGE && totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )
        )
      )}
    </section>
  );
}