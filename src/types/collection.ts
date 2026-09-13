export type CollectionType = "favorite" | "watchlist" | "rating" | "list";

export interface TableItem {
  id: string;
  image: string;
  name: string;
  rating: number;
  yourRating?: number;
  media: string;
  released: string;
}

export interface UserListCurator {
  name: string;
  handle: string;
  avatar?: string;
}

export interface UserList {
  id: string;
  slug: string;
  title: string;
  description: string;
  curator: UserListCurator;
  itemCount: number;
  runtime: string;
  likesCount: number;
  viewsCount?: string;
  rating?: number;
  tags: string[];
  backdrop?: string;
  posters: string[];
  featuredMovies?: string[];
  items?: Array<{
    id: string | number;
    title: string;
    posterImage?: string | null;
    backdropImage?: string | null;
    rating?: number;
    userRating?: number;
    releaseDate?: string;
    isMovie?: boolean;
    mediaType?: "movie" | "tv";
    genre?: string;
  }>;
  isPrivate?: boolean;
  language?: string;
  updatedAt?: string;
}

export type CustomList = UserList;

export interface CollectionFilterState {
  media: string;
  years: string[];
  ratings: string[];
  searchQuery: string;
  sortBy: string;
}

export type CollectionSortMode =
  | "latest-added"
  | "your-rating-desc"
  | "your-rating-asc"
  | "rating"
  | "rating-asc"
  | "latest"
  | "release-asc"
  | "title-asc"
  | "title-desc"
  | "items-desc"
  | "items-asc";
