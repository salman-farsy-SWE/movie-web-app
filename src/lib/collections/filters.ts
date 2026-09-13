import type { TableItem, CustomList } from "@/types";

export interface CollectionFilterOptions {
  mediaFilter?: string;
  yearFilter?: string[];
  ratingFilter?: string[];
  searchQuery?: string;
}

export function filterCollectionItems(
  items: TableItem[],
  options: CollectionFilterOptions
): TableItem[] {
  const { mediaFilter, yearFilter = [], ratingFilter = [], searchQuery = "" } = options;
  let result = [...items];

  if (mediaFilter && mediaFilter !== "all") {
    if (mediaFilter === "movie" || mediaFilter === "movies") {
      result = result.filter((item) => item.media === "Movie");
    } else if (mediaFilter === "tv" || mediaFilter === "tv_shows") {
      result = result.filter((item) => item.media === "TV Show");
    }
  }

  if (yearFilter.length > 0) {
    result = result.filter((item) => {
      const itemYear = item.released ? item.released.trim() : "";
      return yearFilter.some((y) => itemYear.includes(y) || itemYear === y);
    });
  }

  if (ratingFilter.length > 0) {
    const minThreshold = Math.min(
      ...ratingFilter.map((r) => Number(r)).filter((n) => !isNaN(n))
    );
    if (!isNaN(minThreshold)) {
      result = result.filter((item) => {
        const score = item.yourRating ?? item.rating ?? 0;
        return score >= minThreshold;
      });
    }
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((item) => item.name.toLowerCase().includes(query));
  }

  return result;
}

export function filterCustomLists(
  lists: CustomList[],
  options: { visibilityFilter?: string; searchQuery?: string }
): CustomList[] {
  const { visibilityFilter, searchQuery = "" } = options;
  let result = [...lists];

  if (visibilityFilter && visibilityFilter !== "all") {
    if (visibilityFilter === "public") {
      result = result.filter((l) => !l.isPrivate);
    } else if (visibilityFilter === "private") {
      result = result.filter((l) => l.isPrivate);
    }
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        (l.description && l.description.toLowerCase().includes(query))
    );
  }

  return result;
}

