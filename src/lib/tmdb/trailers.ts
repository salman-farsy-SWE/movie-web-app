import { tmdbFetch } from "./tmdb";
import type { TmdbVideoListResponse } from "./types";

export function getYouTubeTrailerKey(videos: TmdbVideoListResponse): string | null {
  const youtubeVideos = videos.results.filter((v) => v.site === "YouTube");

  const trailer = youtubeVideos.find(
    (v) => v.type === "Trailer" && v.official
  );
  if (trailer) return trailer.key;

  const anyTrailer = youtubeVideos.find((v) => v.type === "Trailer");
  if (anyTrailer) return anyTrailer.key;

  const teaser = youtubeVideos.find((v) => v.type === "Teaser");
  if (teaser) return teaser.key;

  return youtubeVideos[0]?.key ?? null;
}

export async function fetchMovieTrailerKey(movieId: number): Promise<string | null> {
  try {
    const videos = await tmdbFetch<TmdbVideoListResponse>(
      `/movie/${movieId}/videos`,
      { language: "en-US" }
    );
    return getYouTubeTrailerKey(videos);
  } catch {
    return null;
  }
}

export async function fetchTvTrailerKey(tvId: number): Promise<string | null> {
  try {
    const videos = await tmdbFetch<TmdbVideoListResponse>(
      `/tv/${tvId}/videos`,
      { language: "en-US" }
    );
    return getYouTubeTrailerKey(videos);
  } catch {
    return null;
  }
}

