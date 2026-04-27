"use client";

import Image from "next/image";
import Link from "next/link";
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
        <div className="grid grid-cols-6 gap-x-[96px] gap-y-[60px] mt-[24px]">
            {gridData.map((person) => (
                <PersonCard basePath={basePath} key={person.id} person={person} />
            ))}
        </div>
    );
}