"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MoreOptionsButton } from "./MoreOptionsButton";
import { WatchlistPopup } from "./WatchlistPopup";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useList } from "@/contexts/ListContext";

interface ListProps {
    basePath: string;
}

export function List({ basePath }: ListProps) {
    const items = Array.from({ length: 8 });

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const { setOpen } = useList();


    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const clickedOutsidePopup =
                popupRef.current &&
                !popupRef.current.contains(e.target as Node);

            const clickedOutsideButtons = btnRefs.current.every(
                (btn) => btn && !btn.contains(e.target as Node)
            );

            if (clickedOutsidePopup && clickedOutsideButtons) {
                setOpenIndex(null);
            }
        };

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    return (
        <div>
            <div className="mt-[40px] xl:ml-0 lg:ml-10 md:ml-6 sm:ml-3 ml-10">
                <Button onClick={() => setOpen(true)} className="w-fit lg:h-[43px] md:h-[41px] sm:h-[38px] h-[36px] flex items-center justify-center lg:gap-[7px] md:gap-[6px] sm:gap-[5px] gap-[4px] bg-black/85 hover:bg-black/75 dark:bg-dropdown dark:hover:bg-dropdown/85 text-white hover:text-white/85 font-inter font-medium lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] rounded-[25px] border-none transition-colors duration-75 md:px-5 sm:px-4 px-[14px]">
                    Create new
                    <Plus strokeWidth={2.5} className="lg:w-[18px] lg:h-[18px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] w-[13px] h-[13px]" />
                </Button>
            </div>

            <div className="lg:mt-[36px] md:mt-[33px] sm:mt-[30px] mt-[28px] grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-2 lg:gap-x-[33px] md:gap-x-[30px] gap-x-[25px] xl:gap-y-[40px] lg:gap-y-[50px] md:gap-y-[45px] gap-y-[40px] container-1440 xl:px-0 lg:px-10 md:px-6 sm:px-3 px-10">
                {items.map((_, i) => (
                    <div key={i} className="relative">
                        <Link href={`${basePath}/salman`} className="block xl:w-[330px] lg:w-[320px] md:w-[300px] w-[250px]">
                            <div className="relative xl:h-[200px] lg:h-[190px] md:h-[185px] h-[150px] rounded-[7px] overflow-hidden group">
                                <Image
                                    src="/assets/images.jpg"
                                    alt="list"
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition duration-150" />

                                <span className="absolute lg:right-[18px] lg:bottom-[12px] md:right-[16px] md:bottom-[10px] right-[14px] bottom-[8px] text-white font-inter font-medium lg:text-[16px] md:text-[15px] text-[14px]">
                                    18 Items
                                </span>
                            </div>

                            <div className="flex items-center justify-between xl:mt-[7px] md:mt-[6px] mt-[5px] relative">
                                <h3 className="font-inter font-medium xl:text-[20px] lg:text-[19px] md:text-[18px] text-[16px] text-black dark:text-white/85">
                                    Salman
                                </h3>

                                <MoreOptionsButton
                                    ref={(el) => {
                                        btnRefs.current[i] = el;
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOpenIndex((prev) => (prev === i ? null : i));
                                    }}
                                    className="lg:w-[30px] lg:h-[30px] md:w-[28px] md:h-[28px] w-[24px] h-[24px] xl:-mr-[6px] md:-mr-[8px] -mr-[7px] hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center"
                                    className2="lg:w-[16px] lg:h-[16px] md:w-[15px] md:h-[15px] w-[14px] h-[14px] text-black hover:text-black/75 dark:text-white/90 dark:hover:text-white/75"
                                />

                                {openIndex === i && (
                                    <div
                                        ref={popupRef}
                                        className="absolute xl:right-[6px] lg:right-[5px] md:right-[4px] right-[3px] md:bottom-7 bottom-[25px] animate-in fade-in zoom-in-95 duration-150 z-50"
                                    >
                                        <WatchlistPopup />
                                    </div>
                                )}
                            </div>

                            <p className="xl:mt-[5px] md:mt-[4px] mt-[3px] w-[85%] font-inter lg:text-[14px] md:text-[13px] text-[12px] text-light-mylist-description dark:text-mylist-description md:leading-5 leading-[18px]">
                                This is my favorite playlist. I saved all of my adventure movies.
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}