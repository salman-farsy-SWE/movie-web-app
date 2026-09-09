import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { PersonDetails } from "@/components/media/PersonDetails";
import { PosterDetails } from "@/components/media/PosterDetails";
import { YouMayLike } from "@/components/media/YouMayLike";
import { slugify } from "@/lib/utils";
import { getMediaDetails, getPersonDetails } from "@/lib/tmdb";

export default async function PersonDetailsPage({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}) {
  const { id, posterId } = await params;

  const formattedParam = slugify(id) || id;
  let decoded = posterId;
  try {
    decoded = decodeURIComponent(posterId);
  } catch {
    decoded = posterId;
  }

  if (id === "persons") {
    const personData = await getPersonDetails(posterId);

    return (
      <MediaPage
        param={formattedParam}
        type="trending"
        showSearch
        param2={personData.name || decoded.replace(/-/g, " ")}
        hidePagination
      >
        <PersonDetails data={personData} />
        <PeopleYouMayKnow title="People You May Know" items={personData.collaborators} />
        <YouMayLike items={personData.knownForCredits} />
      </MediaPage>
    );
  } else {
    const isExplicitMovie = id === "movies" ? true : id === "tv-shows" ? false : undefined;
    const data = await getMediaDetails(posterId, isExplicitMovie);
    const isMovie = data.isMovie ?? (isExplicitMovie ?? true);

    return (
      <MediaPage
        param={formattedParam}
        type="trending"
        showSearch
        param2={data.title || decoded.replace(/-/g, " ")}
        hidePagination
        isMovie={isMovie}
      >
        <PosterDetails isMovie={isMovie} data={data} />
        <PeopleYouMayKnow title="Cast" items={data.cast} />
        <YouMayLike items={data.recommendations} />
      </MediaPage>
    );
  }
}
