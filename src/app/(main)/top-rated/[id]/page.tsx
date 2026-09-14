import type { Metadata } from "next";
import { MediaPage } from "@/components/media/MediaPage";
import { slugify } from "@/lib/utils";
import { getTopRatedContent } from "@/lib/tmdb";
import { notFound } from "next/navigation";

const VALID_TOP_RATED_CATEGORIES = ["movies", "tv-shows"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const formattedParam = slugify(id);

  const isMovie = formattedParam === "movies";
  const title = isMovie
    ? "Top Rated Movies"
    : "Top Rated TV Shows";
  const description = isMovie
    ? "Browse the highest rated and critically acclaimed movies of all time on Movie Trails."
    : "Explore the highest rated TV shows, series, and miniseries as rated by viewers.";

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

export default async function TopRatedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const { id } = await params;
  const urlParams = await searchParams;
  const formattedParam = slugify(id);

  if (!VALID_TOP_RATED_CATEGORIES.includes(formattedParam)) {
    notFound();
  }

  const parsedPage = Number(urlParams.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const result = await getTopRatedContent(
    formattedParam,
    currentPage,
    24
  );

  return (
    <MediaPage
      param={formattedParam}
      type="top-rated"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}
