import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";
import { getListDetails } from "@/lib/tmdb/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ listId: string }>;
}): Promise<Metadata> {
  const { listId } = await params;
  const rawId = listId.replace(/^list-/, "");

  let title = "Custom List";
  let description = "View curated movies and TV shows in this list on Movie Trails.";
  let backdropUrl: string | undefined;

  try {
    const details = await getListDetails(rawId);
    if (details?.name) {
      title = `${details.name} - Movie Trails`;
      if (details.description) {
        description = details.description;
      }
    } else {
      const cleanTitle = decodeURIComponent(listId)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      title = `${cleanTitle} - Custom List`;
    }
  } catch {
    const cleanTitle = decodeURIComponent(listId)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    title = `${cleanTitle} - Custom List`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Movie Trails`,
      description,
      type: "website",
      images: [
        {
          url: backdropUrl || "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${title} | Movie Trails`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Movie Trails`,
      description,
      images: [backdropUrl || "/twitter-image"],
    },
  };
}

export default async function AnonymousListPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = await params;
  const formattedListId = slugify(listId);

  return (
    <UserCollectionPage
      type="list"
      param2={formattedListId}
    />
  );
}

