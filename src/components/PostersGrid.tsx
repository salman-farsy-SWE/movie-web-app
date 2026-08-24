"use client";

import { PosterCard } from "@/components/PosterCard";

interface PostersGridProps {
  basePath: string;
}

const dummyMovies = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  title: `Movie ${i + 1}`,
  image: "/assets/images.jpg", 
}));

export function PostersGrid({ basePath }: PostersGridProps) {
  return (
    <div className="xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] max-w-[1440px] w-fit flex justify-center flex-wrap xl:gap-[24px] lg:gap-[23px] gap-[22px]">
      {dummyMovies.map((movie) => (
        <PosterCard
          key={movie.id}
          title={movie.title}
          image={movie.image}
          basePath={basePath}
        />
      ))}
    </div>
  );
}