import type { TableItem, CustomList } from "@/types";

export function sortCollectionItems(items: TableItem[], sortBy: string): TableItem[] {
  if (!sortBy) return items;
  const sorted = [...items];

  switch (sortBy) {
    case "your-rating-desc":
    case "your_rating.desc":
      return sorted.sort((a, b) => (b.yourRating ?? 0) - (a.yourRating ?? 0));
    case "your-rating-asc":
    case "your_rating.asc":
      return sorted.sort((a, b) => (a.yourRating ?? 0) - (b.yourRating ?? 0));
    case "rating":
    case "rating-desc":
    case "rating.desc":
    case "vote_average.desc":
    case "top-rated":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "rating-asc":
    case "rating.asc":
    case "vote_average.asc":
      return sorted.sort((a, b) => a.rating - b.rating);
    case "latest":
    case "release-desc":
    case "primary_release_date.desc":
    case "release_date.desc":
    case "now-playing":
      return sorted.sort((a, b) => (b.released || "").localeCompare(a.released || ""));
    case "release-asc":
    case "primary_release_date.asc":
    case "release_date.asc":
      return sorted.sort((a, b) => (a.released || "").localeCompare(b.released || ""));
    case "title-asc":
    case "title.asc":
    case "name.asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "title-desc":
    case "title.desc":
    case "name.desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

export function sortCustomLists(lists: CustomList[], sortBy: string): CustomList[] {
  if (!sortBy) return lists;
  const sorted = [...lists];

  switch (sortBy) {
    case "title-asc":
    case "title.asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
    case "title.desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "items-desc":
    case "items.desc":
    case "most-items":
      return sorted.sort((a, b) => {
        const countB = b.itemCount ?? b.items?.length ?? 0;
        const countA = a.itemCount ?? a.items?.length ?? 0;
        return countB - countA;
      });
    case "items-asc":
    case "items.asc":
    case "fewest-items":
      return sorted.sort((a, b) => {
        const countB = b.itemCount ?? b.items?.length ?? 0;
        const countA = a.itemCount ?? a.items?.length ?? 0;
        return countA - countB;
      });
    default:
      return sorted;
  }
}

