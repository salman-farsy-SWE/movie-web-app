import { MediaPage } from "@/components/MediaPage";

export default async function TrendingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const formattedParam = id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return <MediaPage param={formattedParam} type="trending" showSearch={id === "persons"} />;
}