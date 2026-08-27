"use client";

import { slugify } from "@/lib/utils";
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
        href={`${basePath}/${slugify(person.id)}`}
        className={
          variant === "grid"
            ? "relative xl:w-[160px] xl:h-[160px] lg:w-[150px] lg:h-[150px] md:w-[140px] md:h-[140px] sm:w-[130px] sm:h-[130px] w-[120px] h-[120px] border-2 rounded-full border-light-search-font overflow-hidden"
            : "relative xl:w-[160px] xl:h-[160px] lg:w-[150px] lg:h-[150px] md:w-[140px] md:h-[140px] sm:w-[130px] sm:h-[130px] w-[120px] h-[120px] border-2 rounded-full border-light-search-font overflow-hidden"
        }
      >
        <Image
          src={person.image}
          alt={person.name}
          fill
          className="object-cover w-full h-full"
        />
      </Link>

      <Link href={`${basePath}/${slugify(person.id)}`} className="flex flex-col items-center h-fit">
        <p className="font-normal xl:text-[13px] sm:text-[12px] text-[11px] text-light-persons-card-role dark:text-persons-card-role xl:mt-[8px] lg:mt-[7px] md:mt-[6px] sm:mt-[5px] mt-[4px]">
          {person.role}
        </p>

        <p className="font-medium xl:text-[17px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] text-black dark:text-white/85 xl:mt-[5px] lg:mt-[4px] sm:mt-[3px] mt-[2px]">
          {person.name}
        </p>
      </Link>
    </div>
  );
}