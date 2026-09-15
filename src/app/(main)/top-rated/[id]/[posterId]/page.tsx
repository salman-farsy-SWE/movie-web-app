import type { Metadata } from "next";
import { PosterDetails } from "@/components/media/PosterDetails";
import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { YouMayLike } from "@/components/media/YouMayLike";
import { slugify } from "@/lib/utils";
import { getMediaDetails } from "@/lib/tmdb";
import { notFound } from "next/navigation";

const VALID_TOP_RATED_CATEGORIES = ["movies", "tv-shows"];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string; posterId: string }>;
}): Promise<Metadata> {
    const { id, posterId } = await params;
    const formattedParam = slugify(id) || id;

    try {
        const isExplicitMovie = formattedParam === "movies" ? true : formattedParam === "tv-shows" ? false : undefined;
        const data = await getMediaDetails(posterId, isExplicitMovie);
        const isMovie = data.isMovie ?? (isExplicitMovie ?? true);
        const title = data.title || "Media Details";
        const description =
            data.overview ||
            `Watch trailer, cast, and top-rated details for ${data.title} on Movie Trails.`;
        const image = data.backdropImage || data.posterImage;
        const validImage =
            image && !image.startsWith("/assets/") ? image : undefined;

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
                images: image ? [image] : ["/twitter-image"],
                ...(validImage ? { images: [validImage] } : {}),
            },
        };
    } catch {
        return {
            title: "Media Details",
            description: "Discover top-rated movie and TV show details on Movie Trails.",
            openGraph: {
                title: "Media Details | Movie Trails",
                description: "Discover top-rated movie and TV show details on Movie Trails.",
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
                description: "Discover top-rated movie and TV show details on Movie Trails.",
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

    if (!VALID_TOP_RATED_CATEGORIES.includes(formattedParam)) {
        notFound();
    }

    const isExplicitMovie = formattedParam === "movies" ? true : formattedParam === "tv-shows" ? false : undefined;
    const data = await getMediaDetails(posterId, isExplicitMovie);
    const isMovie = data.isMovie ?? (isExplicitMovie ?? true);
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
            type="top-rated"
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