"use server";

import { cookies } from "next/headers";
import {
  getAccountDetails,
  markAsFavorite,
  markAsWatchlist,
  getAccountStates,
  getAccountFavorites,
  getAccountWatchlist,
  getAccountRated,
  setMediaRating,
  deleteMediaRating,
  getAccountLists,
  getListDetails,
  createList,
  updateList,
  deleteList,
  clearList,
  addMediaToList,
  removeMediaFromList,
  getAccountSummaryCounts,
  type TmdbAccountStates,
  type TmdbMediaResult,
  type TmdbAccountStats,
  type TmdbListDetailsResponse,
} from "@/lib/tmdb/auth";
import { getTmdbImageUrl } from "@/lib/tmdb/tmdb";
import type { CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import type { UserList } from "@/types";

const SESSION_COOKIE_NAME = "tmdb_session_id";

function mapTmdbResultToCollectionItem(
  m: TmdbMediaResult,
  isMovie: boolean
): CollectionMediaItem {
  return {
    id: m.id,
    title: m.title || m.original_title || m.name || m.original_name || "",
    posterImage: getTmdbImageUrl(m.poster_path, "w500"),
    backdropImage: getTmdbImageUrl(m.backdrop_path, "original"),
    rating: m.vote_average ?? 0,
    userRating: m.rating,
    releaseDate: isMovie ? (m.release_date || "") : (m.first_air_date || ""),
    isMovie,
    mediaType: isMovie ? "movie" : "tv",
  };
}

async function fetchAllTmdbPages(
  fetchFn: (page: number) => Promise<{ results: TmdbMediaResult[]; total_pages: number }>
): Promise<TmdbMediaResult[]> {
  try {
    const firstPage = await fetchFn(1);
    const items = [...(firstPage.results || [])];
    const maxPages = Math.min(firstPage.total_pages || 1, 50);
    if (maxPages > 1) {
      const promises = [];
      for (let p = 2; p <= maxPages; p++) {
        promises.push(fetchFn(p));
      }
      const remainingPages = await Promise.all(promises);
      for (const res of remainingPages) {
        if (res?.results) {
          items.push(...res.results);
        }
      }
    }
    return items;
  } catch {
    return [];
  }
}

/**
 * Server action to toggle a favorite in TMDB for the logged-in session.
 */
export async function toggleTmdbFavoriteAction({
  mediaId,
  mediaType = "movie",
  favorite,
}: {
  mediaId: string | number;
  mediaType?: "movie" | "tv";
  favorite: boolean;
}): Promise<{ success: boolean; favorite: boolean; isTmdbSynced: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const numericId = Math.floor(Number(mediaId));
    if (isNaN(numericId) || numericId <= 0) {
      return { success: true, favorite, isTmdbSynced: false };
    }

    if (!sessionId) {
      return { success: false, favorite: !favorite, isTmdbSynced: false, error: "Authentication required" };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, favorite: !favorite, isTmdbSynced: false, error: "Authentication required" };
    }

    const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
    await markAsFavorite(sessionId, account.id, validMediaType, numericId, favorite);
    return { success: true, favorite, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update favorite in TMDB.";
    return { success: false, favorite: !favorite, isTmdbSynced: false, error: message };
  }
}

/**
 * Server action to toggle watchlist in TMDB for the logged-in session.
 */
export async function toggleTmdbWatchlistAction({
  mediaId,
  mediaType = "movie",
  watchlist,
}: {
  mediaId: string | number;
  mediaType?: "movie" | "tv";
  watchlist: boolean;
}): Promise<{ success: boolean; watchlist: boolean; isTmdbSynced: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const numericId = Math.floor(Number(mediaId));
    if (isNaN(numericId) || numericId <= 0) {
      return { success: true, watchlist, isTmdbSynced: false };
    }

    if (!sessionId) {
      return { success: false, watchlist: !watchlist, isTmdbSynced: false, error: "Authentication required" };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, watchlist: !watchlist, isTmdbSynced: false, error: "Authentication required" };
    }

    const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
    await markAsWatchlist(sessionId, account.id, validMediaType, numericId, watchlist);
    return { success: true, watchlist, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update watchlist in TMDB.";
    return { success: false, watchlist: !watchlist, isTmdbSynced: false, error: message };
  }
}

