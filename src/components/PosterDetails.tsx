"use client";

import Image from "next/image";
import { GenreBadge } from "@/components/GenreBadge";
import { IoTriangleSharp } from "react-icons/io5";
import { Button } from "./ui/button";
import Link from "next/link";

import { IoMdStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import { SquareStar } from "lucide-react";
import { MdBookmarkAdd, MdBookmarkAdded, MdFavorite } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { WatchlistPopup } from "./WatchlistPopup";
import { AddButton } from "./AddButton";

export function PosterDetails({ isMovie = false }: { isMovie?: boolean }) {
    const [saved, setSaved] = useState(false);
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

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

        return () => document.removeEventListener("click", onClick);
    }, []);

    return (
        <section className="relative mt-[19px] left-1/2 right-1/2 w-screen -translate-x-1/2">
            <div className="relative w-full min-h-[750px] pb-[40px] overflow-hidden">

                <Image
                    src="/assets/images.jpg"
                    alt="Poster Background"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,#3C49C3,#7A5556)] opacity-90 backdrop-blur-md" />

                <div className="relative z-10 container-1440 text-white font-inter">

                    <div
                        onClick={() => setSaved((prev) => !prev)}
                        className="absolute -top-6 -right-[6px] cursor-pointer transition-all duration-200 active:scale-90 z-50"
                    >
                        {saved ? (
                            <MdBookmarkAdded className="w-[61px] h-[69px] text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]" />
                        ) : (
                            <MdBookmarkAdd className="w-[61px] h-[69px] text-white2/70 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]" />
                        )}
                    </div>

                    <h1 className="text-[30px] font-medium mt-[17px]">
                        Game of Thrones
                    </h1>

                    <p className="text-[18px] font-medium text-white/80 mt-[8px]">
                        7 Nov, 2014
                    </p>

                    <p className="text-[20px] font-medium text-white/80 mt-[20px] w-[70%]">
                        Nine noble families wage war against each other in order to gain control over the mythical land of Westeros.
                    </p>

                    <div className="flex justify-between items-start mt-[24px]">

                        <div className="flex flex-col gap-[18px]">
                            <div className="flex gap-[10px]">
                                <GenreBadge genre="Adventure" className="bg-white/15 text-white" />
                                <GenreBadge genre="Drama" className="bg-white/15 text-white" />
                            </div>

                            <div className="flex items-center gap-[11px]">
                                <span className="text-[18px] font-medium">{isMovie ? "Duration:" : "Episode Duration:"}</span>
                                <span className="text-[18px] text-white/80">2h 49m</span>
                            </div>
                        </div>

                        <div className="flex gap-[53px] text-[18px] font-medium">

                            <div className="flex flex-col items-start gap-[5px]">
                                <p>YOUR RATING</p>

                                <Button className="bg-transparent hover:bg-white/5 text-[#8792F2] flex items-center gap-[5px] transition-colors duration-75">
                                    <IoMdStarOutline className="w-[28px] h-[28px]" />
                                    <span className="text-[20px] font-inter">Rate</span>
                                </Button>
                            </div>

                            <div className="flex flex-col items-start gap-[7px]">
                                <p>RATING</p>

                                <div className="flex items-center gap-[7px]">
                                    <IoIosStar className="w-[28px] h-[28px] text-yellow-400" />
                                    <span className="text-[20px] text-white2">8.4</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-[7px]">
                                <p>VOTES</p>

                                <div className="flex items-center gap-[7px]">
                                    <FcApproval className="w-[28px] h-[28px] [filter:hue-rotate(500deg)_saturate(5)_brightness(0.9)]" />
                                    <span className="text-[20px] text-white2">34,000</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-[7px]">
                                <p>POPULARITY</p>

                                <div className="flex items-center gap-[7px]">
                                    <MdFavorite className="w-[28px] h-[28px] text-red-500" />
                                    <span className="text-[20px] text-white2">256.42</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex mt-[20px]">
                        <div className="flex flex-col items-center">
                            <div className="relative w-[252px] h-[377px] border border-white group flex-shrink-0">
                                <Image
                                    src="/assets/images.jpg"
                                    alt="Poster"
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

                                <Link href="#" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150">
                                    <div className="w-[132px] h-[132px] bg-[#3A48C3] rounded-full flex items-center justify-center">
                                        <IoTriangleSharp className="text-white w-[88px] h-[88px] -rotate-90 mr-[18px]" />
                                    </div>
                                </Link>

                                <div className="absolute inset-0 pointer-events-none group-hover:shadow-[4px_4px_8px_4px_rgba(255,255,255,0.25),-4px_-4px_8px_4px_rgba(255,255,255,0.25)] transition" />
                            </div>

                            <div className="flex mt-[18px] ">
                                <Button className="w-[189px] h-[50px] bg-[#A54B4B] hover:bg-[#A54B4B]/80 text-white text-[22px] font-medium font-monda rounded-[3px]">
                                    Official Trailer
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[25px] text-[20px] ml-[30px] mt-[20px] text-white font-medium">

                            <div className="flex items-center gap-[10px]">
                                Country: <span className="text-white2">United States, United Kingdom</span>
                            </div>

                            <div className="flex items-center gap-[10px] ">
                                Language: <span className="text-white2">English</span>
                            </div>

                            {!isMovie && (<div className="flex items-center gap-[10px]">
                                <div className="flex items-center gap-[10px] ">
                                    Number of Episodes: <span className="text-white2">73</span>
                                </div>
                            </div>)}

                            {!isMovie && (<div className="flex items-center gap-[10px]">
                                <div className="flex items-center gap-[10px] ">
                                    Number of Seasons: <span className="text-white2">8</span>
                                </div>
                            </div>)}

                            {isMovie && (<div className="flex items-center gap-[10px]">
                                <p className="flex items-center gap-[2px]">
                                    <span className="bg-[#DFDD58] text-[18px] w-[84px] h-[25px] flex items-center justify-center text-black">Budget</span>:
                                </p>
                                <span className="text-white2">$165M</span>
                            </div>)}

                            {isMovie && (<div className="flex items-center gap-[10px]">
                                <p className="flex items-center gap-[2px]">
                                    <span className="bg-[#2331AE] text-[18px] w-[84px] h-[25px] flex items-center justify-center">Revenue</span>:
                                </p>
                                <span className="text-white2">$700M</span>
                            </div>)}

                            <div className="flex flex-col items-start gap-[13px]">
                                <p>Studio</p>

                                <div className="flex flex-col items-start">
                                    <div className="h-[50px] w-[50px] relative">
                                        <Image
                                            src="/assets/images.jpg"
                                            alt="Created by"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-[14px] text-white2 mt-[3px]">
                                        Legendary Pictures
                                    </p>
                                </div>
                            </div>

                            {!isMovie && (<div className="flex flex-col items-start gap-[13px]">
                                <p>Created by</p>

                                <div className="flex flex-col items-start">
                                    <div className="h-[70px] w-[70px] relative rounded-full">
                                        <Image
                                            src="/assets/images.jpg"
                                            alt="Created by"
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                    <p className="text-[14px] text-white2 mt-[3px]">
                                        Legendary Pictures
                                    </p>
                                </div>
                            </div>)}

                        </div>
                    </div>

                    {open && (
                        <div
                            ref={popupRef}
                            className="absolute bottom-[70px] right-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                        >
                            <WatchlistPopup />
                        </div>
                    )}

                    <AddButton
                        ref={btnRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen((prev) => !prev);
                        }}
                        className="absolute bottom-[34px] right-2 h-[30px] w-[30px] bg-dropdown-hover dark:bg-plus-btn hover:bg-dropdown-hover/90 dark:hover:bg-plus-btn/90 flex items-center justify-center rounded-sm"
                        iconClassName="h-[21px] w-[21px] text-white"
                    />

                </div>
            </div>
        </section>
    );
}