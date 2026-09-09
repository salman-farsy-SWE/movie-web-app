import { tmdbFetch } from "./tmdb";
import {
  getGenres,
  getTvGenres,
  filterMockMovies,
  deduplicateByTitleAndId,
} from "./movies";
import type {
  TmdbMovieListResponse,
  TmdbTvListResponse,
} from "./types";
import { rowItems, type MovieItem } from "@/data/mock-home";
import { mapTmdbToMovieItem } from "./mapper";

export interface TopRatedMediaResult {
  movies: MovieItem[];
  totalPages: number;
  currentPage: number;
}

export type TopRatedCategory = "movies" | "tv-shows" | string;

export async function getTopRatedContent(
  category: TopRatedCategory,
  page: number = 1,
  pageSize: number = 24
): Promise<TopRatedMediaResult | null> {
  const isTv = category === "tv-shows";
  const endpoint = isTv ? "/tv/top_rated" : "/movie/top_rated";

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
      tmdbFetch<TmdbMovieListResponse | TmdbTvListResponse>(endpoint, {
        language: "en-US",
        page: firstTmdbPage.toString(),
      }),
      tmdbFetch<TmdbMovieListResponse | TmdbTvListResponse>(endpoint, {
        language: "en-US",
        page: secondTmdbPage.toString(),
      }).catch(() => null),
      tmdbFetch<TmdbMovieListResponse | TmdbTvListResponse>(endpoint, {
        language: "en-US",
        page: thirdTmdbPage.toString(),
      }).catch(() => null),
    ]);

    const combinedResults = [
      ...(data1?.results || []),
      ...(data2?.results || []),
      ...(data3?.results || []),
    ];

    let mappedMovies = combinedResults.map((item) =>
      mapTmdbToMovieItem(item, movieGenreMap, tvGenreMap)
    );

    if (isTv) {
      mappedMovies = mappedMovies.filter((i) => i.mediaType === "tv");
    } else {
      mappedMovies = mappedMovies.filter((i) => i.mediaType !== "tv");
    }

    const deduplicatedMovies = deduplicateByTitleAndId(mappedMovies);
    const selected = deduplicatedMovies.slice(offset, offset + pageSize).slice(0, pageSize);
    const totalResults = data1?.total_results ?? deduplicatedMovies.length;
    const totalPages = Math.min(Math.ceil(totalResults / pageSize), 500);

    return {
      movies: selected,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error(`Failed to fetch top rated ${category} from TMDB:`, error);
    const mediaFilter = isTv ? "tv_shows" : "movies";

    const baseMock = filterMockMovies(rowItems, {
      media: mediaFilter,
    });
    const deduplicatedMock = deduplicateByTitleAndId(baseMock);

    return {
      movies: deduplicatedMock.slice((page - 1) * pageSize, page * pageSize).slice(0, pageSize),
      totalPages: Math.max(1, Math.ceil(deduplicatedMock.length / pageSize)),
      currentPage: page,
    };
  }
}
