import { MediaPage } from "@/components/MediaPage";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PersonDetails } from "@/components/PersonDetails";
import { PosterDetails } from "@/components/PosterDetails";
import { YouMayLike } from "@/components/YouMayLike";

export default async function PersonDetailsPage({
  params,
}: {
  params: Promise<{ id: string; subId: string }>;
}) {
  const { id, subId } = await params;

  const formattedParam = id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const formattedParam2 = subId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (id === "persons") {

    return (
      <MediaPage
        param={formattedParam}
        type="trending"
        showSearch
        param2="John Doe"
        hidePagination
      >
        <PersonDetails
          name="John Doe"
          bio="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"
          birthDate="Jan 1, 1990"
          gender="Male"
          profession="Actor"
          birthPlace="USA"
          popularity="8.5"
          knownFor="Movies"
          image="/assets/persons-image.jpg"
        />
        <PeopleYouMayKnow title="People You May Know" />
        <YouMayLike />
      </MediaPage>
    );
  } else {
    return (
      <MediaPage
        param={formattedParam}
        type="trending"
        showSearch
        param2={formattedParam2}
        hidePagination
        isMovie
      >
        <PosterDetails />
        <PeopleYouMayKnow title="Cast" />
        <YouMayLike />
      </MediaPage>
    );
  }
}