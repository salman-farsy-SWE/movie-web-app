"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { WatchlistPopup } from "@/components/WatchlistPopup";
import { slugify } from "@/lib/utils";
import { AddButton } from "./AddButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function PosterCard({
    title,
    image,
    basePath,
}: {
    title: string;
    image: string;
    basePath?: string;
}) {
    const [saved, setSaved] = useState(false);
    const [open, setOpen] = useState(false);


    const popupRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const openRef = useRef(open);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const dragThreshold = 5;
    const pathname = usePathname();

    const isPersonsList = pathname === "/trending/persons";
    const isSearchList = pathname === "/search";

    const isPersonDetails =
        pathname.startsWith("/trending/persons/") &&
        !isPersonsList;

    const isSearchDetails =
        pathname.startsWith("/search/") &&
        !isSearchList;

    useEffect(() => {
        openRef.current = open;
    }, [open]);

    useEffect(() => {
        const onDown = (e: PointerEvent) => {
            if (!openRef.current) return;
            if (popupRef.current?.contains(e.target as Node)) return;
            if (btnRef.current?.contains(e.target as Node)) return;

            dragStartRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMove = (e: PointerEvent) => {
            if (!dragStartRef.current) return;

            const dx = Math.abs(e.clientX - dragStartRef.current.x);
            const dy = Math.abs(e.clientY - dragStartRef.current.y);

            if (dx > dragThreshold || dy > dragThreshold) {
                setOpen(false);
                dragStartRef.current = null;
            }
        };

        const onUp = () => {
            dragStartRef.current = null;
        };

        const onClick = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                btnRef.current &&
                !btnRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", onDown);
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.removeEventListener("click", onClick);
        };
    }, []);

    return (
        <div className="flex flex-col items-end relative">
            {open && (
                <div
                    ref={popupRef}
                    className="absolute right-0 xl:bottom-[30px] lg:bottom-[29px] md:bottom-[27px] sm:bottom-[25px] bottom-[21px] z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                    <WatchlistPopup />
                </div>
            )}

            <div className="relative xl:w-[220px] xl:h-[310px] lg:w-[210px] lg:h-[300px] md:w-[200px] md:h-[290px] sm:w-[185px] sm:h-[265px] w-[175px] h-[250px]">
                <Image src={image} alt={title} fill className="object-cover" />

                <div
                    onClick={() => setSaved((prev) => !prev)}
                    className="absolute lg:-top-[5px] md:-top-[4px] sm:-top-[5px] -top-[6px] xl:right-[2px] lg:right-[2px] md:right-[1px] sm:right-[0px] right-[1px] cursor-pointer transition-all duration-200 active:scale-90 z-20"
                >
                    {saved ? (
                        <MdBookmarkAdded className="xl:w-[44px] xl:h-[48px] lg:w-[42px] lg:h-[46px] md:w-[40px] md:h-[44px] sm:w-[38px] sm:h-[42px] w-[36px] h-[40px] text-white drop-shadow-[2px_2px_2.5px_rgba(0,0,0,0.6)]" />
                    ) : (
                        <MdBookmarkAdd className="xl:w-[44px] xl:h-[48px] lg:w-[42px] lg:h-[46px] md:w-[40px] md:h-[44px] sm:w-[38px] sm:h-[42px] w-[36px] h-[40px] text-white2/70 drop-shadow-[2px_2px_2.5px_rgba(0,0,0,0.6)]" />
                    )}
                </div>

                <Link href={`${isPersonDetails || isSearchDetails ? "/movies" : basePath}/${slugify(title)}`} className="absolute inset-0 bg-black opacity-0 hover:opacity-20 z-10 transition-[opacity] duration-200" />

                <Link href={`${isPersonDetails || isSearchDetails ? "/movies" : basePath}/${slugify(title)}`} className="absolute inset-0 flex items-end justify-center xl:pb-[14px] lg:pb-[13px] sm:pb-[12px] pb-[10px] cursor-pointer">
                    <div className="font-inter font-medium xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] text-[12px] z-30 text-white hover:drop-shadow-[1.5px_1.5px_7px_rgba(0,0,0,0.5)] text-center select-none">
                        {title}
                    </div>
                </Link>
            </div>

            <AddButton
                ref={btnRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                className="lg:h-[25px] lg:w-[25px] md:h-[23px] md:w-[23px] sm:h-[21px] sm:w-[21px] h-[18px] w-[18px] bg-light-plus-btn dark:bg-plus-btn hover:bg-light-plus-btn/95 dark:hover:bg-plus-btn/95 lg:mt-[9px] sm:mt-[8px] mt-[6px]"
                iconClassName="lg:h-[20px] lg:w-[20px] md:h-[18px] md:w-[18px] sm:h-[16px] sm:w-[16px] h-[14px] w-[14px]"
            />
        </div>
    );
}