
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";


export async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB_ACCESS_TOKEN is not set. Add it to your .env.local file."
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, 
  });

  if (!res.ok) {
    throw new Error(
      `TMDB API error: ${res.status} ${res.statusText} — ${endpoint}`
    );
  }

  return res.json() as Promise<T>;
}


export function getTmdbImageUrl(
  path: string | null | undefined,
  size: string = "original"
): string {
  if (!path || !path.trim()) {
    return "/assets/movie-placeholder.jpg"; 
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
