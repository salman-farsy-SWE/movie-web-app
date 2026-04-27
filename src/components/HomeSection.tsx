"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { SectionControls } from "@/components/SectionControls";

interface HomeSectionProps {
    id: string;
    title: string;
    items: {
        id: string;
        title: string;
        genre: string;
        image: string;
        trailer: string;
    }[];
}

export function HomeSection({ id, title, items }: HomeSectionProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        containScroll: "trimSnaps",
    });

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateButtons = () => {
        if (!emblaApi) return;

        setCanScrollLeft(emblaApi.canScrollPrev());
        setCanScrollRight(emblaApi.canScrollNext());
    };

    useEffect(() => {
        if (!emblaApi) return;

        updateButtons();
        emblaApi.on("select", updateButtons);
        emblaApi.on("reInit", updateButtons);

        return () => {
            emblaApi.off("select", updateButtons);
            emblaApi.off("reInit", updateButtons);
        };
    }, [emblaApi]);

    return (
        <section className="xl:px-0 lg:px-5 md:px-7 px-9">
            <h2 className="font-akshar xl:text-[28px] lg:text-[26px] md:text-[24px] sm:text-[22px] text-[20px] font-medium leading-none text-black dark:text-white">
                {title}
            </h2>

            <div className="relative xl:mt-[15px] lg:mt-[13px] md:mt-[11px] sm:mt-[9px] mt-[7px]">
                <div ref={emblaRef} className="overflow-hidden active:cursor-grabbing">
                    <div className="flex xl:gap-[15px] sm:gap-[13px] gap-[11px]">
                        {items.map((movie, index) => (
                            <div key={`${id}-${movie.id}-${index}`} className="flex-[0_0_auto]">
                                <MovieCard
                                    title={movie.title}
                                    genre={movie.genre}
                                    image={movie.image}
                                    trailer={movie.trailer}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <SectionControls
                    canScrollLeft={canScrollLeft}
                    canScrollRight={canScrollRight}
                    onRight={() => {
                        if (!emblaApi) return;

                        const snaps = emblaApi.scrollSnapList();
                        const currentIndex = emblaApi.selectedScrollSnap();

                        const nextIndex = Math.min(currentIndex + 3, snaps.length - 1);
                        emblaApi.scrollTo(nextIndex);
                    }}

                    onLeft={() => {
                        if (!emblaApi) return;

                        const currentIndex = emblaApi.selectedScrollSnap();
                        const prevIndex = Math.max(currentIndex - 3, 0);

                        emblaApi.scrollTo(prevIndex);
                    }}
                    className={"xl:top-[59px] lg:top-[51px] md:top-[53px] sm:top-[51px] top-[40px]"}
                />
            </div>
        </section>
    );
}