import { TMDB_LANGUAGE_MAP } from "./filters";

export interface TmdbAccount {
  id: number;
  name: string;
  username: string;
  include_adult: boolean;
  iso_639_1: string;
  iso_3166_1: string;
  avatar: {
    tmdb: {
      avatar_path: string | null;
    };
    gravatar: {
      hash: string;
    };
  };
}

function normalizeLanguageCode(lang?: string): string {
  if (!lang) return "en";
  const trimmed = lang.trim();
  if (TMDB_LANGUAGE_MAP[trimmed]) return TMDB_LANGUAGE_MAP[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(TMDB_LANGUAGE_MAP)) {
    if (key.toLowerCase() === lower || val.toLowerCase() === lower) {
      return val;
    }
  }
  return lower.slice(0, 2) || "en";
}

function getAuthParams(): { headers: HeadersInit; apiKeyParam?: string } {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (accessToken) {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      apiKeyParam: apiKey ? `api_key=${apiKey}` : undefined,
    };
  }

  if (apiKey) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      apiKeyParam: `api_key=${apiKey}`,
    };
  }

  throw new Error("TMDB credentials not configured. Please add TMDB_ACCESS_TOKEN or TMDB_API_KEY to .env.local.");
}

/**
 * Resilient fetch wrapper with retry and exponential backoff
 * handles TMDB HTTP 429 (Too Many Requests) and transient network glitches.
 */
async function tmdbAuthFetch(
  url: string,
  init?: RequestInit,
  retries: number = 3
): Promise<Response> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const res = await fetch(url, { ...init, cache: "no-store" });
      if ((res.status === 429 || (res.status >= 500 && res.status <= 504)) && attempt < retries) {
        const retryAfterHeader = res.headers.get("Retry-After");
        const delayMs = retryAfterHeader
          ? Number(retryAfterHeader) * 1000
          : (attempt + 1) * 350 + Math.random() * 150;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        attempt++;
        continue;
      }
      return res;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 300));
        attempt++;
        continue;
      }
      throw err;
    }
  }
  return fetch(url, { ...init, cache: "no-store" });
}

/**
 * Creates a new temporary request token from TMDB.
 */
export async function createRequestToken(): Promise<string> {
  const { headers, apiKeyParam } = getAuthParams();
  const url = apiKeyParam
    ? `https://api.themoviedb.org/3/authentication/token/new?${apiKeyParam}`
    : "https://api.themoviedb.org/3/authentication/token/new";

  const res = await tmdbAuthFetch(url, {
    headers,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.status_message || "Failed to initiate login session.");
  }

  return data.request_token;
}

/**
 * Validates a request token using TMDB username and password.
 */
export async function validateWithLogin(
  username: string,
  password: string,
  requestToken: string
): Promise<string> {
  const { headers, apiKeyParam } = getAuthParams();
  const url = apiKeyParam
    ? `https://api.themoviedb.org/3/authentication/token/validate_with_login?${apiKeyParam}`
    : "https://api.themoviedb.org/3/authentication/token/validate_with_login";

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: username.trim(),
      password,
      request_token: requestToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.status_message || "Invalid username or password.");
  }

  return data.request_token;
}

/**
 * Exchanges an authorized request token for a TMDB session ID.
 */
export async function createSession(requestToken: string): Promise<string> {
  const { headers, apiKeyParam } = getAuthParams();
  const url = apiKeyParam
    ? `https://api.themoviedb.org/3/authentication/session/new?${apiKeyParam}`
    : "https://api.themoviedb.org/3/authentication/session/new";

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      request_token: requestToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.status_message || "Failed to create TMDB session.");
  }

  return data.session_id;
}

/**
 * Fetches the user account details for a given session ID.
 */
