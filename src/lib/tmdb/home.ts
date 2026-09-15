import { tmdbFetch, getTmdbImageUrl } from "./tmdb";
import { getGenres, getTvGenres } from "./movies";
import type {
  TmdbMovieListResponse,
  TmdbTvListResponse,
  TmdbMixedListResponse,
  TmdbMovie,
  TmdbTvShow,
} from "./types";
import type { MovieItem } from "@/types";

import { fetchMovieTrailerKey, fetchTvTrailerKey } from "./trailers";

export async function getTrendingAll(
  limit: number = 10
): Promise<MovieItem[] | null> {
  try {
    const [mixedData, movieGenreMap, tvGenreMap] = await Promise.all([
      tmdbFetch<TmdbMixedListResponse>("/trending/all/week", {
        language: "en-US",
      }),
      getGenres(),
      getTvGenres(),
    ]);

    const mixed = mixedData.results
      .filter((m) => m.backdrop_path && (m.media_type === "movie" || m.media_type === "tv"))
      .slice(0, limit);

    const items = await Promise.all(
      mixed.map(async (item) => {
        const isMovie = item.media_type === "movie";
        const trailerKey = isMovie
          ? await fetchMovieTrailerKey(item.id)
          : await fetchTvTrailerKey(item.id);
        const genreMap = isMovie ? movieGenreMap : tvGenreMap;

        return {
          id: item.id.toString(),
          title: "title" in item ? item.title : item.name,
          genre: item.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => Boolean(name))
            .slice(0, 2)
            .join("/"),
          image: getTmdbImageUrl(item.backdrop_path, "w780"),
          trailerKey,
          isMovie,
          mediaType: (isMovie ? "movie" : "tv") as "movie" | "tv",
        };
      })
    );

    return items;
  } catch (error) {
    console.error("Failed to fetch trending all:", error);
    return null;
  }
}

export async function getTopRatedAll(
  limit: number = 10
): Promise<MovieItem[] | null> {
  try {
    const [moviesData, tvData, movieGenreMap, tvGenreMap] = await Promise.all([
      tmdbFetch<TmdbMovieListResponse>("/movie/top_rated", {
        language: "en-US",
        page: "1",
      }),
      tmdbFetch<TmdbTvListResponse>("/tv/top_rated", {
        language: "en-US",
        page: "1",
      }),
      getGenres(),
      getTvGenres(),
    ]);

    const movies = moviesData.results.filter((m) => m.backdrop_path);
    const shows = tvData.results.filter((s) => s.backdrop_path);

    // Interleave movies and tv shows
    const interleaved: (TmdbMovie | TmdbTvShow)[] = [];
    const maxLength = Math.max(movies.length, shows.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < movies.length) interleaved.push({ ...movies[i], media_type: "movie" });
      if (i < shows.length) interleaved.push({ ...shows[i], media_type: "tv" });
    }

    const mixed = interleaved.slice(0, limit);

    const items = await Promise.all(
      mixed.map(async (item) => {
        const isMovie = item.media_type === "movie";
        const trailerKey = isMovie
          ? await fetchMovieTrailerKey(item.id)
          : await fetchTvTrailerKey(item.id);
        const genreMap = isMovie ? movieGenreMap : tvGenreMap;

        return {
          id: item.id.toString(),
          title: "title" in item ? item.title : item.name,
          genre: item.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => Boolean(name))
            .slice(0, 2)
            .join("/"),
          image: getTmdbImageUrl(item.backdrop_path, "w780"),
          trailerKey,
          isMovie,
          mediaType: (isMovie ? "movie" : "tv") as "movie" | "tv",
        };
      })
    );

    return items;
  } catch (error) {
    console.error("Failed to fetch top rated all:", error);
    return null;
  }
}

export async function getPopularMovies(
  limit: number = 10
): Promise<MovieItem[] | null> {
  try {
    const [moviesData, genreMap] = await Promise.all([
      tmdbFetch<TmdbMovieListResponse>("/movie/popular", {
        language: "en-US",
        page: "1",
      }),
      getGenres(),
    ]);

    const movies = moviesData.results
      .filter((m) => m.backdrop_path)
      .slice(0, limit);

    const items = await Promise.all(
      movies.map(async (movie) => {
        const trailerKey = await fetchMovieTrailerKey(movie.id);
        return {
          id: movie.id.toString(),
          title: movie.title,
          genre: movie.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => Boolean(name))
            .slice(0, 2)
            .join("/"),
          image: getTmdbImageUrl(movie.backdrop_path, "w780"),
          trailerKey,
        };
      })
    );

    return items;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return null;
  }
}

export async function getTrendingTvShows(
  limit: number = 10
): Promise<MovieItem[] | null> {
  try {
    const [tvData, genreMap] = await Promise.all([
      tmdbFetch<TmdbTvListResponse>("/trending/tv/week", {
        language: "en-US",
      }),
      getTvGenres(),
    ]);

    const shows = tvData.results
      .filter((s) => s.backdrop_path)
      .slice(0, limit);

    const items = await Promise.all(
      shows.map(async (show) => {
        const trailerKey = await fetchTvTrailerKey(show.id);
        return {
          id: show.id.toString(),
          title: show.name,
          genre: show.genre_ids
            .map((id) => genreMap.get(id))
            .filter((name): name is string => Boolean(name))
            .slice(0, 2)
            .join("/"),
          image: getTmdbImageUrl(show.backdrop_path, "w780"),
          trailerKey,
        };
      })
    );

    return items;
  } catch (error) {
    console.error("Failed to fetch trending TV shows:", error);
    return null;
  }
}