/**
 * Server action to set a user rating in TMDB.
 */
export async function setTmdbRatingAction({
  mediaId,
  mediaType = "movie",
  rating,
}: {
  mediaId: string | number;
  mediaType?: "movie" | "tv";
  rating: number;
}): Promise<{ success: boolean; isTmdbSynced: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const numericId = Math.floor(Number(mediaId));
    if (isNaN(numericId) || numericId <= 0) {
      return { success: false, isTmdbSynced: false, error: "Invalid media ID" };
    }

    if (!sessionId) {
      return { success: false, isTmdbSynced: false, error: "Authentication required" };
    }

    const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
    await setMediaRating(sessionId, validMediaType, numericId, rating);
    return { success: true, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to set rating in TMDB.";
    return { success: false, isTmdbSynced: false, error: message };
  }
}

/**
 * Server action to remove a user rating in TMDB.
 */
export async function removeTmdbRatingAction({
  mediaId,
  mediaType = "movie",
}: {
  mediaId: string | number;
  mediaType?: "movie" | "tv";
}): Promise<{ success: boolean; isTmdbSynced: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const numericId = Math.floor(Number(mediaId));
    if (isNaN(numericId) || numericId <= 0) {
      return { success: false, isTmdbSynced: false, error: "Invalid media ID" };
    }

    if (!sessionId) {
      return { success: false, isTmdbSynced: false, error: "Authentication required" };
    }

    const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
    const res = await deleteMediaRating(sessionId, validMediaType, numericId);
    return { success: res.success, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove rating in TMDB.";
    return { success: false, isTmdbSynced: false, error: message };
  }
}

/**
 * Server action to get TMDB account states (is favorite, user rating, in watchlist).
 */
export async function getTmdbAccountStateAction(
  mediaId: string | number,
  mediaType: "movie" | "tv" = "movie"
): Promise<TmdbAccountStates | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const numericId = Math.floor(Number(mediaId));
    if (!sessionId || isNaN(numericId) || numericId <= 0) {
      return null;
    }

    const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
    return await getAccountStates(sessionId, validMediaType, numericId);
  } catch {
    return null;
  }
}

/**
 * Server action to fetch all TMDB favorites for the authenticated user.
 */
export async function syncTmdbFavoritesAction(): Promise<{
  success: boolean;
  favorites: CollectionMediaItem[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, favorites: [] };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, favorites: [] };
    }

    const [movieResults, tvResults] = await Promise.all([
      fetchAllTmdbPages((page) => getAccountFavorites(sessionId, account.id, "movie", page)),
      fetchAllTmdbPages((page) => getAccountFavorites(sessionId, account.id, "tv", page)),
    ]);

    const movieItems = movieResults.map((m) =>
      mapTmdbResultToCollectionItem(m, true)
    );
    const tvItems = tvResults.map((t) =>
      mapTmdbResultToCollectionItem(t, false)
    );

    return {
      success: true,
      favorites: [...movieItems, ...tvItems],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync TMDB favorites.";
    return { success: false, favorites: [], error: message };
  }
}

/**
 * Server action to fetch all TMDB watchlist items for the authenticated user.
 */
export async function syncTmdbWatchlistAction(): Promise<{
  success: boolean;
  watchlist: CollectionMediaItem[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, watchlist: [] };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, watchlist: [] };
    }

    const [movieResults, tvResults] = await Promise.all([
      fetchAllTmdbPages((page) => getAccountWatchlist(sessionId, account.id, "movie", page)),
      fetchAllTmdbPages((page) => getAccountWatchlist(sessionId, account.id, "tv", page)),
    ]);

    const movieItems = movieResults.map((m) =>
      mapTmdbResultToCollectionItem(m, true)
    );
    const tvItems = tvResults.map((t) =>
      mapTmdbResultToCollectionItem(t, false)
    );

    return {
      success: true,
      watchlist: [...movieItems, ...tvItems],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync TMDB watchlist.";
    return { success: false, watchlist: [], error: message };
  }
}

