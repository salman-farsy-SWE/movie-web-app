import { PosterDetails } from "@/components/media/PosterDetails";
import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { YouMayLike } from "@/components/media/YouMayLike";
import { getMediaDetails } from "@/lib/tmdb";

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