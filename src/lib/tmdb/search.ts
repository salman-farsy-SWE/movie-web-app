import { tmdbFetch } from "./tmdb";
import { getGenres, getTvGenres, deduplicateByTitleAndId } from "./movies";
import { mapTmdbToMovieItem } from "./mapper";
import type { TmdbMixedListResponse, TmdbMovie, TmdbTvShow } from "./types";
import { heroContents, rowItems, type MovieItem } from "@/data/mock-home";
import { slugify } from "@/lib/utils";

export type SearchMediaType = "all" | "movie" | "tv";

export interface SearchMediaResult {
  movies: MovieItem[];
  totalPages: number;
  currentPage: number;
  totalResults: number;
}

export async function searchMoviesAndTv(
  query: string,
  page: number = 1,
  pageSize: number = 24,
  mediaType: SearchMediaType = "all"
): Promise<SearchMediaResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      movies: [],
      totalPages: 1,
      currentPage: 1,
      totalResults: 0,
    };
  }

  const cleanQuery = trimmed.replace(/-/g, " ");

  // Determine TMDB endpoint based on mediaType
  const tmdbEndpoint =
    mediaType === "movie"
      ? "/search/movie"
      : mediaType === "tv"
      ? "/search/tv"
      : "/search/multi";

  // Try TMDB API first
  try {
    const [movieGenreMap, tvGenreMap] = await Promise.all([
      getGenres().catch(() => new Map<number, string>()),
      getTvGenres().catch(() => new Map<number, string>()),
    ]);

    const startItem = (page - 1) * pageSize;
    const firstTmdbPage = Math.floor(startItem / 20) + 1;
    const offset = startItem % 20;

    const [data1, data2] = await Promise.all([
      tmdbFetch<TmdbMixedListResponse>(tmdbEndpoint, {
        query: cleanQuery,
        language: "en-US",
        page: firstTmdbPage.toString(),
        include_adult: "false",
      }),
      tmdbFetch<TmdbMixedListResponse>(tmdbEndpoint, {
        query: cleanQuery,
        language: "en-US",
        page: (firstTmdbPage + 1).toString(),
        include_adult: "false",
      }).catch(() => null),
    ]);

    const rawResults = [
      ...(data1?.results || []),
      ...(data2?.results || []),
    ].filter((item): item is TmdbMovie | TmdbTvShow => {
      if (mediaType === "movie") {
        return "title" in item || item.media_type === "movie";
      }
      if (mediaType === "tv") {
        return "name" in item || item.media_type === "tv";
      }
      return (
        item.media_type === "movie" ||
        item.media_type === "tv" ||
        (!("known_for" in item) && ("title" in item || "name" in item))
      );
    });

    if (rawResults.length > 0) {
      const mapped = rawResults.map((item) => {
        // If searching specifically for movies/tv, ensure the item type is preserved
        if (mediaType === "movie") {
          return mapTmdbToMovieItem({ ...item, media_type: "movie" }, movieGenreMap, tvGenreMap);
        }
        if (mediaType === "tv") {
          return mapTmdbToMovieItem({ ...item, media_type: "tv" }, movieGenreMap, tvGenreMap);
        }
        return mapTmdbToMovieItem(item, movieGenreMap, tvGenreMap);
      });
      const deduplicated = deduplicateByTitleAndId(mapped);
      const selected = deduplicated.slice(offset, offset + pageSize);
      const totalResults = data1?.total_results ?? deduplicated.length;
      const totalPages = Math.max(
        1,
        Math.min(Math.ceil(totalResults / pageSize), 500)
      );

      return {
        movies: selected,
        totalPages,
        currentPage: page,
        totalResults,
      };
    }
  } catch {
    // TMDB API unavailable, fallback to mock data
  }

  // Fallback to local catalog
  const heroAsMovie: MovieItem[] = heroContents.map((h, i) => ({
    id: `hero-${i}`,
    title: h.title,
    genre: h.genres.join(" / "),
    image: h.image,
    trailerKey: h.trailerKey,
    year: h.year,
    rating: h.rating,
    mediaType: "movie",
  }));

  const allMockItems = deduplicateByTitleAndId([...heroAsMovie, ...rowItems]);
  const queryLower = cleanQuery.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(Boolean);
  const querySlug = slugify(trimmed).toLowerCase();

  const matched = allMockItems.filter((item) => {
    // Media type filter for mock data
    if (mediaType === "movie" && item.mediaType === "tv") return false;
    if (mediaType === "tv" && item.mediaType !== "tv") return false;

    const titleLower = item.title.toLowerCase();
    const titleSlug = slugify(item.title).toLowerCase();

    // Direct match (contains query or query contains title)
    if (titleLower.includes(queryLower) || queryLower.includes(titleLower)) {
      return true;
    }
    if (titleSlug.includes(querySlug) || querySlug.includes(titleSlug)) {
      return true;
    }

    // All tokens match
    if (queryTokens.length > 0 && queryTokens.every((token) => titleLower.includes(token))) {
      return true;
    }

    // Partial token match for multi-word queries
    if (queryTokens.some((token) => token.length >= 3 && titleLower.includes(token))) {
      return true;
    }

    return false;
  });

  const deduplicatedMatched = deduplicateByTitleAndId(matched);
  const paged = deduplicatedMatched.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return {
    movies: paged,
    totalPages: Math.max(1, Math.ceil(deduplicatedMatched.length / pageSize)),
    currentPage: page,
    totalResults: deduplicatedMatched.length,
  };
}

