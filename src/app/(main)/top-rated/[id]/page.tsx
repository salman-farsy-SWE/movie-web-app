import { MediaPage } from "@/components/media/MediaPage";
import { slugify } from "@/lib/utils";
import { getTopRatedContent } from "@/lib/tmdb";

export default async function TopRatedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const { id } = await params;
  const urlParams = await searchParams;
  const formattedParam = slugify(id);

  const parsedPage = Number(urlParams.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const result = await getTopRatedContent(
    formattedParam,
    currentPage,
    24
  );

  return (
    <MediaPage
      param={formattedParam}
      type="top-rated"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}
