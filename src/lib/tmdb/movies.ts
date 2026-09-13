import { tmdbFetch, getTmdbImageUrl } from "./tmdb";
import { fetchMovieTrailerKey } from "./trailers";
import type {
  TmdbMovieListResponse,
  TmdbGenreListResponse,
} from "./types";
import type { HeroContent, MovieItem } from "@/types";

let genreCache: Map<number, string> | null = null;
let tvGenreCache: Map<number, string> | null = null;

export async function getGenres(): Promise<Map<number, string>> {
  if (genreCache) return genreCache;

  try {
    const data = await tmdbFetch<TmdbGenreListResponse>(
      "/genre/movie/list",
      { language: "en-US" }
    );
    genreCache = new Map(data.genres.map((g) => [g.id, g.name]));
  } catch {
    genreCache = new Map(
      Object.entries(TMDB_GENRE_MAP).map(([name, id]) => [id, name])
    );
  }
  return genreCache;
}

export async function getTvGenres(): Promise<Map<number, string>> {
  if (tvGenreCache) return tvGenreCache;

  try {
    const data = await tmdbFetch<TmdbGenreListResponse>(
      "/genre/tv/list",
      { language: "en-US" }
    );
    tvGenreCache = new Map(data.genres.map((g) => [g.id, g.name]));
  } catch {
    tvGenreCache = new Map(
      Object.entries(TMDB_TV_GENRE_MAP).map(([name, id]) => [id, name])
    );
  }
  return tvGenreCache;
}

export interface GenreDefinition {
  canonical: string;
  movieIds: number[];
  tvIds: number[];
  tvKeywords?: number[];
}

export const GENRE_DEFINITIONS: Record<string, GenreDefinition> = {
  action: { canonical: "Action", movieIds: [28], tvIds: [10759] },
  adventure: { canonical: "Adventure", movieIds: [12], tvIds: [10759] },
  actionadventure: { canonical: "Action & Adventure", movieIds: [28, 12], tvIds: [10759] },
  animation: { canonical: "Animation", movieIds: [16], tvIds: [16] },
  anime: { canonical: "Animation", movieIds: [16], tvIds: [16] },
  comedy: { canonical: "Comedy", movieIds: [35], tvIds: [35] },
  crime: { canonical: "Crime", movieIds: [80], tvIds: [80] },
  documentary: { canonical: "Documentary", movieIds: [99], tvIds: [99] },
  drama: { canonical: "Drama", movieIds: [18], tvIds: [18] },
  family: { canonical: "Family", movieIds: [10751], tvIds: [10751] },
  fantasy: { canonical: "Fantasy", movieIds: [14], tvIds: [10765] },
  history: { canonical: "History", movieIds: [36], tvIds: [], tvKeywords: [282633, 15012, 239635, 159862] },
  horror: { canonical: "Horror", movieIds: [27], tvIds: [], tvKeywords: [315058, 226762, 50009, 351957, 178647] },
  music: { canonical: "Music", movieIds: [10402], tvIds: [], tvKeywords: [283297, 226971, 298780, 5699] },
  musical: { canonical: "Music", movieIds: [10402], tvIds: [], tvKeywords: [283297, 226971, 298780, 5699] },
  mystery: { canonical: "Mystery", movieIds: [9648], tvIds: [9648] },
  romance: { canonical: "Romance", movieIds: [10749], tvIds: [], tvKeywords: [9840, 188237, 200129, 212796, 284274] },
  romantic: { canonical: "Romance", movieIds: [10749], tvIds: [], tvKeywords: [9840, 188237, 200129, 212796, 284274] },
  scifi: { canonical: "Sci-Fi", movieIds: [878], tvIds: [10765] },
  sciencefiction: { canonical: "Sci-Fi", movieIds: [878], tvIds: [10765] },
  scififantasy: { canonical: "Sci-Fi & Fantasy", movieIds: [878, 14], tvIds: [10765] },
  tvmovie: { canonical: "TV Movie", movieIds: [10770], tvIds: [10751] },
  thriller: { canonical: "Thriller", movieIds: [53], tvIds: [], tvKeywords: [316362, 12565, 302132, 217282, 298530] },
  war: { canonical: "War", movieIds: [10752], tvIds: [10768] },
  warpolitics: { canonical: "War & Politics", movieIds: [10752], tvIds: [10768] },
  western: { canonical: "Western", movieIds: [37], tvIds: [37] },
  kids: { canonical: "Kids", movieIds: [10751, 16], tvIds: [10762] },
  news: { canonical: "News", movieIds: [99], tvIds: [10763] },
  reality: { canonical: "Reality", movieIds: [99], tvIds: [10764] },
  soap: { canonical: "Soap", movieIds: [18, 10749], tvIds: [10766] },
  talk: { canonical: "Talk", movieIds: [99], tvIds: [10767] },
};

