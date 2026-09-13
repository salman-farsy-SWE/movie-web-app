export type FilterContextType =
  | "movie"
  | "tv"
  | "mixed"
  | "genre"
  | "trending"
  | "collection"
  | "rating"
  | "custom_lists";

export interface MediaFilterOptionItem {
  id: string;
  value: string;
  label: string;
}

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

export type MovieFilterOption =
  | "all"
  | "now_playing"
  | "upcoming"
  | "released"
  | "airing_today"
  | "on_the_air"
  | "movies"
  | "tv_shows";

