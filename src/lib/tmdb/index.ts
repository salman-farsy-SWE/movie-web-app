export {
  getNowPlayingMovies,
  getDiscoverMovies,
  getDiscoverTvShows,
  getDiscoverMixed,
  getMovieChanges,
  deduplicateByTitleAndId,
  getTvGenres,
  resolveGenreDef,
  GENRE_DEFINITIONS,
  type DiscoverMoviesResult,
  type MovieChangesResult,
  type GenreDefinition,
} from "./movies";

export {
  searchMoviesAndTv,
  type SearchMediaResult,
  type SearchMediaType,
} from "./search";

export {
  SORT_OPTIONS,
  MOVIE_SORT_OPTIONS,
  TV_SORT_OPTIONS,
  MIXED_SORT_OPTIONS,
  getSortOptionsByContext,
  DEFAULT_SORT_OPTION,
  normalizeSortOption,
  getSortOptionConfig,
  type MovieSortOption,
  type SortOptionConfig,
} from "./sort";

export {
  saveBasePage,
  getBasePage,
  clearBasePage,
} from "../page-memory";

export {
  FILTER_GENRES,
  MOVIE_GENRES,
  TV_GENRES,
  MIXED_GENRES,
  getGenresByContext,
  FILTER_COUNTRIES,
  FILTER_LANGUAGES,
  FILTER_RATINGS,
  FILTER_DURATIONS,
  MEDIA_FILTER_OPTIONS,
  MOVIE_MEDIA_OPTIONS,
  TV_MEDIA_OPTIONS,
  TRENDING_MEDIA_OPTIONS,
  TRENDING_TIME_WINDOW_OPTIONS,
  TMDB_COUNTRY_MAP,
  TMDB_LANGUAGE_MAP,
  MIXED_MEDIA_OPTIONS,
  getMediaFilterOptions,
  YEAR_OPTIONS,
  getYearFilterOptions,
  AVAILABLE_GENRES,
  AVAILABLE_COUNTRIES,
  AVAILABLE_LANGUAGES,
  AVAILABLE_RATINGS,
  AVAILABLE_DURATIONS,
  FILTER_PARAM_KEYS,
  normalizeMovieFilter,
  normalizeMediaFilter,
  isFilterActive,
  countActiveFilters,
  parseFilterParamArray,
  parseFilterParams,
  clearFilterParams,
  type FilterContextType,
  type FilterGenre,
  type FilterCountry,
  type FilterLanguage,
  type FilterRating,
  type FilterDuration,
  type MovieFilterOption,
  type MovieFilterParams,
  type MediaFilterOptionItem,
} from "./filters";

export {
  getTrendingAll,
  getTopRatedAll,
  getPopularMovies,
  getTrendingTvShows,
} from "./home";

export {
  getTrendingContent,
  getTrendingPersons,
  searchPersons,
  type TrendingMediaResult,
  type TrendingPersonsResult,
  type TrendingCategory,
} from "./trending";

export {
  getTopRatedContent,
  type TopRatedMediaResult,
  type TopRatedCategory,
} from "./top-rated";

export {
  mapTmdbToMovieItem,
  mapTmdbToPersonItem,
  LANG_CODE_TO_NAME,
  COUNTRY_CODE_TO_NAME,
  inferCountryFromLanguage,
} from "./mapper";

export {
  fetchMovieTrailerKey,
  fetchTvTrailerKey,
  getYouTubeTrailerKey,
} from "./trailers";

export { tmdbFetch, getTmdbImageUrl } from "./tmdb";

export {
  getMediaDetails,
  getPersonDetails,
  getPersonDetailsByName,
  type MediaDetailsData,
  type PersonDetailsData,
} from "./details";

export type {
  TmdbMovie,
  TmdbTvShow,
  TmdbGenre,
  TmdbVideo,
  TmdbPerson,
  TmdbPersonListResponse,
  TmdbMovieListResponse,
  TmdbTvListResponse,
  TmdbVideoListResponse,
  TmdbGenreListResponse,
} from "./types";

