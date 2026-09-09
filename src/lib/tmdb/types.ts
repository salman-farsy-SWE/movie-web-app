// TMDB API response types

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string | null;
  poster_path: string | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  media_type?: "movie" | "tv";
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
  dates?: {
    maximum: string;
    minimum: string;
  };
}

export interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

export interface TmdbTvShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string | null;
  poster_path: string | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  popularity: number;
  media_type?: "movie" | "tv";
}

export interface TmdbVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TmdbVideoListResponse {
  id: number;
  results: TmdbVideo[];
}

export interface TmdbTvListResponse {
  page: number;
  results: TmdbTvShow[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMixedListResponse {
  page: number;
  results: (TmdbMovie | TmdbTvShow)[];
  total_pages: number;
  total_results: number;
}

export interface TmdbChangesItem {
  id: number;
  adult?: boolean | null;
}

export interface TmdbChangesResponse {
  results: TmdbChangesItem[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string | null;
  poster_path: string | null;
  genres: TmdbGenre[];
  adult: boolean;
}

export interface TmdbPerson {
  id: number;
  name: string;
  original_name?: string;
  media_type?: "person";
  adult?: boolean;
  popularity?: number;
  gender?: number;
  known_for_department?: string;
  profile_path?: string | null;
  known_for?: (TmdbMovie | TmdbTvShow)[];
}

export interface TmdbPersonListResponse {
  page: number;
  results: TmdbPerson[];
  total_pages: number;
  total_results: number;
}


