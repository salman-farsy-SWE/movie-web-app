import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}): Promise<Metadata> {
  const { listId } = await params;
  const cleanTitle = decodeURIComponent(listId)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${cleanTitle} - Custom List`;
  const description = "View curated movies and TV shows in this custom list on Movie Trails.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ListRedirectPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  const { listId } = await params;
  redirect(`/list/${listId}`);
}