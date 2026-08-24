import { PosterDetails } from "@/components/PosterDetails";
import { MediaPage } from "@/components/MediaPage";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { YouMayLike } from "@/components/YouMayLike";
import { slugify } from "@/lib/utils";

export default async function PosterDetailsPage({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}) {
  const { id, posterId } = await params;

  const formattedParam = slugify(id);

  const formattedParam2 = slugify(posterId);

  return (
    <MediaPage
      param={formattedParam}
      type="genre"
      showSearch
      param2={formattedParam2}
      hidePagination
      isMovie
    >
      <PosterDetails  />
      <PeopleYouMayKnow title="Cast" />
      <YouMayLike />
    </MediaPage>
  );
}