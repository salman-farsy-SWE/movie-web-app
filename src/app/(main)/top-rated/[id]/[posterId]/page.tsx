import { PosterDetails } from "@/components/media/PosterDetails";
import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { YouMayLike } from "@/components/media/YouMayLike";
import { slugify } from "@/lib/utils";
import { getMediaDetails } from "@/lib/tmdb";

export default async function PosterDetailsPage({
    params,
}: {
    params: Promise<{ id: string; posterId: string }>;
}) {
    const { id, posterId } = await params;

    const formattedParam = slugify(id) || id;
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