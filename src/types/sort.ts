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