export function resolveGenreDef(input: string): GenreDefinition | null {
  if (!input) return null;
  const key = input.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (GENRE_DEFINITIONS[key]) return GENRE_DEFINITIONS[key];
  for (const [k, def] of Object.entries(GENRE_DEFINITIONS)) {
    if (key === k) return def;
  }
  for (const def of Object.values(GENRE_DEFINITIONS)) {
    if (def.canonical.toLowerCase().replace(/[^a-z0-9]/g, "") === key) return def;
  }
  for (const [k, def] of Object.entries(GENRE_DEFINITIONS)) {
    if (key.length >= 4 && (key.includes(k) || k.includes(key))) return def;
  }
  return null;
}

export function matchesGenre(itemGenre: string, targetGenre: string): boolean {
  if (!itemGenre || !targetGenre) return false;
  const gLower = targetGenre.toLowerCase().trim();
  const def = resolveGenreDef(targetGenre);
  const canonical = (def?.canonical || targetGenre).toLowerCase().trim();
  const itemGenreLower = itemGenre.toLowerCase();
  const itemGenreList = itemGenreLower.split("/").map((s) => s.trim());

  return itemGenreList.some((ig) => {
    if (ig === gLower || ig === canonical) return true;
    if (gLower === "action" || canonical === "action") {
      return ig === "action" || ig === "action & adventure" || ig.startsWith("action ");
    }
    if (gLower === "adventure" || canonical === "adventure") {
      return ig === "adventure" || ig === "action & adventure" || ig.endsWith(" adventure");
    }
    if (gLower === "action & adventure" || canonical === "action & adventure") {
      return ig.includes("action") || ig.includes("adventure");
    }
    if (gLower === "sci-fi" || canonical === "sci-fi" || gLower === "science fiction") {
      return (
        ig === "sci-fi" ||
        ig === "science fiction" ||
        ig === "sci-fi & fantasy" ||
        ig.includes("sci-fi") ||
        ig.includes("science fiction")
      );
    }
    if (gLower === "fantasy" || canonical === "fantasy") {
      return ig === "fantasy" || ig === "sci-fi & fantasy" || ig.includes("fantasy");
    }
    if (gLower === "sci-fi & fantasy" || canonical === "sci-fi & fantasy") {
      return ig.includes("sci-fi") || ig.includes("fantasy") || ig.includes("science fiction");
    }
    if (gLower === "animation" || canonical === "animation") {
      return ig === "animation" || ig === "anime";
    }
    if (gLower === "family" || canonical === "family") {
      return ig === "family" || ig === "kids";
    }
    if (gLower === "kids" || canonical === "kids") {
      return ig === "kids" || ig === "family";
    }
    if (gLower === "music" || canonical === "music") {
      return ig === "music" || ig === "musical";
    }
    if (gLower === "romance" || canonical === "romance") {
      return ig === "romance" || ig === "romantic";
    }
    if (gLower === "war" || canonical === "war") {
      return ig === "war" || ig === "war & politics" || ig.includes("war");
    }
    if (gLower === "war & politics" || canonical === "war & politics") {
      return ig.includes("war") || ig.includes("politics");
    }
    return ig === gLower || ig === canonical || ig.includes(gLower) || gLower.includes(ig);
  });
}

export function formatItemGenre(
  genreNames: string[],
  targetGenre?: string,
  fallback: string = "Movie"
): string {
  if (!genreNames || genreNames.length === 0) {
    return targetGenre ? (resolveGenreDef(targetGenre)?.canonical || targetGenre) : fallback;
  }

  if (!targetGenre) {
    return genreNames.slice(0, 2).join(" / ");
  }

  const def = resolveGenreDef(targetGenre);
  const targetCanonical = def ? def.canonical : targetGenre;

  // Check if one of genreNames already matches the target genre
  const matchIndex = genreNames.findIndex((g) => matchesGenre(g, targetGenre));

  if (matchIndex !== -1) {
    const matched = def ? def.canonical : genreNames[matchIndex];
    const others = genreNames.filter((_, idx) => idx !== matchIndex);
    const reordered = [matched, ...others];
    return reordered.slice(0, 2).join(" / ");
  }

  // If item doesn't contain target genre, prepend canonical to guarantee display
  const combined = [targetCanonical, ...genreNames.filter((g) => g !== targetCanonical)];
  return combined.slice(0, 2).join(" / ");
}

