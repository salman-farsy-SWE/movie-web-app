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

  const data = await getMediaDetails(posterId);
  const isMovie = data.isMovie ?? true;
  const formattedParam = slugify(id) || id;
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
      type="genre"
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