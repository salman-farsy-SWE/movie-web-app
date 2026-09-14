"use client";

import { useEffect, useMemo, useState } from "react";
import { CollectionSortDropdown } from "@/components/user-collection/sort/CollectionSortDropdown";
import { CollectionFilterPanel } from "@/components/user-collection/filters/CollectionFilterPanel";
import { CollectionVisibilityTabs } from "@/components/user-collection/filters/CollectionVisibilityTabs";
import { CollectionActiveFilters } from "@/components/user-collection/filters/CollectionActiveFilters";
import { CollectionSearchBar } from "@/components/user-collection/search/CollectionSearchBar";
import { CollectionPagination } from "@/components/user-collection/pagination/CollectionPagination";
import { FilterButton } from "@/components/shared/filters/FilterButton";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Item } from "@/components/user-collection/Item";
import { List } from "@/components/user-collection/List";
import { ChevronLeft, Lock, Globe, Share2, Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { slugify } from "@/lib/utils";
import { useUserCollectionsStore } from "@/stores/useUserCollectionsStore";
import { getTmdbListDetailsAction } from "@/actions/collections";
import type { TableItem, CustomList, CollectionType, FilterContextType, UserList } from "@/types";
import { useHydrated } from "@/hooks/useHydrated";
import { Button } from "@/components/ui/button";
import { ShareListModal } from "@/components/user-collection/ShareListModal";
import { DeleteListModal } from "@/components/user-collection/DeleteListModal";
import { useUIStore } from "@/stores/useUIStore";
import { useAuth } from "@/contexts/AuthContext";
import { parseFilterParamArray } from "@/lib/tmdb";
import {
  sortCollectionItems,
  filterCollectionItems,
  sortCustomLists,
  filterCustomLists,
} from "@/lib/collections";
import { useSortFilterTransition } from "@/contexts/SortFilterTransitionContext";
import { useSmartBack } from "@/hooks/useSmartBack";

interface UserCollectionPageProps {
  param?: string;
  param2?: string;
  type: CollectionType;
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
  const [fetchedList, setFetchedList] = useState<UserList | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isHydrated = useHydrated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isPending } = useSortFilterTransition();
  const { goBack } = useSmartBack();

  const isListDetails = type === "list" && Boolean(param2);

  const isUserMismatch = useMemo(() => {
    if (isListDetails) return false;
    if (!isAuthenticated || !user || !param) return false;
    const rawParam = decodeURIComponent(param).trim().toLowerCase();
    const slugParam = slugify(param).toLowerCase();
    const valid = new Set<string>();
    if (user.id !== undefined && user.id !== null) {
      valid.add(String(user.id).toLowerCase());
      valid.add(slugify(user.id).toLowerCase());
    }
    if (user.username) {
      valid.add(user.username.trim().toLowerCase());
      valid.add(slugify(user.username).toLowerCase());
    }
    if (user.name) {
      valid.add(user.name.trim().toLowerCase());
      valid.add(slugify(user.name).toLowerCase());
    }
    return !valid.has(rawParam) && !valid.has(slugParam);
  }, [isListDetails, isAuthenticated, user, param]);

  const openEdit = useUIStore((state) => state.openEditList);

  const favorites = useUserCollectionsStore((state) => state.favorites);
  const watchlist = useUserCollectionsStore((state) => state.watchlist);
  const ratings = useUserCollectionsStore((state) => state.ratings);
  const customLists = useUserCollectionsStore((state) => state.customLists);
  const updateListDetails = useUserCollectionsStore((state) => state.updateListDetails);
  const getListBySlugOrId = useUserCollectionsStore((state) => state.getListBySlugOrId);
  const deleteCustomList = useUserCollectionsStore((state) => state.deleteCustomList);
  const syncCustomListsFromTmdb = useUserCollectionsStore((state) => state.syncCustomListsFromTmdb);

  const searchQuery = (searchParams.get("q") || searchParams.get("search") || "").toLowerCase().trim();
  const sortBy = searchParams.get("sort_by") || "";
  const pageParam = Number(searchParams.get("page")) || 1;
  const mediaFilter = searchParams.get("media") || "all";
  const yearFilter = parseFilterParamArray(searchParams.get("year"));
  const ratingFilter = parseFilterParamArray(searchParams.get("rating"));

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const syncAction = async () => {
      // 1. If viewing list details (public or private custom list)
      if (isListDetails && param2) {
        const rawListId = param2.replace(/^list-/, "");
        const storeState = useUserCollectionsStore.getState();
        const existing =
          storeState.getListBySlugOrId(param2) ||
          storeState.customLists.find(
            (l) => l.slug === param2 || String(l.id) === param2 || String(l.id) === rawListId
          );

        if (!existing && !fetchedList) {
          setIsLoading(true);
        }

        try {
          const res = await getTmdbListDetailsAction(rawListId);
          if (!isCancelled) {
            if (res.success && res.list) {
              setFetchedList(res.list);
              if (isAuthenticated) {
                updateListDetails(res.list);
              }
            } else {
              setFetchError(res.error || "List not found");
            }
          }
        } catch {
          if (!isCancelled) {
            setFetchError("Failed to fetch list details");
          }
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
        return;
      }

      // 2. Personal collections dashboard / lists overview (requires authentication)
      if (!isAuthenticated || isUserMismatch) return;

      const storeState = useUserCollectionsStore.getState();
      const isStale =
        type === "favorite"
          ? storeState.isStale("favorites")
          : type === "watchlist"
          ? storeState.isStale("watchlist")
          : type === "rating"
          ? storeState.isStale("ratings")
          : storeState.isStale("customLists");

      const hasLocalData =
        type === "favorite"
          ? storeState.favorites.length > 0
          : type === "watchlist"
          ? storeState.watchlist.length > 0
          : type === "rating"
          ? Object.keys(storeState.ratings).length > 0
          : storeState.customLists.length > 0;

      if (isStale && !hasLocalData) {
        setIsLoading(true);
      }

      try {
        if (type === "favorite") {
          await useUserCollectionsStore.getState().syncFavoritesFromTmdb();
        } else if (type === "watchlist") {
          await useUserCollectionsStore.getState().syncWatchlistFromTmdb();
        } else if (type === "rating") {
          await useUserCollectionsStore.getState().syncRatingsFromTmdb();
        } else if (type === "list") {
          await syncCustomListsFromTmdb();
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
  }, [
    type,
    isListDetails,
    param2,
    isAuthenticated,
    isUserMismatch,
    syncCustomListsFromTmdb,
    updateListDetails,
    fetchedList,
  ]);

  useClickOutsideClose({
    enabled: filterOpen,
    selectors: [".filter-container", ".filter-btn", ".year-popover"],
    onClose: () => setFilterOpen(false),
  });

  const currentList = useMemo(() => {
    if (!isListDetails || !param2) return null;
    const rawId = param2.replace(/^list-/, "");
    return (
      getListBySlugOrId(param2) ||
      customLists.find((l) => l.slug === param2 || String(l.id) === param2 || String(l.id) === rawId) ||
      fetchedList ||
      null
    );
  }, [isListDetails, param2, customLists, getListBySlugOrId, fetchedList]);

  const isOwner = useMemo(() => {
    if (!isAuthenticated || !user || !currentList) return false;
    const inUserLists = customLists.some(
      (l) => String(l.id) === String(currentList.id) || l.slug === currentList.slug
    );
    if (inUserLists) return true;

    const curatorHandle = currentList.curator?.handle?.replace(/^@/, "").toLowerCase();
    const curatorName = currentList.curator?.name?.toLowerCase();
    const username = user.username?.toLowerCase();
    const userName = user.name?.toLowerCase();
    const userId = String(user.id).toLowerCase();

    if (curatorHandle && (curatorHandle === username || curatorHandle === userId)) return true;
    if (curatorName && (curatorName === userName || curatorName === username)) return true;

    return false;
  }, [isAuthenticated, user, currentList, customLists]);

  const rawItems: TableItem[] = useMemo(() => {
    if (!isHydrated) return [];

    if (type === "favorite") {
      return favorites.map((item) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] : "—",
      }));
    }

    if (type === "watchlist") {
      return watchlist.map((item) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] : "—",
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
        released: item.releaseDate ? item.releaseDate.split("-")[0] : "—",
      }));
    }

    if (isListDetails && param2) {
      const rawId = param2.replace(/^list-/, "");
      const foundList =
        getListBySlugOrId(param2) ||
        customLists.find((l) => l.slug === param2 || String(l.id) === param2 || String(l.id) === rawId) ||
        fetchedList;
      const itemsToUse = foundList?.items || [];

      return itemsToUse.map((item) => ({
        id: String(item.id),
        image: item.posterImage || "/assets/movie-placeholder.jpg",
        name: item.title,
        rating: typeof item.rating === "number" ? item.rating : 0,
        media: (item.mediaType === "tv" || item.isMovie === false) ? "TV Show" : "Movie",
        released: item.releaseDate ? item.releaseDate.split("-")[0] : "—",
      }));
    }

    return [];
  }, [isHydrated, type, favorites, watchlist, ratings, customLists, isListDetails, param2, getListBySlugOrId, fetchedList]);

  const isVisibilityActive = type === "list" && !isListDetails && mediaFilter && mediaFilter !== "all";
  const isMediaFilterActive = (type !== "list" || isListDetails) && mediaFilter && mediaFilter !== "all";
  const hasActiveFilters =
    isVisibilityActive ||
    isMediaFilterActive ||
    yearFilter.length > 0 ||
    ratingFilter.length > 0;

  const effectiveSortBy = hasActiveFilters ? "" : sortBy;

  const processedItems = useMemo(() => {
    if (hasActiveFilters) {
      return filterCollectionItems(rawItems, {
        mediaFilter,
        yearFilter,
        ratingFilter,
        searchQuery,
      });
    }
    const searched = searchQuery
      ? filterCollectionItems(rawItems, { searchQuery })
      : rawItems;
    return effectiveSortBy ? sortCollectionItems(searched, effectiveSortBy) : searched;
  }, [rawItems, hasActiveFilters, mediaFilter, yearFilter, ratingFilter, searchQuery, effectiveSortBy]);

  const processedLists = useMemo(() => {
    if (type !== "list" || isListDetails) return [];
    if (isVisibilityActive) {
      return filterCustomLists(customLists as CustomList[], {
        visibilityFilter: mediaFilter,
        searchQuery,
      });
    }
    const searched = searchQuery
      ? filterCustomLists(customLists as CustomList[], { searchQuery })
      : (customLists as CustomList[]);
    return effectiveSortBy ? sortCustomLists(searched, effectiveSortBy) : searched;
  }, [type, isListDetails, customLists, isVisibilityActive, mediaFilter, searchQuery, effectiveSortBy]);

  const totalPages = Math.max(1, Math.ceil(processedItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [processedItems, currentPage]);

  const totalListPages = Math.max(1, Math.ceil(processedLists.length / LISTS_PER_PAGE));
  const currentListPage = Math.min(Math.max(1, pageParam), totalListPages);

  const paginatedLists = useMemo(() => {
    const start = (currentListPage - 1) * LISTS_PER_PAGE;
    return processedLists.slice(start, start + LISTS_PER_PAGE);
  }, [processedLists, currentListPage]);

  let emptyMessage = "No items found in this collection.";
  if (type === "favorite") {
    emptyMessage = searchQuery
      ? `No favorite items matching "${searchQuery}".`
      : "You haven't added any favorite movies or TV shows yet.";
  } else if (type === "watchlist") {
    emptyMessage = searchQuery
      ? `No watchlist items matching "${searchQuery}".`
      : "Your watchlist is currently empty.";
  } else if (type === "rating") {
    emptyMessage = searchQuery
      ? `No rated items matching "${searchQuery}".`
      : "You haven't rated any movies or TV shows yet.";
  } else if (isListDetails) {
    emptyMessage = searchQuery
      ? `No items matching "${searchQuery}" in this list.`
      : "No items in this list yet.";
  } else if (type === "list") {
    emptyMessage = searchQuery
      ? `No lists matching "${searchQuery}".`
      : "You haven't created any lists yet.";
  }

  const listDisplayTitle = currentList?.title || (param2 ? param2.replace(/^list-/, "").replace(/-/g, " ") : "");
  const isListPrivate = currentList?.isPrivate ?? false;

  const handleConfirmDeleteFromDetails = () => {
    if (!currentList) return;
    const listId = currentList.id;
    setDeleteModalOpen(false);
    deleteCustomList(listId);
    if (isAuthenticated && user) {
      router.push(`/${slugify(user.id)}/list`);
    } else {
      router.push("/movies");
    }
  };

  const filterContext: FilterContextType = useMemo(() => {
    if (type === "rating") return "rating";
    if (type === "list" && !isListDetails) return "custom_lists";
    return "collection";
  }, [type, isListDetails]);

  const searchPlaceholder = useMemo(() => {
    if (type === "favorite") return "Search in favorites...";
    if (type === "watchlist") return "Search in watchlist...";
    if (type === "rating") return "Search in ratings...";
    if (isListDetails) return `Search in ${listDisplayTitle || "list"}...`;
    return "Search your lists...";
  }, [type, isListDetails, listDisplayTitle]);

  if (!isListDetails && isHydrated && !isAuthLoading && (!isAuthenticated || isUserMismatch)) {
    return null;
  }

  // Private list barrier for unauthenticated / non-owner visitors
  if (isListDetails && isHydrated && !isLoading && currentList && currentList.isPrivate && !isOwner) {
    return (
      <section className="container-1440 mt-[72px]">
        <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4">
          <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4">
            <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="font-akshar text-2xl sm:text-3xl font-semibold text-black dark:text-white">
            This List is Private
          </h1>
          <p className="mt-2 text-sm sm:text-base text-light-genre-font dark:text-genre-font max-w-md font-inter">
            The creator of this list has set its visibility to private. Only the list owner can view its contents.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button
              onClick={() => goBack(isAuthenticated && user ? `/${slugify(user.id)}/list` : "/movies")}
              variant="outline"
              className="h-10 px-5 rounded-full font-inter text-xs font-medium cursor-pointer"
            >
              Go Back
            </Button>
            {!isAuthenticated && (
              <Button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "")}`)}
                className="h-10 px-5 rounded-full bg-light-create-new-btn dark:bg-create-new-btn text-white font-inter text-xs font-medium cursor-pointer"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // List Not Found State
  if (isListDetails && isHydrated && !isLoading && fetchError && !currentList) {
    return (
      <section className="container-1440 mt-[72px]">
        <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4">
          <h1 className="font-akshar text-2xl sm:text-3xl font-semibold text-black dark:text-white">
            List Not Found
          </h1>
          <p className="mt-2 text-sm sm:text-base text-light-genre-font dark:text-genre-font max-w-md font-inter">
            We couldn't find the requested list. It may have been deleted or the link might be incorrect.
          </p>
          <Button
            onClick={() => goBack(isAuthenticated && user ? `/${slugify(user.id)}/list` : "/movies")}
            className="mt-6 h-10 px-5 rounded-full bg-light-create-new-btn dark:bg-create-new-btn text-white font-inter text-xs font-medium cursor-pointer"
          >
            Explore Movies
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-1440 mt-[72px]">
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
          customUrl={
            typeof window !== "undefined" && param2
              ? `${window.location.origin}/list/${currentList?.id || param2}`
              : undefined
          }
        />
      )}

      {isListDetails && currentList && isOwner && (
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
            <button
              type="button"
              aria-label="Go back"
              onClick={() => {
                if (isAuthenticated && user) {
                  goBack(param ? `/${slugify(param)}/list` : `/${slugify(user.id)}/list`);
                } else {
                  goBack("/movies");
                }
              }}
              className="group flex items-center gap-[4px] cursor-pointer select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trails-red rounded-md text-left"
            >
              <ChevronLeft className="w-[28px] h-[28px] text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90 transition-transform duration-200 group-hover:-translate-x-1 shrink-0" />
              <h1 className="font-akshar text-[24px] sm:text-[28px] font-medium text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90 capitalize">
                List - {listDisplayTitle}
              </h1>
            </button>

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

              {isOwner && currentList && (
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

              {(!isListPrivate || isOwner) && (
                <Button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="h-[28px] sm:h-[30px] px-3 sm:px-3.5 rounded-full bg-light-create-new-btn hover:bg-light-create-new-btn/90 dark:bg-create-new-btn dark:hover:bg-create-new-btn/90 text-white font-inter font-medium text-[11px] sm:text-xs flex items-center gap-1.5 border-none shadow-xs transition-all duration-150 active:scale-95 cursor-pointer select-none"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </Button>
              )}

              {isOwner && currentList && (
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
          </div>
        )}

        <div className="flex lg:items-center items-end lg:justify-normal justify-center lg:flex-row flex-col">
          <div className="xl:mr-[30px] lg:mr-[25px] lg:mt-0 md:mt-6 mt-4 lg:order-1 order-2">
            <CollectionSearchBar placeholder={searchPlaceholder} />
          </div>

          <div className="flex items-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px] lg:order-2 order-1">
            <CollectionSortDropdown context={filterContext} />

            {type === "list" && !isListDetails ? (
              <CollectionVisibilityTabs />
            ) : (
              <FilterButton
                onClick={() => setFilterOpen((prev) => !prev)}
                isActive={hasActiveFilters}
              />
            )}
          </div>
        </div>
      </div>

      {!(type === "list" && !isListDetails) && (
        <CollectionFilterPanel
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          context={filterContext}
        />
      )}

      <CollectionActiveFilters isListView={type === "list" && !isListDetails} />

      {isListDetails && (
        <Breadcrumb type={type} subRoute2={listDisplayTitle} />
      )}

      {type === "list" && !isListDetails ? (
        <List
          basePath={param ? `/${param}/list` : "/list"}
          lists={paginatedLists}
          isLoading={isLoading || !isHydrated || isPending}
          emptyMessage={emptyMessage}
        />
      ) : (
        <Item
          data={paginatedItems}
          totalCount={processedItems.length}
          isLoading={isLoading || !isHydrated || isPending}
          emptyMessage={emptyMessage}
          currentListId={isListDetails ? (currentList?.id || param2) : undefined}
          isOwner={isOwner}
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
            <CollectionPagination currentPage={currentListPage} totalPages={totalListPages} />
          )
        ) : (
          processedItems.length > ITEMS_PER_PAGE && totalPages > 1 && (
            <CollectionPagination currentPage={currentPage} totalPages={totalPages} />
          )
        )
      )}
    </section>
  );
}