export type FilterContextType =
  | "movie"
  | "tv"
  | "mixed"
  | "genre"
  | "trending"
  | "collection"
  | "rating"
  | "custom_lists";

export const MOVIE_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
] as const;

export const TV_GENRES = [
  "Action & Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Kids",
  "Mystery",
  "News",
  "Reality",
  "Sci-Fi & Fantasy",
  "Soap",
  "Talk",
  "War & Politics",
  "Western",
] as const;

export const MIXED_GENRES = Array.from(
  new Set([...MOVIE_GENRES, ...TV_GENRES])
).sort((a, b) => a.localeCompare(b));

export const FILTER_GENRES = MIXED_GENRES;

export function getGenresByContext(
  context?: FilterContextType
): readonly string[] {
  if (context === "movie") return MOVIE_GENRES;
  if (context === "tv") return TV_GENRES;
  return MIXED_GENRES;
}

export const FILTER_COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "India",
  "Japan",
  "South Korea",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "China",
  "Hong Kong",
  "Taiwan",
  "Mexico",
  "Brazil",
  "Argentina",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Netherlands",
  "Belgium",
  "Poland",
  "Ireland",
  "Russia",
  "Turkey",
  "Thailand",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "Nigeria",
  "South Africa",
  "Egypt",
  "Iran",
  "Israel",
  "New Zealand",
  "Bangladesh",
  "Pakistan",
  "Greece",
  "Portugal",
  "Colombia",
  "Chile",
  "Austria",
  "Switzerland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Ukraine",
  "Saudi Arabia",
  "UAE",
] as const;

export const FILTER_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Marathi",
  "Punjabi",
  "Urdu",
  "Gujarati",
  "Japanese",
  "Korean",
  "Chinese",
  "Cantonese",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Filipino",
  "Malay",
  "Arabic",
  "Turkish",
  "Persian",
  "Hebrew",
  "Polish",
  "Dutch",
  "Swedish",
  "Danish",
  "Norwegian",
  "Finnish",
  "Greek",
  "Ukrainian",
  "Czech",
  "Hungarian",
  "Romanian",
  "Swahili",
] as const;

export const TMDB_COUNTRY_MAP: Record<string, string> = {
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

export const TMDB_LANGUAGE_MAP: Record<string, string> = {
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

export const FILTER_RATINGS = ["3", "4", "5", "6", "7", "8", "9"] as const;

export const FILTER_DURATIONS = [
  "0-60",
  "60-90",
  "90-120",
  "120-150",
  "150+",
] as const;

export type MovieFilterOption =
  | "all"
  | "now_playing"
  | "upcoming"
  | "released"
  | "airing_today"
  | "on_the_air"
  | "movies"
  | "tv_shows";

export interface MediaFilterOptionItem {
  id: string;
  value: string;
  label: string;
}

export const MOVIE_MEDIA_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "media-all", value: "all", label: "All" },
  { id: "media-now-playing", value: "now_playing", label: "Now Playing" },
  { id: "media-upcoming", value: "upcoming", label: "Upcoming" },
  { id: "media-released", value: "released", label: "Released" },
] as const;

export const TV_MEDIA_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "tv-media-all", value: "all", label: "All" },
  { id: "tv-media-airing-today", value: "airing_today", label: "Airing Today" },
  { id: "tv-media-on-the-air", value: "on_the_air", label: "On The Air" },
] as const;

export const TRENDING_MEDIA_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "trending-media-all", value: "all", label: "All" },
  { id: "trending-media-movies", value: "movies", label: "Movies" },
  { id: "trending-media-tv-shows", value: "tv_shows", label: "TV Shows" },
] as const;

export const TRENDING_TIME_WINDOW_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "window-today", value: "day", label: "Today" },
  { id: "window-this-week", value: "week", label: "This Week" },
] as const;

export const MIXED_MEDIA_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "mixed-media-all", value: "all", label: "All" },
  { id: "mixed-media-movies", value: "movies", label: "Movies" },
  { id: "mixed-media-tv-shows", value: "tv_shows", label: "TV Shows" },
  { id: "mixed-media-now-playing", value: "now_playing", label: "Now Playing" },
  { id: "mixed-media-upcoming", value: "upcoming", label: "Upcoming" },
  { id: "mixed-media-released", value: "released", label: "Released" },
  { id: "mixed-media-airing-today", value: "airing_today", label: "Airing Today" },
  { id: "mixed-media-on-the-air", value: "on_the_air", label: "On The Air" },
] as const;

