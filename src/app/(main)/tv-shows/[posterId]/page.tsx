import type { Metadata } from "next";
import { PosterDetails } from "@/components/media/PosterDetails";
import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { YouMayLike } from "@/components/media/YouMayLike";
import { getMediaDetails } from "@/lib/tmdb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ posterId: string }>;
}): Promise<Metadata> {
  const { posterId } = await params;
  try {
    const data = await getMediaDetails(posterId, false);
    const title = data.title ? `${data.title} - TV Shows` : "TV Show Details";
    const description =
      data.overview ||
      `Watch trailer, seasons, episodes, cast and details for ${data.title} on Movie Trails.`;
    const image = data.backdropImage || data.posterImage;
    const validImage =
      image && !image.startsWith("/assets/") ? image : undefined;

    const keywords = [
      data.title,
      `${data.title} tv show`,
      `${data.title} series`,
      `${data.title} trailer`,
      `${data.title} cast`,
      `${data.title} seasons`,
      `${data.title} episodes`,
      `${data.title} reviews`,
      ...(data.genres || []),
      "watch tv series",
      "movie trails",
    ];

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `/tv-shows/${posterId}`,
      },
      openGraph: {
        title: `${title} | Movie Trails`,
        description,
        type: "video.tv_show",
        ...(validImage
          ? {
              images: [
                {
                  url: validImage,
                  width: 1200,
                  height: 630,
                  alt: data.title,
                },
              ],
            }
          : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Movie Trails`,
        description,
        ...(validImage ? { images: [validImage] } : {}),
      },
    };
  } catch {
    return {
      title: "TV Show Details",
      description: "Watch trailers, discover cast and details on Movie Trails.",
      openGraph: {
        title: "TV Show Details | Movie Trails",
        description: "Watch trailers, discover cast and details on Movie Trails.",
        type: "video.tv_show",
      },
      twitter: {
        card: "summary_large_image",
        title: "TV Show Details | Movie Trails",
        description: "Watch trailers, discover cast and details on Movie Trails.",
      },
    };
  }
}

export default async function PosterDetailsPage({
  params,
}: {
  params: Promise<{ posterId: string }>;
}) {
  const { posterId } = await params;

  const data = await getMediaDetails(posterId, false);
  let decoded = posterId;
  try {
    decoded = decodeURIComponent(posterId);
  } catch {
    decoded = posterId;
  }
  const formattedParam = data.title || decoded.replace(/-/g, " ");

  const validImage =
    data.posterImage && !data.posterImage.startsWith("/assets/")
      ? data.posterImage
      : data.backdropImage && !data.backdropImage.startsWith("/assets/")
      ? data.backdropImage
      : undefined;

  const tvJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: data.title,
    description: data.overview,
    image: validImage,
    genre: data.genres,
    numberOfSeasons: data.numberOfSeasons,
    numberOfEpisodes: data.numberOfEpisodes,
    ...(data.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: data.rating,
            bestRating: "10",
            worstRating: "1",
            ratingCount:
              Number(data.voteCount?.replace(/[^0-9]/g, "")) || 50,
          },
        }
      : {}),
    ...(data.cast && data.cast.length > 0
      ? {
          actor: data.cast.slice(0, 5).map((actor) => ({
            "@type": "Person",
            name: actor.name,
          })),
        }
      : {}),
    ...(data.trailerKey
      ? {
          trailer: {
            "@type": "VideoObject",
            name: `${data.title} Official Trailer`,
            embedUrl: `https://www.youtube.com/embed/${data.trailerKey}`,
            thumbnailUrl: validImage,
            description: `Watch official trailer for ${data.title}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }}
      />
      <MediaPage
        param={formattedParam}
        type="tv"
        showSearch
        hidePagination
        isMovie={false}
      >
        <PosterDetails isMovie={false} data={data} />
        <PeopleYouMayKnow title="Cast" items={data.cast} />
        <YouMayLike items={data.recommendations} />
      </MediaPage>
    </>
  );
}