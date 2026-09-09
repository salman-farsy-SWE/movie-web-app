import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockUserLists, type UserList } from "@/data/mock-lists";
import { slugify } from "@/lib/utils";
import { operationQueue } from "@/lib/queue/operationQueue";
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

export interface UserCollectionsState {
  favorites: CollectionMediaItem[];
  watchlist: CollectionMediaItem[];
  ratings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }>;
  customLists: UserList[];
  deletedListIds: string[];

  // Favorites
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (item: CollectionMediaItem) => Promise<boolean>;
  setFavoriteStatus: (item: CollectionMediaItem, favorite: boolean) => void;
  removeFavorite: (id: string | number) => void;
  syncFavoritesFromTmdb: () => Promise<void>;

  // Watchlist
  isInWatchlist: (id: string | number) => boolean;
  toggleWatchlist: (item: CollectionMediaItem) => Promise<boolean>;
  setWatchlistStatus: (item: CollectionMediaItem, inWatchlist: boolean) => void;
  removeWatchlist: (id: string | number) => void;
  syncWatchlistFromTmdb: () => Promise<void>;

  // Ratings
  getUserRating: (id: string | number) => number | undefined;
  setUserRating: (item: CollectionMediaItem, rating: number) => Promise<void>;
  removeUserRating: (id: string | number, mediaType?: "movie" | "tv") => Promise<void>;
  syncRatingsFromTmdb: () => Promise<void>;

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
  syncCustomListsFromTmdb: () => Promise<void>;

  // Sync All
  // Sync All & Fast ID Sync
  syncCollectionIdsFromTmdb: () => Promise<void>;
  syncAllFromTmdb: () => Promise<void>;
}