/**
 * Server action to fetch all TMDB rated items for the authenticated user.
 */
export async function syncTmdbRatingsAction(): Promise<{
  success: boolean;
  ratings: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }>;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, ratings: {} };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, ratings: {} };
    }

    const [movieResults, tvResults] = await Promise.all([
      fetchAllTmdbPages((page) => getAccountRated(sessionId, account.id, "movie", page)),
      fetchAllTmdbPages((page) => getAccountRated(sessionId, account.id, "tv", page)),
    ]);

    const ratingsMap: Record<string, { rating: number; item: CollectionMediaItem; ratedAt: string }> = {};

    movieResults.forEach((m) => {
      const item = mapTmdbResultToCollectionItem(m, true);
      const userRating = m.rating ?? m.vote_average ?? 0;
      ratingsMap[String(m.id)] = {
        rating: userRating,
        item: { ...item, userRating },
        ratedAt: new Date().toISOString(),
      };
    });

    tvResults.forEach((t) => {
      const item = mapTmdbResultToCollectionItem(t, false);
      const userRating = t.rating ?? t.vote_average ?? 0;
      ratingsMap[String(t.id)] = {
        rating: userRating,
        item: { ...item, userRating },
        ratedAt: new Date().toISOString(),
      };
    });

    return {
      success: true,
      ratings: ratingsMap,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync TMDB ratings.";
    return { success: false, ratings: {}, error: message };
  }
}

/**
 * Server action to fetch all lists created by the user on TMDB.
 */
export async function syncTmdbListsAction(): Promise<{
  success: boolean;
  lists: UserList[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, lists: [] };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, lists: [] };
    }

    const firstListsRes = await getAccountLists(sessionId, account.id, 1);
    const listMapById = new Map<string, (typeof firstListsRes.results)[0]>();
    (firstListsRes.results || []).forEach((l) => listMapById.set(String(l.id), l));

    const totalListPages = Math.min(firstListsRes.total_pages || 1, 50);
    if (totalListPages > 1) {
      const listPromises = [];
      for (let p = 2; p <= totalListPages; p++) {
        listPromises.push(getAccountLists(sessionId, account.id, p));
      }
      const restPages = await Promise.all(listPromises);
      for (const res of restPages) {
        if (res?.results) {
          res.results.forEach((l) => {
            if (!listMapById.has(String(l.id))) {
              listMapById.set(String(l.id), l);
            }
          });
        }
      }
    }

    const allListResults = Array.from(listMapById.values());

    const tmdbLists: UserList[] = await Promise.all(
      allListResults.map(async (l) => {
        let details: TmdbListDetailsResponse | null = null;
        try {
          details = await getListDetails(l.id, sessionId);
        } catch {}

        const rawItems = details?.items || [];
        const items = rawItems.map((item) => {
          const isTvItem =
            item.media_type === "tv" ||
            (!item.title && Boolean(item.name || item.first_air_date));
          return mapTmdbResultToCollectionItem(item, !isTvItem);
        });

        const posters = items
          .map((i) => i.posterImage)
          .filter(Boolean) as string[];

        const detailsBackdrop = details?.backdrop_path || null;
        const mostRecentItem = items[0];
        const coverBackdrop =
          mostRecentItem?.backdropImage ||
          getTmdbImageUrl(detailsBackdrop || l.backdrop_path, "original") ||
          (l.poster_path ? getTmdbImageUrl(l.poster_path, "w500") : null) ||
          "/assets/movie-placeholder.jpg";

        const isPrivate =
          details?.public !== undefined
            ? !details.public
            : (l.list_type === "private" ? true : false);
        const listTitle = details?.name || l.name || "Untitled List";
        const listDescription = details?.description || l.description || "";
        const listLanguage = details?.iso_639_1 || l.iso_639_1 || "en";

        const computedPosters =
          posters.length > 0
            ? posters.slice(0, 4)
            : l.poster_path
            ? [getTmdbImageUrl(l.poster_path, "w500") || "/assets/movie-placeholder.jpg"]
            : ["/assets/movie-placeholder.jpg"];

        return {
          id: String(l.id),
          slug: `list-${l.id}`,
          title: listTitle,
          description: listDescription,
          curator: {
            name: details?.created_by || account.name || account.username || "User",
            handle: `@${account.username || "user"}`,
            avatar: "/assets/persons-image.jpg",
          },
          itemCount: details?.item_count ?? (l.item_count ?? items.length),
          runtime: "—",
          likesCount: details?.favorite_count || l.favorite_count || 0,
          viewsCount: "1",
          rating: 4.8,
          tags: ["TMDB List"],
          backdrop: coverBackdrop,
          posters: computedPosters,
          items,
          isPrivate,
          language: listLanguage,
          updatedAt: "Synced from TMDB",
        };
      })
    );

    return {
      success: true,
      lists: tmdbLists,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync TMDB lists.";
    return { success: false, lists: [], error: message };
  }
}

