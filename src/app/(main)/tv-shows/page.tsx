
import type { Metadata } from "next";
import { MediaPage } from "@/components/media/MediaPage";
import {
  getDiscoverTvShows,
  parseFilterParams,
  isFilterActive,
} from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Explore TV Shows | Popular Series & Top Rated Shows",
  description:
    "Discover trending and top-rated TV shows, series, and miniseries. Filter by genre, release year, network, country, and rating on Movie Trails.",
  keywords: [
    "explore tv shows",
    "popular tv series",
    "top rated tv shows",
    "trending series",
    "watch tv trailers",
    "tv show tracker",
    "tv series database",
  ],
  alternates: {
    canonical: "/tv-shows",
  },
  openGraph: {
    title: "Explore TV Shows | Movie Trails",
    description:
      "Discover trending and top-rated TV shows, series, and miniseries. Filter by genre, release year, network, country, and rating.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Explore TV Shows | Movie Trails",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore TV Shows | Movie Trails",
    description:
      "Discover trending and top-rated TV shows, series, and miniseries. Filter by genre, release year, network, country, and rating.",
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: "Explore TV Shows | Movie Trails",
      },
    ],
  },
};

export default async function TVShowsPage({
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

  const result = await getDiscoverTvShows(
    currentPage,
    currentSort,
    24,
    hasActiveFilters ? filterParams : "all"
  );

  return (
    <MediaPage
      type="tv"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}
