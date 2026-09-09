import { MediaPage } from "@/components/media/MediaPage";
import { slugify } from "@/lib/utils";
import {
  getTrendingContent,
  getTrendingPersons,
  searchPersons,
  parseFilterParams,
  isFilterActive,
} from "@/lib/tmdb";

export default async function TrendingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    media?: string;
    time_window?: string;
    q?: string;
    search?: string;
  }>;
}) {
  const { id } = await params;
  const urlParams = await searchParams;
  const formattedParam = slugify(id);

  const parsedPage = Number(urlParams.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  if (id === "persons") {
    const query = (urlParams.q || urlParams.search)?.trim();
    const selectedTimeWindow =
      urlParams.time_window === "day" || urlParams.media === "day"
        ? "day"
        : "week";

    const result = query
      ? await searchPersons(query, currentPage, 24)
      : await getTrendingPersons(
          selectedTimeWindow,
          currentPage,
          24
        );

    return (
      <MediaPage
        param={formattedParam}
        type="trending"
        personItems={result?.persons ?? []}
        searchQuery={query}
        currentPage={currentPage}
        totalPages={result?.totalPages ?? 1}
        trendingTimeWindow={selectedTimeWindow}
      />
    );
  }


  const hasActiveFilters = isFilterActive(urlParams);
  const filterParams = parseFilterParams(urlParams);

  const result = await getTrendingContent(
    formattedParam,
    currentPage,
    24,
    hasActiveFilters ? filterParams : "all"
  );

  return (
    <MediaPage
      param={formattedParam}
      type="trending"
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
      trendingMedia={filterParams.media}
      trendingTimeWindow={filterParams.time_window}
    />
  );
}