/**
 * Server action to get TMDB list details and items.
 */
export async function getTmdbListDetailsAction(listId: string | number): Promise<{
  success: boolean;
  list?: UserList;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const details = await getListDetails(listId, sessionId);
    if (!details) {
      return { success: false, error: "List not found on TMDB" };
    }

    const items = (details.items || []).map((item) => {
      const isTvItem =
        item.media_type === "tv" ||
        (!item.title && Boolean(item.name || item.first_air_date));
      return mapTmdbResultToCollectionItem(item, !isTvItem);
    });
    const posters = items
      .map((i) => i.posterImage)
      .filter(Boolean) as string[];

    const mostRecentItem = items[0];
    const coverBackdrop =
      mostRecentItem?.backdropImage ||
      getTmdbImageUrl(details.backdrop_path, "original") ||
      "/assets/movie-placeholder.jpg";

    const isPrivate =
      details.public !== undefined ? !details.public : false;

    const userList: UserList = {
      id: String(details.id),
      slug: `list-${details.id}`,
      title: details.name,
      description: details.description || "",
      curator: {
        name: details.created_by || "User",
        handle: `@${details.created_by || "user"}`,
      },
      itemCount: details.item_count ?? items.length,
      runtime: "—",
      likesCount: details.favorite_count || 0,
      tags: [],
      backdrop: coverBackdrop,
      posters: posters.slice(0, 4),
      items,
      isPrivate,
      language: details.iso_639_1 || "en",
      updatedAt: "Synced from TMDB",
    };

    return { success: true, list: userList };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch list details.";
    return { success: false, error: message };
  }
}

/**
 * Server action to create a new list in TMDB (or local custom list if unauthenticated).
 */
export async function createTmdbListAction({
  title,
  description = "",
  language = "en",
  isPrivate = false,
}: {
  title: string;
  description?: string;
  language?: string;
  isPrivate?: boolean;
}): Promise<{ success: boolean; listId?: string | number; list?: UserList; isTmdbSynced?: boolean; error?: string }> {
  try {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      return { success: false, error: "List title is required." };
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, error: "Authentication required" };
    }

    const res = await createList(sessionId, cleanTitle, description.trim(), language, isPrivate);
    if (!res.success || !res.list_id) {
      return { success: false, error: res.status_message || "Failed to create list on TMDB." };
    }

    let curatorName = "User";
    let curatorHandle = "@user";
    try {
      const account = await getAccountDetails(sessionId);
      if (account) {
        curatorName = account.name || account.username || "User";
        curatorHandle = `@${account.username || "user"}`;
      }
    } catch {}

    const list: UserList = {
      id: String(res.list_id),
      slug: `list-${res.list_id}`,
      title: cleanTitle,
      description: description.trim(),
      curator: {
        name: curatorName,
        handle: curatorHandle,
        avatar: "/assets/persons-image.jpg",
      },
      itemCount: 0,
      runtime: "0m",
      likesCount: 0,
      viewsCount: "1",
      tags: ["TMDB List"],
      backdrop: "/assets/movie-placeholder.jpg",
      posters: [],
      items: [],
      isPrivate,
      language,
      updatedAt: "Just now",
    };

    return { success: true, listId: res.list_id, list, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create list on TMDB.";
    return { success: false, error: message };
  }
}