export async function getNowPlayingMovies(
  limit: number = 5
): Promise<HeroContent[] | null> {
  try {
    const [moviesData, genreMap] = await Promise.all([
      tmdbFetch<TmdbMovieListResponse>("/movie/now_playing", {
        language: "en-US",
        page: "1",
      }),
      getGenres(),
    ]);

    const movies = moviesData.results
      .filter((m) => m.backdrop_path)
      .slice(0, limit);

    return await Promise.all(
      movies.map(async (movie) => {
        const trailerKey = await fetchMovieTrailerKey(movie.id);
        return {
          title: movie.title,
          description: movie.overview,
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear().toString()
            : "N/A",
          rating: movie.vote_average.toFixed(1),
          genres: movie.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => Boolean(name)),
          image: getTmdbImageUrl(movie.backdrop_path, "original"),
          trailerKey,
        };
      })
    );
  } catch (error) {
    console.error("Failed to fetch now-playing movies from TMDB:", error);
    return null;
  }
}

import {
  SORT_OPTIONS,
  DEFAULT_SORT_OPTION,
  normalizeSortOption,
  getSortOptionConfig,
  type MovieSortOption,
  type SortOptionConfig,
} from "./sort";

import {
  normalizeMovieFilter,
  type MovieFilterOption,
  type MovieFilterParams,
} from "./filters";

export {
  SORT_OPTIONS,
  DEFAULT_SORT_OPTION,
  normalizeSortOption,
  getSortOptionConfig,
  type MovieSortOption,
  type SortOptionConfig,
  normalizeMovieFilter,
  type MovieFilterOption,
  type MovieFilterParams,
};

const TMDB_GENRE_MAP: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  "Science Fiction": 878,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const TMDB_TV_GENRE_MAP: Record<string, number> = {
  "Action & Adventure": 10759,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Kids: 10762,
  Mystery: 9648,
  News: 10763,
  Reality: 10764,
  "Sci-Fi & Fantasy": 10765,
  Soap: 10766,
  Talk: 10767,
  "War & Politics": 10768,
  Western: 37,
};

const TMDB_COUNTRY_MAP: Record<string, string> = {
  USA: "US",
  UK: "GB",
  Canada: "CA",
  Australia: "AU",
  India: "IN",
  Japan: "JP",
  "South Korea": "KR",
  France: "FR",
  Germany: "DE",
  Italy: "IT",
  Spain: "ES",
  China: "CN",
  "Hong Kong": "HK",
  Taiwan: "TW",
  Mexico: "MX",
  Brazil: "BR",
  Argentina: "AR",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  Netherlands: "NL",
  Belgium: "BE",
  Poland: "PL",
  Ireland: "IE",
  Russia: "RU",
  Turkey: "TR",
  Thailand: "TH",
  Indonesia: "ID",
  Philippines: "PH",
  Vietnam: "VN",
  Nigeria: "NG",
  "South Africa": "ZA",
  Egypt: "EG",
  Iran: "IR",
  Israel: "IL",
  "New Zealand": "NZ",
  Bangladesh: "BD",
  Pakistan: "PK",
  Greece: "GR",
  Portugal: "PT",
  Colombia: "CO",
  Chile: "CL",
  Austria: "AT",
  Switzerland: "CH",
  "Czech Republic": "CZ",
  Hungary: "HU",
  Romania: "RO",
  Ukraine: "UA",
  "Saudi Arabia": "SA",
  UAE: "AE",
};

const TMDB_LANGUAGE_MAP: Record<string, string> = {
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Italian: "it",
  Portuguese: "pt",
  Russian: "ru",
  Hindi: "hi",
  Bengali: "bn",
  Tamil: "ta",
  Telugu: "te",
  Malayalam: "ml",
  Kannada: "kn",
  Marathi: "mr",
  Punjabi: "pa",
  Urdu: "ur",
  Gujarati: "gu",
  Japanese: "ja",
  Korean: "ko",
  Chinese: "zh",
  Cantonese: "cn",
  Thai: "th",
  Vietnamese: "vi",
  Indonesian: "id",
  Filipino: "tl",
  Malay: "ms",
  Arabic: "ar",
  Turkish: "tr",
  Persian: "fa",
  Hebrew: "he",
  Polish: "pl",
  Dutch: "nl",
  Swedish: "sv",
  Danish: "da",
  Norwegian: "no",
  Finnish: "fi",
  Greek: "el",
  Ukrainian: "uk",
  Czech: "cs",
  Hungarian: "hu",
  Romanian: "ro",
  Swahili: "sw",
};

export function deduplicateByTitleAndId<
  T extends { id?: string | number; title?: string }
