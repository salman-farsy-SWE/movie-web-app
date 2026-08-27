"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useSyncExternalStore } from "react";
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

    const subscribe = useCallback(
        (callback: () => void) => {
            if (!emblaApi) return () => {};

            emblaApi.on("select", callback);
            emblaApi.on("reInit", callback);

            return () => {
                emblaApi.off("select", callback);
                emblaApi.off("reInit", callback);
            };
        },
        [emblaApi]
    );

    const canScrollLeft = useSyncExternalStore(
        subscribe,
        () => (emblaApi ? emblaApi.canScrollPrev() : false),
        () => false
    );

    const canScrollRight = useSyncExternalStore(
        subscribe,
        () => (emblaApi ? emblaApi.canScrollNext() : false),
        () => false
    );

    return (
        <div className="xl:mt-[60px] lg:mt-[55px] md:mt-[50px] sm:mt-[45px] mt-[40px] xl:px-6 lg:px-8 md:px-10 sm:px-12 px-14">
            <h2 className="font-akshar font-medium xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[25px] text-[23px] text-black dark:text-white">
                You May Like
            </h2>

            <div className="relative xl:mt-[15px] lg:mt-[14px] md:mt-[13px] sm:mt-[12px] mt-[10px]">
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
                    className="xl:top-[120px] lg:top-[118px] md:top-[114px] sm:top-[104px] top-[95px]"

                />
            </div>
        </div>
    );
}