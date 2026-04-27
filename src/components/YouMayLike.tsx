"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { PosterCard } from "@/components/PosterCard";
import { SectionControls } from "@/components/SectionControls";
import { useBasePath } from "@/contexts/BasePathContext";

const dummyMovies = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    title: `Movie ${i + 1}`,
    image: "/assets/images.jpg",
}));

export function YouMayLike() {
    const { basePath } = useBasePath();

    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        containScroll: "trimSnaps",
        duration: 12,
    });

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const update = () => {
        if (!emblaApi) return;
        setCanScrollLeft(emblaApi.canScrollPrev());
        setCanScrollRight(emblaApi.canScrollNext());
    };

    useEffect(() => {
        if (!emblaApi) return;

        update();
        emblaApi.on("select", update);
        emblaApi.on("reInit", update);
    }, [emblaApi]);

    return (
        <div className="mt-[37px]">
            <h2 className="font-akshar font-medium text-[28px] text-black">
                You May Like
            </h2>

            <div className="relative mt-[15px]">
                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex gap-[24px]">
                        {dummyMovies.map((movie) => (
                            <div key={movie.id} className="flex-[0_0_auto]">
                                <PosterCard
                                    title={movie.title}
                                    image={movie.image} 
                                    basePath={basePath}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <SectionControls
                    canScrollLeft={canScrollLeft}
                    canScrollRight={canScrollRight}
                    onLeft={() => {
                        if (!emblaApi) return;
                        const current = emblaApi.selectedScrollSnap();
                        emblaApi.scrollTo(Math.max(current - 2, 0));
                    }}
                    onRight={() => {
                        if (!emblaApi) return;
                        const snaps = emblaApi.scrollSnapList();
                        const current = emblaApi.selectedScrollSnap();
                        emblaApi.scrollTo(Math.min(current + 2, snaps.length - 1));
                    }}
                    className="xl:top-[120px] lg:top-[51px] md:top-[53px] sm:top-[51px] top-[40px]"

                />
            </div>
        </div>
    );
}