>(items: T[]): T[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();

  return items.filter((item) => {
    if (!item) return false;
    const id =
      item.id !== undefined && item.id !== null
        ? String(item.id).trim()
        : null;
    const title = item.title ? item.title.trim().toLowerCase() : null;

    if (id && seenIds.has(id)) {
      return false;
    }
    if (title && seenTitles.has(title)) {
      return false;
    }

    if (id) seenIds.add(id);
    if (title) seenTitles.add(title);
    return true;
  });
}

export interface DiscoverMoviesResult {
  movies: MovieItem[];
  totalPages: number;
  currentPage: number;
}

export async function getDiscoverMovies(
  page: number = 1,
  sortBy: string = "popularity",
  pageSize: number = 24,
  filters: MovieFilterParams | string = "all"
): Promise<DiscoverMoviesResult | null> {
  const filterParams: MovieFilterParams =
    typeof filters === "string" ? { media: filters } : filters;

  const normalizedMedia = normalizeMovieFilter(filterParams.media);
  if (
    normalizedMedia === "tv_shows" ||
    normalizedMedia === "airing_today" ||
    normalizedMedia === "on_the_air"
  ) {
    return getDiscoverTvShows(page, sortBy, pageSize, filterParams);
  }

  const normalizedSort = normalizeSortOption(sortBy);
  const matchedConfig =
    SORT_OPTIONS.find((opt) => opt.value === normalizedSort) ?? SORT_OPTIONS[0];

  try {
    const startItem = (page - 1) * pageSize;
    const firstTmdbPage = Math.floor(startItem / 20) + 1;
    const offset = startItem % 20;

    const endpoint = "/discover/movie";
    const fetchParams1: Record<string, string> = {
      language: "en-US",
      page: firstTmdbPage.toString(),
      include_adult: "false",
    };

    fetchParams1["sort_by"] = matchedConfig.tmdbSort;
    if (normalizedSort === "rating") {
      fetchParams1["vote_count.gte"] = "100";
    }

    if (normalizedMedia === "released") {
      fetchParams1["primary_release_date.lte"] = new Date()
        .toISOString()
        .split("T")[0];
    } else if (normalizedMedia === "now_playing") {
      const today = new Date();
      const past = new Date();
      past.setDate(today.getDate() - 45);
      fetchParams1["primary_release_date.gte"] = past
        .toISOString()
        .split("T")[0];
      fetchParams1["primary_release_date.lte"] = today
        .toISOString()
        .split("T")[0];
    } else if (normalizedMedia === "upcoming") {
      const today = new Date();
      fetchParams1["primary_release_date.gte"] = today
        .toISOString()
        .split("T")[0];
    }

    // Add genres
    if (filterParams.genres && filterParams.genres.length > 0) {
      const genreClauses: string[] = [];
      for (const g of filterParams.genres) {
        const def = resolveGenreDef(g);
        if (def && def.movieIds.length > 0) {
          genreClauses.push(def.movieIds.join("|"));
        } else if (TMDB_GENRE_MAP[g]) {
          genreClauses.push(String(TMDB_GENRE_MAP[g]));
        }
      }
      if (genreClauses.length > 0) {
        fetchParams1["with_genres"] = genreClauses.join(",");
      } else {
        return {
          movies: [],
          totalPages: 0,
          currentPage: page,
        };
      }
    }

    // Add origin countries
    if (filterParams.countries && filterParams.countries.length > 0) {
      const countryCodes = filterParams.countries
        .map((c) => TMDB_COUNTRY_MAP[c])
        .filter(Boolean);
      if (countryCodes.length > 0) {
        fetchParams1["with_origin_country"] = countryCodes.join("|");
      }
    }

    // Add languages
    if (filterParams.languages && filterParams.languages.length > 0) {
      const langCodes = filterParams.languages
        .map((l) => TMDB_LANGUAGE_MAP[l])
        .filter(Boolean);
      if (langCodes.length > 0) {
        fetchParams1["with_original_language"] = langCodes.join("|");
      }
    }

    // Add years
    if (filterParams.years && filterParams.years.length > 0) {
      const numericYears = filterParams.years.filter(
        (y) => !isNaN(Number(y))
      );
      const hasBefore1970 = filterParams.years.some(
        (y) => y === "Before 1970" || y === "before-1970"
      );

      if (hasBefore1970 && numericYears.length === 0) {
        fetchParams1["primary_release_date.lte"] = "1969-12-31";
      } else if (numericYears.length === 1) {
        fetchParams1["primary_release_year"] = numericYears[0];
      } else if (numericYears.length > 1) {
        const sorted = numericYears.map(Number).sort((a, b) => a - b);
        fetchParams1["primary_release_date.gte"] = `${sorted[0]}-01-01`;
        fetchParams1[
          "primary_release_date.lte"
        ] = `${sorted[sorted.length - 1]}-12-31`;
      }
    }

    // Add rating
    if (filterParams.ratings && filterParams.ratings.length > 0) {
      const minRating = Math.min(
        ...filterParams.ratings.map(Number).filter((n) => !isNaN(n))
      );
      if (!isNaN(minRating) && minRating > 0) {
        fetchParams1["vote_average.gte"] = minRating.toString();
        if (normalizedSort !== "rating") {
          fetchParams1["vote_count.gte"] = "20";
        }
      }
    }

    // Add duration
    if (filterParams.durations && filterParams.durations.length > 0) {
      let minRuntime: number | null = null;
      let maxRuntime: number | null = null;
      const hasUnboundedMax = filterParams.durations.some((dur) => dur.includes("+"));

      for (const dur of filterParams.durations) {
        if (dur.includes("+")) {
          const val = parseInt(dur, 10);
          minRuntime = minRuntime === null ? val : Math.min(minRuntime, val);
        } else if (dur.includes("-")) {
          const [minStr, maxStr] = dur.split("-");
          const minVal = parseInt(minStr, 10);
          const maxVal = parseInt(maxStr, 10);
          minRuntime =
            minRuntime === null ? minVal : Math.min(minRuntime, minVal);
          maxRuntime =
            maxRuntime === null ? maxVal : Math.max(maxRuntime, maxVal);
        }
      }
      if (minRuntime !== null) {
        fetchParams1["with_runtime.gte"] = minRuntime.toString();
      }
      if (maxRuntime !== null && !hasUnboundedMax) {
        fetchParams1["with_runtime.lte"] = maxRuntime.toString();
      }
    }

    const fetchParams2: Record<string, string> = {
      ...fetchParams1,
      page: (firstTmdbPage + 1).toString(),
    };

    const [data1, data2, genreMap] = await Promise.all([
      tmdbFetch<TmdbMovieListResponse>(endpoint, fetchParams1),
      tmdbFetch<TmdbMovieListResponse>(endpoint, fetchParams2).catch(
        () => null
      ),
      getGenres().catch(() => new Map<number, string>()),
    ]);

    const rawCombined = [
      ...(data1.results || []),
      ...(data2?.results || []),
    ];

    const deduplicatedRaw: typeof rawCombined = [];
    const seenRawIds = new Set<number>();
    const seenRawTitles = new Set<string>();

    for (const movie of rawCombined) {
      if (!movie || !movie.id) continue;
      const titleKey = (movie.title || "").trim().toLowerCase();
      if (seenRawIds.has(movie.id)) continue;
      if (titleKey && seenRawTitles.has(titleKey)) continue;

      seenRawIds.add(movie.id);
      if (titleKey) seenRawTitles.add(titleKey);
      deduplicatedRaw.push(movie);
    }

    const requiredGenreIdGroups: number[][] = [];
    if (filterParams.genres && filterParams.genres.length > 0) {
      for (const g of filterParams.genres) {
        const def = resolveGenreDef(g);
        if (def && def.movieIds.length > 0) {
          requiredGenreIdGroups.push(def.movieIds);
        } else if (TMDB_GENRE_MAP[g]) {
          requiredGenreIdGroups.push([TMDB_GENRE_MAP[g]]);
        }
      }
    }

    const genreFilteredRaw =
      requiredGenreIdGroups.length > 0
        ? deduplicatedRaw.filter((movie) => {
            if (!movie.genre_ids || movie.genre_ids.length === 0) return false;
            return requiredGenreIdGroups.every((ids) =>
              ids.some((id) => movie.genre_ids?.includes(id))
            );
          })
        : deduplicatedRaw;

    const selected = genreFilteredRaw.slice(offset, offset + pageSize);
    const totalResults = data1?.total_results ?? genreFilteredRaw.length;
    const totalPages = Math.min(Math.ceil(totalResults / pageSize), 500);

    const targetGenreStr = filterParams.genres?.[0] || undefined;

    const mappedMovies = await Promise.all(
      selected.map(async (movie) => {
        const trailerKey = await fetchMovieTrailerKey(movie.id);
        const genreNames = (movie.genre_ids || [])
          .map((id) => genreMap.get(id))
          .filter((name): name is string => Boolean(name));

        return {
          id: movie.id.toString(),
          title: movie.title || `Movie ${movie.id}`,
          genre: formatItemGenre(genreNames, targetGenreStr, "Movie"),
          image: getTmdbImageUrl(
            movie.poster_path || movie.backdrop_path,
            "w500"
          ),
          trailerKey,
          mediaType: "movie" as const,
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear().toString()
            : undefined,
          rating: movie.vote_average
            ? movie.vote_average.toFixed(1)
            : undefined,
          voteCount: movie.vote_count,
          popularity: movie.popularity,
        };
      })
    );

    const movies = deduplicateByTitleAndId(mappedMovies).slice(0, pageSize);

    return {
      movies,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch discover/filtered movies from TMDB:", error);
    return {
      movies: [],
      totalPages: 1,
      currentPage: page,
    };
  }
}

export async function getDiscoverTvShows(
  page: number = 1,
  sortBy: string = "popularity",
  pageSize: number = 24,
  filters: MovieFilterParams | string = "all"
): Promise<DiscoverMoviesResult | null> {
  const filterParams: MovieFilterParams =
    typeof filters === "string" ? { media: filters } : filters;

  const normalizedMedia = normalizeMovieFilter(filterParams.media);
  if (
    normalizedMedia === "movies" ||
    normalizedMedia === "now_playing" ||
    normalizedMedia === "upcoming"
  ) {
    return getDiscoverMovies(page, sortBy, pageSize, filterParams);
  }

  const normalizedSort = normalizeSortOption(sortBy);

  try {
    const startItem = (page - 1) * pageSize;
    const firstTmdbPage = Math.floor(startItem / 20) + 1;
    const offset = startItem % 20;

    const endpoint = "/discover/tv";
    const fetchParams1: Record<string, string> = {
      language: "en-US",
      page: firstTmdbPage.toString(),
      include_adult: "false",
    };

    if (normalizedSort === "latest") {
      fetchParams1["sort_by"] = "first_air_date.desc";
      if (!filterParams.years || filterParams.years.length === 0) {
        fetchParams1["first_air_date.lte"] = new Date().toISOString().split("T")[0];
      }
    } else if (normalizedSort === "rating") {
      fetchParams1["sort_by"] = "vote_average.desc";
      fetchParams1["vote_count.gte"] = "50";
    } else if (normalizedSort === "title-asc") {
      fetchParams1["sort_by"] = "name.asc";
    } else if (normalizedSort === "title-desc") {
      fetchParams1["sort_by"] = "name.desc";
    } else if (normalizedSort === "most-rated") {
      fetchParams1["sort_by"] = "vote_count.desc";
    } else {
      fetchParams1["sort_by"] = "popularity.desc";
    }

    if (normalizedMedia === "airing_today") {
      const today = new Date().toISOString().split("T")[0];
      fetchParams1["air_date.gte"] = today;
      fetchParams1["air_date.lte"] = today;
    } else if (normalizedMedia === "on_the_air") {
      const today = new Date();
      const next7 = new Date();
      next7.setDate(today.getDate() + 7);
      fetchParams1["air_date.gte"] = today.toISOString().split("T")[0];
      fetchParams1["air_date.lte"] = next7.toISOString().split("T")[0];
    }

    // Add TV genres & keywords
    if (filterParams.genres && filterParams.genres.length > 0) {
      const genreClauses: string[] = [];
      const keywords: number[] = [];
      for (const g of filterParams.genres) {
        const def = resolveGenreDef(g);
        if (def) {
          if (def.tvIds.length > 0) genreClauses.push(def.tvIds.join("|"));
          if (def.tvKeywords && def.tvKeywords.length > 0) keywords.push(...def.tvKeywords);
        } else if (TMDB_TV_GENRE_MAP[g]) {
          genreClauses.push(String(TMDB_TV_GENRE_MAP[g]));
        }
      }
      const uniqueKeywords = Array.from(new Set(keywords));

      if (genreClauses.length > 0) {
        fetchParams1["with_genres"] = genreClauses.join(",");
      }
      if (uniqueKeywords.length > 0) {
        fetchParams1["with_keywords"] = uniqueKeywords.join("|");
      }

      if (genreClauses.length === 0 && uniqueKeywords.length === 0) {
        return {
          movies: [],
          totalPages: 0,
          currentPage: page,
        };
      }
    }

    // Add origin countries
    if (filterParams.countries && filterParams.countries.length > 0) {
      const countryCodes = filterParams.countries
        .map((c) => TMDB_COUNTRY_MAP[c])
        .filter(Boolean);
      if (countryCodes.length > 0) {
        fetchParams1["with_origin_country"] = countryCodes.join("|");
      }
    }

    // Add languages
    if (filterParams.languages && filterParams.languages.length > 0) {
      const langCodes = filterParams.languages
        .map((l) => TMDB_LANGUAGE_MAP[l])
        .filter(Boolean);
      if (langCodes.length > 0) {
        fetchParams1["with_original_language"] = langCodes.join("|");
      }
    }

    // Add years
    if (filterParams.years && filterParams.years.length > 0) {
      const numericYears = filterParams.years.filter(
        (y) => !isNaN(Number(y))
      );
      const hasBefore1970 = filterParams.years.some(
        (y) => y === "Before 1970" || y === "before-1970"
      );

      if (hasBefore1970 && numericYears.length === 0) {
        fetchParams1["first_air_date.lte"] = "1969-12-31";
      } else if (numericYears.length === 1) {
        fetchParams1["first_air_date_year"] = numericYears[0];
      } else if (numericYears.length > 1) {
        const sorted = numericYears.map(Number).sort((a, b) => a - b);
        fetchParams1["first_air_date.gte"] = `${sorted[0]}-01-01`;
        fetchParams1[
          "first_air_date.lte"
        ] = `${sorted[sorted.length - 1]}-12-31`;
      }
    }

    // Add ratings
    if (filterParams.ratings && filterParams.ratings.length > 0) {
      const minRating = Math.min(
        ...filterParams.ratings.map(Number).filter((n) => !isNaN(n))
      );
      if (!isNaN(minRating) && minRating > 0) {
        fetchParams1["vote_average.gte"] = minRating.toString();
        if (normalizedSort !== "rating") {
          fetchParams1["vote_count.gte"] = "15";
        }
      }
    }

    // Add duration
    if (filterParams.durations && filterParams.durations.length > 0) {
      let minRuntime: number | null = null;
      let maxRuntime: number | null = null;
      for (const dur of filterParams.durations) {
        if (dur.includes("+")) {
          const val = parseInt(dur, 10);
          minRuntime = minRuntime === null ? val : Math.min(minRuntime, val);
        } else if (dur.includes("-")) {
          const [minStr, maxStr] = dur.split("-");
          const minVal = parseInt(minStr, 10);
          const maxVal = parseInt(maxStr, 10);
          minRuntime =
            minRuntime === null ? minVal : Math.min(minRuntime, minVal);
          maxRuntime =
            maxRuntime === null ? maxVal : Math.max(maxRuntime, maxVal);
        }
      }
      if (minRuntime !== null) {
        fetchParams1["with_runtime.gte"] = minRuntime.toString();
      }
      if (maxRuntime !== null) {
        fetchParams1["with_runtime.lte"] = maxRuntime.toString();
      }
    }

    const fetchParams2: Record<string, string> = {
      ...fetchParams1,
      page: (firstTmdbPage + 1).toString(),
    };

    interface TmdbTvItem {
      id: number;
      name?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      genre_ids?: number[];
      first_air_date?: string;
      vote_average?: number;
      vote_count?: number;
      popularity?: number;
    }

    interface TmdbTvListResponse {
      page: number;
      results: TmdbTvItem[];
      total_pages: number;
      total_results: number;
    }

    const [data1, data2, tvGenreMap] = await Promise.all([
      tmdbFetch<TmdbTvListResponse>(endpoint, fetchParams1),
      tmdbFetch<TmdbTvListResponse>(endpoint, fetchParams2).catch(() => null),
      getTvGenres().catch(() => new Map<number, string>()),
    ]);

    const rawTvCombined = [
      ...(data1.results || []),
      ...(data2?.results || []),
    ];

    const deduplicatedTvRaw: typeof rawTvCombined = [];
    const seenTvRawIds = new Set<number>();
    const seenTvRawTitles = new Set<string>();

    for (const tv of rawTvCombined) {
      if (!tv || !tv.id) continue;
      const titleKey = (tv.name || "").trim().toLowerCase();
      if (seenTvRawIds.has(tv.id)) continue;
      if (titleKey && seenTvRawTitles.has(titleKey)) continue;

      seenTvRawIds.add(tv.id);
      if (titleKey) seenTvRawTitles.add(titleKey);
      deduplicatedTvRaw.push(tv);
    }

    const targetTvIdGroups: number[][] = [];
    if (filterParams.genres && filterParams.genres.length > 0) {
      for (const g of filterParams.genres) {
        const def = resolveGenreDef(g);
        if (def) {
          if (def.tvIds.length > 0) targetTvIdGroups.push(def.tvIds);
        } else if (TMDB_TV_GENRE_MAP[g]) {
          targetTvIdGroups.push([TMDB_TV_GENRE_MAP[g]]);
        }
      }
    }

    const genreFilteredTvRaw =
      targetTvIdGroups.length > 0
        ? deduplicatedTvRaw.filter((tv) => {
            if (!tv.genre_ids || tv.genre_ids.length === 0) return false;
            return targetTvIdGroups.every((ids) =>
              ids.some((id) => tv.genre_ids?.includes(id))
            );
          })
        : deduplicatedTvRaw;

    const selected = genreFilteredTvRaw.slice(offset, offset + pageSize);
    const totalResults = data1?.total_results ?? genreFilteredTvRaw.length;
    const totalPages = Math.min(Math.ceil(totalResults / pageSize), 500);

    const targetGenreStr = filterParams.genres?.[0] || undefined;

    const mappedMovies: MovieItem[] = selected.map((tv) => {
      const genreNames = (tv.genre_ids || [])
        .map((id) => tvGenreMap.get(id))
        .filter((name): name is string => Boolean(name));

      return {
        id: tv.id.toString(),
        title: tv.name || `TV Show ${tv.id}`,
        genre: formatItemGenre(genreNames, targetGenreStr, "TV Show"),
        image: getTmdbImageUrl(tv.poster_path || tv.backdrop_path || null, "w500"),
        trailerKey: null,
        mediaType: "tv" as const,
        year: tv.first_air_date ? new Date(tv.first_air_date).getFullYear().toString() : undefined,
        rating: tv.vote_average ? tv.vote_average.toFixed(1) : undefined,
        voteCount: tv.vote_count,
        popularity: tv.popularity,
      };
    });

    const movies = deduplicateByTitleAndId(mappedMovies).slice(0, pageSize);

    return {
      movies,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch discover/filtered TV shows:", error);
    return {
      movies: [],
      totalPages: 1,
      currentPage: page,
    };
  }
}

export async function getDiscoverMixed(
  page: number = 1,
  sortBy: string = "popularity",
  pageSize: number = 24,
  filters: MovieFilterParams | string = "all",
  baseGenre?: string
): Promise<DiscoverMoviesResult | null> {
  const filterParams: MovieFilterParams =
    typeof filters === "string" ? { media: filters } : { ...filters };

  if (baseGenre) {
    const def = resolveGenreDef(baseGenre);
    const canonicalGenre = def ? def.canonical : baseGenre;
    if (!filterParams.genres || filterParams.genres.length === 0) {
      filterParams.genres = [canonicalGenre];
    } else if (!filterParams.genres.some((g) => resolveGenreDef(g)?.canonical === canonicalGenre)) {
      filterParams.genres = [canonicalGenre, ...filterParams.genres];
    }
  }

  const normalizedMedia = normalizeMovieFilter(filterParams.media);

  if (normalizedMedia === "tv_shows" || normalizedMedia === "airing_today" || normalizedMedia === "on_the_air") {
    return getDiscoverTvShows(page, sortBy, pageSize, filterParams);
  }

  if (normalizedMedia === "now_playing" || normalizedMedia === "upcoming" || normalizedMedia === "movies") {
    return getDiscoverMovies(page, sortBy, pageSize, filterParams);
  }

  // Exactly 16 movies and 8 TV shows for 24 results per page
  const movieCount = Math.round(pageSize * (16 / 24));
  const tvCount = pageSize - movieCount;

  // Mixed: fetch both Movies (16) and TV Shows (8) concurrently
  try {
    const [moviesResult, tvResult] = await Promise.all([
      getDiscoverMovies(page, sortBy, movieCount, { ...filterParams, media: "movies" }),
      getDiscoverTvShows(page, sortBy, tvCount, { ...filterParams, media: "tv_shows" }),
    ]);

    const movieList = moviesResult?.movies ?? [];
    const tvList = tvResult?.movies ?? [];

    if (movieList.length === 0 && tvList.length === 0) {
      return {
        movies: [],
        totalPages: 1,
        currentPage: page,
      };
    }

    if (tvList.length === 0) {
      return moviesResult;
    }

    if (movieList.length === 0) {
      return tvResult;
    }

    // Interleave 2 movies and 1 TV show for 16 movies and 8 TV shows (24 results total)
    const mixed: MovieItem[] = [];
    let mIdx = 0;
    let tIdx = 0;

    while (mIdx < movieList.length || tIdx < tvList.length) {
      if (mIdx < movieList.length) mixed.push(movieList[mIdx++]);
      if (mIdx < movieList.length) mixed.push(movieList[mIdx++]);
      if (tIdx < tvList.length) mixed.push(tvList[tIdx++]);
    }

    const deduplicatedMixed = deduplicateByTitleAndId(mixed);
    const totalPages = Math.max(moviesResult?.totalPages ?? 1, tvResult?.totalPages ?? 1);

    return {
      movies: deduplicatedMixed.slice(0, pageSize),
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch discover mixed content from TMDB:", error);
    return {
      movies: [],
      totalPages: 1,
      currentPage: page,
    };
  }
}

// Backward-compatible alias
export type MovieChangesResult = DiscoverMoviesResult;
export async function getMovieChanges(
  page: number = 1
): Promise<DiscoverMoviesResult | null> {
  return getDiscoverMovies(page, "popularity");
}

