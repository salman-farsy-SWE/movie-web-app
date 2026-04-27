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
    <div className="mt-[21px] w-[1440px] flex flex-wrap gap-[24px]">
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