export const COLLECTION_MEDIA_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "collection-media-all", value: "all", label: "All" },
  { id: "collection-media-movies", value: "movies", label: "Movies" },
  { id: "collection-media-tv-shows", value: "tv_shows", label: "TV Shows" },
] as const;

export const CUSTOM_LIST_VISIBILITY_OPTIONS: readonly MediaFilterOptionItem[] = [
  { id: "visibility-all", value: "all", label: "All Lists" },
  { id: "visibility-public", value: "public", label: "Public Only" },
  { id: "visibility-private", value: "private", label: "Private Only" },
] as const;

export const MEDIA_FILTER_OPTIONS = MIXED_MEDIA_OPTIONS;

export function getMediaFilterOptions(
  context?: FilterContextType
): readonly MediaFilterOptionItem[] {
  if (context === "movie") return MOVIE_MEDIA_OPTIONS;
  if (context === "tv") return TV_MEDIA_OPTIONS;
  if (context === "trending") return TRENDING_MEDIA_OPTIONS;
  if (context === "collection" || context === "rating") return COLLECTION_MEDIA_OPTIONS;
  if (context === "custom_lists") return CUSTOM_LIST_VISIBILITY_OPTIONS;
  return MIXED_MEDIA_OPTIONS;
}

export const getYearFilterOptions = (
  currentYear: number = new Date().getFullYear()
) => ({
  "2020s": Array.from({ length: 10 }, (_, i) => 2020 + i).filter(
    (y) => y <= currentYear
  ),
  "2010s": Array.from({ length: 10 }, (_, i) => 2010 + i).filter(
    (y) => y <= currentYear
  ),
  "2000s": Array.from({ length: 10 }, (_, i) => 2000 + i).filter(
    (y) => y <= currentYear
  ),
  "1990s": Array.from({ length: 10 }, (_, i) => 1990 + i).filter(
    (y) => y <= currentYear
  ),
  "1980s": Array.from({ length: 10 }, (_, i) => 1980 + i).filter(
    (y) => y <= currentYear
  ),
  "1970s": Array.from({ length: 10 }, (_, i) => 1970 + i).filter(
    (y) => y <= currentYear
  ),
});

export const YEAR_OPTIONS = getYearFilterOptions();

// Aliases for convenience
export const AVAILABLE_GENRES = FILTER_GENRES;
export const AVAILABLE_COUNTRIES = FILTER_COUNTRIES;
export const AVAILABLE_LANGUAGES = FILTER_LANGUAGES;
export const AVAILABLE_RATINGS = FILTER_RATINGS;
export const AVAILABLE_DURATIONS = FILTER_DURATIONS;

export type FilterGenre = (typeof FILTER_GENRES)[number];
export type FilterCountry = (typeof FILTER_COUNTRIES)[number];
export type FilterLanguage = (typeof FILTER_LANGUAGES)[number];
export type FilterRating = (typeof FILTER_RATINGS)[number];
export type FilterDuration = (typeof FILTER_DURATIONS)[number];

export interface MovieFilterParams {
  media?: string;
  time_window?: string;
  region?: string;
  genres?: string[];
  countries?: string[];
  languages?: string[];
  years?: string[];
  ratings?: string[];
  durations?: string[];
}

export const FILTER_PARAM_KEYS = [
  "media",
  "time_window",
  "genre",
  "country",
  "language",
  "year",
  "rating",
  "duration",
] as const;

export function normalizeMovieFilter(raw?: string | null): string {
  if (!raw) return "all";
  const lower = raw.trim().toLowerCase();
  switch (lower) {
    case "now_playing":
    case "now-playing":
    case "now playing":
      return "now_playing";
    case "upcoming":
      return "upcoming";
    case "released":
      return "released";
    case "airing_today":
    case "airing-today":
    case "airing today":
      return "airing_today";
    case "on_the_air":
    case "on-the-air":
    case "on the air":
      return "on_the_air";
    case "movies":
    case "movie":
      return "movies";
    case "tv_shows":
    case "tv-shows":
    case "tv":
      return "tv_shows";
    default:
      return "all";
  }
}

export const normalizeMediaFilter = normalizeMovieFilter;

