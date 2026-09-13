import { HeroSection } from "@/components/home/HeroSection";
import { HomeSection } from "@/components/home/HomeSection";
import {
  getNowPlayingMovies,
  getTrendingAll,
  getTopRatedAll,
  getPopularMovies,
  getTrendingTvShows,
} from "@/lib/tmdb";

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
