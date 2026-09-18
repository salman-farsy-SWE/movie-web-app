import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeSection } from "@/components/home/HomeSection";
import {
  getNowPlayingMovies,
  getTrendingAll,
  getTopRatedAll,
  getPopularMovies,
  getTrendingTvShows,
} from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Movie Trails | Watch Trailers, Discover Movies & Track TV Shows",
  description:
    "Discover trending movies, watch trailers, explore top-rated TV shows, create custom watchlists, and track your favorite cinema entertainment with Movie Trails.",
  keywords: [
    "watch movie trailers",
    "movie trailers",
    "discover movies",
    "trending movies",
    "top rated tv shows",
    "popular tv series",
    "custom movie watchlist",
    "movie ratings and reviews",
    "latest cinema trailers",
    "latest tv show trailers",
    "stream trailers online",
    "movie recommendations",
    "film trailers",
    "free movie trailers",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Movie Trails | Watch Trailers, Discover Movies & Track TV Shows",
    description:
      "Discover trending movies, watch trailers, explore top-rated TV shows, create custom watchlists, and track your favorite cinema entertainment with Movie Trails.",
    type: "website",
    url: "/",
  },
};

export default async function Home() {
  const [
    heroContents,
    trending,
    topRated,
    movies,
    tvShows,
  ] = await Promise.all([
    getNowPlayingMovies(5),
    getTrendingAll(10),
    getTopRatedAll(10),
    getPopularMovies(10),
    getTrendingTvShows(10),
  ]);

  const sections = [
    { id: "trending", title: "Trending", items: trending },
    { id: "top-rated", title: "Top Rated", items: topRated },
    { id: "movies", title: "Movies", items: movies },
    { id: "tv-shows", title: "TV Shows", items: tvShows },
  ];

  return (
    <main className="flex flex-col items-center">
      <HeroSection heroContents={heroContents ?? []} />

      <div className="container-1440 flex flex-col xl:gap-[60px] lg:gap-[50px] md:gap-[45px] sm:gap-[40px] gap-[35px] xl:mt-[40px] lg:mt-[36px] md:mt-[32px] sm:mt-[28px] mt-[24px]">
        {sections.map((section) => (
          <HomeSection
            key={section.id}
            id={section.id}
            title={section.title}
            items={section.items ?? []}
          />
        ))}
      </div>
    </main>
  );
}
