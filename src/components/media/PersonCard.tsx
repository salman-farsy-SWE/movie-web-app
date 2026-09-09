"use client";

import { useState } from "react";
import { cn, slugify } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export type Person = {
  id: string;
  name: string;
  role: string;
  image?: string | null;
  popularity?: number;
  knownFor?: string;
};

const DEFAULT_PERSON_IMAGE = "/assets/persons-image.jpg";

interface PersonCardProps {
  person: Person;
  basePath?: string;
  variant?: "grid" | "carousel";
  className?: string;
}

export function PersonCard({
  person,
  basePath,
  variant = "grid",
  className,
}: PersonCardProps) {
  const [hasError, setHasError] = useState(false);
  const imgSrc: string = hasError || !person.image ? DEFAULT_PERSON_IMAGE : person.image;

  const personSlug = slugify(person.name) || person.id;
  const targetPath = `${basePath || "/trending/persons"}/${personSlug}`;

  return (
    <div
      className={cn(
        "flex flex-col items-center font-inter flex-[0_0_auto] w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] xl:w-[160px]",
        className
      )}
    >
      <Link
        href={targetPath}
        className="group flex flex-col items-center w-full rounded-xl"
      >
        {/* Avatar Image Container */}
        <div
          className={cn(
            "relative xl:w-[160px] xl:h-[160px] lg:w-[150px] lg:h-[150px] md:w-[140px] md:h-[140px] sm:w-[130px] sm:h-[130px] w-[120px] h-[120px]",
            "rounded-full overflow-hidden select-none",
            "bg-light-dropdown dark:bg-dropdown",
            "border-2 border-black/10 dark:border-white/10 group-hover:border-black/25 dark:group-hover:border-white/30",
            "shadow-sm transition-all duration-300 ease-out",
            "group-hover:shadow-md",
            variant === "carousel" ? "shrink-0" : ""
          )}
        >
          <Image
            src={imgSrc}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 120px, (max-width: 768px) 130px, (max-width: 1024px) 140px, (max-width: 1280px) 150px, 160px"
            className="object-cover object-[center_18%] w-full h-full"
            onError={() => setHasError(true)}
          />

          {/* Subtle hover overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Text Info */}
        <div className="flex flex-col items-center w-full text-center mt-2.5 sm:mt-3 px-1">
          <p className="font-inter font-normal xl:text-[13px] sm:text-[12px] text-[11px] text-light-genre-font dark:text-genre-font truncate max-w-full">
            {person.role}
          </p>

          <p className="font-inter font-semibold xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] text-[12px] text-black/85 dark:text-white/85 group-hover:text-black dark:group-hover:text-white leading-snug line-clamp-2 xl:mt-1 mt-0.5 transition-colors duration-200">
            {person.name}
          </p>
        </div>
      </Link>
    </div>
  );
}