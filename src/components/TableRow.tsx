"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TableItem } from "@/types/items";
import { Rating } from "./Rating";
import { MoreOptionsButton } from "./MoreOptionsButton";
import { WatchlistPopup } from "./WatchlistPopup";
import { slugify } from "@/lib/utils";

interface TableRowProps {
    item: TableItem;
    isFirst?: boolean;
    isLast: boolean;
}

const gridClass =
    "grid xl:grid-cols-[270px_270px_270px_270px_270px_40px] lg:grid-cols-[230px_230px_230px_230px_230px_40px] md:grid-cols-[200px_200px_200px_200px_200px_30px] sm:grid-cols-[210px_210px_210px_210px_20px] grid-cols-[160px_160px_160px_160px_10px] items-center font-inter md:font-medium font-normal xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-[16px] text-black ";

export function TableRow({ item, isFirst, isLast }: TableRowProps) {
    const imgRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const nameRef = useRef<HTMLSpanElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const openRef = useRef(open);

    useEffect(() => {
        openRef.current = open;
    }, [open]);

    useEffect(() => {
        const el = nameRef.current;
        if (!el) return;

        const checkOverflow = () => {
            setShowTooltip(el.scrollWidth > el.clientWidth);
        };

        checkOverflow();

        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [item?.name]);

    useEffect(() => {
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

        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("click", onClick);
        };
    }, []);

    const href = `/movies/${slugify(item?.name)}`;

    return (
        <div className="relative xl:px-0 px-5">

            <div className={gridClass}>

                <div className="flex justify-center">
                    <Link href={href}>
                        <div ref={imgRef} className="relative xl:w-[90px] xl:h-[130px] lg:w-[80px] lg:h-[115px] md:w-[70px] md:h-[105px] sm:w-[65px] sm:h-[98px] w-[60px] h-[91px] cursor-pointer">
                            <Image
                                src={item?.image}
                                alt={item?.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>
                </div>

                <div className="relative flex justify-center group">
                    <Link href={href}>
                        <span
                            ref={nameRef}
                            className="block xl:w-[200px] lg:w-[190px] md:w-[180px] sm:w-[170px] w-[150px] text-center truncate cursor-pointer"
                        >
                            {item?.name}
                        </span>
                    </Link>

                    {showTooltip && (
                        <div className="pointer-events-none absolute bottom-full mb-[6px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                            <div className="lg:px-[10px] px-[8px] lg:py-[4px] py-[3px] rounded-[6px] bg-black text-white lg:text-[12px] text-[11px] font-inter whitespace-nowrap shadow-md">
                                {item?.name}
                            </div>
                        </div>
                    )}
                </div>

                <Rating
                    value={item?.rating}
                    className="lg:gap-[6px] md:gap-[5px] sm:gap-[4px] gap-[3px]"
                    className1="xl:w-[22px] xl:h-[22px] lg:w-[21px] lg:h-[21px] md:w-[20px] md:h-[20px] sm:w-[19px] sm:h-[19px] w-[18px] h-[18px]"
                    className2="xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-[16px] text-black"
                />

                {item?.yourRating && (
                    <Rating
                        value={item?.yourRating}
                        className="lg:gap-[6px] md:gap-[5px] md:flex hidden"
                        className1="xl:w-[22px] xl:h-[22px] lg:w-[21px] lg:h-[21px] md:w-[20px] md:h-[20px]"
                        className2="xl:text-[20px] lg:text-[19px] md:text-[18px] text-black"
                    />
                )}

                {item?.media && (
                    <div className="text-center">
                        {item?.media}
                    </div>
                )}

                <div className="flex justify-center">
                    <span>{item?.released}</span>
                </div>

                <div className="flex justify-center relative">
                    <MoreOptionsButton
                        ref={btnRef}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen((prev) => !prev);
                        }}
                        className="lg:w-[34px] lg:h-[34px] md:w-[32px] md:h-[32px] sm:w-[30px] sm:h-[30px] w-[28px] h-[28px] hover:bg-black/10 flex items-center justify-center"
                        className2="lg:w-[16px] lg:h-[16px] md:w-[15px] md:h-[15px] sm:w-[14px] sm:h-[14px] w-[13px] h-[13px] text-black"
                    />

                    {open && (
                        <div
                            ref={popupRef}
                            className={`absolute lg:right-[18px] md:right-[14px] sm:right-[9px] right-[5px] animate-in fade-in zoom-in-95 duration-150 z-30 ${
                                isFirst
                                    ? "top-full sm:-mt-[3px] -mt-[2px]"
                                    : "bottom-full sm:-mb-[3px] -mb-[2px]"
                            }`}
                        >
                            <WatchlistPopup />
                        </div>
                    )}
                </div>

            </div>
            {!isLast && (
                <div className="grid xl:grid-cols-[270px_270px_270px_270px_270px_40px] lg:grid-cols-[230px_230px_230px_230px_230px_40px] md:grid-cols-[200px_200px_200px_200px_200px_30px] sm:grid-cols-[210px_210px_210px_210px_20px] grid-cols-[160px_160px_160px_160px_10px]">
                    <div className="col-span-5 xl:py-[33px] lg:py-[36px] md:py-[33px] sm:py-[35px] py-[37px]">
                        <div className="xl:ml-[90px] lg:ml-[76px] md:ml-[65px] sm:ml-[72px] ml-[50px] xl:mr-[50px] lg:mr-[40px] md:mr-[30px] sm:mr-[40px] mr-[35px] border-t border-black/20" />
                    </div>
                </div>
            )}
        </div>
    );
}