/**
 * Server action to update a list's details in TMDB / store.
 */
export async function updateTmdbListAction({
  listId,
  title,
  description,
  language,
  isPrivate,
}: {
  listId: string | number;
  title?: string;
  description?: string;
  language?: string;
  isPrivate?: boolean;
}): Promise<{ success: boolean; isTmdbSynced?: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const cleanListId = String(listId).replace(/^list-/, "").trim();

    if (!sessionId) {
      return { success: false, isTmdbSynced: false, error: "Authentication required" };
    }
    if (isNaN(Number(cleanListId)) || String(listId).startsWith("custom-list-")) {
      return { success: false, isTmdbSynced: false, error: "Invalid list ID" };
    }

    let listTitle = title?.trim();
    let listDesc = description?.trim();
    let listLang = language;
    let listPrivate = isPrivate;

    if (!listTitle || listDesc === undefined || !listLang || listPrivate === undefined) {
      const current = await getListDetails(cleanListId, sessionId);
      if (current) {
        if (!listTitle) listTitle = current.name;
        if (listDesc === undefined) listDesc = current.description || "";
        if (!listLang) listLang = current.iso_639_1 || "en";
        if (listPrivate === undefined) {
          listPrivate = current.public !== undefined ? !current.public : false;
        }
      }
    }

    const res = await updateList(
      sessionId,
      cleanListId,
      listTitle || "",
      listDesc || "",
      listPrivate ?? false,
      listLang || "en"
    );

    return { success: res.success, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update list in TMDB.";
    return { success: false, error: message };
  }
}

/**
 * Server action to clear all items from a list in TMDB.
 */
export async function clearTmdbListAction(
  listId: string | number
): Promise<{ success: boolean; isTmdbSynced?: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const cleanListId = String(listId).replace(/^list-/, "").trim();

    if (!sessionId) {
      return { success: false, isTmdbSynced: false, error: "Authentication required" };
    }
    if (isNaN(Number(cleanListId)) || String(listId).startsWith("custom-list-")) {
      return { success: false, isTmdbSynced: false, error: "Invalid list ID" };
    }

    const res = await clearList(sessionId, cleanListId);
    return { success: res.success, isTmdbSynced: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear list in TMDB.";
    return { success: false, error: message };
  }
}

/**
 * Server action to delete a list from TMDB.
 */
export async function deleteTmdbListAction(
  listId: string | number
): Promise<{ success: boolean; isTmdbSynced?: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, isTmdbSynced: false, error: "Authentication required" };
    }

    const idStr = String(listId);
    if (
      idStr.startsWith("custom-list-") ||
      /^list-[1-9]$/.test(idStr) ||
      /^[1-9]$/.test(idStr)
    ) {
      return { success: true, isTmdbSynced: false };
    }

    const cleanListId = idStr.replace(/^list-/, "").trim();
    if (isNaN(Number(cleanListId))) {
      return { success: false, isTmdbSynced: false, error: "Invalid list ID" };
    }

    const res = await deleteList(sessionId, cleanListId);
    return { success: true, isTmdbSynced: res.success };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete list from TMDB.";
    return { success: false, isTmdbSynced: false, error: message };
  }
}

/**
 * Server action to add or remove an item in a TMDB list.
 */
export async function toggleTmdbListItemAction({
  listId,
  mediaId,
  mediaType = "movie",
  inList,
}: {
  listId: string | number;
  mediaId: string | number;
  mediaType?: "movie" | "tv";
  inList: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { success: false, error: "Authentication required" };
    }

    const cleanListId = String(listId).replace(/^list-/, "").trim();
    const numericMediaId = Math.floor(Number(mediaId));
    const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";

    if (isNaN(numericMediaId) || numericMediaId <= 0 || isNaN(Number(cleanListId))) {
      return { success: false, error: "Invalid parameters" };
    }

    if (inList) {
      await addMediaToList(sessionId, cleanListId, numericMediaId, validMediaType);
    } else {
      await removeMediaFromList(sessionId, cleanListId, numericMediaId, validMediaType);
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update list item in TMDB.";
    return { success: false, error: message };
  }
}