export async function getAccountDetails(sessionId: string): Promise<TmdbAccount> {
  if (!sessionId) {
    throw new Error("No session ID provided.");
  }
  const { headers, apiKeyParam } = getAuthParams();
  const base = `https://api.themoviedb.org/3/account?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  const res = await tmdbAuthFetch(url, {
    headers,
  });

  const data = await res.json();
  if (!res.ok || !data.id) {
    throw new Error(data.status_message || "Failed to fetch TMDB account.");
  }

  return data as TmdbAccount;
}

/**
 * Deletes a TMDB session on the TMDB servers.
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;
  const { headers, apiKeyParam } = getAuthParams();
  const url = apiKeyParam
    ? `https://api.themoviedb.org/3/authentication/session?${apiKeyParam}`
    : "https://api.themoviedb.org/3/authentication/session";

  try {
    const res = await tmdbAuthFetch(url, {
      method: "DELETE",
      headers,
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    const data = await res.json();
    return Boolean(res.ok && data.success);
  } catch {
    return false;
  }
}

/**
 * Helper to resolve an account's avatar image URL.
 */
export function getTmdbAvatarUrl(account: TmdbAccount | null): string | undefined {
  if (!account) return undefined;
  if (account.avatar?.tmdb?.avatar_path) {
    return `https://image.tmdb.org/t/p/w200${account.avatar.tmdb.avatar_path}`;
  }
  if (account.avatar?.gravatar?.hash) {
    return `https://www.gravatar.com/avatar/${account.avatar.gravatar.hash}?s=200&d=mp`;
  }
  return undefined;
}

export interface TmdbAccountStates {
  id: number;
  favorite: boolean;
  rated: boolean | { value: number };
  watchlist: boolean;
}

/**
 * Marks or unmarks a media item as favorite in TMDB for the logged-in user.
 */
export async function markAsFavorite(
  sessionId: string,
  accountId: number,
  mediaType: "movie" | "tv",
  mediaId: number,
  favorite: boolean
): Promise<{ success: boolean; status_message?: string }> {
  const numericId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
  if (isNaN(numericId) || numericId <= 0) {
    throw new Error("Invalid media ID");
  }

  const { headers, apiKeyParam } = getAuthParams();
  const base = `https://api.themoviedb.org/3/account/${accountId}/favorite?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      media_type: validMediaType,
      media_id: numericId,
      favorite: Boolean(favorite),
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.status_message || "Failed to update favorite status in TMDB.");
  }

  return { success: true, status_message: data.status_message };
}

/**
 * Fetches the user account states (favorite, rated, watchlist) for a single movie or TV show.
 */
export async function getAccountStates(
  sessionId: string,
  mediaType: "movie" | "tv",
  mediaId: number
): Promise<TmdbAccountStates | null> {
  const numericId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
  if (isNaN(numericId) || numericId <= 0 || !sessionId) return null;

  const { headers, apiKeyParam } = getAuthParams();
  const base = `https://api.themoviedb.org/3/${validMediaType}/${numericId}/account_states?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  try {
    const res = await tmdbAuthFetch(url, {
      headers,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data as TmdbAccountStates;
  } catch {
    return null;
  }
}

export interface TmdbMediaResult {
  id: number;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  rating?: number; // User rating if rated item
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

export interface TmdbListResult {
  id: number;
  name: string;
  description: string;
  favorite_count: number;
  item_count: number;
  iso_639_1?: string;
  list_type?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

export interface TmdbListDetailsResponse {
  id: number | string;
  name: string;
  description: string;
  created_by?: string;
  favorite_count?: number;
  item_count: number;
  iso_639_1?: string;
  public?: boolean;
  poster_path?: string | null;
  backdrop_path?: string | null;
  items: TmdbMediaResult[];
}

export interface TmdbAccountStats {
  favorites: number;
  watchlist: number;
  ratings: number;
  lists: number;
}

/**
 * Fetches all user favorite movies or TV shows from TMDB.
 */
export async function getAccountFavorites(
  sessionId: string,
  accountId: number,
  mediaType: "movie" | "tv",
  page: number = 1,
  sortBy?: string
): Promise<{ results: TmdbMediaResult[]; total_pages: number; total_results: number }> {
  const { headers, apiKeyParam } = getAuthParams();
  const listType = mediaType === "movie" ? "movies" : "tv";
  const sortParam = sortBy ? `&sort_by=${encodeURIComponent(sortBy)}` : "";
  const base = `https://api.themoviedb.org/3/account/${accountId}/favorite/${listType}?session_id=${encodeURIComponent(sessionId)}&page=${page}${sortParam}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  try {
    const res = await tmdbAuthFetch(url, {
      headers,
    });

    if (!res.ok) return { results: [], total_pages: 0, total_results: 0 };
    const data = await res.json();
    return {
      results: (data.results || []) as TmdbMediaResult[],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };
  } catch {
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

/**
 * Marks or unmarks a media item in TMDB watchlist for the logged-in user.
 */
export async function markAsWatchlist(
  sessionId: string,
  accountId: number,
  mediaType: "movie" | "tv",
  mediaId: number,
  watchlist: boolean
): Promise<{ success: boolean; status_message?: string }> {
  const numericId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
  if (isNaN(numericId) || numericId <= 0) {
    throw new Error("Invalid media ID");
  }

  const { headers, apiKeyParam } = getAuthParams();
  const base = `https://api.themoviedb.org/3/account/${accountId}/watchlist?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      media_type: validMediaType,
      media_id: numericId,
      watchlist: Boolean(watchlist),
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.status_message || "Failed to update watchlist in TMDB.");
  }

  return { success: true, status_message: data.status_message };
}

/**
 * Fetches user watchlist movies or TV shows from TMDB.
 */
export async function getAccountWatchlist(
  sessionId: string,
  accountId: number,
  mediaType: "movie" | "tv",
  page: number = 1,
  sortBy?: string
): Promise<{ results: TmdbMediaResult[]; total_pages: number; total_results: number }> {
  const { headers, apiKeyParam } = getAuthParams();
  const listType = mediaType === "movie" ? "movies" : "tv";
  const sortParam = sortBy ? `&sort_by=${encodeURIComponent(sortBy)}` : "";
  const base = `https://api.themoviedb.org/3/account/${accountId}/watchlist/${listType}?session_id=${encodeURIComponent(sessionId)}&page=${page}${sortParam}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  try {
    const res = await tmdbAuthFetch(url, {
      headers,
    });

    if (!res.ok) return { results: [], total_pages: 0, total_results: 0 };
    const data = await res.json();
    return {
      results: (data.results || []) as TmdbMediaResult[],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };
  } catch {
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

/**
 * Sets a user rating for a movie or TV show on TMDB.
 */
export async function setMediaRating(
  sessionId: string,
  mediaType: "movie" | "tv",
  mediaId: number,
  ratingValue: number
): Promise<{ success: boolean; status_message?: string }> {
  const numericId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
  if (isNaN(numericId) || numericId <= 0) {
    throw new Error("Invalid media ID");
  }

  // Clamped to 0.5 - 10.0 scale, rounded to nearest 0.5 for TMDB format
  const sanitizedRating = Math.max(0.5, Math.min(10, Math.round(Number(ratingValue) * 2) / 2));

  const { headers, apiKeyParam } = getAuthParams();
  const base = `https://api.themoviedb.org/3/${validMediaType}/${numericId}/rating?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      value: sanitizedRating,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.status_message || "Failed to set rating in TMDB.");
  }

  return { success: true, status_message: data.status_message };
}

/**
 * Deletes a user rating for a movie or TV show on TMDB.
 */
export async function deleteMediaRating(
  sessionId: string,
  mediaType: "movie" | "tv",
  mediaId: number
): Promise<{ success: boolean; status_message?: string }> {
  const numericId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";
  if (isNaN(numericId) || numericId <= 0) {
    return { success: true };
  }

  const { headers, apiKeyParam } = getAuthParams();
  const base = `https://api.themoviedb.org/3/${validMediaType}/${numericId}/rating?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  try {
    const res = await tmdbAuthFetch(url, {
      method: "DELETE",
      headers,
    });

    const data = await res.json().catch(() => null);
    const isSuccess = Boolean(
      (res.ok && (data?.success === true || res.status === 200 || data?.status_code === 13 || data?.status_code === 12)) ||
      res.status === 404
    );
    return { success: isSuccess, status_message: data?.status_message };
  } catch {
    return { success: false };
  }
}

/**
 * Fetches user rated movies or TV shows from TMDB.
 */
export async function getAccountRated(
  sessionId: string,
  accountId: number,
  mediaType: "movie" | "tv",
  page: number = 1,
  sortBy?: string
): Promise<{ results: TmdbMediaResult[]; total_pages: number; total_results: number }> {
  const { headers, apiKeyParam } = getAuthParams();
  const listType = mediaType === "movie" ? "movies" : "tv";
  const sortParam = sortBy ? `&sort_by=${encodeURIComponent(sortBy)}` : "";
  const base = `https://api.themoviedb.org/3/account/${accountId}/rated/${listType}?session_id=${encodeURIComponent(sessionId)}&page=${page}${sortParam}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  try {
    const res = await tmdbAuthFetch(url, {
      headers,
    });

    if (!res.ok) return { results: [], total_pages: 0, total_results: 0 };
    const data = await res.json();
    return {
      results: (data.results || []) as TmdbMediaResult[],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };
  } catch {
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

/**
 * Fetches lists created by the user on TMDB (supporting both v4 modern lists and v3 legacy lists).
 */
export async function getAccountLists(
  sessionId: string,
  accountId: number,
  page: number = 1
): Promise<{ results: TmdbListResult[]; total_pages: number; total_results: number }> {
  const { headers, apiKeyParam } = getAuthParams();
  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam, `page=${page}`].filter(Boolean).join("&");

  const v4Url = queryParts
    ? `https://api.themoviedb.org/4/account/${accountId}/lists?${queryParts}`
    : `https://api.themoviedb.org/4/account/${accountId}/lists?page=${page}`;

  const v3Base = `https://api.themoviedb.org/3/account/${accountId}/lists`;
  const v3Url = queryParts ? `${v3Base}?${queryParts}` : `${v3Base}?page=${page}`;

  const allResults: TmdbListResult[] = [];
  const seenIds = new Set<string>();
  let maxTotalPages = 1;
  let totalCount = 0;

  // 1. Fetch modern v4 lists (e.g. lists created on themoviedb.org or v4 API)
  try {
    const resV4 = await tmdbAuthFetch(v4Url, { headers });
    if (resV4.ok) {
      const dataV4 = await resV4.json();
      if (dataV4 && Array.isArray(dataV4.results)) {
        maxTotalPages = Math.max(maxTotalPages, dataV4.total_pages || 1);
        totalCount += dataV4.total_results || dataV4.results.length;
        dataV4.results.forEach((r: Record<string, unknown>) => {
          const idStr = String(r.id);
          if (!seenIds.has(idStr)) {
            seenIds.add(idStr);
            const isPub =
              typeof r.public === "boolean"
                ? r.public
                : typeof r.public === "number"
                ? r.public === 1
                : typeof (r as Record<string, unknown>).is_public === "boolean"
                ? (r as Record<string, unknown>).is_public
                : undefined;
            allResults.push({
              id: Number(r.id) || 0,
              name: (r.name as string) || "",
              description: (r.description as string) || "",
              favorite_count: (r.favorite_count as number) || (r.likes_count as number) || 0,
              item_count: (r.item_count as number) ?? (r.number_of_items as number) ?? 0,
              iso_639_1: (r.iso_639_1 as string) || "en",
              list_type: isPub !== undefined ? (isPub ? "public" : "private") : ((r.list_type as string) || "public"),
              poster_path: (r.poster_path as string | null) || null,
              backdrop_path: (r.backdrop_path as string | null) || null,
            });
          }
        });
      }
    }
  } catch {}

  // 2. Fetch v3 lists
  try {
    const resV3 = await tmdbAuthFetch(v3Url, { headers });
    if (resV3.ok) {
      const dataV3 = await resV3.json();
      if (dataV3 && Array.isArray(dataV3.results)) {
        maxTotalPages = Math.max(maxTotalPages, dataV3.total_pages || 1);
        totalCount += dataV3.total_results || dataV3.results.length;
        dataV3.results.forEach((r: Record<string, unknown>) => {
          const idStr = String(r.id);
          if (!seenIds.has(idStr)) {
            seenIds.add(idStr);
            const isPub =
              typeof r.public === "boolean"
                ? r.public
                : typeof r.public === "number"
                ? r.public === 1
                : typeof (r as Record<string, unknown>).is_public === "boolean"
                ? (r as Record<string, unknown>).is_public
                : undefined;
            allResults.push({
              id: Number(r.id) || 0,
              name: (r.name as string) || "",
              description: (r.description as string) || "",
              favorite_count: (r.favorite_count as number) || (r.likes_count as number) || 0,
              item_count: (r.item_count as number) ?? (r.number_of_items as number) ?? 0,
              iso_639_1: (r.iso_639_1 as string) || "en",
              list_type: isPub !== undefined ? (isPub ? "public" : "private") : ((r.list_type as string) || "public"),
              poster_path: (r.poster_path as string | null) || null,
              backdrop_path: (r.backdrop_path as string | null) || null,
            });
          }
        });
      }
    }
  } catch {}

  return {
    results: allResults,
    total_pages: maxTotalPages,
    total_results: totalCount || allResults.length,
  };
}

/**
 * Fetches details and items of a specific TMDB list.
 */
export async function getListDetails(
  listId: string | number,
  sessionId?: string
): Promise<TmdbListDetailsResponse | null> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanId = String(listId).replace(/^list-/, "").trim();
  if (!cleanId || isNaN(Number(cleanId))) return null;

  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam].filter(Boolean).join("&");

  let v4Public: boolean | undefined = undefined;
  let v4Items: TmdbMediaResult[] | null = null;
  let v4Data: Record<string, unknown> | null = null;

  // 1. Try v4 endpoint first (v4 provides accurate public/private flag and supports modern movie/tv lists)
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list/${cleanId}?${queryParts}`
      : `https://api.themoviedb.org/4/list/${cleanId}`;

    const resV4 = await tmdbAuthFetch(v4Url, {
      headers,
    });

    if (resV4.ok) {
      const data = await resV4.json();
      if (data && (data.results !== undefined || data.items !== undefined || data.name)) {
        v4Data = data;
        const allItems: TmdbMediaResult[] = [...(data.results || data.items || [])];
        const totalPages = Math.min(data.total_pages || 1, 50);
        if (totalPages > 1) {
          const pagePromises = [];
          for (let p = 2; p <= totalPages; p++) {
            const pUrl = queryParts
              ? `https://api.themoviedb.org/4/list/${cleanId}?page=${p}&${queryParts}`
              : `https://api.themoviedb.org/4/list/${cleanId}?page=${p}`;
            pagePromises.push(
              tmdbAuthFetch(pUrl, { headers })
                .then((r) => r.json())
                .catch(() => null)
            );
          }
          const pageResults = await Promise.all(pagePromises);
          for (const pr of pageResults) {
            if (pr?.results) {
              allItems.push(...pr.results);
            }
          }
        }

        v4Items = allItems;
        v4Public =
          typeof data.public === "boolean"
            ? data.public
            : typeof data.public === "number"
            ? data.public === 1
            : typeof data.public === "string"
            ? data.public === "true" || data.public === "1" || data.public === "public"
            : undefined;
      }
    }
  } catch {}

  // 2. Fallback / supplementary check via v3 endpoint
  try {
    const base = `https://api.themoviedb.org/3/list/${cleanId}`;
    const v3Url = queryParts ? `${base}?${queryParts}` : base;

    const resV3 = await tmdbAuthFetch(v3Url, {
      headers,
    });

    if (resV3.ok) {
      const data = await resV3.json();
      if (data && (data.items || data.results || data.name)) {
        const v3Items = (data.items || data.results || []) as TmdbMediaResult[];
        const resolvedItems = (v4Items && v4Items.length > 0) ? v4Items : v3Items;
        let resolvedPublic = v4Public;
        if (resolvedPublic === undefined) {
          if (typeof data.public === "boolean") {
            resolvedPublic = data.public;
          } else if (typeof data.public === "number") {
            resolvedPublic = data.public === 1;
          } else if (typeof data.public === "string") {
            resolvedPublic = data.public === "true" || data.public === "1" || data.public === "public";
          } else if (sessionId) {
            try {
              const probeUrl = apiKeyParam ? `${base}?${apiKeyParam}` : base;
              const probeRes = await tmdbAuthFetch(probeUrl, { headers });
              resolvedPublic = probeRes.ok;
            } catch {
              resolvedPublic = false;
            }
          } else {
            resolvedPublic = true;
          }
        }

        const creatorName =
          (typeof data.created_by === "string" ? data.created_by : undefined) ||
          (v4Data?.created_by as { username?: string; name?: string })?.username ||
          (v4Data?.created_by as { username?: string; name?: string })?.name;

        return {
          id: data.id || v4Data?.id || cleanId,
          name: data.name || (v4Data?.name as string) || "",
          description: data.description || (v4Data?.description as string) || "",
          created_by: creatorName,
          favorite_count: data.favorite_count || (v4Data?.favorite_count as number) || 0,
          item_count: data.item_count ?? (v4Data?.total_results as number) ?? resolvedItems.length,
          iso_639_1: data.iso_639_1 || (v4Data?.iso_639_1 as string) || "en",
          public: resolvedPublic,
          poster_path: data.poster_path || (v4Data?.poster_path as string | null) || null,
          backdrop_path: data.backdrop_path || (v4Data?.backdrop_path as string | null) || null,
          items: resolvedItems,
        };
      }
    }
  } catch {}

  // If v3 failed but v4 succeeded, return v4 result
  if (v4Data) {
    const creatorName =
      (v4Data.created_by as { username?: string; name?: string })?.username ||
      (v4Data.created_by as { username?: string; name?: string })?.name ||
      (typeof v4Data.created_by === "string" ? v4Data.created_by : undefined);

    return {
      id: (v4Data.id as string | number) || cleanId,
      name: (v4Data.name as string) || "",
      description: (v4Data.description as string) || "",
      created_by: creatorName,
      favorite_count: (v4Data.favorite_count as number) || (v4Data.likes_count as number) || 0,
      item_count: (v4Data.total_results as number) ?? (v4Data.item_count as number) ?? (v4Items?.length || 0),
      iso_639_1: (v4Data.iso_639_1 as string) || "en",
      public: v4Public,
      poster_path: (v4Data.poster_path as string | null) || null,
      backdrop_path: (v4Data.backdrop_path as string | null) || null,
      items: v4Items || [],
    };
  }

  return null;
}

