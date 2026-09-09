import { MovieCard } from "@/components/home/MovieCard";
import { RowCarousel } from "./RowCarousel";

import type { MovieItem } from "@/data/mock-home";

interface HomeSectionProps {
    id: string;
    title: string;
    items: (MovieItem | {
        id: string;
        title: string;
        genre: string;
        image?: string | null;
        trailerKey: string | null;
        mediaType?: "movie" | "tv";
    })[];
}

export function HomeSection({ id, title, items }: HomeSectionProps) {
    return (
        <section className="xl:px-0 lg:px-5 md:px-7 px-9">
            <h2 className="font-akshar font-medium xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[25px] text-[23px] text-black dark:text-white">
                {title}
            </h2>

            <RowCarousel className="xl:-mt-[32px] lg:-mt-[30px] md:-mt-[28px] sm:-mt-[26px] -mt-[22px]" controlsClassName = "xl:top-[96px] lg:top-[90px] md:top-[84px] sm:top-[80px] top-[63px]">
                {items.map((movie, index) => (
                    <div key={`${id}-${movie.id}-${index}`} className="flex-[0_0_auto]">
                        <MovieCard
                            id={movie.id}
                            title={movie.title}
                            genre={movie.genre}
                            image={movie.image}
                            trailerKey={movie.trailerKey}
                            mediaType={"mediaType" in movie && movie.mediaType ? movie.mediaType : (id === "tv-shows" ? "tv" : "movie")}
                            basePath={id === "trending" ? "/trending/all" : id === "top-rated" ? "/top-rated/all" : id === "tv-shows" ? "/tv-shows" : "/movies"}
                        />
                    </div>
                ))}
            </RowCarousel>
        </section>
    );
}