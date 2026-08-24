"use client";

import { PersonCard } from "./PersonCard";

type Person = {
    id: string;
    name: string;
    role: string;
    image: string;
};

interface PersonsGridProps {
    basePath?: string;
}

const persons: Person[] = [
    {
        id: "1",
        name: "John Doe",
        role: "Actor/Director",
        image: "/assets/persons-image.jpg",
    },
    {
        id: "2",
        name: "Jane Smith",
        role: "Director/Producer",
        image: "/assets/persons-image.jpg",
    },
    {
        id: "3",
        name: "Michael Lee",
        role: "Producer/Writer",
        image: "/assets/persons-image.jpg",
    },
    {
        id: "4",
        name: "Emma Brown",
        role: "Actress/Producer",
        image: "/assets/persons-image.jpg",
    },
    {
        id: "5",
        name: "David Kim",
        role: "Writer/Producer",
        image: "/assets/persons-image.jpg",
    },
    {
        id: "6",
        name: "Sophia Wilson",
        role: "Cinematographer/Producer",
        image: "/assets/persons-image.jpg",
    },
];


export function PersonsGrid({ basePath }: PersonsGridProps) {
    const gridData = Array.from({ length: 36 }).map((_, i) => {
        const base = persons[i % persons.length];
        return { ...base, id: `${base.id}-${i}` };
    });

    return (
        <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 xl:gap-x-[96px] lg:gap-x-[86px] md:gap-x-[70px] sm:gap-x-[60px] gap-x-[50px] lg:gap-y-[60px] md:gap-y-[50px] sm:gap-y-[35px] gap-y-[30px] xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] xl:px-0 lg:px-2 px-1">
            {gridData.map((person) => (
                <PersonCard basePath={basePath} key={person.id} person={person} />
            ))}
        </div>
    );
}