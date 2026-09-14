import type { Metadata } from "next";
import { PosterDetails } from "@/components/media/PosterDetails";
import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { YouMayLike } from "@/components/media/YouMayLike";
import { slugify } from "@/lib/utils";
import { getMediaDetails, MIXED_GENRES } from "@/lib/tmdb";
import { notFound } from "next/navigation";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}): Promise<Metadata> {
  const { posterId } = await params;

  try {
    const data = await getMediaDetails(posterId);
    const isMovie = data.isMovie ?? true;
    const title = data.title || "Media Details";
    const description =
      data.overview ||
      `Watch trailers, cast, and overview for ${data.title} on Movie Trails.`;
    const image = data.backdropImage || data.posterImage;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Movie Trails`,
        description,
        type: isMovie ? "video.movie" : "video.tv_show",
        images: image
          ? [{ url: image, alt: data.title }]
          : [
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
        images: image ? [image] : ["/twitter-image"],
      },
    };
  } catch {
    return {
      title: "Media Details",
      description: "Discover movie and TV show details on Movie Trails.",
      openGraph: {
        title: "Media Details | Movie Trails",
        description: "Discover movie and TV show details on Movie Trails.",
        type: "video.movie",
        images: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: "Media Details | Movie Trails",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Media Details | Movie Trails",
        description: "Discover movie and TV show details on Movie Trails.",
        images: ["/twitter-image"],
      },
    };
  }
}

export default async function PosterDetailsPage({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}) {
  const { id, posterId } = await params;

  const formattedParam = slugify(id) || id;

  if (!VALID_GENRE_SLUGS.has(formattedParam)) {
    notFound();
  }

  const data = await getMediaDetails(posterId);
  const isMovie = data.isMovie ?? true;
  let decoded = posterId;
  try {
    decoded = decodeURIComponent(posterId);
  } catch {
    decoded = posterId;
  }
  const formattedParam2 = data.title || decoded.replace(/-/g, " ");

  return (
    <MediaPage
      param={formattedParam}
      type="genre"
      showSearch
      param2={formattedParam2}
      hidePagination
      isMovie={isMovie}
    >
      <PosterDetails isMovie={isMovie} data={data} />
      <PeopleYouMayKnow title="Cast" items={data.cast} />
      <YouMayLike items={data.recommendations} />
    </MediaPage>
  );
}