/**
 * Creates a new custom list on TMDB.
 */
export async function createList(
  sessionId: string,
  name: string,
  description: string = "",
  language: string = "en",
  isPrivate: boolean = false
): Promise<{ success: boolean; list_id?: number; status_message?: string }> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanName = name.trim();
  if (!cleanName) {
    throw new Error("List name cannot be empty.");
  }
  const isoLang = normalizeLanguageCode(language);
  const isPublic = !isPrivate;

  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam].filter(Boolean).join("&");

  // Try v4 endpoint if possible
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list?${queryParts}`
      : "https://api.themoviedb.org/4/list";

    const res = await tmdbAuthFetch(v4Url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: cleanName,
        description: description.trim(),
        public: isPublic,
        iso_639_1: isoLang,
        iso_3166_1: "US",
      }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && (data?.id || data?.list_id || data?.success)) {
      const listId = data.id || data.list_id;
      if (listId) {
        try {
          await updateList(sessionId, listId, cleanName, description.trim(), isPrivate, isoLang);
        } catch {}
      }
      return { success: true, list_id: listId, status_message: data?.status_message };
    }
  } catch {}

  // Fallback to v3 list endpoint
  const base = "https://api.themoviedb.org/3/list";
  const url = queryParts ? `${base}?${queryParts}` : base;

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: cleanName,
      description: description.trim(),
      language: isoLang,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.status_message || "Failed to create list in TMDB.");
  }

  // Attempt to sync privacy and language metadata via updateList
  if (data.list_id) {
    try {
      await updateList(sessionId, data.list_id, cleanName, description.trim(), isPrivate, isoLang);
    } catch {}
  }

  return { success: true, list_id: data.list_id, status_message: data.status_message };
}

/**
 * Updates a custom list on TMDB (name, description, privacy, language).
 */
export async function updateList(
  sessionId: string,
  listId: string | number,
  name: string,
  description: string = "",
  isPrivate: boolean = false,
  language: string = "en"
): Promise<{ success: boolean; status_message?: string }> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanId = String(listId).replace(/^list-/, "").trim();
  if (!cleanId || isNaN(Number(cleanId))) {
    return { success: true };
  }
  const isoLang = normalizeLanguageCode(language);
  const isPublic = !isPrivate;

  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam].filter(Boolean).join("&");

  // 1. Try v4 endpoint with PUT
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list/${cleanId}?${queryParts}`
      : `https://api.themoviedb.org/4/list/${cleanId}`;

    const res = await tmdbAuthFetch(v4Url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        public: isPublic,
        iso_639_1: isoLang,
        sort_by: "original_order.asc",
      }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && (data?.success === true || res.status === 200)) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  // 2. Try v4 endpoint with POST
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list/${cleanId}?${queryParts}`
      : `https://api.themoviedb.org/4/list/${cleanId}`;

    const res = await tmdbAuthFetch(v4Url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        public: isPublic,
        iso_639_1: isoLang,
      }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && (data?.success === true || res.status === 200)) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  // 3. Fallback to v3 endpoint
  try {
    const base = `https://api.themoviedb.org/3/list/${cleanId}`;
    const v3Url = queryParts ? `${base}?${queryParts}` : base;
    const res = await tmdbAuthFetch(v3Url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        public: isPublic,
        language: isoLang,
        iso_639_1: isoLang,
      }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && (data?.success === true || res.status === 200)) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  return { success: true };
}

