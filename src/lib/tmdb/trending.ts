import { tmdbFetch } from "./tmdb";
import {
  getGenres,
  getTvGenres,
  filterMockMovies,
  deduplicateByTitleAndId,
} from "./movies";
import { type MovieFilterParams } from "./filters";
import type {
  TmdbMovieListResponse,
  TmdbTvListResponse,
  TmdbMixedListResponse,
  TmdbPersonListResponse,
  TmdbPerson,
} from "./types";
import { rowItems, type MovieItem } from "@/data/mock-home";
import { mapTmdbToMovieItem, mapTmdbToPersonItem } from "./mapper";
import type { Person } from "@/components/media/PersonCard";


export interface TrendingMediaResult {
  movies: MovieItem[];
  totalPages: number;
  currentPage: number;
}

export interface TrendingPersonsResult {
  persons: Person[];
  totalPages: number;
  currentPage: number;
}

export type TrendingCategory = "today" | "this-week" | "movies" | "tv-shows" | "persons" | string;


export async function getTrendingContent(
  category: TrendingCategory,
  page: number = 1,
  pageSize: number = 24,
  filters: MovieFilterParams | string = "all"
): Promise<TrendingMediaResult | null> {
  const filterParams: MovieFilterParams =
    typeof filters === "string" ? { media: filters } : filters;

  let endpoint = "/trending/all/day";
  const selectedMedia = filterParams.media || "all";
  const selectedTimeWindow =
    filterParams.time_window || (filterParams.media === "day" || filterParams.media === "week" ? filterParams.media : undefined) || "week";

  if (category === "today") {
    const mediaType =
      selectedMedia === "movies"
        ? "movie"
        : selectedMedia === "tv_shows"
        ? "tv"
        : "all";
    endpoint = `/trending/${mediaType}/day`;
  } else if (category === "this-week") {
    const mediaType =
      selectedMedia === "movies"
        ? "movie"
        : selectedMedia === "tv_shows"
        ? "tv"
        : "all";
    endpoint = `/trending/${mediaType}/week`;
  } else if (category === "movies") {
    const timeWindow =
      selectedTimeWindow === "day" || selectedTimeWindow === "today"
        ? "day"
        : "week";
    endpoint = `/trending/movie/${timeWindow}`;
  } else if (category === "tv-shows") {
    const timeWindow =
      selectedTimeWindow === "day" || selectedTimeWindow === "today"
        ? "day"
        : "week";
    endpoint = `/trending/tv/${timeWindow}`;
  } else {
    endpoint = "/trending/all/day";
  }

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
      tmdbFetch<TmdbMixedListResponse | TmdbMovieListResponse | TmdbTvListResponse>(
        endpoint,
        { language: "en-US", page: firstTmdbPage.toString() }
      ),
      tmdbFetch<TmdbMixedListResponse | TmdbMovieListResponse | TmdbTvListResponse>(
        endpoint,
        { language: "en-US", page: secondTmdbPage.toString() }
      ).catch(() => null),
      tmdbFetch<TmdbMixedListResponse | TmdbMovieListResponse | TmdbTvListResponse>(
        endpoint,
        { language: "en-US", page: thirdTmdbPage.toString() }
      ).catch(() => null),
    ]);

    const combinedResults = [
      ...(data1?.results || []),
      ...(data2?.results || []),
      ...(data3?.results || []),
    ];

    let mappedMovies = combinedResults.map((item) =>
      mapTmdbToMovieItem(item, movieGenreMap, tvGenreMap)
    );

    if (category === "movies" || endpoint.startsWith("/trending/movie/")) {
      mappedMovies = mappedMovies.filter((i) => i.mediaType !== "tv");
    } else if (category === "tv-shows" || endpoint.startsWith("/trending/tv/")) {
      mappedMovies = mappedMovies.filter((i) => i.mediaType === "tv");
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
    console.error(`Failed to fetch trending ${category} from TMDB:`, error);
    const mediaFilter =
      category === "tv-shows" || selectedMedia === "tv_shows"
        ? "tv_shows"
        : category === "movies" || selectedMedia === "movies"
        ? "movies"
        : undefined;

    const baseMock = filterMockMovies(rowItems, {
      ...filterParams,
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

export async function getTrendingPersons(
  timeWindow: "day" | "week" | string = "week",
  page: number = 1,
  pageSize: number = 24
): Promise<TrendingPersonsResult | null> {
  const validTimeWindow =
    timeWindow === "day" || timeWindow === "today" ? "day" : "week";
  const endpoint = `/trending/person/${validTimeWindow}`;

  try {
    const startItem = (page - 1) * pageSize;
    const firstTmdbPage = Math.floor(startItem / 20) + 1;
    const secondTmdbPage = firstTmdbPage + 1;
    const thirdTmdbPage = firstTmdbPage + 2;
    const offset = startItem % 20;

    const [data1, data2, data3] = await Promise.all([
      tmdbFetch<TmdbPersonListResponse>(endpoint, {
        language: "en-US",
        page: firstTmdbPage.toString(),
      }),
      tmdbFetch<TmdbPersonListResponse>(endpoint, {
        language: "en-US",
        page: secondTmdbPage.toString(),
      }).catch(() => null),
      tmdbFetch<TmdbPersonListResponse>(endpoint, {
        language: "en-US",
        page: thirdTmdbPage.toString(),
      }).catch(() => null),
    ]);

    const combinedResults = [
      ...(data1?.results || []),
      ...(data2?.results || []),
      ...(data3?.results || []),
    ];

    const seen = new Set<number>();
    const deduplicatedResults: TmdbPerson[] = [];
    for (const p of combinedResults) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        deduplicatedResults.push(p);
      }
    }

    const mappedPersons = deduplicatedResults.map(mapTmdbToPersonItem);
    const selected = mappedPersons.slice(offset, offset + pageSize);
    const totalResults = data1?.total_results ?? mappedPersons.length;
    const totalPages = Math.min(Math.ceil(totalResults / pageSize), 500);

    return {
      persons: selected,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error(`Failed to fetch trending persons from TMDB:`, error);
    const mockPersonsList: Person[] = [
      { id: "1", name: "John Doe", role: "Actor", image: "/assets/persons-image.jpg" },
      { id: "2", name: "Jane Smith", role: "Director", image: "/assets/persons-image.jpg" },
      { id: "3", name: "Michael Lee", role: "Producer", image: "/assets/persons-image.jpg" },
      { id: "4", name: "Emma Brown", role: "Actress", image: "/assets/persons-image.jpg" },
      { id: "5", name: "David Kim", role: "Writer", image: "/assets/persons-image.jpg" },
      { id: "6", name: "Sophia Wilson", role: "Cinematographer", image: "/assets/persons-image.jpg" },
    ];
    const gridData = Array.from({ length: 36 }).map((_, i) => {
      const base = mockPersonsList[i % mockPersonsList.length];
      return { ...base, id: `${base.id}-${i}` };
    });

    return {
      persons: gridData.slice((page - 1) * pageSize, page * pageSize),
      totalPages: Math.max(1, Math.ceil(gridData.length / pageSize)),
      currentPage: page,
    };
  }
}

export async function searchPersons(
  query: string,
  page: number = 1,
  pageSize: number = 24
): Promise<TrendingPersonsResult | null> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return null;
  }

  try {
    const startItem = (page - 1) * pageSize;
    const firstTmdbPage = Math.floor(startItem / 20) + 1;
    const secondTmdbPage = firstTmdbPage + 1;
    const thirdTmdbPage = firstTmdbPage + 2;
    const offset = startItem % 20;

    const [data1, data2, data3] = await Promise.all([
      tmdbFetch<TmdbPersonListResponse>("/search/person", {
        query: trimmedQuery,
        language: "en-US",
        page: firstTmdbPage.toString(),
        include_adult: "false",
      }),
      tmdbFetch<TmdbPersonListResponse>("/search/person", {
        query: trimmedQuery,
        language: "en-US",
        page: secondTmdbPage.toString(),
        include_adult: "false",
      }).catch(() => null),
      tmdbFetch<TmdbPersonListResponse>("/search/person", {
        query: trimmedQuery,
        language: "en-US",
        page: thirdTmdbPage.toString(),
        include_adult: "false",
      }).catch(() => null),
    ]);

    const combinedResults = [
      ...(data1?.results || []),
      ...(data2?.results || []),
      ...(data3?.results || []),
    ];

    const seen = new Set<number>();
    const deduplicatedResults: TmdbPerson[] = [];
    for (const p of combinedResults) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        deduplicatedResults.push(p);
      }
    }

    const mappedPersons = deduplicatedResults.map(mapTmdbToPersonItem);
    const selected = mappedPersons.slice(offset, offset + pageSize);
    const totalResults = data1?.total_results || 0;
    const totalPages = Math.max(1, Math.min(Math.ceil(totalResults / pageSize), 500));

    return {
      persons: selected,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error(`Failed to search persons for query "${trimmedQuery}":`, error);
    const mockPersonsList: Person[] = [
      { id: "1", name: "John Doe", role: "Actor", image: "/assets/movie-placeholder.jpg", knownFor: "Action, Thriller" },
      { id: "2", name: "Jane Smith", role: "Director", image: "/assets/movie-placeholder.jpg", knownFor: "Drama, Sci-Fi" },
      { id: "3", name: "Michael Lee", role: "Producer", image: "/assets/movie-placeholder.jpg", knownFor: "Comedy" },
      { id: "4", name: "Emma Brown", role: "Actress", image: "/assets/movie-placeholder.jpg", knownFor: "Romance, Drama" },
      { id: "5", name: "David Kim", role: "Writer", image: "/assets/movie-placeholder.jpg", knownFor: "Animation" },
      { id: "6", name: "Sophia Wilson", role: "Cinematographer", image: "/assets/movie-placeholder.jpg", knownFor: "Adventure" },
      { id: "7", name: "Tom Cruise", role: "Acting", image: "/assets/movie-placeholder.jpg", knownFor: "Top Gun, Mission: Impossible" },
      { id: "8", name: "Christopher Nolan", role: "Directing", image: "/assets/movie-placeholder.jpg", knownFor: "Oppenheimer, Inception" },
      { id: "9", name: "Leonardo DiCaprio", role: "Acting", image: "/assets/movie-placeholder.jpg", knownFor: "Titanic, Inception" },
      { id: "10", name: "Cillian Murphy", role: "Acting", image: "/assets/movie-placeholder.jpg", knownFor: "Oppenheimer, Peaky Blinders" },
      { id: "11", name: "Margot Robbie", role: "Acting", image: "/assets/movie-placeholder.jpg", knownFor: "Barbie, Babylon" },
      { id: "12", name: "Zendaya", role: "Acting", image: "/assets/movie-placeholder.jpg", knownFor: "Dune, Euphoria" },
    ];
    const qLower = trimmedQuery.toLowerCase();
    const matched = mockPersonsList.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.role.toLowerCase().includes(qLower) ||
        (p.knownFor && p.knownFor.toLowerCase().includes(qLower))
    );

    return {
      persons: matched.slice((page - 1) * pageSize, page * pageSize),
      totalPages: Math.max(1, Math.ceil(matched.length / pageSize)),
      currentPage: page,
    };
  }
}

