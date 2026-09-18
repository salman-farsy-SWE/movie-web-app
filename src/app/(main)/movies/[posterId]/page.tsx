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
        const data = await getMediaDetails(posterId, true);
        const year = data.releaseDate && data.releaseDate !== "N/A" ? data.releaseDate.split(" ").pop() : "";
        const title = year ? `${data.title || "Movie Details"} (${year})` : data.title || "Movie Details";
        const description =
            data.overview ||
            `Watch trailer, cast, rating and release information for ${data.title} on Movie Trails.`;
        const image = data.backdropImage || data.posterImage;

        const validImage =
            image && !image.startsWith("/assets/") ? image : undefined;

        const keywords = [
            data.title,
            `${data.title} movie`,
            `${data.title} trailer`,
            `${data.title} cast`,
            `${data.title} release date`,
            `${data.title} rating`,
            `${data.title} watch online`,
            ...(data.genres || []),
            "watch movie trailers",
            "movie trails",
        ];

        return {
            title,
            description,
            keywords,
            alternates: {
                canonical: `/movies/${posterId}`,
            },
            openGraph: {
                title: `${title} | Movie Trails`,
                description,
                type: "video.movie",
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
            title: "Movie Details",
            description: "Watch trailers, discover cast and details on Movie Trails.",
            openGraph: {
                title: "Movie Details | Movie Trails",
                description: "Watch trailers, discover cast and details on Movie Trails.",
                type: "video.movie",
                images: [
                    {
                        url: "/opengraph-image",
                        width: 1200,
                        height: 630,
                        alt: "Movie Details | Movie Trails",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Movie Details | Movie Trails",
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

    const data = await getMediaDetails(posterId, true);
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

    const movieJsonLd = {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: data.title,
        description: data.overview,
        image: validImage,
        datePublished: data.releaseDate && data.releaseDate !== "N/A" ? data.releaseDate : undefined,
        genre: data.genres,
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
                      uploadDate:
                          data.releaseDate && data.releaseDate !== "N/A"
                              ? data.releaseDate
                              : undefined,
                      description: `Watch official trailer for ${data.title}`,
                  },
              }
            : {}),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
            />
            <MediaPage
                param={formattedParam}
                type="movie"
                showSearch
                hidePagination
                isMovie
            >
                <PosterDetails isMovie data={data} />
                <PeopleYouMayKnow title="Cast" items={data.cast} />
                <YouMayLike items={data.recommendations} />
            </MediaPage>
        </>
    );
}