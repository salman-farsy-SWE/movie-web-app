import { tmdbFetch } from "./tmdb";
import { getGenres, getTvGenres, deduplicateByTitleAndId } from "./movies";
import { mapTmdbToMovieItem } from "./mapper";
import type { TmdbMixedListResponse, TmdbMovie, TmdbTvShow } from "./types";
import type { MovieItem } from "@/types";

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

  const tmdbEndpoint =
    mediaType === "movie"
      ? "/search/movie"
      : mediaType === "tv"
      ? "/search/tv"
      : "/search/multi";

  try {
    const [movieGenreMap, tvGenreMap] = await Promise.all([
      getGenres().catch(() => new Map<number, string>()),
      getTvGenres().catch(() => new Map<number, string>()),
    ]);

    const startItem = (page - 1) * pageSize;
    const firstTmdbPage = Math.floor(startItem / 20) + 1;
    const secondTmdbPage = firstTmdbPage + 1;
    const thirdTmdbPage = firstTmdbPage + 2;
    const offset = startItem % 20;

    const [data1, data2, data3] = await Promise.all([
      tmdbFetch<TmdbMixedListResponse>(tmdbEndpoint, {
        query: cleanQuery,
        language: "en-US",
        page: firstTmdbPage.toString(),
        include_adult: "false",
      }),
      tmdbFetch<TmdbMixedListResponse>(tmdbEndpoint, {
        query: cleanQuery,
        language: "en-US",
        page: secondTmdbPage.toString(),
        include_adult: "false",
      }).catch(() => null),
      tmdbFetch<TmdbMixedListResponse>(tmdbEndpoint, {
        query: cleanQuery,
        language: "en-US",
        page: thirdTmdbPage.toString(),
        include_adult: "false",
      }).catch(() => null),
    ]);

    const combinedRaw = [
      ...(data1?.results || []),
      ...(data2?.results || []),
      ...(data3?.results || []),
    ];

    const filteredRaw = combinedRaw.filter((item) => {
      if ((item as { media_type?: string }).media_type === "person") return false;
      if (mediaType === "movie") {
        return !item.media_type || item.media_type === "movie";
      }
      if (mediaType === "tv") {
        return item.media_type === "tv" || "first_air_date" in item;
      }
      return true;
    }) as (TmdbMovie | TmdbTvShow)[];

    if (filteredRaw.length > 0) {
      const mapped = filteredRaw.map((item) =>
        mapTmdbToMovieItem(item, movieGenreMap, tvGenreMap)
      );

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
    // TMDB API unavailable, return empty results
  }

  return {
    movies: [],
    totalPages: 1,
    currentPage: page,
    totalResults: 0,
  };
}
