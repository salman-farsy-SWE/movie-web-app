"use client";

import { RowCarousel } from "@/components/home/RowCarousel";
import { PosterCard } from "@/components/media/PosterCard";
import type { MovieItem } from "@/types";

export function YouMayLike({ items, basePath }: { items?: MovieItem[]; basePath?: string }) {
    const displayItems = items || [];

    if (displayItems.length === 0) return null;

    return (
        <div className="xl:mt-[56px] lg:mt-[48px] md:mt-[42px] sm:mt-[36px] mt-[30px] xl:mb-[24px] lg:mb-[20px] md:mb-[16px] mb-[12px] xl:px-0 lg:px-5 md:px-7 px-9">
            <h2 className="font-akshar font-medium xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[25px] text-[23px] text-black dark:text-white">
                You May Like
            </h2>

            <RowCarousel
                gapClassName="lg:gap-[24px] sm:gap-[22px] gap-[20px]"
                controlsClassName="xl:top-[120px] lg:top-[118px] md:top-[114px] sm:top-[104px] top-[95px]"
                scrollStep={2}
            >
                {displayItems.map((movie) => (
                    <div key={movie.id} className="flex-[0_0_auto]">
                        <PosterCard
                            id={movie.id}
                            title={movie.title}
                            image={movie.image}
                            mediaType={"mediaType" in movie ? (movie.mediaType as "movie" | "tv") : undefined}
                            basePath={basePath}
                            rating={movie.rating}
                            releaseDate={movie.releaseDate || (movie.year ? String(movie.year) : (movie.releaseYear ? String(movie.releaseYear) : undefined))}
                            genre={movie.genre}
                        />
                    </div>
                ))}
            </RowCarousel>
        </div>
    );
}