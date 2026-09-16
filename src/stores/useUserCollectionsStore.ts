import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserList } from "@/types";
import { slugify } from "@/lib/utils";
import { operationQueue } from "@/lib/queue/operationQueue";
import { toast } from "@/lib/toast";
import {
  toggleTmdbFavoriteAction,
  syncTmdbFavoritesAction,
  toggleTmdbWatchlistAction,
  syncTmdbWatchlistAction,
  setTmdbRatingAction,
  removeTmdbRatingAction,
  syncTmdbRatingsAction,
  syncTmdbListsAction,
  createTmdbListAction,
  updateTmdbListAction,
  deleteTmdbListAction,
  clearTmdbListAction,
  toggleTmdbListItemAction,
  syncTmdbCollectionIdsAction,
} from "@/actions/collections";

export interface CollectionMediaItem {
  id: string | number;
  title: string;
  posterImage?: string | null;
  backdropImage?: string | null;
  rating?: number;
  userRating?: number;
  releaseDate?: string;
  isMovie?: boolean;
  mediaType?: "movie" | "tv";
  genre?: string;
}

export const COLLECTION_SYNC_TTL = 3 * 60 * 1000; // 3 minutes

export function matchesMedia(
  item: CollectionMediaItem,
  id: string | number,
  title?: string
): boolean {
  if (!item) return false;
  const itemIdStr = String(item.id);
  const targetIdStr = String(id);

  if (itemIdStr === targetIdStr) return true;

  const itemNum = Number(item.id);
  const targetNum = Number(id);
  if (!isNaN(itemNum) && !isNaN(targetNum) && itemNum > 0 && itemNum === targetNum) {
    return true;
  }

  const cleanItemTitle = item.title ? item.title.trim().toLowerCase() : "";
  if (title) {
    const cleanTitle = title.trim().toLowerCase();
    if (cleanItemTitle && cleanTitle) {
      if (cleanItemTitle === cleanTitle || slugify(cleanItemTitle) === slugify(cleanTitle)) {
        return true;
      }
    }
  } else if (isNaN(targetNum) && typeof id === "string") {
    const cleanTarget = id.trim().toLowerCase();
    if (cleanItemTitle && cleanTarget) {
      if (cleanItemTitle === cleanTarget || slugify(cleanItemTitle) === slugify(cleanTarget)) {
        return true;
      }
    }
  }

  return false;
}

export interface UserCollectionsState {
  favorites: CollectionMediaItem[];
  watchlist: CollectionMediaItem[];
  ratings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }>;
  customLists: UserList[];
  deletedListIds: string[];
  lastSyncedAt: Record<string, number>;

  // Freshness check
  isStale: (key: "favorites" | "watchlist" | "ratings" | "customLists" | "collectionIds" | string, ttlMs?: number) => boolean;

  // Favorites
  isFavorite: (id: string | number, title?: string) => boolean;
  toggleFavorite: (item: CollectionMediaItem) => Promise<boolean>;
  setFavoriteStatus: (item: CollectionMediaItem, favorite: boolean) => void;
  removeFavorite: (id: string | number, title?: string) => void;
  syncFavoritesFromTmdb: (force?: boolean) => Promise<void>;

  // Watchlist
  isInWatchlist: (id: string | number, title?: string) => boolean;
  toggleWatchlist: (item: CollectionMediaItem) => Promise<boolean>;
  setWatchlistStatus: (item: CollectionMediaItem, inWatchlist: boolean) => void;
  removeWatchlist: (id: string | number, title?: string) => void;
  syncWatchlistFromTmdb: (force?: boolean) => Promise<void>;

  // Ratings
  getUserRating: (id: string | number, title?: string) => number | undefined;
  setUserRating: (item: CollectionMediaItem, rating: number) => Promise<void>;
  setUserRatingStatus: (item: CollectionMediaItem, rating: number) => void;
  removeUserRatingStatus: (id: string | number, title?: string) => void;
  removeUserRating: (id: string | number, mediaType?: "movie" | "tv", title?: string) => Promise<void>;
  syncRatingsFromTmdb: (force?: boolean) => Promise<void>;

  // Custom Lists
  createCustomList: (params: { title: string; description?: string; language?: string; isPrivate?: boolean }) => Promise<UserList>;
  updateCustomList: (params: { id: string | number; title: string; description?: string; language?: string; isPrivate?: boolean }) => Promise<UserList>;
  deleteCustomList: (listId: string | number) => Promise<boolean>;
  toggleListItem: (listId: string | number, item: CollectionMediaItem) => Promise<void>;
  addItemToList: (listId: string | number, item: CollectionMediaItem) => Promise<void>;
  removeItemFromList: (listId: string | number, itemId: string | number, itemTitle?: string) => Promise<void>;
  clearCustomList: (listId: string | number) => Promise<void>;
  isItemInList: (listId: string | number, itemId: string | number, itemTitle?: string) => boolean;
  getListBySlugOrId: (slugOrId: string) => UserList | undefined;
  updateListDetails: (list: UserList) => void;
  syncCustomListsFromTmdb: (force?: boolean) => Promise<void>;

  // Sync All & Fast ID Sync
  syncCollectionIdsFromTmdb: (force?: boolean) => Promise<void>;
  syncAllFromTmdb: (force?: boolean) => Promise<void>;

  // Reset & Clear
  reset: () => void;
}

