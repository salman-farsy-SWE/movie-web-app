import type { Metadata } from "next";
import { MediaPage } from "@/components/media/MediaPage";
import { PeopleYouMayKnow } from "@/components/media/PeopleYouMayKnow";
import { PersonDetails } from "@/components/media/PersonDetails";
import { PosterDetails } from "@/components/media/PosterDetails";
import { YouMayLike } from "@/components/media/YouMayLike";
import { slugify } from "@/lib/utils";
import { getMediaDetails, getPersonDetails } from "@/lib/tmdb";
import { notFound } from "next/navigation";

const VALID_TRENDING_CATEGORIES = [
  "today",
  "this-week",
  "movies",
  "tv-shows",
  "persons",
  "all",
  "day",
  "week",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}): Promise<Metadata> {
  const { id, posterId } = await params;
  const formattedParam = slugify(id) || id;

  try {
    if (formattedParam === "persons") {
      const personData = await getPersonDetails(posterId);
      const title = personData.name
        ? `${personData.name} - ${personData.profession || "Actor"}`
        : "Person Details";
      const description =
        personData.bio && personData.bio.length > 10
          ? personData.bio.slice(0, 160) + "..."
          : `Explore filmography, biography, and photos of ${personData.name} on Movie Trails.`;
      const image = personData.image && personData.image !== "/assets/movie-placeholder.jpg" ? personData.image : undefined;
      const validImage =
        personData.image && !personData.image.startsWith("/assets/")
          ? personData.image
          : undefined;

      return {
        title,
        description,
        openGraph: {
          title: `${title} | Movie Trails`,
          description,
          type: "profile",
          images: image
            ? [{ url: image, alt: personData.name }]
            : [
                {
                  url: "/opengraph-image",
                  width: 1200,
                  height: 630,
                  alt: `${title} | Movie Trails`,
                },
              ],
          ...(validImage
            ? {
                images: [
                  {
                    url: validImage,
                    width: 1200,
                    height: 630,
                    alt: personData.name,
                  },
                ],
              }
            : {}),
        },
        twitter: {
          card: "summary_large_image",
          title: `${title} | Movie Trails`,
          description,
          images: image ? [image] : ["/twitter-image"],
          ...(validImage ? { images: [validImage] } : {}),
        },
      };
    } else {
      const isExplicitMovie = id === "movies" ? true : id === "tv-shows" ? false : undefined;
      const data = await getMediaDetails(posterId, isExplicitMovie);
      const isMovie = data.isMovie ?? (isExplicitMovie ?? true);
      const title = data.title || "Media Details";
      const description =
        data.overview ||
        `Watch trailers, cast information, and details for ${data.title} on Movie Trails.`;
      const image = data.backdropImage || data.posterImage;
      const validImage =
        image && !image.startsWith("/assets/") ? image : undefined;

      return {
        title,
        description,
        openGraph: {
          title: `${title} | Movie Trails`,
          description,
          type: isMovie ? "video.movie" : "video.tv_show",
          images: image
            ? [{ url: image, alt: data.title }]
            : [
                {
                  url: "/opengraph-image",
                  width: 1200,
                  height: 630,
                  alt: `${title} | Movie Trails`,
                },
              ],
          ...(validImage
            ? {
                images: [
                  {
                    url: validImage,
                    width: 1200,
                    height: 630,
                    alt: data.title,
                  },
                ],
              }
            : {}),
        },
        twitter: {
          card: "summary_large_image",
          title: `${title} | Movie Trails`,
          description,
          images: image ? [image] : ["/twitter-image"],
          ...(validImage ? { images: [validImage] } : {}),
        },
      };
    }
  } catch {
    const fallbackTitle = formattedParam === "persons" ? "Person Details" : "Media Details";
    const fallbackDesc = "Discover entertainment details on Movie Trails.";
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      openGraph: {
        title: `${fallbackTitle} | Movie Trails`,
        description: fallbackDesc,
        type: "website",
        images: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${fallbackTitle} | Movie Trails`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${fallbackTitle} | Movie Trails`,
        description: fallbackDesc,
        images: ["/twitter-image"],
      },
    };
  }
}

export default async function PersonDetailsPage({
  params,
}: {
  params: Promise<{ id: string; posterId: string }>;
}) {
  const { id, posterId } = await params;

  const formattedParam = slugify(id) || id;

  if (!VALID_TRENDING_CATEGORIES.includes(formattedParam)) {
    notFound();
  }
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
