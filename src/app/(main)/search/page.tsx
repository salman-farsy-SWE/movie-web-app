import { MediaPage } from "@/components/media/MediaPage";
import { searchMoviesAndTv, type SearchMediaType } from "@/lib/tmdb";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; search?: string; page?: string; type?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || params.search || "").trim();

  const parsedPage = Number(params.page);
  const currentPage = !isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const validTypes: SearchMediaType[] = ["all", "movie", "tv"];
  const mediaType: SearchMediaType = validTypes.includes(params.type as SearchMediaType)
    ? (params.type as SearchMediaType)
    : "all";

  const result = await searchMoviesAndTv(query, currentPage, 24, mediaType);

  return (
    <MediaPage
      type="search"
      param=""
      searchQuery={query}
      searchMediaType={mediaType}
      items={result?.movies ?? []}
      currentPage={currentPage}
      totalPages={result?.totalPages ?? 1}
      totalResults={result?.totalResults ?? 0}
    />
  );
}

