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

        return {
            title,
            description,
            openGraph: {
                title: `${title} | Movie Trails`,
                description,
                type: "video.movie",
                images: image ? [{ url: image, alt: data.title }] : [],
            },
            twitter: {
                card: "summary_large_image",
                title: `${title} | Movie Trails`,
                description,
                images: image ? [image] : [],
            },
        };
    } catch {
        return {
            title: "Movie Details",
            description: "Watch trailers, discover cast and details on Movie Trails.",
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

    return (
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
    );
}