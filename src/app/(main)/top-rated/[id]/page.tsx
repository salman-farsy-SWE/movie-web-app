import { MediaPage } from "@/components/MediaPage";

export default async function TopRatedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const formattedParam = id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return <MediaPage param={formattedParam} type="top-rated" />;
}