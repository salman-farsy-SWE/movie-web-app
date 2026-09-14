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

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Movie Trails`,
        description,
        type: "video.tv_show",
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
      title: "TV Show Details",
      description: "Watch trailers, discover cast and details on Movie Trails.",
      openGraph: {
        title: "TV Show Details | Movie Trails",
        description: "Watch trailers, discover cast and details on Movie Trails.",
        type: "video.tv_show",
        images: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: "TV Show Details | Movie Trails",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "TV Show Details | Movie Trails",
        description: "Watch trailers, discover cast and details on Movie Trails.",
        images: ["/twitter-image"],
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

  return (
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
  );
}