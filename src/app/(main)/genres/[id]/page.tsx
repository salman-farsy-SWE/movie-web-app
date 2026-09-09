import { MediaPage } from "@/components/media/MediaPage";
import { slugify } from "@/lib/utils";
import {
  getDiscoverMixed,
  parseFilterParams,
  isFilterActive,
} from "@/lib/tmdb";

export default async function GenresPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    sort_by?: string;
    media?: string;
    genre?: string;
    country?: string;
    language?: string;
    year?: string;
    rating?: string;
    duration?: string;
  }>;
}) {
  const { id } = await params;
  const urlParams = await searchParams;
  const formattedParam = slugify(id);

  const parsedPage = Number(urlParams.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const hasActiveFilters = isFilterActive(urlParams);
  const filterParams = parseFilterParams(urlParams);
  const currentSort = urlParams.sort_by || "popularity";

  const result = await getDiscoverMixed(
    currentPage,
    currentSort,
    24,
    hasActiveFilters ? filterParams : "all",
    id.replace(/-/g, " ")
  );

  return (
    <MediaPage
      param={formattedParam}
      type="genre"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}
