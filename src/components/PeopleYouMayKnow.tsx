"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useSyncExternalStore } from "react";
import { SectionControls } from "@/components/SectionControls";
import { PersonCard } from "./PersonCard";

type Person = {
    id: string;
    name: string;
    role: string;
    image: string;
};

const persons: Person[] = [
    { id: "1", name: "John Doe", role: "Actor", image: "/assets/images.jpg" },
    { id: "2", name: "Jane Smith", role: "Director", image: "/assets/images.jpg" },
    { id: "3", name: "Michael Lee", role: "Producer", image: "/assets/images.jpg" },
    { id: "4", name: "Emma Brown", role: "Actress", image: "/assets/images.jpg" },
    { id: "5", name: "David Kim", role: "Writer", image: "/assets/images.jpg" },
    { id: "6", name: "Sophia Wilson", role: "Cinematographer", image: "/assets/images.jpg" },
    { id: "7", name: "Chris Evans", role: "Actor", image: "/assets/images.jpg" },
    { id: "8", name: "Scarlett Lee", role: "Producer", image: "/assets/images.jpg" },
    { id: "9", name: "Robert Kim", role: "Director", image: "/assets/images.jpg" },
    { id: "10", name: "Anna Stone", role: "Actress", image: "/assets/images.jpg" },
    { id: "11", name: "Mark Lee", role: "Writer", image: "/assets/images.jpg" },
    { id: "12", name: "Lisa Ray", role: "Producer", image: "/assets/images.jpg" },
];

export function PeopleYouMayKnow({ title }: { title: string }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        dragFree: true,
        containScroll: "trimSnaps",
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
        <div className="xl:mt-[40px] lg:mt-[38px] md:mt-[34px] sm:mt-[32px] mt-[30px] xl:px-6 lg:px-8 md:px-10 sm:px-12 px-14">
            <h2 className="font-akshar font-medium xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[25px] text-[23px] text-black">
                {title}
            </h2>

            <div className="relative xl:mt-[15px] lg:mt-[14px] md:mt-[13px] sm:mt-[12px] mt-[10px]">
                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex xl:gap-[96px] lg:gap-[86px] md:gap-[76px] sm:gap-[66px] gap-[56px]">
                        {persons.map((p, i) => (
                            <PersonCard
                                key={`${p.id}-${i}`}
                                person={p}
                                basePath="/trending/persons"
                                variant="carousel"
                            />
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
                        const current = emblaApi.selectedScrollSnap();
                        emblaApi.scrollTo(current + 2);
                    }}
                    className="xl:top-[49px] lg:top-[44px] md:top-[43px] sm:top-[39px] top-[40px]"
                />
            </div>
        </div>
    );
}