export const useUserCollectionsStore = create<UserCollectionsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      watchlist: [],
      ratings: {},
      customLists: mockUserLists,
      deletedListIds: [],

      // ==========================================
      // Favorites (Coalesced & Sequenced)
      // ==========================================
      isFavorite: (id) => {
        const idStr = String(id);
        return get().favorites.some((item) => String(item.id) === idStr);
      },

      setFavoriteStatus: (item, favorite) => {
        const idStr = String(item.id);
        set((state) => {
          const exists = state.favorites.some((f) => String(f.id) === idStr);
          if (favorite && !exists) {
            return { favorites: [item, ...state.favorites] };
          }
          if (!favorite && exists) {
            return { favorites: state.favorites.filter((f) => String(f.id) !== idStr) };
          }
          return state;
        });
      },

      toggleFavorite: async (item) => {
        const idStr = String(item.id);
        const currentlyFavorited = get().isFavorite(item.id);
        const newFavoriteState = !currentlyFavorited;

        // 1. Instant Optimistic Local State Update
        set((state) => {
          if (currentlyFavorited) {
            return {
              favorites: state.favorites.filter((f) => String(f.id) !== idStr),
            };
          }
          return {
            favorites: [item, ...state.favorites],
          };
        });

        // 2. Coalesced and Sequenced TMDB Sync
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `fav:${mediaType}:${idStr}`;

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
                const isCurrentlyFav = state.favorites.some((f) => String(f.id) === idStr);
                if (isCurrentlyFav === failedValue) {
                  return {
                    favorites: failedValue
                      ? state.favorites.filter((f) => String(f.id) !== idStr)
                      : [item, ...state.favorites],
                  };
                }
                return state;
              });
            },
          })
          .catch(() => {});

        return newFavoriteState;
      },

      removeFavorite: (id) => {
        const idStr = String(id);
        const item = get().favorites.find((f) => String(f.id) === idStr);

        set((state) => ({
          favorites: state.favorites.filter((f) => String(f.id) !== idStr),
        }));

        if (item) {
          const mediaType: "movie" | "tv" =
            item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
          const key = `fav:${mediaType}:${idStr}`;

          operationQueue
            .syncState({
              key,
              desiredValue: false,
              syncFn: async () => {
                return await toggleTmdbFavoriteAction({
                  mediaId: id,
                  mediaType,
                  favorite: false,
                });
              },
            })
            .catch(() => {});
        }
      },

      syncFavoritesFromTmdb: async () => {
        try {
          const res = await syncTmdbFavoritesAction();
          if (res.success) {
            set((state) => {
              const tmdbMap = new Map<string, CollectionMediaItem>();
              res.favorites.forEach((item) => tmdbMap.set(String(item.id), item));
              // Preserve non-numeric local mock items if any
              state.favorites.forEach((item) => {
                if (isNaN(Number(item.id)) && !tmdbMap.has(String(item.id))) {
                  tmdbMap.set(String(item.id), item);
                }
              });
              return { favorites: Array.from(tmdbMap.values()) };
            });
          }
        } catch {}
      },

      // ==========================================
      // Watchlist (Coalesced & Sequenced)
      // ==========================================
      isInWatchlist: (id) => {
        const idStr = String(id);
        return get().watchlist.some((item) => String(item.id) === idStr);
      },

      setWatchlistStatus: (item, inWatchlist) => {
        const idStr = String(item.id);
        set((state) => {
          const exists = state.watchlist.some((w) => String(w.id) === idStr);
          if (inWatchlist && !exists) {
            return { watchlist: [item, ...state.watchlist] };
          }
          if (!inWatchlist && exists) {
            return { watchlist: state.watchlist.filter((w) => String(w.id) !== idStr) };
          }
          return state;
        });
      },

      toggleWatchlist: async (item) => {
        const idStr = String(item.id);
        const currentlyInWatchlist = get().isInWatchlist(item.id);
        const newWatchlistState = !currentlyInWatchlist;

        // 1. Instant Optimistic Local State Update
        set((state) => {
          if (currentlyInWatchlist) {
            return {
              watchlist: state.watchlist.filter((w) => String(w.id) !== idStr),
            };
          }
          return {
            watchlist: [item, ...state.watchlist],
          };
        });

        // 2. Coalesced and Sequenced TMDB Sync
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `wl:${mediaType}:${idStr}`;

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
                const isCurrentlyInWl = state.watchlist.some((w) => String(w.id) === idStr);
                if (isCurrentlyInWl === failedValue) {
                  return {
                    watchlist: failedValue
                      ? state.watchlist.filter((w) => String(w.id) !== idStr)
                      : [item, ...state.watchlist],
                  };
                }
                return state;
              });
            },
          })
          .catch(() => {});

        return newWatchlistState;
      },

      removeWatchlist: (id) => {
        const idStr = String(id);
        const item = get().watchlist.find((w) => String(w.id) === idStr);

        set((state) => ({
          watchlist: state.watchlist.filter((w) => String(w.id) !== idStr),
        }));

        if (item) {
          const mediaType: "movie" | "tv" =
            item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
          const key = `wl:${mediaType}:${idStr}`;

          operationQueue
            .syncState({
              key,
              desiredValue: false,
              syncFn: async () => {
                return await toggleTmdbWatchlistAction({
                  mediaId: id,
                  mediaType,
                  watchlist: false,
                });
              },
            })
            .catch(() => {});
        }
      },

      syncWatchlistFromTmdb: async () => {
        try {
          const res = await syncTmdbWatchlistAction();
          if (res.success) {
            set((state) => {
              const tmdbMap = new Map<string, CollectionMediaItem>();
              res.watchlist.forEach((item) => tmdbMap.set(String(item.id), item));
              // Preserve non-numeric local mock items if any
              state.watchlist.forEach((item) => {
                if (isNaN(Number(item.id)) && !tmdbMap.has(String(item.id))) {
                  tmdbMap.set(String(item.id), item);
                }
              });
              return { watchlist: Array.from(tmdbMap.values()) };
            });
          }
        } catch {}
      },

      // ==========================================
      // Ratings (Coalesced & Sequenced)
      // ==========================================
      getUserRating: (id) => {
        const idStr = String(id);
        return get().ratings[idStr]?.rating;
      },

      setUserRating: async (item, rating) => {
        const idStr = String(item.id);
        const prevRating = get().ratings[idStr];

        // 1. Instant Optimistic Local State Update
        const updatedItem: CollectionMediaItem = {
          ...item,
          userRating: rating,
        };
        set((state) => ({
          ratings: {
            ...state.ratings,
            [idStr]: {
              rating,
              item: updatedItem,
              ratedAt: new Date().toISOString(),
            },
          },
        }));

        // 2. Coalesced and Sequenced TMDB Sync
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `rate:${mediaType}:${idStr}`;

        operationQueue
          .syncState({
            key,
            desiredValue: rating,
            syncFn: async (val) => {
              return await setTmdbRatingAction({
                mediaId: item.id,
                mediaType,
                rating: val,
              });
            },
            onRollback: () => {
              set((state) => {
                const newRatings = { ...state.ratings };
                if (prevRating) {
                  newRatings[idStr] = prevRating;
                } else {
                  delete newRatings[idStr];
                }
                return { ratings: newRatings };
              });
            },
          })
          .catch(() => {});
      },

      removeUserRating: async (id, mediaType = "movie") => {
        const idStr = String(id);
        const prevRating = get().ratings[idStr];

        set((state) => {
          const newRatings = { ...state.ratings };
          delete newRatings[idStr];
          return { ratings: newRatings };
        });

        const targetMediaType: "movie" | "tv" =
          prevRating?.item?.mediaType === "tv" || prevRating?.item?.isMovie === false
            ? "tv"
            : (mediaType === "tv" ? "tv" : "movie");
        const key = `rate:${targetMediaType}:${idStr}`;

        operationQueue
          .enqueue(key, async () => {
            return await removeTmdbRatingAction({
              mediaId: id,
              mediaType: targetMediaType,
            });
          })
          .catch(() => {});
      },

      syncRatingsFromTmdb: async () => {
        try {
          const res = await syncTmdbRatingsAction();
          if (res.success) {
            set((state) => {
              const newRatings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }> = { ...res.ratings };
              // Preserve non-numeric local mock items if any
              Object.entries(state.ratings).forEach(([id, val]) => {
                if (isNaN(Number(id)) && !newRatings[id]) {
                  newRatings[id] = val;
                }
              });
              return { ratings: newRatings };
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
          tags: ["Custom List"],
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

        // 2. Creation Promise registered with OperationQueue and awaited
        const creationTask = (async () => {
          try {
            const res = await createTmdbListAction({ title, description, language, isPrivate });
            if (res.success && res.listId) {
              const tmdbIdStr = String(res.listId);
              const tmdbSlug = `list-${tmdbIdStr}`;

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
                  tags: ["TMDB List"],
                  isPrivate: res.list?.isPrivate !== undefined ? res.list.isPrivate : isPrivate,
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
          .catch((err) => {
            console.warn("Background TMDB list update error:", err);
          });

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

        // Cancel any pending queued operations for this list
        operationQueue.cancelListOperations(targetId);

        // 1. Permanent Local State Update
        set((state) => ({
          deletedListIds: Array.from(
            new Set([
              ...state.deletedListIds,
              String(targetId),
              String(listId),
              idStr,
              cleanIdStr,
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

        // 2. Sequenced TMDB Deletion
        operationQueue
          .enqueue(`list-del:${targetId}`, async () => {
            const resolvedId = await operationQueue.resolveListId(targetId);
            const tmdbDeleteId = String(resolvedId).replace(/^list-/, "");
            return await deleteTmdbListAction(tmdbDeleteId);
          })
          .catch((err) => {
            console.warn("Background TMDB list deletion:", err);
          });

        return true;
      },

      toggleListItem: async (listId, item) => {
        const idStr = String(listId);
        const cleanIdStr = idStr.replace(/^list-/, "");
        const itemIdStr = String(item.id);
        const itemTitleLower = item.title ? item.title.trim().toLowerCase() : "";

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
        const itemExists = existingItems.some(
          (i) =>
            String(i.id) === itemIdStr ||
            (itemTitleLower && i.title && i.title.trim().toLowerCase() === itemTitleLower)
        );
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
              updatedItems = (l.items || []).filter(
                (i) =>
                  String(i.id) !== itemIdStr &&
                  (!itemTitleLower || !i.title || i.title.trim().toLowerCase() !== itemTitleLower)
              );
            } else {
              updatedItems = [item, ...(l.items || [])];
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

        // 2. Sequenced TMDB Sync (with list resolution check)
        const mediaType: "movie" | "tv" =
          item.mediaType === "tv" || item.isMovie === false ? "tv" : "movie";
        const key = `list-item:${targetListId}:${item.id}`;

        operationQueue
          .enqueue(key, async () => {
            const resolvedListId = await operationQueue.resolveListId(targetListId);
            return await toggleTmdbListItemAction({
              listId: resolvedListId,
              mediaId: item.id,
              mediaType,
              inList,
            });
          })
          .catch((err) => {
            console.warn("Background TMDB toggle item:", err);
          });
      },

      addItemToList: async (listId, item) => {
        const itemIdStr = String(item.id);
        const itemTitleLower = item.title ? item.title.trim().toLowerCase() : "";
        const alreadyIn = get().isItemInList(listId, itemIdStr, itemTitleLower);
        if (!alreadyIn) {
          await get().toggleListItem(listId, item);
        }
      },

      removeItemFromList: async (listId, itemId, itemTitle) => {
        const itemIdStr = String(itemId);
        const itemTitleLower = itemTitle ? itemTitle.trim().toLowerCase() : "";
        const list = get().getListBySlugOrId(String(listId));
        if (!list) return;

        const targetItem = (list.items || []).find(
          (i) =>
            String(i.id) === itemIdStr ||
            (itemTitleLower && i.title && i.title.trim().toLowerCase() === itemTitleLower)
        ) || {
          id: itemId,
          title: itemTitle || "",
        };

        await get().toggleListItem(list.id, targetItem);
      },

      clearCustomList: async (listId) => {
        const idStr = String(listId);
        const list = get().getListBySlugOrId(idStr);

        if (!list) return;

        // 1. Immediately clear in store
        set((state) => ({
          customLists: state.customLists.map((l) => {
            if (l.id !== list.id) return l;
            return {
              ...l,
              items: [],
              itemCount: 0,
              posters: ["/assets/movie-placeholder.jpg"],
              backdrop: "/assets/movie-placeholder.jpg",
              updatedAt: "Just now",
            };
          }),
        }));

        // 2. Sequenced clear in TMDB
        const targetListId = list.id;
        operationQueue
          .enqueue(`list-clear:${targetListId}`, async () => {
            const resolvedListId = await operationQueue.resolveListId(targetListId);
            return await clearTmdbListAction(resolvedListId);
          })
          .catch((err) => {
            console.warn("Background TMDB clear list:", err);
          });
      },

      isItemInList: (listId, itemId, itemTitle) => {
        const idStr = String(listId);
        const itemIdStr = String(itemId);
        const itemTitleLower = itemTitle ? itemTitle.trim().toLowerCase() : "";

        const list = get().getListBySlugOrId(idStr);

        if (!list || !list.items) return false;
        return list.items.some(
          (i) =>
            String(i.id) === itemIdStr ||
            (itemTitleLower && i.title && i.title.trim().toLowerCase() === itemTitleLower)
        );
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

                const existingItems = l.items || [];
                const incomingItems = list.items || [];
                const mergedMap = new Map<string, CollectionMediaItem>();
                incomingItems.forEach((item) => mergedMap.set(String(item.id), item));
                existingItems.forEach((item) => {
                  const idKey = String(item.id);
                  if (!mergedMap.has(idKey)) {
                    mergedMap.set(idKey, item);
                  }
                });
                const mergedItems = Array.from(mergedMap.values());

                const newPosters = mergedItems
                  .map((i) => i.posterImage)
                  .filter(Boolean) as string[];

                return {
                  ...l,
                  id: list.id || l.id,
                  slug: list.slug || l.slug,
                  title: list.title || l.title,
                  description: list.description !== undefined ? list.description : l.description,
                  isPrivate: list.isPrivate !== undefined ? list.isPrivate : (l.isPrivate ?? false),
                  language: list.language || l.language || "en",
                  items: mergedItems,
                  itemCount: mergedItems.length,
                  posters: newPosters.length > 0 ? newPosters.slice(0, 4) : (list.posters || l.posters),
                  backdrop: mergedItems[0]?.backdropImage || list.backdrop || l.backdrop,
                };
              }),
            };
          } else {
            return {
              customLists: [list, ...state.customLists],
            };
          }
        });
      },

      syncCustomListsFromTmdb: async () => {
        try {
          const res = await syncTmdbListsAction();
          if (res.success) {
            set((state) => {
              const deletedSet = new Set(state.deletedListIds || []);
              const listMap = new Map<string, UserList>();

              const filteredTmdbLists = res.lists.filter(
                (l) =>
                  !deletedSet.has(String(l.id)) &&
                  !deletedSet.has(l.slug) &&
                  !deletedSet.has(String(l.id).replace(/^list-/, ""))
              );

              const tmdbListIdSet = new Set(
                filteredTmdbLists.flatMap((l) => [
                  String(l.id),
                  String(l.id).replace(/^list-/, ""),
                  `list-${String(l.id).replace(/^list-/, "")}`,
                  l.slug,
                ])
              );

              // Track local list IDs that were reconciled into TMDB lists
              const reconciledLocalIds = new Set<string>();

              filteredTmdbLists.forEach((l) => {
                const lTitleLower = l.title.trim().toLowerCase();
                const existing = state.customLists.find(
                  (prev) =>
                    String(prev.id) === String(l.id) ||
                    prev.slug === l.slug ||
                    (String(prev.id).startsWith("custom-list-") &&
                      prev.title.trim().toLowerCase() === lTitleLower)
                );

                if (existing && String(existing.id).startsWith("custom-list-")) {
                  reconciledLocalIds.add(String(existing.id));
                }

                const tmdbItems = l.items || [];
                const existingTvItems = (existing?.items || []).filter(
                  (item) => item.mediaType === "tv" || item.isMovie === false
                );

                const mergedMap = new Map<string, CollectionMediaItem>();
                tmdbItems.forEach((item) => mergedMap.set(String(item.id), item));
                existingTvItems.forEach((item) => {
                  const idKey = String(item.id);
                  if (!mergedMap.has(idKey)) {
                    mergedMap.set(idKey, item);
                  }
                });
                const mergedItems = Array.from(mergedMap.values());

                const newPosters = mergedItems
                  .map((i) => i.posterImage)
                  .filter(Boolean) as string[];

                listMap.set(String(l.id), {
                  ...l,
                  title: l.title || existing?.title || "Untitled List",
                  description:
                    l.description !== undefined
                      ? l.description
                      : (existing?.description || ""),
                  isPrivate:
                    l.isPrivate !== undefined
                      ? l.isPrivate
                      : (existing?.isPrivate ?? false),
                  language: l.language || existing?.language || "en",
                  items: mergedItems,
                  itemCount: mergedItems.length,
                  posters:
                    newPosters.length > 0
                      ? newPosters.slice(0, 4)
                      : (l.posters && l.posters.length > 0 ? l.posters : ["/assets/movie-placeholder.jpg"]),
                  backdrop:
                    mergedItems[0]?.backdropImage ||
                    l.backdrop ||
                    existing?.backdrop ||
                    "/assets/movie-placeholder.jpg",
                });
              });

              const newlyDeletedTmdbIds: string[] = [];

              state.customLists.forEach((l) => {
                const lId = String(l.id);
                const lCleanId = lId.replace(/^list-/, "");
                const isDeleted =
                  deletedSet.has(lId) ||
                  deletedSet.has(lCleanId) ||
                  deletedSet.has(l.slug);

                if (isDeleted) return;

                const isMockList = /^list-[1-8]$/.test(lId) || /^[1-8]$/.test(lId);
                const isLocalOnly = lId.startsWith("custom-list-");

                if (isLocalOnly) {
                  // If this local list was already reconciled into a TMDB list, or if a TMDB list has the same title, skip it
                  const lTitleLower = l.title.trim().toLowerCase();
                  const matchesTmdbList =
                    reconciledLocalIds.has(lId) ||
                    filteredTmdbLists.some(
                      (tmdbList) => tmdbList.title.trim().toLowerCase() === lTitleLower
                    );

                  if (!matchesTmdbList && !listMap.has(lId)) {
                    listMap.set(lId, l);
                  }
                } else if (isMockList) {
                  if (!listMap.has(lId)) {
                    listMap.set(lId, l);
                  }
                } else {
                  if (!tmdbListIdSet.has(lId) && !tmdbListIdSet.has(lCleanId)) {
                    newlyDeletedTmdbIds.push(lId, lCleanId, l.slug);
                  }
                }
              });

              return {
                customLists: Array.from(listMap.values()),
                deletedListIds:
                  newlyDeletedTmdbIds.length > 0
                    ? Array.from(
                        new Set([...state.deletedListIds, ...newlyDeletedTmdbIds])
                      )
                    : state.deletedListIds,
              };
            });
          }
        } catch (error) {
          console.error("Failed to sync custom lists from TMDB:", error);
        }
      },

      syncCollectionIdsFromTmdb: async () => {
        try {
          const res = await syncTmdbCollectionIdsAction();
          if (res.success) {
            set((state) => {
              const currentFavMap = new Map<string, CollectionMediaItem>();
              state.favorites.forEach((f) => currentFavMap.set(String(f.id), f));
              const newFavorites: CollectionMediaItem[] = [];
              res.favoriteIds.forEach((id) => {
                const idStr = String(id);
                if (currentFavMap.has(idStr)) {
                  newFavorites.push(currentFavMap.get(idStr)!);
                } else {
                  newFavorites.push({ id: Number(id) || id, title: "" });
                }
              });
              // Preserve non-numeric local mock items if any
              state.favorites.forEach((item) => {
                if (isNaN(Number(item.id)) && !newFavorites.some((f) => String(f.id) === String(item.id))) {
                  newFavorites.push(item);
                }
              });

              const currentWlMap = new Map<string, CollectionMediaItem>();
              state.watchlist.forEach((w) => currentWlMap.set(String(w.id), w));
              const newWatchlist: CollectionMediaItem[] = [];
              res.watchlistIds.forEach((id) => {
                const idStr = String(id);
                if (currentWlMap.has(idStr)) {
                  newWatchlist.push(currentWlMap.get(idStr)!);
                } else {
                  newWatchlist.push({ id: Number(id) || id, title: "" });
                }
              });
              // Preserve non-numeric local mock items if any
              state.watchlist.forEach((item) => {
                if (isNaN(Number(item.id)) && !newWatchlist.some((w) => String(w.id) === String(item.id))) {
                  newWatchlist.push(item);
                }
              });

              const newRatings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }> = { ...state.ratings };
              Object.entries(res.ratedMap).forEach(([idStr, info]) => {
                const existing = state.ratings[idStr];
                newRatings[idStr] = {
                  rating: info.rating,
                  item: existing?.item || {
                    id: Number(idStr) || idStr,
                    title: info.title || "",
                    mediaType: info.mediaType || "movie",
                    isMovie: info.mediaType !== "tv",
                    userRating: info.rating,
                  },
                  ratedAt: existing?.ratedAt || new Date().toISOString(),
                };
              });

              return {
                favorites: newFavorites,
                watchlist: newWatchlist,
                ratings: newRatings,
              };
            });
          }
        } catch (error) {
          console.error("Failed to sync collection IDs from TMDB:", error);
        }
      },

      syncAllFromTmdb: async () => {
        await Promise.allSettled([
          get().syncFavoritesFromTmdb(),
          get().syncWatchlistFromTmdb(),
          get().syncRatingsFromTmdb(),
          get().syncCollectionIdsFromTmdb(),
          get().syncCustomListsFromTmdb(),
        ]);
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
        })),
        watchlist: state.watchlist.map((w) => ({
          id: w.id,
          title: w.title || "",
          mediaType: w.mediaType,
          isMovie: w.isMovie,
          posterImage: w.posterImage,
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
                userRating: val.rating,
              },
            },
          ])
        ),
        customLists: state.customLists,
        deletedListIds: state.deletedListIds,
      }),
    }
  )
);