/**
 * Server action to get real summary statistics for account (favorites, watchlist, ratings, lists).
 */
export async function getTmdbAccountStatsAction(): Promise<TmdbAccountStats | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) return null;

    const account = await getAccountDetails(sessionId);
    if (!account?.id) return null;

    return await getAccountSummaryCounts(sessionId, account.id);
  } catch {
    return null;
  }
}

/**
 * Server action to fetch paginated favorites from TMDB.
 */
export async function getPaginatedFavoritesAction({
  page = 1,
  mediaType = "all",
  sortBy = "created_at.desc",
}: {
  page?: number;
  mediaType?: "movie" | "tv" | "all";
  sortBy?: string;
}): Promise<{
  success: boolean;
  results: CollectionMediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) {
      return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: "Not authenticated" };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: "Account not found" };
    }

    if (mediaType === "movie" || mediaType === "tv") {
      const res = await getAccountFavorites(sessionId, account.id, mediaType, page, sortBy);
      return {
        success: true,
        results: (res.results || []).map((m) => mapTmdbResultToCollectionItem(m, mediaType === "movie")),
        page,
        totalPages: res.total_pages || 1,
        totalResults: res.total_results || 0,
      };
    }

    const [movieRes, tvRes] = await Promise.all([
      getAccountFavorites(sessionId, account.id, "movie", page, sortBy),
      getAccountFavorites(sessionId, account.id, "tv", page, sortBy),
    ]);

    const movieItems = (movieRes.results || []).map((m) => mapTmdbResultToCollectionItem(m, true));
    const tvItems = (tvRes.results || []).map((t) => mapTmdbResultToCollectionItem(t, false));
    const totalPages = Math.max(movieRes.total_pages || 1, tvRes.total_pages || 1);
    const totalResults = (movieRes.total_results || 0) + (tvRes.total_results || 0);

    return {
      success: true,
      results: [...movieItems, ...tvItems],
      page,
      totalPages,
      totalResults,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch paginated favorites.";
    return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: message };
  }
}

/**
 * Server action to fetch paginated watchlist from TMDB.
 */
export async function getPaginatedWatchlistAction({
  page = 1,
  mediaType = "all",
  sortBy = "created_at.desc",
}: {
  page?: number;
  mediaType?: "movie" | "tv" | "all";
  sortBy?: string;
}): Promise<{
  success: boolean;
  results: CollectionMediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) {
      return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: "Not authenticated" };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: "Account not found" };
    }

    if (mediaType === "movie" || mediaType === "tv") {
      const res = await getAccountWatchlist(sessionId, account.id, mediaType, page, sortBy);
      return {
        success: true,
        results: (res.results || []).map((m) => mapTmdbResultToCollectionItem(m, mediaType === "movie")),
        page,
        totalPages: res.total_pages || 1,
        totalResults: res.total_results || 0,
      };
    }

    const [movieRes, tvRes] = await Promise.all([
      getAccountWatchlist(sessionId, account.id, "movie", page, sortBy),
      getAccountWatchlist(sessionId, account.id, "tv", page, sortBy),
    ]);

    const movieItems = (movieRes.results || []).map((m) => mapTmdbResultToCollectionItem(m, true));
    const tvItems = (tvRes.results || []).map((t) => mapTmdbResultToCollectionItem(t, false));
    const totalPages = Math.max(movieRes.total_pages || 1, tvRes.total_pages || 1);
    const totalResults = (movieRes.total_results || 0) + (tvRes.total_results || 0);

    return {
      success: true,
      results: [...movieItems, ...tvItems],
      page,
      totalPages,
      totalResults,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch paginated watchlist.";
    return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: message };
  }
}

/**
 * Server action to fetch paginated ratings from TMDB.
 */
