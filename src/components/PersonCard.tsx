"use client";

import Image from "next/image";
import Link from "next/link";

export type Person = {
  id: string;
  name: string;
  role: string;
  image: string;
};

interface PersonCardProps {
  person: Person;
  basePath?: string;
  variant?: "grid" | "carousel";
}

export function PersonCard({ person, basePath, variant = "grid" }: PersonCardProps) {
  return (
    <div
      className="flex flex-col items-center font-inter flex-[0_0_auto]"
    >
      <Link
        href={`${basePath}/${person.id}`}

        className={
          variant === "grid"
            ? "w-[160px] h-[160px] border-2 rounded-full border-light-search-font overflow-hidden"
            : "w-[160px] h-[160px] border-2 rounded-full border-light-search-font overflow-hidden"
        }
      >
        <Image
          src={person.image}
          alt={person.name}
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </Link>

      <Link href={`${basePath}/${person.id}`} className="flex flex-col items-center h-fit">
        <p className=" font-normal text-[13px] text-persons-card-role mt-[8px]">
          {person.role}
        </p>

        <p className=" font-medium text-[17px] text-black mt-[5px]">
          {person.name}
        </p>
      </Link>
    </div>
  );
}