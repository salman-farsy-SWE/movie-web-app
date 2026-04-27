import { PosterDetails } from "@/components/PosterDetails";
import { MediaPage } from "@/components/MediaPage";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PersonDetails } from "@/components/PersonDetails";
import { YouMayLike } from "@/components/YouMayLike";

export default async function PosterDetailsPage({
    params,
}: {
    params: Promise<{ posterId: string }>;
}) {
    const { posterId } = await params;

    const formattedParam = posterId
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <MediaPage
            param={formattedParam}
            type="movie"
            showSearch
            hidePagination
            isMovie
        >
            <PosterDetails />
            <PeopleYouMayKnow title="Cast" />
            <YouMayLike />
        </MediaPage>
    );
}