/**
 * Deletes a custom list on TMDB.
 */
export async function deleteList(
  sessionId: string,
  listId: string | number
): Promise<{ success: boolean; status_message?: string }> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanId = String(listId).replace(/^list-/, "").trim();
  if (!cleanId || isNaN(Number(cleanId))) {
    return { success: true };
  }

  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam].filter(Boolean).join("&");

  // 1. Try v4 endpoint (supports modern lists)
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list/${cleanId}?${queryParts}`
      : `https://api.themoviedb.org/4/list/${cleanId}`;

    const resV4 = await tmdbAuthFetch(v4Url, {
      method: "DELETE",
      headers,
    });

    const dataV4 = await resV4.json().catch(() => null);
    if (
      (resV4.ok && (dataV4?.success === true || resV4.status === 200 || dataV4?.status_code === 12 || dataV4?.status_code === 13)) ||
      resV4.status === 404 ||
      dataV4?.status_code === 34
    ) {
      return { success: true, status_message: dataV4?.status_message };
    }
  } catch {}

  // 2. Fallback to v3 endpoint
  try {
    const base = `https://api.themoviedb.org/3/list/${cleanId}?session_id=${encodeURIComponent(sessionId)}`;
    const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

    const res = await tmdbAuthFetch(url, {
      method: "DELETE",
      headers,
    });

    const data = await res.json().catch(() => null);
    const isSuccess = Boolean(
      (res.ok && (data?.success === true || res.status === 200 || data?.status_code === 12 || data?.status_code === 13)) ||
      res.status === 404 ||
      data?.status_code === 34
    );
    return { success: isSuccess, status_message: data?.status_message };
  } catch {
    return { success: false };
  }
}

