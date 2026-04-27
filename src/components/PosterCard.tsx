"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import { Plus } from "lucide-react";
import { WatchlistPopup } from "@/components/WatchlistPopup";
import { cn } from "@/lib/utils";
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

    const isPersonDetails =
        pathname.startsWith("/trending/persons/") &&
        !isPersonsList;

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
                    className="absolute right-1 bottom-[36px] z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                    <WatchlistPopup />
                </div>
            )}

            <div className="relative w-[220px] h-[310px]">
                <Image src={image} alt={title} fill className="object-cover" />

                <div
                    onClick={() => setSaved((prev) => !prev)}
                    className="absolute -top-1 right-[5px] cursor-pointer transition-all duration-200 active:scale-90 z-20"
                >
                    {saved ? (
                        <MdBookmarkAdded className="w-[37px] h-[41px] text-white drop-shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.4)]" />
                    ) : (
                        <MdBookmarkAdd className="w-[37px] h-[41px] text-white2/70 drop-shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.4)]" />
                    )}
                </div>

                <Link href={`${isPersonDetails ? "/movies" : basePath}/${title.toLowerCase().replace(/\s+/g, "-")}`} className="absolute inset-0 bg-black opacity-0 hover:opacity-20 z-10 transition-[opacity] duration-200" />

                <Link href={`${isPersonDetails ? "/movies" : basePath}/${title.toLowerCase().replace(/\s+/g, "-")}`} className="absolute inset-0 flex items-end justify-center pb-[14px] cursor-pointer">
                    <div className="font-inter font-medium text-[16px] z-30 text-white hover:drop-shadow-[1.5px_1.5px_7px_rgba(0,0,0,0.5)] text-center select-none">
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
                className="lg:h-[25px] lg:w-[25px] md:h-[23px] md:w-[23px] sm:h-[21px] sm:w-[21px] h-[18px] w-[18px] bg-light-plus-btn dark:bg-plus-btn hover:bg-light-plus-btn/95 dark:hover:bg-plus-btn/95 lg:mt-[8px] md:mt-[6px] sm:mt-[5px] mt-[4px]"
                iconClassName="lg:h-[18px] lg:w-[18px] md:h-[17px] md:w-[17px] sm:h-[16px] sm:w-[16px] h-[15px] w-[15px]"
            />
        </div>
    );
}