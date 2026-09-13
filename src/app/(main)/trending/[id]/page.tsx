import type { Metadata } from "next";
import { MediaPage } from "@/components/media/MediaPage";
import { slugify } from "@/lib/utils";
import {
  getTrendingContent,
  getTrendingPersons,
  searchPersons,
  parseFilterParams,
  isFilterActive,
} from "@/lib/tmdb";
import { notFound } from "next/navigation";

const VALID_TRENDING_CATEGORIES = [
  "today",
  "this-week",
  "movies",
  "tv-shows",
  "persons",
  "all",
  "day",
  "week",
];

const TRENDING_METADATA_MAP: Record<
  string,
  { title: string; description: string }
> = {
  today: {
    title: "Trending Movies & TV Shows Today",
    description:
      "Explore the most watched and trending movies and TV shows today on Movie Trails.",
  },
  "this-week": {
    title: "Trending Movies & TV Shows This Week",
    description:
      "Discover the hottest movies and TV shows trending across the globe this week.",
  },
  movies: {
    title: "Trending Movies",
    description:
      "Browse popular movies currently trending on Movie Trails and across streaming services.",
  },
  "tv-shows": {
    title: "Trending TV Shows",
    description:
      "Discover top trending television series, shows, and seasons catching viewers' attention right now.",
  },
  persons: {
    title: "Trending Celebrities & Actors",
    description:
      "Explore trending actors, directors, creators, and cinema personalities making headlines.",
  },
  all: {
    title: "Trending Entertainment",
    description:
      "Find trending movies, TV shows, and celebrities updated daily on Movie Trails.",
  },
  day: {
    title: "Trending Today",
    description: "What's popular and trending today in movies and entertainment.",
  },
  week: {
    title: "Trending This Week",
    description:
      "What's popular and trending this week in movies and entertainment.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const formattedParam = slugify(id);

  const meta = TRENDING_METADATA_MAP[formattedParam] || {
    title: "Trending Entertainment",
    description:
      "Discover what's trending in movies and TV shows on Movie Trails.",
  };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Movie Trails`,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Movie Trails`,
      description: meta.description,
    },
  };
}

export default async function TrendingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    media?: string;
    time_window?: string;
    q?: string;
    search?: string;
  }>;
}) {
  const { id } = await params;
  const urlParams = await searchParams;
  const formattedParam = slugify(id);

  if (!VALID_TRENDING_CATEGORIES.includes(formattedParam)) {
    notFound();
  }

  const parsedPage = Number(urlParams.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  if (id === "persons") {
    const query = (urlParams.q || urlParams.search)?.trim();
    const selectedTimeWindow =
      urlParams.time_window === "day" || urlParams.media === "day"
        ? "day"
        : "week";

    const result = query
      ? await searchPersons(query, currentPage, 24)
      : await getTrendingPersons(
          selectedTimeWindow,
          currentPage,
          24
        );

    return (
      <MediaPage
        param={formattedParam}
        type="trending"
        personItems={result?.persons ?? []}
        searchQuery={query}
        currentPage={currentPage}
        totalPages={result?.totalPages ?? 1}
        trendingTimeWindow={selectedTimeWindow}
      />
    );
  }


  const hasActiveFilters = isFilterActive(urlParams);
  const filterParams = parseFilterParams(urlParams);

  const result = await getTrendingContent(
    formattedParam,
    currentPage,
    24,
    hasActiveFilters ? filterParams : "all"
  );

  return (
    <MediaPage
      param={formattedParam}
      type="trending"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
      trendingMedia={filterParams.media}
      trendingTimeWindow={filterParams.time_window}
    />
  );
}