export async function getPaginatedRatingsAction({
  page = 1,
  mediaType = "all",
  sortBy = "created_at.desc",
}: {
  page?: number;
  mediaType?: "movie" | "tv" | "all";
  sortBy?: string;
}): Promise<{
  success: boolean;
  results: CollectionMediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) {
      return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: "Not authenticated" };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: "Account not found" };
    }

    if (mediaType === "movie" || mediaType === "tv") {
      const res = await getAccountRated(sessionId, account.id, mediaType, page, sortBy);
      return {
        success: true,
        results: (res.results || []).map((m) => mapTmdbResultToCollectionItem(m, mediaType === "movie")),
        page,
        totalPages: res.total_pages || 1,
        totalResults: res.total_results || 0,
      };
    }

    const [movieRes, tvRes] = await Promise.all([
      getAccountRated(sessionId, account.id, "movie", page, sortBy),
      getAccountRated(sessionId, account.id, "tv", page, sortBy),
    ]);

    const movieItems = (movieRes.results || []).map((m) => mapTmdbResultToCollectionItem(m, true));
    const tvItems = (tvRes.results || []).map((t) => mapTmdbResultToCollectionItem(t, false));
    const totalPages = Math.max(movieRes.total_pages || 1, tvRes.total_pages || 1);
    const totalResults = (movieRes.total_results || 0) + (tvRes.total_results || 0);

    return {
      success: true,
      results: [...movieItems, ...tvItems],
      page,
      totalPages,
      totalResults,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch paginated ratings.";
    return { success: false, results: [], page: 1, totalPages: 1, totalResults: 0, error: message };
  }
}

/**
 * Server action to fetch lightweight collection IDs and rating mappings from TMDB.
 * This is extremely fast and uses very minimal memory (under 10KB total).
 */
export async function syncTmdbCollectionIdsAction(): Promise<{
  success: boolean;
  favoriteIds: (number | string)[];
  watchlistIds: (number | string)[];
  ratedMap: Record<string, { rating: number; mediaType?: "movie" | "tv"; title?: string }>;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) {
      return { success: false, favoriteIds: [], watchlistIds: [], ratedMap: {} };
    }

    const account = await getAccountDetails(sessionId);
    if (!account?.id) {
      return { success: false, favoriteIds: [], watchlistIds: [], ratedMap: {} };
    }

    const [favMovies, favTv, wlMovies, wlTv, rateMovies, rateTv] = await Promise.all([
      fetchAllTmdbPages((p) => getAccountFavorites(sessionId, account.id, "movie", p)),
      fetchAllTmdbPages((p) => getAccountFavorites(sessionId, account.id, "tv", p)),
      fetchAllTmdbPages((p) => getAccountWatchlist(sessionId, account.id, "movie", p)),
      fetchAllTmdbPages((p) => getAccountWatchlist(sessionId, account.id, "tv", p)),
      fetchAllTmdbPages((p) => getAccountRated(sessionId, account.id, "movie", p)),
      fetchAllTmdbPages((p) => getAccountRated(sessionId, account.id, "tv", p)),
    ]);

    const favoriteIds: (number | string)[] = [
      ...favMovies.map((m) => m.id),
      ...favTv.map((t) => t.id),
    ];

    const watchlistIds: (number | string)[] = [
      ...wlMovies.map((m) => m.id),
      ...wlTv.map((t) => t.id),
    ];

    const ratedMap: Record<string, { rating: number; mediaType?: "movie" | "tv"; title?: string }> = {};
    rateMovies.forEach((m) => {
      if (m.id) {
        ratedMap[String(m.id)] = {
          rating: m.rating ?? m.vote_average ?? 0,
          mediaType: "movie",
          title: m.title || m.original_title,
        };
      }
    });
    rateTv.forEach((t) => {
      if (t.id) {
        ratedMap[String(t.id)] = {
          rating: t.rating ?? t.vote_average ?? 0,
          mediaType: "tv",
          title: t.name || t.original_name,
        };
      }
    });

    return {
      success: true,
      favoriteIds,
      watchlistIds,
      ratedMap,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync collection IDs.";
    return { success: false, favoriteIds: [], watchlistIds: [], ratedMap: {}, error: message };
  }
}
