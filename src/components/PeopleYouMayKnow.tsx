"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { SectionControls } from "@/components/SectionControls";
import Image from "next/image";
import Link from "next/link";
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
        <div className="mt-[40px]">
            <h2 className="font-akshar font-medium text-[28px] text-black">
                {title}
            </h2>

            <div className="relative mt-[15px]">
                <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex gap-[96px]">
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
                    className="xl:top-[48px] lg:top-[51px] md:top-[53px] sm:top-[51px] top-[40px]"
                />
            </div>
        </div>
    );
}