/**
 * Adds a media item (movie or tv show) to a TMDB list.
 */
export async function addMediaToList(
  sessionId: string,
  listId: string | number,
  mediaId: number,
  mediaType: "movie" | "tv" = "movie"
): Promise<{ success: boolean; status_message?: string }> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanId = String(listId).replace(/^list-/, "").trim();
  const numericMediaId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";

  if (!cleanId || isNaN(Number(cleanId)) || isNaN(numericMediaId) || numericMediaId <= 0) {
    return { success: true };
  }

  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam].filter(Boolean).join("&");

  // 1. Try v4 endpoint with items array (supports both movie and tv)
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list/${cleanId}/items?${queryParts}`
      : `https://api.themoviedb.org/4/list/${cleanId}/items`;

    const res = await tmdbAuthFetch(v4Url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: [
          {
            media_type: validMediaType,
            media_id: numericMediaId,
          },
        ],
      }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && (data?.success === true || res.status === 200 || res.status === 201 || data?.status_code === 1)) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  // 2. Try v3 list endpoint with media_type and media_id
  try {
    const base = `https://api.themoviedb.org/3/list/${cleanId}/add_item?session_id=${encodeURIComponent(sessionId)}`;
    const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

    const res = await tmdbAuthFetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        media_id: numericMediaId,
        media_type: validMediaType,
      }),
    });

    const data = await res.json().catch(() => null);
    const isSuccess = Boolean(
      res.ok && (data?.success === true || res.status === 200 || res.status === 201 || data?.status_code === 12 || data?.status_code === 1)
    );
    if (isSuccess) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  // 3. Fallback to standard v3 list add_item with media_id
  const base = `https://api.themoviedb.org/3/list/${cleanId}/add_item?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      media_id: numericMediaId,
    }),
  });

  const data = await res.json().catch(() => null);
  const isSuccess = Boolean(
    res.ok && (data?.success === true || res.status === 200 || res.status === 201 || data?.status_code === 12 || data?.status_code === 1)
  );
  if (!isSuccess && !res.ok) {
    throw new Error(data?.status_message || "Failed to add item to list in TMDB.");
  }

  return { success: true, status_message: data?.status_message };
}

/**
 * Removes a media item (movie or tv show) from a TMDB list.
 */
export async function removeMediaFromList(
  sessionId: string,
  listId: string | number,
  mediaId: number,
  mediaType: "movie" | "tv" = "movie"
): Promise<{ success: boolean; status_message?: string }> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanId = String(listId).replace(/^list-/, "").trim();
  const numericMediaId = Math.floor(Number(mediaId));
  const validMediaType: "movie" | "tv" = mediaType === "tv" ? "tv" : "movie";

  if (!cleanId || isNaN(Number(cleanId)) || isNaN(numericMediaId) || numericMediaId <= 0) {
    return { success: true };
  }

  const sessionParam = sessionId ? `session_id=${encodeURIComponent(sessionId)}` : "";
  const queryParts = [sessionParam, apiKeyParam].filter(Boolean).join("&");

  // 1. Try v4 endpoint with items array (supports both movie and tv)
  try {
    const v4Url = queryParts
      ? `https://api.themoviedb.org/4/list/${cleanId}/items?${queryParts}`
      : `https://api.themoviedb.org/4/list/${cleanId}/items`;

    const res = await tmdbAuthFetch(v4Url, {
      method: "DELETE",
      headers,
      body: JSON.stringify({
        items: [
          {
            media_type: validMediaType,
            media_id: numericMediaId,
          },
        ],
      }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok && (data?.success === true || res.status === 200 || data?.status_code === 1 || data?.status_code === 13)) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  // 2. Try v3 list endpoint with media_type and media_id
  try {
    const base = `https://api.themoviedb.org/3/list/${cleanId}/remove_item?session_id=${encodeURIComponent(sessionId)}`;
    const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

    const res = await tmdbAuthFetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        media_id: numericMediaId,
        media_type: validMediaType,
      }),
    });

    const data = await res.json().catch(() => null);
    const isSuccess = Boolean(
      res.ok && (data?.success === true || res.status === 200 || data?.status_code === 13 || data?.status_code === 1)
    );
    if (isSuccess) {
      return { success: true, status_message: data?.status_message };
    }
  } catch {}

  // 3. Fallback to standard v3 list remove_item with media_id
  const base = `https://api.themoviedb.org/3/list/${cleanId}/remove_item?session_id=${encodeURIComponent(sessionId)}`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  const res = await tmdbAuthFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      media_id: numericMediaId,
    }),
  });

  const data = await res.json().catch(() => null);
  const isSuccess = Boolean(
    res.ok && (data?.success === true || res.status === 200 || data?.status_code === 13 || data?.status_code === 1)
  );
  if (!isSuccess && !res.ok) {
    throw new Error(data?.status_message || "Failed to remove item from list in TMDB.");
  }

  return { success: true, status_message: data?.status_message };
}

