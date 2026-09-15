import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";
import { getListDetails } from "@/lib/tmdb/auth";
import { getTmdbListDetailsAction } from "@/actions/collections";
import type { UserList } from "@/types";

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
      if (details.backdrop_path) {
        backdropUrl = `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`;
      } else if (details.items && details.items[0]?.backdrop_path) {
        backdropUrl = `https://image.tmdb.org/t/p/w1280${details.items[0].backdrop_path}`;
      } else if (details.poster_path) {
        backdropUrl = `https://image.tmdb.org/t/p/w780${details.poster_path}`;
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

  const validImage =
    backdropUrl && !backdropUrl.startsWith("/assets/")
      ? backdropUrl
      : undefined;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Movie Trails`,
      description,
      type: "website",
      url: `/list/${rawId}`,
      siteName: "Movie Trails",
      ...(validImage
        ? {
            images: [
              {
                url: validImage,
                width: 1200,
                height: 630,
                alt: `${title} | Movie Trails`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Movie Trails`,
      description,
      ...(validImage ? { images: [validImage] } : {}),
    },
  };
}

export default async function AnonymousListPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = await params;
  const rawId = listId.replace(/^list-/, "");
  const formattedListId = slugify(listId);

  let initialList: UserList | null = null;
  try {
    const res = await getTmdbListDetailsAction(rawId);
    if (res.success && res.list) {
      initialList = res.list;
    }
  } catch {}

  return (
    <UserCollectionPage
      type="list"
      param2={formattedListId}
      initialList={initialList}
    />
  );
}

