import { PosterDetails } from "@/components/PosterDetails";
import { MediaPage } from "@/components/MediaPage";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PersonDetails } from "@/components/PersonDetails";
import { YouMayLike } from "@/components/YouMayLike";

export default async function PosterDetailsPage({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}) {
  const { id, posterId } = await params;

  const formattedParam = id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const formattedParam2 = posterId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

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