/**
 * Clears all media items from a TMDB list.
 */
export async function clearList(
  sessionId: string,
  listId: string | number
): Promise<{ success: boolean; status_message?: string }> {
  const { headers, apiKeyParam } = getAuthParams();
  const cleanId = String(listId).replace(/^list-/, "").trim();
  if (!cleanId || isNaN(Number(cleanId))) {
    return { success: true };
  }
  const base = `https://api.themoviedb.org/3/list/${cleanId}/clear?session_id=${encodeURIComponent(sessionId)}&confirm=true`;
  const url = apiKeyParam ? `${base}&${apiKeyParam}` : base;

  try {
    const res = await tmdbAuthFetch(url, {
      method: "POST",
      headers,
    });

    const data = await res.json().catch(() => null);
    const isSuccess = Boolean(
      res.ok && (data?.success === true || res.status === 200 || data?.status_code === 12 || data?.status_code === 13)
    );
    return { success: isSuccess, status_message: data?.status_message };
  } catch {
    return { success: false };
  }
}

/**
 * Fetches total counts for favorites, watchlist, ratings, and lists for account summary.
 */
export async function getAccountSummaryCounts(
  sessionId: string,
  accountId: number
): Promise<TmdbAccountStats> {
  try {
    const [favMovies, favTv, wlMovies, wlTv, ratedMovies, ratedTv, lists] = await Promise.all([
      getAccountFavorites(sessionId, accountId, "movie", 1),
      getAccountFavorites(sessionId, accountId, "tv", 1),
      getAccountWatchlist(sessionId, accountId, "movie", 1),
      getAccountWatchlist(sessionId, accountId, "tv", 1),
      getAccountRated(sessionId, accountId, "movie", 1),
      getAccountRated(sessionId, accountId, "tv", 1),
      getAccountLists(sessionId, accountId, 1),
    ]);

    return {
      favorites: (favMovies.total_results || 0) + (favTv.total_results || 0),
      watchlist: (wlMovies.total_results || 0) + (wlTv.total_results || 0),
      ratings: (ratedMovies.total_results || 0) + (ratedTv.total_results || 0),
      lists: lists.total_results || 0,
    };
  } catch {
    return {
      favorites: 0,
      watchlist: 0,
      ratings: 0,
      lists: 0,
    };
  }
}
