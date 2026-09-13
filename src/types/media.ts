export type MediaType =
  | "movie"
  | "tv"
  | "genre"
  | "trending"
  | "top-rated"
  | "search";

export type SearchMediaType = "all" | "movie" | "tv";

export interface HeroContent {
  title: string;
  description: string;
  year: string;
  rating: string;
  genres: string[];
  image: string;
  trailerKey: string | null;
}

export interface MovieItem {
  id: string | number;
  title: string;
  genre?: string;
  genres?: string[];
  image?: string | null;
  posterImage?: string | null;
  backdropImage?: string | null;
  rating?: number | string;
  voteCount?: number;
  popularity?: number;
  year?: string | number;
  releaseYear?: string | number;
  releaseDate?: string;
  duration?: number | string;
  country?: string;
  language?: string;
  isMovie?: boolean;
  mediaType?: "movie" | "tv";
  mediaStatus?: "now_playing" | "upcoming" | "airing_today" | "on_the_air" | "released" | string;
  trailerKey?: string | null;
  trailerId?: string;
  rank?: number;
  description?: string;
}

export interface MovieSection {
  id: string;
  title: string;
  items: MovieItem[];
}

export interface Person {
  id: number | string;
  name: string;
  image?: string | null;
  role?: string;
  knownFor?: string;
  biography?: string;
  birthday?: string;
  placeOfBirth?: string;
  knownForDepartment?: string;
  popularity?: number;
}

export interface CastMember {
  id: number | string;
  name: string;
  character?: string;
  profilePath?: string | null;
  image?: string | null;
  role?: string;
}

export interface MediaDetailsData {
  id: number | string;
  title: string;
  overview?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseDate?: string;
  firstAirDate?: string;
  rating?: number;
  voteCount?: number;
  genres?: string[];
  runtime?: number;
  cast?: CastMember[];
  recommendations?: MovieItem[];
  trailers?: Array<{ id: string; key: string; name: string; site: string }>;
  tagline?: string;
  status?: string;
  director?: string;
}

