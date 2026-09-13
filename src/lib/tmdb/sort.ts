import type { FilterContextType } from "./filters";

export type MovieSortOption =
  | "popularity"
  | "latest"
  | "rating"
  | "most-rated"
  | "title-asc"
  | "title-desc"
  | "latest-added"
  | "rating-asc"
  | "release-asc"
  | "your-rating-desc"
  | "your-rating-asc"
  | "items-desc"
  | "items-asc";

export interface SortOptionConfig {
  label: string;
  value: MovieSortOption;
  tmdbSort: string;
}

export const DEFAULT_SORT_OPTION: MovieSortOption = "popularity";

export const MOVIE_SORT_OPTIONS: readonly SortOptionConfig[] = [
  { label: "Popularity", value: "popularity", tmdbSort: "popularity.desc" },
  { label: "Latest", value: "latest", tmdbSort: "primary_release_date.desc" },
  { label: "Rating", value: "rating", tmdbSort: "vote_average.desc" },
  { label: "Most Rated", value: "most-rated", tmdbSort: "vote_count.desc" },
  { label: "Title A-Z", value: "title-asc", tmdbSort: "original_title.asc" },
  { label: "Title Z-A", value: "title-desc", tmdbSort: "original_title.desc" },
] as const;

export const TV_SORT_OPTIONS: readonly SortOptionConfig[] = [
  { label: "Popularity", value: "popularity", tmdbSort: "popularity.desc" },
  { label: "Latest", value: "latest", tmdbSort: "first_air_date.desc" },
  { label: "Rating", value: "rating", tmdbSort: "vote_average.desc" },
  { label: "Most Rated", value: "most-rated", tmdbSort: "vote_count.desc" },
  { label: "Title A-Z", value: "title-asc", tmdbSort: "name.asc" },
  { label: "Title Z-A", value: "title-desc", tmdbSort: "name.desc" },
] as const;

export const MIXED_SORT_OPTIONS: readonly SortOptionConfig[] = [
  { label: "Popularity", value: "popularity", tmdbSort: "popularity.desc" },
  { label: "Latest", value: "latest", tmdbSort: "primary_release_date.desc" },
  { label: "Rating", value: "rating", tmdbSort: "vote_average.desc" },
  { label: "Most Rated", value: "most-rated", tmdbSort: "vote_count.desc" },
  { label: "Title A-Z", value: "title-asc", tmdbSort: "original_title.asc" },
  { label: "Title Z-A", value: "title-desc", tmdbSort: "original_title.desc" },
] as const;

export const COLLECTION_SORT_OPTIONS: readonly SortOptionConfig[] = [
  { label: "Recently Added", value: "latest-added", tmdbSort: "created_at.desc" },
  { label: "Rating (High to Low)", value: "rating", tmdbSort: "rating.desc" },
  { label: "Rating (Low to High)", value: "rating-asc", tmdbSort: "rating.asc" },
  { label: "Release Date (Newest)", value: "latest", tmdbSort: "release_date.desc" },
  { label: "Release Date (Oldest)", value: "release-asc", tmdbSort: "release_date.asc" },
  { label: "Title A-Z", value: "title-asc", tmdbSort: "title.asc" },
  { label: "Title Z-A", value: "title-desc", tmdbSort: "title.desc" },
] as const;

export const RATING_COLLECTION_SORT_OPTIONS: readonly SortOptionConfig[] = [
  { label: "Recently Added", value: "latest-added", tmdbSort: "created_at.desc" },
  { label: "Your Rating (High to Low)", value: "your-rating-desc", tmdbSort: "your_rating.desc" },
  { label: "Your Rating (Low to High)", value: "your-rating-asc", tmdbSort: "your_rating.asc" },
  { label: "TMDb Rating (High to Low)", value: "rating", tmdbSort: "rating.desc" },
  { label: "TMDb Rating (Low to High)", value: "rating-asc", tmdbSort: "rating.asc" },
  { label: "Release Date (Newest)", value: "latest", tmdbSort: "release_date.desc" },
  { label: "Release Date (Oldest)", value: "release-asc", tmdbSort: "release_date.asc" },
  { label: "Title A-Z", value: "title-asc", tmdbSort: "title.asc" },
  { label: "Title Z-A", value: "title-desc", tmdbSort: "title.desc" },
] as const;

