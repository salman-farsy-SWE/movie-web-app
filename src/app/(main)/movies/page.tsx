import type { Metadata } from "next";
import { MediaPage } from "@/components/media/MediaPage";
import {
  getDiscoverMovies,
  parseFilterParams,
  isFilterActive,
} from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Explore Movies | Popular, Top Rated & New Releases",
  description:
    "Discover popular, top-rated, and newly released movies. Filter by genre, release year, rating, country, and duration on Movie Trails.",
  keywords: [
    "explore movies",
    "popular movies",
    "top rated movies",
    "new movie releases",
    "movie filters",
    "watch movie trailers",
    "find films",
    "movie database",
  ],
  alternates: {
    canonical: "/movies",
  },
  openGraph: {
    title: "Explore Movies | Movie Trails",
    description:
      "Discover popular, top-rated, and newly released movies. Filter by genre, release year, rating, country, and duration.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Explore Movies | Movie Trails",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Movies | Movie Trails",
    description:
      "Discover popular, top-rated, and newly released movies. Filter by genre, release year, rating, country, and duration.",
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: "Explore Movies | Movie Trails",
      },
    ],
  },
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sort_by?: string;
    media?: string;
    genre?: string;
    country?: string;
    language?: string;
    year?: string;
    rating?: string;
    duration?: string;
  }>;
}) {
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const hasActiveFilters = isFilterActive(params);
  const filterParams = parseFilterParams(params);
  const currentSort = params.sort_by || "popularity";

  const result = await getDiscoverMovies(
    currentPage,
    currentSort,
    24,
    hasActiveFilters ? filterParams : "all"
  );

  return (
    <MediaPage
      type="movie"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}