import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  const staticRoutes = [
    "",
    "/movies",
    "/tv-shows",
    "/trending/today",
    "/trending/this-week",
    "/trending/movies",
    "/trending/tv-shows",
    "/trending/persons",
    "/top-rated/movies",
    "/top-rated/tv-shows",
    "/top-rated/all",
    "/search",
  ];

  const genres = [
    "action",
    "adventure",
    "animation",
    "comedy",
    "crime",
    "documentary",
    "drama",
    "family",
    "fantasy",
    "history",
    "horror",
    "music",
    "mystery",
    "romance",
    "sci-fi",
    "thriller",
    "war",
    "western",
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: route === "" ? 1.0 : 0.8,
    })),
    ...genres.map((genre) => ({
      url: `${baseUrl}/genres/${genre}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return entries;
}
