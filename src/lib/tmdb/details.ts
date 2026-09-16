import { tmdbFetch, getTmdbImageUrl } from "./tmdb";
import { getYouTubeTrailerKey, fetchMovieTrailerKey, fetchTvTrailerKey } from "./trailers";
import type { MovieItem, Person } from "@/types";

export interface MediaDetailsData {
  id: string;
  title: string;
  overview: string;
  releaseDate: string;
  genres: string[];
  duration?: string;
  rating: number;
  voteCount: string;
  popularity: string;
  backdropImage: string;
  posterImage: string;
  trailerKey: string | null;
  country: string;
  language: string;
  budget?: string;
  revenue?: string;
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  studio?: {
    name: string;
    image?: string;
  };
  createdBy?: {
    name: string;
    image?: string;
  };
  cast?: Person[];
  recommendations?: MovieItem[];
  isMovie?: boolean;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "2h 15m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function formatMoney(amount?: number): string {
  if (!amount || amount <= 0) return "$150M";
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  }
  if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(0)}M`;
  }
  if (amount >= 1e3) {
    return `$${(amount / 1e3).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export async function getMediaDetails(
  slugOrId: string,
  isMovieParam?: boolean
): Promise<MediaDetailsData> {
  let decoded = slugOrId;
  try {
    decoded = decodeURIComponent(slugOrId);
  } catch {
    decoded = slugOrId;
  }

  const cleanQuery = decoded.replace(/-/g, " ").trim();
  const isNumeric = /^\d+$/.test(decoded.trim());
  let isMovie = isMovieParam;

  // 1. Try fetching from TMDB
  try {
    let tmdbId: number | null = isNumeric ? parseInt(decoded.trim(), 10) : null;

    if (!tmdbId && cleanQuery) {
      if (isMovie !== undefined) {
        const searchEndpoint = isMovie ? "/search/movie" : "/search/tv";
        const searchRes = await tmdbFetch<{ results: { id: number; title?: string; name?: string }[] }>(
          searchEndpoint,
          { query: cleanQuery, language: "en-US", page: "1" }
        );

        if (searchRes.results && searchRes.results.length > 0) {
          tmdbId = searchRes.results[0].id;
        }
      } else {
        const searchRes = await tmdbFetch<{
          results: { id: number; title?: string; name?: string; media_type?: string }[];
        }>("/search/multi", { query: cleanQuery, language: "en-US", page: "1" });

        const mediaItem = searchRes.results?.find(
          (r) => r.media_type === "movie" || r.media_type === "tv"
        );

        if (mediaItem) {
          tmdbId = mediaItem.id;
          isMovie = mediaItem.media_type !== "tv";
        } else {
          const movieRes = await tmdbFetch<{ results: { id: number }[] }>(
            "/search/movie",
            { query: cleanQuery, language: "en-US", page: "1" }
          );
          if (movieRes.results && movieRes.results.length > 0) {
            tmdbId = movieRes.results[0].id;
            isMovie = true;
          } else {
            const tvRes = await tmdbFetch<{ results: { id: number }[] }>(
              "/search/tv",
              { query: cleanQuery, language: "en-US", page: "1" }
            );
            if (tvRes.results && tvRes.results.length > 0) {
              tmdbId = tvRes.results[0].id;
              isMovie = false;
            }
          }
        }
      }
    }

    if (tmdbId) {
      let resolvedIsMovie = isMovie ?? true;
      /* eslint-disable @typescript-eslint/no-explicit-any */
      let data: any = null;

      if (isMovie !== undefined) {
        const detailsEndpoint = isMovie ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
        data = await tmdbFetch<any>(detailsEndpoint, {
          append_to_response: "credits,recommendations,similar,videos",
          language: "en-US",
        });
      } else {
        try {
          data = await tmdbFetch<any>(`/movie/${tmdbId}`, {
            append_to_response: "credits,recommendations,similar,videos",
            language: "en-US",
          });
          resolvedIsMovie = true;
        } catch {
          data = await tmdbFetch<any>(`/tv/${tmdbId}`, {
            append_to_response: "credits,recommendations,similar,videos",
            language: "en-US",
          });
          resolvedIsMovie = false;
        }
      }

      isMovie = resolvedIsMovie;

      const trailerKey =
        (data.videos ? getYouTubeTrailerKey(data.videos) : null) ||
        (isMovie
          ? await fetchMovieTrailerKey(tmdbId)
          : await fetchTvTrailerKey(tmdbId));

      const releaseDate = formatDate(data.release_date || data.first_air_date);

      const genres =
        data.genres && data.genres.length > 0
          ? data.genres.map((g: { name: string }) => g.name)
          : isMovie
          ? ["Action", "Drama"]
          : ["Drama", "Sci-Fi & Fantasy"];

      const duration = isMovie
        ? formatDuration(data.runtime)
        : data.episode_run_time && data.episode_run_time.length > 0
        ? `${data.episode_run_time[0]}m`
        : "50m";

      const rating =
        data.vote_average !== undefined && data.vote_average > 0
          ? Number(data.vote_average.toFixed(1))
          : 8.4;

      const voteCount =
        data.vote_count !== undefined
          ? data.vote_count.toLocaleString()
          : "34,000";

      const popularity =
        data.popularity !== undefined
          ? data.popularity.toFixed(2)
          : "256.42";

      const backdropImage = getTmdbImageUrl(
        data.backdrop_path || data.poster_path,
        "original"
      );

      const posterImage = getTmdbImageUrl(
        data.poster_path || data.backdrop_path,
        "w500"
      );

      const country =
        data.production_countries && data.production_countries.length > 0
          ? data.production_countries.map((c: { name: string }) => c.name).join(", ")
          : "United States";

      const language =
        data.spoken_languages && data.spoken_languages.length > 0
          ? data.spoken_languages[0].english_name || data.spoken_languages[0].name
          : "English";

      const budget = isMovie ? formatMoney(data.budget) : undefined;
      const revenue = isMovie ? formatMoney(data.revenue) : undefined;
      const numberOfEpisodes = !isMovie ? data.number_of_episodes || 73 : undefined;
      const numberOfSeasons = !isMovie ? data.number_of_seasons || 8 : undefined;

      const studioCompany =
        data.production_companies?.find((c: { logo_path?: string; name: string }) => Boolean(c.logo_path)) ||
        data.production_companies?.[0];

      const studio = studioCompany
        ? {
            name: studioCompany.name,
            image: studioCompany.logo_path
              ? getTmdbImageUrl(studioCompany.logo_path, "w200")
              : undefined,
          }
        : {
            name: "Legendary Pictures",
            image: undefined,
          };

      const director = data.credits?.crew?.find((c: { job: string }) => c.job === "Director");
      const createdBy = !isMovie
        ? data.created_by && data.created_by.length > 0
          ? {
              name: data.created_by[0].name,
              image: getTmdbImageUrl(data.created_by[0].profile_path, "w200"),
            }
          : undefined
        : director
        ? {
            name: director.name,
            image: getTmdbImageUrl(director.profile_path, "w200"),
          }
        : undefined;

      const cast = data.credits?.cast && data.credits.cast.length > 0
        ? data.credits.cast.slice(0, 14).map((c: any) => ({
            id: String(c.id),
            name: c.name,
            role: c.character || "Actor",
            image: getTmdbImageUrl(c.profile_path, "w200"),
          }))
        : [];

      const rawRecs =
        data.recommendations?.results?.length > 0
          ? data.recommendations.results
          : data.similar?.results?.length > 0
          ? data.similar.results
          : [];

      const recommendations: MovieItem[] =
        rawRecs.length > 0
          ? rawRecs.slice(0, 14).map((r: any) => {
              const recRawDate = r.release_date || r.first_air_date;
              const recYear = recRawDate ? new Date(recRawDate).getFullYear().toString() : undefined;
              return {
                id: String(r.id),
                title: r.title || r.name,
                genre: isMovie ? "Movie" : "TV Show",
                image: getTmdbImageUrl(r.poster_path || r.backdrop_path, "w500"),
                trailerKey: null,
                mediaType: isMovie ? "movie" : "tv",
                rating: r.vote_average ? r.vote_average.toFixed(1) : "8.0",
                releaseDate: recRawDate || recYear,
                year: recYear,
                releaseYear: recYear,
              };
            })
          : [];

      return {
        id: String(tmdbId),
        title: data.title || data.name || cleanQuery,
        overview:
          data.overview ||
          "An engaging story filled with adventure, emotion, and unforgettable moments.",
        releaseDate,
        genres,
        duration,
        rating,
        voteCount,
        popularity,
        backdropImage,
        posterImage,
        trailerKey,
        country,
        language,
        budget,
        revenue,
        numberOfEpisodes,
        numberOfSeasons,
        studio,
        createdBy,
        cast,
        recommendations,
        isMovie,
      };
    }
  } catch (err) {
    console.error("TMDB details fetch failed:", err);
  }

  // Fallback if TMDB lookup fails
  const title =
    cleanQuery.replace(/\b\w/g, (l) => l.toUpperCase()) ||
    (isMovie ? "Movie Details" : "TV Shows Details");

  return {
    id: String(slugOrId),
    title,
    overview: "Details are currently unavailable.",
    releaseDate: "N/A",
    genres: isMovie ? ["Movie"] : ["TV Show"],
    duration: isMovie ? "N/A" : undefined,
    rating: 0,
    voteCount: "0",
    popularity: "0",
    backdropImage: "/assets/movie-placeholder.jpg",
    posterImage: "/assets/movie-placeholder.jpg",
    trailerKey: null,
    country: "N/A",
    language: "en",
    cast: [],
    recommendations: [],
    isMovie: isMovie ?? true,
  };
}

export interface PersonDetailsData {
  id: string;
  name: string;
  bio: string;
  birthDate: string;
  birthdayRaw?: string;
  deathDay?: string;
  gender: string;
  profession: string;
  birthPlace: string;
  popularity: string;
  knownFor: string;
  knownForDepartment?: string;
  image: string;
  imdbId?: string;
  alsoKnownAs?: string[];
  totalCredits?: number;
  knownForCredits?: MovieItem[];
  collaborators?: Person[];
}

export async function getPersonDetails(
  slugOrNameOrId: string
): Promise<PersonDetailsData> {
  let decoded = slugOrNameOrId;
  try {
    decoded = decodeURIComponent(slugOrNameOrId);
  } catch {
    decoded = slugOrNameOrId;
  }

  const cleanName = decoded.replace(/-/g, " ").trim();
  const isNumeric = /^\d+$/.test(decoded.trim());

  try {
    let personId: number | null = isNumeric ? parseInt(decoded.trim(), 10) : null;

    if (!personId) {
      const searchRes = await tmdbFetch<{
        results: Array<{ id: number; name: string; popularity: number }>;
      }>("/search/person", {
        query: cleanName,
        language: "en-US",
        page: "1",
      });

      if (searchRes?.results && searchRes.results.length > 0) {
        personId = searchRes.results[0].id;
      }
    }

    if (personId) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const data = await tmdbFetch<any>(`/person/${personId}`, {
        append_to_response: "combined_credits,images",
        language: "en-US",
      });

      const genderMap: Record<number, string> = {
        1: "Female",
        2: "Male",
        3: "Non-binary",
      };

      // Combine cast and crew credits so directors, writers, creators, animators, and actors are all supported
      const castCredits = data.combined_credits?.cast || [];
      const crewCredits = data.combined_credits?.crew || [];
      const allCredits = [...castCredits, ...crewCredits];

      const seenCreditIds = new Set<number>();
      const rawCredits = allCredits
        .filter((c: any) => {
          if (!c.id || seenCreditIds.has(c.id)) return false;
          if (!c.poster_path && !c.backdrop_path) return false;
          seenCreditIds.add(c.id);
          return true;
        })
        .sort((a: any, b: any) => (b.vote_count || 0) - (a.vote_count || 0));

      const knownForCredits: MovieItem[] =
        rawCredits.length > 0
          ? rawCredits.slice(0, 14).map((m: any) => {
              const mRawDate = m.release_date || m.first_air_date;
              const mYear = mRawDate ? new Date(mRawDate).getFullYear().toString() : undefined;
              return {
                id: String(m.id),
                title: m.title || m.name,
                genre: m.media_type === "tv" ? "TV Show" : "Movie",
                image: getTmdbImageUrl(m.poster_path || m.backdrop_path, "w500"),
                rating: m.vote_average ? m.vote_average.toFixed(1) : "8.0",
                mediaType: m.media_type === "tv" ? "tv" : "movie",
                trailerKey: null,
                releaseDate: mRawDate || mYear,
                year: mYear,
                releaseYear: mYear,
              };
            })
          : [];

      // Fetch co-stars and crew collaborators from top 4 media items in parallel
      const topMedia = rawCredits.slice(0, 4);
      const creditPromises = topMedia.map((m: any) => {
        const endpoint = m.media_type === "tv" ? `/tv/${m.id}/credits` : `/movie/${m.id}/credits`;
        return tmdbFetch<any>(endpoint, { language: "en-US" }).catch(() => null);
      });

      const creditResults = await Promise.all(creditPromises);

      const seenPersonIds = new Set<number>([personId]);
      const collaborators: Person[] = [];

      for (const res of creditResults) {
        if (!res) continue;

        const castList = res.cast || [];
        for (const member of castList) {
          if (!seenPersonIds.has(member.id)) {
            seenPersonIds.add(member.id);
            collaborators.push({
              id: String(member.id),
              name: member.name,
              role: member.character ? `Co-Star (${member.character})` : "Actor",
              image: getTmdbImageUrl(member.profile_path, "w200"),
            });
          }
        }

        const crewList = res.crew || [];
        for (const member of crewList) {
          if (
            !seenPersonIds.has(member.id) &&
            (member.job === "Director" || member.job === "Writer" || member.job === "Producer" || member.job === "Executive Producer")
          ) {
            seenPersonIds.add(member.id);
            collaborators.push({
              id: String(member.id),
              name: member.name,
              role: member.job,
              image: getTmdbImageUrl(member.profile_path, "w200"),
            });
          }
        }
      }

      const totalCreditsCount =
        (data.combined_credits?.cast?.length || 0) + (data.combined_credits?.crew?.length || 0);

      return {
        id: String(data.id),
        name: data.name || cleanName,
        bio: data.biography || "Biography is currently not available for this person.",
        birthDate: formatDate(data.birthday),
        birthdayRaw: data.birthday || undefined,
        deathDay: data.deathday ? formatDate(data.deathday) : undefined,
        gender: genderMap[data.gender] || "Not specified",
        profession: data.known_for_department || "Acting",
        birthPlace: data.place_of_birth || "N/A",
        popularity: data.popularity ? data.popularity.toFixed(1) : "N/A",
        knownFor: data.known_for_department === "Directing" ? "Directing" : "Movies & TV",
        knownForDepartment: data.known_for_department || "Acting",
        image: getTmdbImageUrl(data.profile_path, "w500") || "/assets/movie-placeholder.jpg",
        imdbId: data.imdb_id || undefined,
        alsoKnownAs: Array.isArray(data.also_known_as) ? data.also_known_as : [],
        totalCredits: totalCreditsCount > 0 ? totalCreditsCount : undefined,
        knownForCredits,
        collaborators: collaborators.length > 0 ? collaborators.slice(0, 14) : [],
      };
    }
  } catch (error) {
    console.error(`Failed to fetch person details for "${cleanName}":`, error);
  }

  return {
    id: slugOrNameOrId,
    name: cleanName.replace(/\b\w/g, (l) => l.toUpperCase()) || "Person Details",
    bio: "Biography details are currently unavailable.",
    birthDate: "N/A",
    gender: "Not specified",
    profession: "Actor",
    birthPlace: "N/A",
    popularity: "N/A",
    knownFor: "Movies",
    image: "/assets/movie-placeholder.jpg",
    knownForCredits: [],
    collaborators: [],
  };
}

export const getPersonDetailsByName = getPersonDetails;