export const useUserCollectionsStore = create<UserCollectionsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      watchlist: [],
      ratings: {},
      customLists: [],
      deletedListIds: [],
      lastSyncedAt: {},

      isStale: (key, ttlMs = COLLECTION_SYNC_TTL) => {
        const last = get().lastSyncedAt?.[key];
        if (!last) return true;
        return Date.now() - last > ttlMs;
      },

      // ==========================================
      // Favorites (Coalesced & Sequenced)
      // ==========================================
      isFavorite: (id, title) => {
        return get().favorites.some((item) => matchesMedia(item, id, title));
      },

      setFavoriteStatus: (item, favorite) => {
        set((state) => {
          const existing = state.favorites.find((f) => matchesMedia(f, item.id, item.title));
          const fullItem = existing
            ? { ...existing, ...item, releaseDate: item.releaseDate || existing.releaseDate }
            : item;
          const exists = Boolean(existing);
          if (favorite && !exists) {
            return { favorites: [fullItem, ...state.favorites] };
          }
          if (!favorite && exists) {
            return {
              favorites: state.favorites.filter((f) => !matchesMedia(f, item.id, item.title)),
            };
          }
          return state;
        });
      },

      toggleFavorite: async (item) => {
        const existing = get().favorites.find((f) => matchesMedia(f, item.id, item.title));
        const fullItem = existing
          ? { ...existing, ...item, releaseDate: item.releaseDate || existing.releaseDate }
          : item;
        const currentlyFavorited = Boolean(existing);
        const newFavoriteState = !currentlyFavorited;

        // 1. Instant Optimistic Local State Update
        set((state) => {
          if (currentlyFavorited) {
            return {
              favorites: state.favorites.filter((f) => !matchesMedia(f, item.id, item.title)),
            };
          }
          return {
            favorites: [fullItem, ...state.favorites],
          };
        });

        // 2. Toast notification
        toast.favorite(fullItem.title || "Movie", newFavoriteState, {
          image: fullItem.posterImage,
        });

        // 3. Coalesced and Sequenced TMDB Sync
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `fav:${mediaType}:${item.id}`;

        operationQueue
          .syncState({
            key,
            desiredValue: newFavoriteState,
            syncFn: async (val) => {
              return await toggleTmdbFavoriteAction({
                mediaId: item.id,
                mediaType,
                favorite: val,
              });
            },
            onRollback: (failedValue) => {
              // Rollback only if the current state still equals the failed value
              set((state) => {
                const isCurrentlyFav = state.favorites.some((f) => matchesMedia(f, item.id, item.title));
                if (isCurrentlyFav === failedValue) {
                  return {
                    favorites: failedValue
                      ? state.favorites.filter((f) => !matchesMedia(f, item.id, item.title))
                      : [fullItem, ...state.favorites],
                  };
                }
                return state;
              });
            },
          })
          .catch(() => {});

        return newFavoriteState;
      },

      removeFavorite: (id, title) => {
        const item = get().favorites.find((f) => matchesMedia(f, id, title));
        const mediaId = item?.id ?? id;

        set((state) => ({
          favorites: state.favorites.filter((f) => !matchesMedia(f, id, title)),
        }));

        toast.favorite(item?.title || title || "Movie", false, {
          image: item?.posterImage,
        });

        const mediaType: "movie" | "tv" =
          item?.mediaType === "tv" || item?.isMovie === false ? "tv" : "movie";
        const key = `fav:${mediaType}:${mediaId}`;

        operationQueue
          .syncState({
            key,
            desiredValue: false,
            syncFn: async () => {
              return await toggleTmdbFavoriteAction({
                mediaId,
                mediaType,
                favorite: false,
              });
            },
            onRollback: () => {
              set((state) => {
                if (item && !state.favorites.some((f) => matchesMedia(f, id, title))) {
                  return { favorites: [item, ...state.favorites] };
                }
                return state;
              });
            },
          })
          .catch(() => {});
      },

      syncFavoritesFromTmdb: async (force = false) => {
        if (!force && !get().isStale("favorites")) {
          return;
        }
        try {
          const res = await syncTmdbFavoritesAction();
          if (res.success) {
            set((state) => {
              // TMDB is the authoritative source of truth for current favorites
              const tmdbMap = new Map<string, CollectionMediaItem>();
              res.favorites.forEach((item) => {
                tmdbMap.set(String(item.id), item);
              });

              // Enrich with local metadata (e.g. genre, releaseDate) if available
              state.favorites.forEach((localItem) => {
                const idKey = String(localItem.id);
                const tmdbItem = tmdbMap.get(idKey);
                if (tmdbItem) {
                  tmdbMap.set(idKey, {
                    ...localItem,
                    ...tmdbItem,
                    genre: localItem.genre || tmdbItem.genre,
                    releaseDate: tmdbItem.releaseDate || localItem.releaseDate,
                    posterImage: tmdbItem.posterImage || localItem.posterImage,
                    backdropImage: tmdbItem.backdropImage || localItem.backdropImage,
                  });
                }
              });

              // Check if any item has an active in-flight mutation in operationQueue
              state.favorites.forEach((localItem) => {
                const mediaType = localItem.mediaType === "tv" || localItem.isMovie === false ? "tv" : "movie";
                const key = `fav:${mediaType}:${localItem.id}`;
                if (operationQueue.isKeyPending(key)) {
                  const pendingVal = operationQueue.getPendingDesiredValue<boolean>(key);
                  if (pendingVal === true && !tmdbMap.has(String(localItem.id))) {
                    tmdbMap.set(String(localItem.id), localItem);
                  } else if (pendingVal === false && tmdbMap.has(String(localItem.id))) {
                    tmdbMap.delete(String(localItem.id));
                  }
                }
              });

              return {
                favorites: Array.from(tmdbMap.values()),
                lastSyncedAt: {
                  ...state.lastSyncedAt,
                  favorites: Date.now(),
                },
              };
            });
          }
        } catch {}
      },

      // ==========================================
      // Watchlist (Coalesced & Sequenced)
      // ==========================================
      isInWatchlist: (id, title) => {
        return get().watchlist.some((item) => matchesMedia(item, id, title));
      },

      setWatchlistStatus: (item, inWatchlist) => {
        set((state) => {
          const existing = state.watchlist.find((w) => matchesMedia(w, item.id, item.title));
          const fullItem = existing
            ? { ...existing, ...item, releaseDate: item.releaseDate || existing.releaseDate }
            : item;
          const exists = Boolean(existing);
          if (inWatchlist && !exists) {
            return { watchlist: [fullItem, ...state.watchlist] };
          }
          if (!inWatchlist && exists) {
            return {
              watchlist: state.watchlist.filter((w) => !matchesMedia(w, item.id, item.title)),
            };
          }
          return state;
        });
      },

      toggleWatchlist: async (item) => {
        const existing = get().watchlist.find((w) => matchesMedia(w, item.id, item.title));
        const fullItem = existing
          ? { ...existing, ...item, releaseDate: item.releaseDate || existing.releaseDate }
          : item;
        const currentlyInWatchlist = Boolean(existing);
        const newWatchlistState = !currentlyInWatchlist;

        // 1. Instant Optimistic Local State Update
        set((state) => {
          if (currentlyInWatchlist) {
            return {
              watchlist: state.watchlist.filter((w) => !matchesMedia(w, item.id, item.title)),
            };
          }
          return {
            watchlist: [fullItem, ...state.watchlist],
          };
        });

        // 2. Toast notification
        toast.watchlist(fullItem.title || "Movie", newWatchlistState, {
          image: fullItem.posterImage,
        });

        // 3. Coalesced and Sequenced TMDB Sync
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `wl:${mediaType}:${item.id}`;

        operationQueue
          .syncState({
            key,
            desiredValue: newWatchlistState,
            syncFn: async (val) => {
              return await toggleTmdbWatchlistAction({
                mediaId: item.id,
                mediaType,
                watchlist: val,
              });
            },
            onRollback: (failedValue) => {
              set((state) => {
                const isCurrentlyInWl = state.watchlist.some((w) => matchesMedia(w, item.id, item.title));
                if (isCurrentlyInWl === failedValue) {
                  return {
                    watchlist: failedValue
                      ? state.watchlist.filter((w) => !matchesMedia(w, item.id, item.title))
                      : [fullItem, ...state.watchlist],
                  };
                }
                return state;
              });
            },
          })
          .catch(() => {});

        return newWatchlistState;
      },

      removeWatchlist: (id, title) => {
        const item = get().watchlist.find((w) => matchesMedia(w, id, title));
        const mediaId = item?.id ?? id;

        set((state) => ({
          watchlist: state.watchlist.filter((w) => !matchesMedia(w, id, title)),
        }));

        toast.watchlist(item?.title || title || "Movie", false, {
          image: item?.posterImage,
        });

        const mediaType: "movie" | "tv" =
          item?.mediaType === "tv" || item?.isMovie === false ? "tv" : "movie";
        const key = `wl:${mediaType}:${mediaId}`;

        operationQueue
          .syncState({
            key,
            desiredValue: false,
            syncFn: async () => {
              return await toggleTmdbWatchlistAction({
                mediaId,
                mediaType,
                watchlist: false,
              });
            },
            onRollback: () => {
              set((state) => {
                if (item && !state.watchlist.some((w) => matchesMedia(w, id, title))) {
                  return { watchlist: [item, ...state.watchlist] };
                }
                return state;
              });
            },
          })
          .catch(() => {});
      },

      syncWatchlistFromTmdb: async (force = false) => {
        if (!force && !get().isStale("watchlist")) {
          return;
        }
        try {
          const res = await syncTmdbWatchlistAction();
          if (res.success) {
            set((state) => {
              const tmdbMap = new Map<string, CollectionMediaItem>();
              res.watchlist.forEach((item) => {
                tmdbMap.set(String(item.id), item);
              });

              state.watchlist.forEach((localItem) => {
                const idKey = String(localItem.id);
                const tmdbItem = tmdbMap.get(idKey);
                if (tmdbItem) {
                  tmdbMap.set(idKey, {
                    ...localItem,
                    ...tmdbItem,
                    genre: localItem.genre || tmdbItem.genre,
                    releaseDate: tmdbItem.releaseDate || localItem.releaseDate,
                    posterImage: tmdbItem.posterImage || localItem.posterImage,
                    backdropImage: tmdbItem.backdropImage || localItem.backdropImage,
                  });
                }
              });

              // Respect in-flight operations
              state.watchlist.forEach((localItem) => {
                const mediaType = localItem.mediaType === "tv" || localItem.isMovie === false ? "tv" : "movie";
                const key = `wl:${mediaType}:${localItem.id}`;
                if (operationQueue.isKeyPending(key)) {
                  const pendingVal = operationQueue.getPendingDesiredValue<boolean>(key);
                  if (pendingVal === true && !tmdbMap.has(String(localItem.id))) {
                    tmdbMap.set(String(localItem.id), localItem);
                  } else if (pendingVal === false && tmdbMap.has(String(localItem.id))) {
                    tmdbMap.delete(String(localItem.id));
                  }
                }
              });

              return {
                watchlist: Array.from(tmdbMap.values()),
                lastSyncedAt: {
                  ...state.lastSyncedAt,
                  watchlist: Date.now(),
                },
              };
            });
          }
        } catch {}
      },

      // ==========================================
      // Ratings (Coalesced & Sequenced)
      // ==========================================
      getUserRating: (id, title) => {
        const idStr = String(id);
        const direct = get().ratings[idStr]?.rating;
        if (direct !== undefined) return direct;
        const match = Object.values(get().ratings).find((r) => r.item && matchesMedia(r.item, id, title));
        return match?.rating;
      },

      setUserRating: async (item, rating) => {
        const idStr = String(item.id);
        const existingEntry = Object.entries(get().ratings).find(
          ([key, val]) => key === idStr || (val.item && matchesMedia(val.item, item.id, item.title))
        );
        const prevKey = existingEntry ? existingEntry[0] : idStr;
        const prevRating = existingEntry ? existingEntry[1] : undefined;

        const existingItem = prevRating?.item;
        const updatedItem: CollectionMediaItem = {
          ...(existingItem || {}),
          ...item,
          releaseDate: item.releaseDate || existingItem?.releaseDate,
          userRating: rating,
        };

        // 1. Instant Optimistic Local State Update
        set((state) => {
          const newRatings = { ...state.ratings };
          if (prevKey !== idStr) {
            delete newRatings[prevKey];
          }
          newRatings[idStr] = {
            rating,
            item: updatedItem,
            ratedAt: new Date().toISOString(),
          };
          return { ratings: newRatings };
        });

        // 2. Toast notification
        toast.rating(updatedItem.title || "Movie", rating, {
          image: updatedItem.posterImage,
        });

        // 3. Coalesced and Sequenced TMDB Sync
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `rate:${mediaType}:${idStr}`;

        operationQueue
          .syncState({
            key,
            desiredValue: rating,
            syncFn: async (val) => {
              if (typeof val === "number" && val > 0) {
                return await setTmdbRatingAction({
                  mediaId: item.id,
                  mediaType,
                  rating: val,
                });
              } else {
                return await removeTmdbRatingAction({
                  mediaId: item.id,
                  mediaType,
                });
              }
            },
            onRollback: () => {
              set((state) => {
                const newRatings = { ...state.ratings };
                if (prevRating) {
                  newRatings[prevKey] = prevRating;
                  if (prevKey !== idStr) {
                    delete newRatings[idStr];
                  }
                } else {
                  delete newRatings[idStr];
                }
                return { ratings: newRatings };
              });
            },
          })
          .catch(() => {});
      },

      setUserRatingStatus: (item, rating) => {
        const idStr = String(item.id);
        const existingEntry = Object.entries(get().ratings).find(
          ([key, val]) => key === idStr || (val.item && matchesMedia(val.item, item.id, item.title))
        );
        const prevKey = existingEntry ? existingEntry[0] : idStr;
        const prevRating = existingEntry ? existingEntry[1] : undefined;

        const existingItem = prevRating?.item;
        const updatedItem: CollectionMediaItem = {
          ...(existingItem || {}),
          ...item,
          releaseDate: item.releaseDate || existingItem?.releaseDate,
          userRating: rating,
        };

        set((state) => {
          const newRatings = { ...state.ratings };
          if (prevKey !== idStr) {
            delete newRatings[prevKey];
          }
          newRatings[idStr] = {
            rating,
            item: updatedItem,
            ratedAt: new Date().toISOString(),
          };
          return { ratings: newRatings };
        });
      },

      removeUserRatingStatus: (id, title) => {
        const idStr = String(id);
        const existingEntry = Object.entries(get().ratings).find(
          ([key, val]) => key === idStr || (val.item && matchesMedia(val.item, id, title))
        );
        const targetKey = existingEntry ? existingEntry[0] : idStr;
        set((state) => {
          const newRatings = { ...state.ratings };
          delete newRatings[targetKey];
          delete newRatings[idStr];
          Object.entries(newRatings).forEach(([k, v]) => {
            if (v.item && matchesMedia(v.item, id, title)) {
              delete newRatings[k];
            }
          });
          return { ratings: newRatings };
        });
      },

      removeUserRating: async (id, mediaType = "movie", title?: string) => {
        const idStr = String(id);
        const existingEntry = Object.entries(get().ratings).find(
          ([key, val]) => key === idStr || (val.item && matchesMedia(val.item, id, title))
        );
        const targetKey = existingEntry ? existingEntry[0] : idStr;
        const prevRating = existingEntry ? existingEntry[1] : undefined;

        set((state) => {
          const newRatings = { ...state.ratings };
          delete newRatings[targetKey];
          delete newRatings[idStr];
          Object.entries(newRatings).forEach(([k, v]) => {
            if (v.item && matchesMedia(v.item, id, title)) {
              delete newRatings[k];
            }
          });
          return { ratings: newRatings };
        });

        toast.rating(prevRating?.item?.title || title || "Movie", 0, {
          image: prevRating?.item?.posterImage,
        });

        const targetMediaType: "movie" | "tv" =
          prevRating?.item?.mediaType === "tv" || prevRating?.item?.isMovie === false
            ? "tv"
            : (mediaType === "tv" ? "tv" : "movie");
        const key = `rate:${targetMediaType}:${idStr}`;

        operationQueue
          .syncState({
            key,
            desiredValue: 0,
            syncFn: async () => {
              return await removeTmdbRatingAction({
                mediaId: id,
                mediaType: targetMediaType,
              });
            },
            onRollback: () => {
              set((state) => {
                const newRatings = { ...state.ratings };
                if (prevRating) {
                  newRatings[targetKey] = prevRating;
                }
                return { ratings: newRatings };
              });
            },
          })
          .catch(() => {});
      },

      syncRatingsFromTmdb: async (force = false) => {
        if (!force && !get().isStale("ratings")) {
          return;
        }
        try {
          const res = await syncTmdbRatingsAction();
          if (res.success) {
            set((state) => {
              // Start fresh with TMDB ratings as source of truth
              const mergedRatings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }> = {};

              Object.entries(res.ratings).forEach(([idStr, val]) => {
                const existing = state.ratings[idStr];
                mergedRatings[idStr] = {
                  rating: val.rating,
                  item: {
                    ...(existing?.item || {}),
                    ...val.item,
                    title: val.item.title || existing?.item?.title || "",
                    posterImage: val.item.posterImage || existing?.item?.posterImage,
                    backdropImage: val.item.backdropImage || existing?.item?.backdropImage,
                    genre: existing?.item?.genre || val.item.genre,
                    releaseDate: val.item.releaseDate || existing?.item?.releaseDate,
                  },
                  ratedAt: val.ratedAt || existing?.ratedAt || new Date().toISOString(),
                };
              });

              // Respect in-flight rating operations
              Object.entries(state.ratings).forEach(([idStr, entry]) => {
                const mediaType = entry.item?.mediaType === "tv" || entry.item?.isMovie === false ? "tv" : "movie";
                const key = `rate:${mediaType}:${idStr}`;
                if (operationQueue.isKeyPending(key)) {
                  const pendingRating = operationQueue.getPendingDesiredValue<number>(key);
                  if (typeof pendingRating === "number" && pendingRating > 0) {
                    mergedRatings[idStr] = {
                      ...entry,
                      rating: pendingRating,
                      item: { ...entry.item, userRating: pendingRating },
                    };
                  } else if (pendingRating === undefined || pendingRating === 0) {
                    delete mergedRatings[idStr];
                  }
                }
              });

              return {
                ratings: mergedRatings,
                lastSyncedAt: {
                  ...state.lastSyncedAt,
                  ratings: Date.now(),
                },
              };
            });
          }
        } catch {}
      },

      // ==========================================
      // Custom Lists (Sequenced & Dependency Chained)
      // ==========================================
      createCustomList: async ({ title, description = "", language = "en", isPrivate = false }) => {
        const localId = `custom-list-${Date.now()}`;
        const slug = `list-${localId}`;

        let curatorName = "User";
        let curatorHandle = "@user";
        if (typeof window !== "undefined") {
          try {
            const authStorage = localStorage.getItem("tmdb_account_info");
            if (authStorage) {
              const parsed = JSON.parse(authStorage);
              if (parsed?.name || parsed?.username) {
                curatorName = parsed.name || parsed.username;
                curatorHandle = `@${parsed.username || "user"}`;
              }
            }
          } catch {}
        }

        const optimisticList: UserList = {
          id: localId,
          slug,
          title,
          description,
          curator: {
            name: curatorName,
            handle: curatorHandle,
            avatar: "/assets/persons-image.jpg",
          },
          itemCount: 0,
          runtime: "0m",
          likesCount: 0,
          viewsCount: "1",
          tags: isPrivate ? ["Private"] : ["Public"],
          backdrop: "/assets/movie-placeholder.jpg",
          posters: [],
          items: [],
          isPrivate,
          language,
          updatedAt: "Just now",
        };

        // 1. Immediately insert into local store
        set((state) => ({
          deletedListIds: state.deletedListIds.filter(
            (id) => id !== localId && id !== slug
          ),
          customLists: [
            optimisticList,
            ...state.customLists.filter((l) => String(l.id) !== localId),
          ],
        }));

        toast.list("Created Custom List", title);

        // 2. Creation Promise registered with OperationQueue and awaited
        const creationTask = (async () => {
          try {
            const res = await createTmdbListAction({ title, description, language, isPrivate });
            if (res.success && res.listId) {
              const tmdbIdStr = String(res.listId);
              const tmdbSlug = `list-${tmdbIdStr}`;
              const resolvedIsPrivate = res.list?.isPrivate !== undefined ? res.list.isPrivate : isPrivate;

              // Update list id & slug in store
              set((state) => {
                const currentList = state.customLists.find(
                  (l) => String(l.id) === localId || l.slug === slug
                );
                if (!currentList) return state;

                const updatedList: UserList = {
                  ...currentList,
                  id: tmdbIdStr,
                  slug: tmdbSlug,
                  curator: res.list?.curator || currentList.curator,
                  tags: resolvedIsPrivate ? ["Private"] : ["Public"],
                  isPrivate: resolvedIsPrivate,
                  language: res.list?.language || language,
                };

                return {
                  customLists: state.customLists.map((l) =>
                    String(l.id) === localId || l.slug === slug ? updatedList : l
                  ),
                };
              });

              // Sync any items added while TMDB list creation was in flight
              const currentList = get().customLists.find(
                (l) => String(l.id) === tmdbIdStr || l.slug === tmdbSlug
              );
              if (currentList && currentList.items && currentList.items.length > 0) {
                for (const itm of currentList.items) {
                  const mediaType: "movie" | "tv" =
                    itm.mediaType === "tv" || itm.isMovie === false ? "tv" : "movie";
                  toggleTmdbListItemAction({
                    listId: tmdbIdStr,
                    mediaId: itm.id,
                    mediaType,
                    inList: true,
                  }).catch(() => {});
                }
              }

              return tmdbIdStr;
            } else if (!res.success) {
              // Rollback optimistic addition if creation failed
              set((state) => ({
                customLists: state.customLists.filter(
                  (l) => String(l.id) !== localId && l.slug !== slug
                ),
              }));
              throw new Error(res.error || "Failed to create list on TMDB.");
            }
            return localId;
          } catch (err) {
            // Rollback optimistic addition on error
            set((state) => ({
              customLists: state.customLists.filter(
                (l) => String(l.id) !== localId && l.slug !== slug
              ),
            }));
            throw err;
          }
        })();

        operationQueue.registerListCreation(localId, creationTask);

        const resolvedId = await creationTask;
        const finalList = get().customLists.find(
          (l) => String(l.id) === String(resolvedId) || l.slug === `list-${resolvedId}`
        );
        return finalList || optimisticList;
      },

      updateCustomList: async ({ id, title, description = "", language = "en", isPrivate = false }) => {
        const idStr = String(id);
        const cleanIdStr = idStr.replace(/^list-/, "");
        const prevLists = get().customLists;
        const targetList = prevLists.find((l) => {
          const lIdStr = String(l.id);
          const lCleanIdStr = lIdStr.replace(/^list-/, "");
          return (
            lIdStr === idStr ||
            lCleanIdStr === cleanIdStr ||
            l.slug === idStr ||
            l.slug === `list-${cleanIdStr}` ||
            slugify(l.title) === idStr
          );
        });

        if (!targetList) {
          throw new Error("List not found.");
        }

        const updatedList: UserList = {
          ...targetList,
          title,
          description,
          language,
          isPrivate,
          tags: isPrivate ? ["Private"] : ["Public"],
          updatedAt: "Just now",
        };

        // 1. Immediately update store
        set((state) => ({
          customLists: state.customLists.map((l) => {
            const isMatch =
              String(l.id) === String(targetList.id) ||
              l.id === targetList.id ||
              l.slug === targetList.slug ||
              String(l.id) === idStr ||
              String(l.id).replace(/^list-/, "") === cleanIdStr;
            return isMatch ? updatedList : l;
          }),
        }));

        toast.list("Updated List", title);

        // 2. Sequenced update in queue
        const targetListId = targetList.id;
        operationQueue
          .enqueue(`list:${targetListId}`, async () => {
            const resolvedId = await operationQueue.resolveListId(targetListId);
            return await updateTmdbListAction({
              listId: resolvedId,
              title,
              description,
              language,
              isPrivate,
            });
          })
          .catch(() => {});

        return updatedList;
      },

      deleteCustomList: async (listId) => {
        const idStr = String(listId);
        const cleanIdStr = idStr.replace(/^list-/, "");

        const targetList = get().customLists.find((l) => {
          const lIdStr = String(l.id);
          const lCleanIdStr = lIdStr.replace(/^list-/, "");
          return (
            lIdStr === idStr ||
            lCleanIdStr === cleanIdStr ||
            l.slug === idStr ||
            l.slug === `list-${cleanIdStr}` ||
            slugify(l.title) === idStr
          );
        });

        const targetId = targetList?.id ?? listId;
        const targetSlug = targetList?.slug ?? idStr;

        // 1. Permanent Local State Update
        set((state) => ({
          deletedListIds: Array.from(
            new Set([
              ...(state.deletedListIds || []),
              String(targetId),
              String(listId),
              idStr,
              cleanIdStr,
              `list-${cleanIdStr}`,
              targetSlug,
            ])
          ),
          customLists: state.customLists.filter((l) => {
            const lIdStr = String(l.id);
            const lCleanIdStr = lIdStr.replace(/^list-/, "");
            const isMatch =
              l.id === targetId ||
              lIdStr === idStr ||
              lCleanIdStr === cleanIdStr ||
              l.slug === idStr ||
              l.slug === targetSlug ||
              l.slug === `list-${cleanIdStr}` ||
              (targetList && l.id === targetList.id);
            return !isMatch;
          }),
        }));

        // Cancel any pending queued operations for this list AFTER capturing IDs
        operationQueue.cancelListOperations(targetId);

        toast.list("Deleted List", targetList?.title || idStr);

        // 2. Sequenced TMDB Deletion
        operationQueue
          .enqueue(`list-del:${targetId}`, async () => {
            const resolvedId = await operationQueue.resolveListId(targetId);
            const tmdbDeleteId = String(resolvedId).replace(/^list-/, "");
            return await deleteTmdbListAction(tmdbDeleteId);
          })
          .catch(() => {});

        return true;
      },

      toggleListItem: async (listId, item) => {
        const idStr = String(listId);
        const cleanIdStr = idStr.replace(/^list-/, "");

        const list = get().customLists.find((l) => {
          const lIdStr = String(l.id);
          const lCleanIdStr = lIdStr.replace(/^list-/, "");
          return (
            lIdStr === idStr ||
            lCleanIdStr === cleanIdStr ||
            l.slug === idStr ||
            l.slug === `list-${cleanIdStr}` ||
            slugify(l.title) === idStr
          );
        });

        if (!list) return;

        const targetListId = list.id;
        const existingItems = list.items || [];
        const itemExists = existingItems.some((i) => matchesMedia(i, item.id, item.title));
        const inList = !itemExists;

        // 1. Instant Optimistic Local State Update
        set((state) => ({
          customLists: state.customLists.map((l) => {
            const lIdStr = String(l.id);
            const lCleanIdStr = lIdStr.replace(/^list-/, "");
            const isMatch =
              l.id === targetListId ||
              lIdStr === idStr ||
              lCleanIdStr === cleanIdStr ||
              l.slug === idStr ||
              l.slug === `list-${cleanIdStr}`;

            if (!isMatch) return l;

            let updatedItems: CollectionMediaItem[];
            if (itemExists) {
              updatedItems = (l.items || []).filter((i) => !matchesMedia(i, item.id, item.title));
            } else {
              const existingInList = (l.items || []).find((i) => matchesMedia(i, item.id, item.title));
              const fullItem = existingInList
                ? { ...existingInList, ...item, releaseDate: item.releaseDate || existingInList.releaseDate }
                : item;
              updatedItems = [fullItem, ...(l.items || [])];
            }

            const newPosters = updatedItems
              .map((i) => i.posterImage)
              .filter(Boolean) as string[];

            return {
              ...l,
              items: updatedItems,
              itemCount: updatedItems.length,
              posters: newPosters.length > 0 ? newPosters.slice(0, 4) : ["/assets/movie-placeholder.jpg"],
              backdrop: updatedItems[0]?.backdropImage || l.backdrop || "/assets/movie-placeholder.jpg",
              updatedAt: "Just now",
            };
          }),
        }));

        // 2. Toast notification
        toast.list(
          inList ? "Added to List" : "Removed from List",
          inList ? `Added "${item.title}" to ${list.title}` : `Removed "${item.title}" from ${list.title}`,
          { image: item.posterImage }
        );

        // 3. Coalesced TMDB Sync (with list resolution check)
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `list-item:${targetListId}:${item.id}`;

        operationQueue
          .syncState({
            key,
            desiredValue: inList,
            syncFn: async (val) => {
              const resolvedListId = await operationQueue.resolveListId(targetListId);
              return await toggleTmdbListItemAction({
                listId: resolvedListId,
                mediaId: item.id,
                mediaType,
                inList: val,
              });
            },
            onRollback: (failedValue) => {
              set((state) => ({
                customLists: state.customLists.map((l) => {
                  const isMatch = l.id === targetListId;
                  if (!isMatch) return l;

                  const hasItem = (l.items || []).some((i) => matchesMedia(i, item.id, item.title));
                  if (hasItem === failedValue) {
                    let updatedItems: CollectionMediaItem[];
                    if (failedValue) {
                      updatedItems = (l.items || []).filter((i) => !matchesMedia(i, item.id, item.title));
                    } else {
                      const existingInList = (l.items || []).find((i) => matchesMedia(i, item.id, item.title));
                      const fullItem = existingInList
                        ? { ...existingInList, ...item, releaseDate: item.releaseDate || existingInList.releaseDate }
                        : item;
                      updatedItems = [fullItem, ...(l.items || [])];
                    }
                    const newPosters = updatedItems
                      .map((i) => i.posterImage)
                      .filter(Boolean) as string[];

                    return {
                      ...l,
                      items: updatedItems,
                      itemCount: updatedItems.length,
                      posters: newPosters.length > 0 ? newPosters.slice(0, 4) : ["/assets/movie-placeholder.jpg"],
                      backdrop: updatedItems[0]?.backdropImage || l.backdrop || "/assets/movie-placeholder.jpg",
                      updatedAt: "Just now",
                    };
                  }
                  return l;
                }),
              }));
            },
          })
          .catch(() => {});
      },

      addItemToList: async (listId, item) => {
        const alreadyIn = get().isItemInList(listId, item.id, item.title);
        if (!alreadyIn) {
          await get().toggleListItem(listId, item);
        }
      },

      removeItemFromList: async (listId, itemId, itemTitle) => {
        const list = get().getListBySlugOrId(String(listId));
        if (!list) return;

        const targetItem = (list.items || []).find((i) => matchesMedia(i, itemId, itemTitle)) || {
          id: itemId,
          title: itemTitle || "",
        };

        await get().toggleListItem(list.id, targetItem);
      },

      clearCustomList: async (listId) => {
        const idStr = String(listId);
        const cleanIdStr = idStr.replace(/^list-/, "");

        const list = get().customLists.find((l) => {
          const lIdStr = String(l.id);
          return lIdStr === idStr || lIdStr === cleanIdStr;
        });
        if (!list) return;

        // 1. Optimistic update
        set((state) => ({
          customLists: state.customLists.map((l) => {
            const lIdStr = String(l.id);
            if (lIdStr === idStr || lIdStr === cleanIdStr) {
              return {
                ...l,
                itemCount: 0,
                items: [],
                backdropPath: undefined,
              };
            }
            return l;
          }),
        }));

        toast.list("Cleared List", list.title);

        // 2. Sequenced TMDB Clear
        const targetListId = list.id;
        operationQueue
          .enqueue(`list-clear:${targetListId}`, async () => {
            const resolvedListId = await operationQueue.resolveListId(targetListId);
            return await clearTmdbListAction(resolvedListId);
          })
          .catch(() => {});
      },

      isItemInList: (listId, itemId, itemTitle) => {
        const list = get().getListBySlugOrId(String(listId));
        if (!list || !list.items) return false;
        return list.items.some((i) => matchesMedia(i, itemId, itemTitle));
      },

      getListBySlugOrId: (slugOrId) => {
        const decoded = decodeURIComponent(slugOrId).toLowerCase();
        const clean = decoded.replace(/^list-/, "");
        return get().customLists.find((l) => {
          const lIdStr = String(l.id).toLowerCase();
          const lCleanIdStr = lIdStr.replace(/^list-/, "");
          const lSlug = l.slug.toLowerCase();
          const lTitleSlug = slugify(l.title).toLowerCase();

          return (
            lIdStr === decoded ||
            lCleanIdStr === clean ||
            lSlug === decoded ||
            lSlug.replace(/^list-/, "") === clean ||
            lTitleSlug === decoded ||
            lTitleSlug === clean
          );
        });
      },

      updateListDetails: (list) => {
        set((state) => {
          const listIdStr = String(list.id);
          const cleanIdStr = listIdStr.replace(/^list-/, "");
          const listTitleLower = list.title ? list.title.trim().toLowerCase() : "";

          const existingList = state.customLists.find((l) => {
            const lIdStr = String(l.id);
            const lCleanIdStr = lIdStr.replace(/^list-/, "");
            return (
              lIdStr === listIdStr ||
              lCleanIdStr === cleanIdStr ||
              l.slug === list.slug ||
              l.slug === `list-${cleanIdStr}` ||
              slugify(l.title) === listIdStr ||
              (lIdStr.startsWith("custom-list-") && listTitleLower && l.title.trim().toLowerCase() === listTitleLower)
            );
          });

          if (existingList) {
            return {
              customLists: state.customLists.map((l) => {
                const lIdStr = String(l.id);
                const lCleanIdStr = lIdStr.replace(/^list-/, "");
                const isMatch =
                  l.id === existingList.id ||
                  lIdStr === listIdStr ||
                  lCleanIdStr === cleanIdStr ||
                  l.slug === list.slug ||
                  l.slug === `list-${cleanIdStr}` ||
                  slugify(l.title) === listIdStr ||
                  (lIdStr.startsWith("custom-list-") && listTitleLower && l.title.trim().toLowerCase() === listTitleLower);

                if (!isMatch) return l;

                // Incoming items are the primary source of truth
                const incomingItems = list.items !== undefined ? list.items : (l.items || []);
                const newPosters = incomingItems
                  .map((i) => i.posterImage)
                  .filter(Boolean) as string[];

                const resolvedIsPrivate = list.isPrivate !== undefined ? list.isPrivate : (l.isPrivate ?? false);

                return {
                  ...l,
                  id: list.id || l.id,
                  slug: list.slug || l.slug,
                  title: list.title || l.title,
                  description: list.description !== undefined ? list.description : l.description,
                  isPrivate: resolvedIsPrivate,
                  tags: resolvedIsPrivate ? ["Private"] : ["Public"],
                  language: list.language || l.language || "en",
                  items: incomingItems,
                  itemCount: incomingItems.length,
                  posters: newPosters.length > 0 ? newPosters.slice(0, 4) : (list.posters || l.posters),
                  backdrop: incomingItems[0]?.backdropImage || list.backdrop || l.backdrop,
                };
              }),
            };
          } else {
            const resolvedIsPrivate = list.isPrivate ?? false;
            return {
              customLists: [
                {
                  ...list,
                  tags: resolvedIsPrivate ? ["Private"] : ["Public"],
                  isPrivate: resolvedIsPrivate,
                },
                ...state.customLists,
              ],
            };
          }
        });
      },

      syncCustomListsFromTmdb: async (force = false) => {
        if (!force && !get().isStale("customLists")) {
          return;
        }
        try {
          const res = await syncTmdbListsAction();
          if (res.success) {
            set((state) => {
              const listMap = new Map<string, UserList>();

              // Only filter out lists that have an active deletion in-flight in operationQueue
              const hasPendingDelete = (listId: string) => {
                const raw = listId.replace(/^list-/, "");
                return (
                  operationQueue.isKeyPending(`list-del:${listId}`) ||
                  operationQueue.isKeyPending(`list-del:${raw}`) ||
                  operationQueue.isKeyPending(`list-del:list-${raw}`)
                );
              };

              // 1. Reconcile and add all TMDB lists returned from TMDB
              res.lists.forEach((l) => {
                const lIdStr = String(l.id).toLowerCase();
                const lCleanIdStr = lIdStr.replace(/^list-/, "");
                const lSlug = (l.slug || "").toLowerCase();

                // If this list has an active deletion in flight, ignore it
                if (
                  hasPendingDelete(lIdStr) ||
                  hasPendingDelete(lCleanIdStr) ||
                  (lSlug && hasPendingDelete(lSlug))
                ) {
                  return;
                }

                const lTitleLower = l.title.trim().toLowerCase();
                const existing = state.customLists.find(
                  (prev) =>
                    String(prev.id) === String(l.id) ||
                    prev.slug === l.slug ||
                    (String(prev.id).startsWith("custom-list-") &&
                      prev.title.trim().toLowerCase() === lTitleLower)
                );

                const tmdbItems = l.items || [];
                const posters = tmdbItems
                  .map((i) => i.posterImage)
                  .filter(Boolean) as string[];

                const resolvedIsPrivate =
                  l.isPrivate !== undefined
                    ? l.isPrivate
                    : (existing?.isPrivate ?? false);

                listMap.set(String(l.id), {
                  ...l,
                  title: l.title || existing?.title || "Untitled List",
                  description:
                    l.description !== undefined
                      ? l.description
                      : (existing?.description || ""),
                  isPrivate: resolvedIsPrivate,
                  tags: resolvedIsPrivate ? ["Private"] : ["Public"],
                  language: l.language || existing?.language || "en",
                  items: tmdbItems,
                  itemCount: tmdbItems.length > 0 ? tmdbItems.length : (l.itemCount || 0),
                  posters:
                    posters.length > 0
                      ? posters.slice(0, 4)
                      : (l.posters && l.posters.length > 0 ? l.posters : ["/assets/movie-placeholder.jpg"]),
                  backdrop:
                    tmdbItems[0]?.backdropImage ||
                    l.backdrop ||
                    existing?.backdrop ||
                    "/assets/movie-placeholder.jpg",
                });
              });

              // 2. Preserve un-synced local-only custom lists (custom-list-*) that weren't deleted
              state.customLists.forEach((l) => {
                const lId = String(l.id).toLowerCase();
                const lCleanId = lId.replace(/^list-/, "");
                const lSlug = (l.slug || "").toLowerCase();
                if (!lId.startsWith("custom-list-")) return;
                if (hasPendingDelete(lId) || hasPendingDelete(lCleanId) || (lSlug && hasPendingDelete(lSlug))) return;

                const lTitleLower = l.title.trim().toLowerCase();
                const alreadyMergedIntoTmdb = res.lists.some(
                  (tmdbList) => tmdbList.title.trim().toLowerCase() === lTitleLower
                );
                if (!alreadyMergedIntoTmdb && !listMap.has(String(l.id))) {
                  listMap.set(String(l.id), l);
                }
              });

              // 3. Clean up deletedListIds: only retain IDs that still have an active deletion in-flight
              const updatedDeletedListIds = (state.deletedListIds || []).filter((id) =>
                hasPendingDelete(String(id).toLowerCase())
              );

              return {
                customLists: Array.from(listMap.values()),
                deletedListIds: updatedDeletedListIds,
                lastSyncedAt: {
                  ...state.lastSyncedAt,
                  customLists: Date.now(),
                },
              };
            });
          }
        } catch {}
      },

      syncCollectionIdsFromTmdb: async (force = false) => {
        if (!force && !get().isStale("collectionIds")) {
          return;
        }
        try {
          const res = await syncTmdbCollectionIdsAction();
          if (res.success) {
            set((state) => {
              const favIdSet = new Set(res.favoriteIds.map((id) => String(id)));
              const wlIdSet = new Set(res.watchlistIds.map((id) => String(id)));

              // Filter favorites to only those in TMDB response (or pending in-flight)
              const updatedFavorites = state.favorites.filter((f) => {
                const fIdStr = String(f.id);
                const mediaType = f.mediaType === "tv" || f.isMovie === false ? "tv" : "movie";
                const key = `fav:${mediaType}:${fIdStr}`;
                if (operationQueue.isKeyPending(key)) {
                  return operationQueue.getPendingDesiredValue<boolean>(key) !== false;
                }
                return favIdSet.has(fIdStr);
              });

              // Add any missing IDs
              const existingFavIdSet = new Set(updatedFavorites.map((f) => String(f.id)));
              res.favoriteIds.forEach((id) => {
                const idStr = String(id);
                if (!existingFavIdSet.has(idStr)) {
                  updatedFavorites.push({ id: Number(id) || id, title: "" });
                }
              });

              // Filter watchlist to only those in TMDB response (or pending in-flight)
              const updatedWatchlist = state.watchlist.filter((w) => {
                const wIdStr = String(w.id);
                const mediaType = w.mediaType === "tv" || w.isMovie === false ? "tv" : "movie";
                const key = `wl:${mediaType}:${wIdStr}`;
                if (operationQueue.isKeyPending(key)) {
                  return operationQueue.getPendingDesiredValue<boolean>(key) !== false;
                }
                return wlIdSet.has(wIdStr);
              });

              // Add any missing IDs
              const existingWlIdSet = new Set(updatedWatchlist.map((w) => String(w.id)));
              res.watchlistIds.forEach((id) => {
                const idStr = String(id);
                if (!existingWlIdSet.has(idStr)) {
                  updatedWatchlist.push({ id: Number(id) || id, title: "" });
                }
              });

              // Sync ratings (preserve rich metadata such as posterImage, backdropImage, genre, rating, releaseDate)
              const newRatings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }> = {};
              Object.entries(res.ratedMap).forEach(([idStr, info]) => {
                const existing = state.ratings[idStr];
                newRatings[idStr] = {
                  rating: info.rating,
                  item: {
                    ...(existing?.item || {}),
                    id: Number(idStr) || idStr,
                    title: existing?.item?.title || info.title || "",
                    posterImage: existing?.item?.posterImage,
                    backdropImage: existing?.item?.backdropImage,
                    genre: existing?.item?.genre,
                    rating: existing?.item?.rating,
                    releaseDate: info.releaseDate || existing?.item?.releaseDate,
                    mediaType: info.mediaType || existing?.item?.mediaType || "movie",
                    isMovie: (info.mediaType || existing?.item?.mediaType) !== "tv",
                    userRating: info.rating,
                  },
                  ratedAt: existing?.ratedAt || new Date().toISOString(),
                };
              });

              // Respect in-flight rating operations
              Object.entries(state.ratings).forEach(([idStr, entry]) => {
                const mediaType = entry.item?.mediaType === "tv" || entry.item?.isMovie === false ? "tv" : "movie";
                const key = `rate:${mediaType}:${idStr}`;
                if (operationQueue.isKeyPending(key)) {
                  const pendingRating = operationQueue.getPendingDesiredValue<number>(key);
                  if (typeof pendingRating === "number" && pendingRating > 0) {
                    newRatings[idStr] = {
                      ...entry,
                      rating: pendingRating,
                      item: { ...entry.item, userRating: pendingRating },
                    };
                  }
                }
              });

              return {
                favorites: updatedFavorites,
                watchlist: updatedWatchlist,
                ratings: newRatings,
                lastSyncedAt: {
                  ...state.lastSyncedAt,
                  collectionIds: Date.now(),
                },
              };
            });
          }
        } catch {}
      },

      syncAllFromTmdb: async (force = false) => {
        await Promise.allSettled([
          get().syncFavoritesFromTmdb(force),
          get().syncWatchlistFromTmdb(force),
          get().syncRatingsFromTmdb(force),
          get().syncCustomListsFromTmdb(force),
        ]);
      },

      reset: () => {
        set({
          favorites: [],
          watchlist: [],
          ratings: {},
          customLists: [],
          deletedListIds: [],
          lastSyncedAt: {},
        });
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("movie_trails_user_collections");
          } catch {}
        }
      },
    }),
    {
      name: "movie_trails_user_collections",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites.map((f) => ({
          id: f.id,
          title: f.title || "",
          mediaType: f.mediaType,
          isMovie: f.isMovie,
          posterImage: f.posterImage,
          backdropImage: f.backdropImage,
          rating: f.rating,
          userRating: f.userRating,
          releaseDate: f.releaseDate,
          genre: f.genre,
        })),
        watchlist: state.watchlist.map((w) => ({
          id: w.id,
          title: w.title || "",
          mediaType: w.mediaType,
          isMovie: w.isMovie,
          posterImage: w.posterImage,
          backdropImage: w.backdropImage,
          rating: w.rating,
          userRating: w.userRating,
          releaseDate: w.releaseDate,
          genre: w.genre,
        })),
        ratings: Object.fromEntries(
          Object.entries(state.ratings).map(([id, val]) => [
            id,
            {
              rating: val.rating,
              ratedAt: val.ratedAt,
              item: {
                id: val.item.id,
                title: val.item.title || "",
                mediaType: val.item.mediaType,
                isMovie: val.item.isMovie,
                posterImage: val.item.posterImage,
                backdropImage: val.item.backdropImage,
                rating: val.item.rating,
                userRating: val.rating,
                releaseDate: val.item.releaseDate,
                genre: val.item.genre,
              },
            },
          ])
        ),
        customLists: state.customLists || [],
        deletedListIds: state.deletedListIds,
        lastSyncedAt: state.lastSyncedAt || {},
      }),
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "movie_trails_user_collections" && event.newValue) {
      try {
        useUserCollectionsStore.persist?.rehydrate();
      } catch {}
    }
  });
}