export const CUSTOM_LIST_SORT_OPTIONS: readonly SortOptionConfig[] = [
  { label: "Recently Created", value: "latest-added", tmdbSort: "created_at.desc" },
  { label: "Title A-Z", value: "title-asc", tmdbSort: "title.asc" },
  { label: "Title Z-A", value: "title-desc", tmdbSort: "title.desc" },
  { label: "Most Items", value: "items-desc", tmdbSort: "items.desc" },
  { label: "Fewest Items", value: "items-asc", tmdbSort: "items.asc" },
] as const;

export const SORT_OPTIONS = MOVIE_SORT_OPTIONS;

export function getSortOptionsByContext(
  context: FilterContextType = "movie"
): readonly SortOptionConfig[] {
  switch (context) {
    case "tv":
      return TV_SORT_OPTIONS;
    case "genre":
    case "trending":
    case "mixed":
      return MIXED_SORT_OPTIONS;
    case "collection":
      return COLLECTION_SORT_OPTIONS;
    case "rating":
      return RATING_COLLECTION_SORT_OPTIONS;
    case "custom_lists":
      return CUSTOM_LIST_SORT_OPTIONS;
    case "movie":
    default:
      return MOVIE_SORT_OPTIONS;
  }
}

export function normalizeSortOption(raw?: string | null): MovieSortOption {
  if (!raw) return DEFAULT_SORT_OPTION;
  const lower = raw.trim().toLowerCase();

  switch (lower) {
    case "popularity":
    case "popularity.desc":
    case "popularity.asc":
      return "popularity";
    case "latest":
    case "release-date":
    case "primary_release_date.desc":
    case "first_air_date.desc":
    case "release_date.desc":
    case "release_date.asc":
      return "latest";
    case "rating":
    case "vote_average.desc":
    case "vote_average.asc":
      return "rating";
    case "most-rated":
    case "most_rated":
    case "vote_count.desc":
    case "vote_count.asc":
      return "most-rated";
    case "title-asc":
    case "title_asc":
    case "title a-z":
    case "title-a-z":
    case "name a-z":
    case "name-a-z":
    case "original_title.asc":
    case "name.asc":
    case "title.asc":
      return "title-asc";
    case "latest-added":
    case "created_at.desc":
    case "created_at.asc":
    case "recently-added":
    case "recently_added":
      return "latest-added";
    case "rating-asc":
    case "rating.asc":
    case "vote_average.asc":
      return "rating-asc";
    case "release-asc":
    case "release_date.asc":
    case "primary_release_date.asc":
    case "first_air_date.asc":
      return "release-asc";
    case "your-rating-desc":
    case "your_rating.desc":
    case "your-rating":
      return "your-rating-desc";
    case "your-rating-asc":
    case "your_rating.asc":
      return "your-rating-asc";
    case "items-desc":
    case "items.desc":
    case "most-items":
      return "items-desc";
    case "items-asc":
    case "items.asc":
    case "fewest-items":
      return "items-asc";
    case "title-desc":
    case "title_desc":
    case "title z-a":
    case "title-z-a":
    case "name z-a":
    case "name-z-a":
    case "original_title.desc":
    case "name.desc":
    case "title.desc":
      return "title-desc";
    default:
      return DEFAULT_SORT_OPTION;
  }
}

export function getSortOptionConfig(
  sortOption: MovieSortOption,
  context: FilterContextType = "movie"
): SortOptionConfig {
  const options = getSortOptionsByContext(context);
  return options.find((opt) => opt.value === sortOption) ?? options[0];
}



