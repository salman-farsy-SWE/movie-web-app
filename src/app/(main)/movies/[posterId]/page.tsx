import { PosterDetails } from "@/components/PosterDetails";
import { MediaPage } from "@/components/MediaPage";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { YouMayLike } from "@/components/YouMayLike";
import { slugify } from "@/lib/utils";

export default async function PosterDetailsPage({
    params,
}: {
    params: Promise<{ posterId: string }>;
}) {
    const { posterId } = await params;

    const formattedParam = slugify(posterId);

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