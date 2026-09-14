import type { Metadata } from "next";
import { MediaPage } from "@/components/media/MediaPage";
import { slugify } from "@/lib/utils";
import {
  getDiscoverMixed,
  parseFilterParams,
  isFilterActive,
  MIXED_GENRES,
} from "@/lib/tmdb";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const capitalized = id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = `${capitalized} Movies & TV Shows`;
  const description = `Explore top-rated, popular, and trending ${capitalized} movies and TV series on Movie Trails.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Movie Trails`,
      description,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${title} | Movie Trails`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Movie Trails`,
      description,
      images: ["/twitter-image"],
    },
  };
}

const VALID_GENRE_SLUGS = new Set([
  ...MIXED_GENRES.map((g) => slugify(g)),
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "history",
  "horror",
  "kids",
  "music",
  "mystery",
  "news",
  "reality",
  "romance",
  "sci-fi",
  "sci-fi-fantasy",
  "soap",
  "talk",
  "tv-movie",
  "thriller",
  "war",
  "war-politics",
  "western",
  "action-adventure",
]);

export default async function GenresPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
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
  const { id } = await params;
  const urlParams = await searchParams;
  const formattedParam = slugify(id);

  if (!VALID_GENRE_SLUGS.has(formattedParam)) {
    notFound();
  }

  const parsedPage = Number(urlParams.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const hasActiveFilters = isFilterActive(urlParams);
  const filterParams = parseFilterParams(urlParams);
  const currentSort = urlParams.sort_by || "popularity";

  const result = await getDiscoverMixed(
    currentPage,
    currentSort,
    24,
    hasActiveFilters ? filterParams : "all",
    id.replace(/-/g, " ")
  );

  return (
    <MediaPage
      param={formattedParam}
      type="genre"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}
