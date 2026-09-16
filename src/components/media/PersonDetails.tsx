"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Copy, Check, BadgeCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import type { PersonDetailsData } from "@/lib/tmdb";

export type PersonDetailsProps = {
    data?: PersonDetailsData;
    name?: string;
    bio?: string;
    birthDate?: string;
    gender?: string;
    profession?: string;
    birthPlace?: string;
    popularity?: string;
    knownFor?: string;
    image?: string;
    id?: string;
    imdbId?: string;
    alsoKnownAs?: string[];
    deathDay?: string;
    birthdayRaw?: string;
    totalCredits?: number;
    knownForDepartment?: string;
};

function calculateAge(birthdayStr?: string, deathDayStr?: string) {
    if (!birthdayStr || birthdayStr === "N/A") return null;
    const birth = new Date(birthdayStr);
    if (isNaN(birth.getTime())) return null;
    const end = deathDayStr ? new Date(deathDayStr) : new Date();
    if (isNaN(end.getTime())) return null;
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
        age--;
    }
    return age > 0 && age < 130 ? age : null;
}

export function PersonDetails({
    data,
    name: propName,
    bio: propBio,
    birthDate: propBirthDate,
    gender: propGender,
    profession: propProfession,
    birthPlace: propBirthPlace,
    popularity: propPopularity,
    knownFor: propKnownFor,
    image: propImage,
    id: propId,
    imdbId: propImdbId,
    alsoKnownAs: propAlsoKnownAs,
    deathDay: propDeathDay,
    birthdayRaw: propBirthdayRaw,
    knownForDepartment: propKnownForDepartment,
}: PersonDetailsProps) {
    const [imageError, setImageError] = useState(false);
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [hasMoreBio, setHasMoreBio] = useState(false);
    const [copiedId, setCopiedId] = useState(false);
    const bioRef = useRef<HTMLParagraphElement>(null);

    // Resolve unified data props
    const name = data?.name || propName || "Person Details";
    const bio = data?.bio || propBio || "Biography is currently not available for this person.";
    const birthDate = data?.birthDate || propBirthDate || "N/A";
    const birthdayRaw = data?.birthdayRaw || propBirthdayRaw;
    const deathDay = data?.deathDay || propDeathDay;
    const gender = data?.gender || propGender || "Not specified";
    const profession = data?.profession || propProfession || "Acting";
    const birthPlace = data?.birthPlace || propBirthPlace || "N/A";
    const popularity = data?.popularity || propPopularity || "N/A";
    const knownFor = data?.knownFor || propKnownFor || "Movies & TV";
    const knownForDepartment = data?.knownForDepartment || propKnownForDepartment || profession;
    const personId = data?.id || propId || "";
    const imdbId = data?.imdbId || propImdbId;
    const alsoKnownAs = data?.alsoKnownAs || propAlsoKnownAs || [];
    const personImage = imageError || !(data?.image || propImage)
        ? "/assets/persons-image.jpg"
        : (data?.image || propImage || "/assets/persons-image.jpg");

    const age = calculateAge(birthdayRaw || birthDate, deathDay);

    const [prevBio, setPrevBio] = useState(bio);
    if (prevBio !== bio) {
        setPrevBio(bio);
        setIsBioExpanded(false);
    }

    useEffect(() => {
        const el = bioRef.current;
        if (!el) return;

        const checkOverflow = () => {
            if (!el) return;
            if (!isBioExpanded) {
                const isOverflow = el.scrollHeight > el.clientHeight;
                setHasMoreBio((prev) => (prev !== isOverflow ? isOverflow : prev));
            }
        };

        checkOverflow();
        const rafId = requestAnimationFrame(checkOverflow);

        if (typeof ResizeObserver !== "undefined") {
            const resizeObserver = new ResizeObserver(() => {
                checkOverflow();
            });
            resizeObserver.observe(el);

            return () => {
                cancelAnimationFrame(rafId);
                resizeObserver.disconnect();
            };
        }

        window.addEventListener("resize", checkOverflow);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", checkOverflow);
        };
    }, [bio, isBioExpanded]);

    const handleCopyId = () => {
        if (!personId) return;
        navigator.clipboard.writeText(personId);
        setCopiedId(true);
        toast.success("Person ID copied to clipboard");
        setTimeout(() => setCopiedId(false), 2000);
    };

    return (
        <section className="relative mt-[19px] left-1/2 right-1/2 w-screen -translate-x-1/2 bg-light-dropdown dark:bg-dropdown md:px-8 sm:px-7 px-6 xl:py-[32px] lg:py-[28px] md:py-[24px] sm:py-[20px] py-[18px] flex justify-center border-y border-black/5 dark:border-white/5 transition-colors duration-200">
            <div className="container-1440 flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12">

                {/* Left Column: Portrait Photo & Quick Actions */}
                <div className="flex flex-col items-center sm:items-start flex-shrink-0 sm:self-start">
                    <div className="relative xl:w-[320px] xl:h-[450px] lg:w-[290px] lg:h-[410px] md:w-[260px] md:h-[370px] sm:w-[230px] sm:h-[330px] w-[210px] h-[300px] rounded-md overflow-hidden bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm">
                        <Image
                            src={personImage}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 210px, (max-width: 768px) 230px, (max-width: 1024px) 260px, (max-width: 1280px) 290px, 320px"
                            className="object-cover object-top select-none"
                            priority
                            onError={() => setImageError(true)}
                        />
                    </div>

                    {/* IMDb Reference Button */}
                    {imdbId && (
                        <a
                            href={`https://www.imdb.com/name/${imdbId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[210px] sm:w-full h-[38px] sm:h-[40px] mt-3.5 bg-trails-red hover:bg-trails-red/90 text-white text-[13px] sm:text-[14px] font-medium font-inter rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <span>View IMDb Profile</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {/* Right Column: Person Identification & Details */}
                <div className="flex-1 flex flex-col xl:gap-[20px] lg:gap-[18px] md:gap-[16px] gap-[14px] font-inter text-black/85 dark:text-white/85">

                    {/* Person Identification Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                            <h1 className="font-poppins font-bold xl:text-[32px] lg:text-[28px] md:text-[26px] sm:text-[23px] text-[21px] text-black dark:text-white tracking-tight leading-tight">
                                {name}
                            </h1>

                            {/* Verified Talent Badge */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] sm:text-[12px] font-medium select-none">
                                <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                                <span>Verified Artist</span>
                            </div>

                            {/* TMDB Identification Tag */}
                            {personId && (
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    title="Click to copy Person ID"
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-black/75 dark:text-white/80 text-[11px] sm:text-[12px] font-mono transition-colors cursor-pointer select-none"
                                >
                                    <span>ID: #{personId}</span>
                                    {copiedId ? (
                                        <Check className="w-3 h-3 text-green-600 dark:text-green-400 ml-0.5" />
                                    ) : (
                                        <Copy className="w-3 h-3 opacity-60 ml-0.5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Biography Section */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 max-w-[950px] leading-relaxed xl:text-[17px] lg:text-[16px] md:text-[15px] text-[14px]">
                        <span className="font-medium text-black/90 dark:text-white/90 flex-shrink-0">
                            Bio:
                        </span>
                        <div className="flex-1 min-w-0">
                            <p
                                ref={bioRef}
                                className={cn(
                                    "text-light-person-details-data dark:text-genre-font font-normal break-words transition-all duration-200",
                                    !isBioExpanded && "line-clamp-3"
                                )}
                            >
                                {bio}
                            </p>
                            {hasMoreBio && (
                                <button
                                    type="button"
                                    onClick={() => setIsBioExpanded((prev) => !prev)}
                                    className="text-rate-btn hover:text-rate-btn/80 text-[13px] sm:text-[14px] font-medium mt-1 cursor-pointer transition-colors focus:outline-none select-none inline-flex items-center"
                                >
                                    {isBioExpanded ? "See less" : "See more"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Metadata & Identification Grid */}
                    <div className="flex flex-col gap-3 sm:gap-3.5 xl:text-[17px] lg:text-[16px] md:text-[15px] text-[14px]">
                        {/* Profession & Department */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-medium text-black/90 dark:text-white/90">Profession:</span>
                            <span className="text-light-person-details-data dark:text-genre-font font-normal">
                                {profession}
                                {knownForDepartment && knownForDepartment !== profession && ` (${knownForDepartment})`}
                            </span>
                        </div>

                        {/* Birth Date & Age */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-medium text-black/90 dark:text-white/90">Birth Date:</span>
                            <span className="text-light-person-details-data dark:text-genre-font font-normal">
                                {birthDate}
                                {age ? ` (${age} years old)` : ""}
                            </span>
                        </div>

                        {/* Status (if deceased) */}
                        {deathDay && (
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-medium text-black/90 dark:text-white/90">Died:</span>
                                <span className="text-trails-red font-medium">{deathDay}</span>
                            </div>
                        )}

                        {/* Gender */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-medium text-black/90 dark:text-white/90">Gender:</span>
                            <span className="text-light-person-details-data dark:text-genre-font font-normal">{gender}</span>
                        </div>

                        {/* Birth Place */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-medium text-black/90 dark:text-white/90">Birth Place:</span>
                            <span className="text-light-person-details-data dark:text-genre-font font-normal">{birthPlace}</span>
                        </div>

                        {/* Known For */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-medium text-black/90 dark:text-white/90">Known For:</span>
                            <span className="text-light-person-details-data dark:text-genre-font font-normal">{knownFor}</span>
                        </div>

                        {/* Popularity */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-black/90 dark:text-white/90">Popularity:</span>
                            <span className="inline-flex items-center gap-1.5 text-light-person-details-data dark:text-genre-font font-normal">
                                <Heart className="w-4 h-4 text-trails-red fill-trails-red" />
                                <span>{popularity}</span>
                            </span>
                        </div>

                        {/* Also Known As (Aliases) */}
                        {alsoKnownAs && alsoKnownAs.length > 0 && (
                            <div className="flex items-start gap-2 flex-wrap pt-1">
                                <span className="font-medium text-black/90 dark:text-white/90 flex-shrink-0">
                                    Also Known As:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {alsoKnownAs.slice(0, 5).map((alias, idx) => (
                                        <span
                                            key={`${alias}-${idx}`}
                                            className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80 text-[12px] sm:text-[13px] font-normal"
                                        >
                                            {alias}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}