import { MediaPage } from "@/components/media/MediaPage";
import {
  getDiscoverMovies,
  parseFilterParams,
  isFilterActive,
} from "@/lib/tmdb";

export default async function MoviesPage({
  searchParams,
}: {
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
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const hasActiveFilters = isFilterActive(params);
  const filterParams = parseFilterParams(params);
  const currentSort = params.sort_by || "popularity";

  const result = await getDiscoverMovies(
    currentPage,
    currentSort,
    24,
    hasActiveFilters ? filterParams : "all"
  );

  return (
    <MediaPage
      type="movie"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
    />
  );
}