export function parseFilterParamArray(
  value?: string | string[] | null
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseFilterParams(
  source?:
    | URLSearchParams
    | { get?: (key: string) => string | null; [key: string]: unknown }
    | null
): MovieFilterParams {
  if (!source) {
    return {
      media: "all",
      time_window: undefined,
      region: undefined,
      genres: [],
      countries: [],
      languages: [],
      years: [],
      ratings: [],
      durations: [],
    };
  }

  if (typeof source.get === "function") {
    const rawTimeWindow = source.get("time_window");
    const rawRegion = source.get("region");
    return {
      media: normalizeMovieFilter(source.get("media")),
      time_window: rawTimeWindow ? rawTimeWindow.trim() : undefined,
      region: rawRegion ? rawRegion.trim() : undefined,
      genres: parseFilterParamArray(source.get("genre")),
      countries: parseFilterParamArray(source.get("country")),
      languages: parseFilterParamArray(source.get("language")),
      years: parseFilterParamArray(source.get("year")),
      ratings: parseFilterParamArray(source.get("rating")),
      durations: parseFilterParamArray(source.get("duration")),
    };
  }

  const obj = source as Record<string, unknown>;
  const rawMedia = typeof obj.media === "string" ? obj.media : null;
  const rawTimeWindow = typeof obj.time_window === "string" ? obj.time_window : undefined;
  const rawRegion = typeof obj.region === "string" ? obj.region : undefined;

  return {
    media: normalizeMovieFilter(rawMedia),
    time_window: rawTimeWindow,
    region: rawRegion,
    genres: parseFilterParamArray(
      (obj.genre || obj.genres) as string | string[] | undefined
    ),
    countries: parseFilterParamArray(
      (obj.country || obj.countries) as string | string[] | undefined
    ),
    languages: parseFilterParamArray(
      (obj.language || obj.languages) as string | string[] | undefined
    ),
    years: parseFilterParamArray(
      (obj.year || obj.years) as string | string[] | undefined
    ),
    ratings: parseFilterParamArray(
      (obj.rating || obj.ratings) as string | string[] | undefined
    ),
    durations: parseFilterParamArray(
      (obj.duration || obj.durations) as string | string[] | undefined
    ),
  };
}

export function isFilterActive(
  params?:
    | URLSearchParams
    | MovieFilterParams
    | { get?: (key: string) => string | null; [key: string]: unknown }
    | null
): boolean {
  if (!params) return false;

  if ("get" in params && typeof params.get === "function") {
    const media = params.get("media");
    const timeWindow = params.get("time_window");
    const region = params.get("region");
    return Boolean(
      (media && media.toLowerCase() !== "all") ||
        (timeWindow && timeWindow.toLowerCase() !== "week") ||
        region ||
        params.get("genre") ||
        params.get("country") ||
        params.get("language") ||
        params.get("year") ||
        params.get("rating") ||
        params.get("duration")
    );
  }

  const obj = params as Record<string, unknown>;
  const media = typeof obj.media === "string" ? obj.media : undefined;
  const timeWindow = typeof obj.time_window === "string" ? obj.time_window : undefined;
  const isMediaActive = Boolean(media && media.toLowerCase() !== "all");
  const isTimeWindowActive = Boolean(timeWindow && timeWindow.toLowerCase() !== "week");
  const isRegionActive = Boolean(obj.region);

  const hasArrayOrString = (val: unknown) => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim().length > 0;
    return false;
  };

  return (
    isMediaActive ||
    isTimeWindowActive ||
    isRegionActive ||
    hasArrayOrString(obj.genre) ||
    hasArrayOrString(obj.genres) ||
    hasArrayOrString(obj.country) ||
    hasArrayOrString(obj.countries) ||
    hasArrayOrString(obj.language) ||
    hasArrayOrString(obj.languages) ||
    hasArrayOrString(obj.year) ||
    hasArrayOrString(obj.years) ||
    hasArrayOrString(obj.rating) ||
    hasArrayOrString(obj.ratings) ||
    hasArrayOrString(obj.duration) ||
    hasArrayOrString(obj.durations)
  );
}

export function countActiveFilters(filters: MovieFilterParams): number {
  return (
    (filters.media && filters.media !== "all" ? 1 : 0) +
    (filters.time_window && filters.time_window !== "week" ? 1 : 0) +
    (filters.region ? 1 : 0) +
    (filters.genres?.length || 0) +
    (filters.countries?.length || 0) +
    (filters.languages?.length || 0) +
    (filters.years?.length || 0) +
    (filters.ratings?.length || 0) +
    (filters.durations?.length || 0)
  );
}

export function clearFilterParams(params: URLSearchParams): void {
  for (const key of FILTER_PARAM_KEYS) {
    params.delete(key);
  }
}

