"use client";

import Image from "next/image";
import { GenreBadge } from "@/components/GenreBadge";
import { IoTriangleSharp } from "react-icons/io5";
import { Button } from "./ui/button";
import Link from "next/link";

import { IoMdStarOutline } from "react-icons/io";
import { FcApproval } from "react-icons/fc";
import { MdBookmarkAdd, MdBookmarkAdded, MdFavorite } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { WatchlistPopup } from "./WatchlistPopup";
import { AddButton } from "./AddButton";
import { Rating } from "./Rating";
import { useRating } from "@/contexts/RatingContext";

export function PosterDetails({ isMovie = true }: { isMovie?: boolean }) {
    const [saved, setSaved] = useState(false);
    const [open2, setOpen2] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const { setOpen } = useRating();

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                btnRef.current &&
                !btnRef.current.contains(e.target as Node)
            ) {
                setOpen2(false);
            }
        };

        document.addEventListener("click", onClick);

        return () => document.removeEventListener("click", onClick);
    }, []);

    return (
        <section className="relative xl:mt-[19px] lg:mt-[17px] md:mt-[15px] mt-[13px] left-1/2 right-1/2 w-screen -translate-x-1/2">
            <div className="relative w-full min-h-[750px] xl:px-6 lg:px-[26px] md:px-7 px-[30px] lg:pb-[40px] md:pb-[30px] sm:pb-[20px] overflow-hidden">

                <Image
                    src="/assets/images.jpg"
                    alt="Poster Background"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,#3C49C3,#7A5556)] dark:bg-[radial-gradient(ellipse_100%_65%_at_50%_-10%,rgba(65,105,225,0.45)_0%,rgba(35,55,120,0.22)_45%,transparent_85%),linear-gradient(180deg,#1F2636_0%,#14161E_100%)] opacity-90 backdrop-blur-md" />

                <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-500/25 rounded-full blur-[100px] pointer-events-none dark:block hidden" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent dark:block hidden pointer-events-none" />

                <div className="relative z-10 container-1440 text-white font-inter">

                    <div
                        onClick={() => setSaved((prev) => !prev)}
                        className="absolute lg:-top-[4px] md:-top-[2px] sm:-top-[1px] -top-[2px] xl:right-0 lg:right-[18px] md:right-[10px] sm:right-[8px] right-[6px] cursor-pointer transition-all duration-200 active:scale-90 z-50 bg-white/10 hover:bg-transparent hover:drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] px-[3px] dark:hover:drop-shadow-[2px_2px_4px_rgba(80,80,80,0.5)]"
                    >
                        {saved ? (
                            <MdBookmarkAdded className="xl:w-[61px] xl:h-[69px] lg:w-[55px] lg:h-[63px] md:w-[52px] md:h-[59px] sm:w-[47px] sm:h-[55px] w-[39px] h-[49px] text-white" />
                        ) : (
                            <MdBookmarkAdd className="xl:w-[61px] xl:h-[69px] lg:w-[55px] lg:h-[63px] md:w-[52px] md:h-[59px] sm:w-[47px] sm:h-[55px] w-[39px] h-[49px] text-white2/70" />
                        )}
                    </div>

                    <h1 className="xl:text-[30px] lg:text-[28px] md:text-[26px] sm:text-[24px] text-[22px] md:font-medium font-normal xl:mt-[22px] md:mt-[20px] sm:mt-[18px] mt-[16px]">
                        Game of Thrones
                    </h1>

                    <p className="xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] md:font-medium font-normal text-white/80 xl:mt-[8px] lg:mt-[7px] md:mt-[6px] sm:mt-[5px] mt-[4px]">
                        7 Nov, 2014
                    </p>

                    <p className="xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-[16px] md:font-medium font-normal text-white/80 xl:mt-[20px] lg:mt-[19px] md:mt-[18px] sm:mt-[17px] mt-[16px] xl:w-[70%] lg:w-[65%] sm:w-[75%] w-[80%]">
                        Nine noble families wage war against each other in order to gain control over the mythical land of Westeros.
                    </p>

                    <div className="flex justify-between items-start xl:mt-[32px] md:mt-[30px] sm:mt-[28px] mt-[26px]">

                        <div className="flex flex-col xl:gap-[18px] lg:gap-[17px] md:gap-[16px] sm:gap-[15px] gap-[14px]">
                            <div className="flex xl:gap-[10px] md:gap-[9px] sm:gap-[10px] gap-[8px]">
                                <GenreBadge genre="Adventure" className="bg-white/15 text-white" />
                                <GenreBadge genre="Drama" className="bg-white/15 text-white" />
                            </div>

                            <div className="flex items-center gap-[11px] xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] lg:font-normal md:font-medium font-normal">
                                <span className="md:font-medium font-normal">{isMovie ? "Duration:" : "Episode Duration:"}</span>
                                <span className="text-white/80">2h 49m</span>
                            </div>
                        </div>

                        <div className="lg:flex hidden xl:gap-[60px] lg:gap-[45px] xl:text-[18px] lg:text-[17px] md:text-[16px] font-medium">

                            <div className="flex flex-col items-start gap-[2px]">
                                <p className="tracking-wider">YOUR RATING</p>
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="bg-white/5 border-none hover:bg-white/10 text-[#8792F2] hover:text-[#8792F2]/85 flex items-center gap-[5px] transition-colors duration-75 xl:mt-[6px] lg:mt-[4px]"
                                >
                                    <IoMdStarOutline className="xl:w-[28px] xl:h-[28px] lg:w-[26px] lg:h-[26px]" />
                                    <span className="xl:text-[20px] lg:text-[19px] font-inter">Rate</span>
                                </Button>
                            </div>

                            <div className="flex flex-col items-start gap-[7px]">
                                <p className="tracking-wider">RATING</p>
                                <Rating value={8.4} className="gap-[7px]" className1="xl:text-[20px] lg:text-[19px] text-white2" />
                            </div>

                            <div className="flex flex-col items-start gap-[7px]">
                                <p className="tracking-wider">VOTES</p>

                                <div className="flex items-center gap-[7px]">
                                    <FcApproval className="xl:w-[28px] xl:h-[28px] lg:w-[26px] lg:h-[26px] [filter:hue-rotate(500deg)_saturate(5)_brightness(0.9)]" />
                                    <span className="xl:text-[20px] lg:text-[19px] text-white2">34,000</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-[7px]">
                                <p className="tracking-wider">POPULARITY</p>

                                <div className="flex items-center gap-[7px]">
                                    <MdFavorite className="xl:w-[28px] xl:h-[28px] lg:w-[26px] lg:h-[26px] text-red-500" />
                                    <span className="xl:text-[20px] lg:text-[19px] text-white2">256.42</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="flex mt-[20px]">
                        <div className="flex flex-col items-center">
                            <div className="relative xl:w-[252px] xl:h-[377px] lg:w-[242px] lg:h-[351px] md:w-[232px] md:h-[337px] sm:w-[220px] sm:h-[322px] w-[200px] h-[300px] md:border-[3px] border-2 border-white group flex-shrink-0">
                                <Image
                                    src="/assets/images.jpg"
                                    alt="Poster"
                                    fill
                                    className="object-cover"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

                                <Link href="#" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150">
                                    <div className="xl:w-[132px] xl:h-[132px] lg:w-[126px] lg:h-[126px] md:w-[116px] md:h-[116px] sm:w-[110px] sm:h-[110px] w-[100px] h-[100px] bg-play rounded-full flex items-center justify-center">
                                        <IoTriangleSharp className="text-white xl:w-[88px] xl:h-[88px] lg:w-[86px] lg:h-[86px] md:w-[82px] md:h-[82px] sm:w-[78px] sm:h-[78px] w-[74px] h-[74px] -rotate-90 sm:mr-[18px] mr-[13px]" />
                                    </div>
                                </Link>

                                <div className="absolute inset-0 pointer-events-none group-hover:shadow-[4px_4px_8px_4px_rgba(255,255,255,0.25),-4px_-4px_8px_4px_rgba(255,255,255,0.25)] transition" />
                            </div>

                            <div className="flex md:mt-[24px] sm:mt-[22px] mt-[20px]">
                                <Button className="xl:w-[189px] xl:h-[50px] md:w-[179px] lg:h-[48px] md:h-[46px] sm:w-[165px] sm:h-[44px] w-[150px] h-[40px] bg-hero-trailer hover:bg-hero-trailer/85 text-white xl:text-[22px] lg:text-[21px] md:text-[20px] sm:text-[18px] text-[16px] md:font-medium font-normal font-monda rounded-[3px]">
                                    Official Trailer
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-start lg:gap-[25px] md:gap-[23px] sm:gap-[21px] gap-[19px] xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[16px] text-[14px] xl:ml-[30px] lg:ml-[24px] md:ml-[28px] sm:ml-[22px] ml-[20px] text-white md:font-medium font-normal">

                            <div className="flex items-start sm:gap-[10px] gap-[8px]">
                                Country: <span className="text-white2">United States, United Kingdom</span>
                            </div>

                            <div className="flex items-center sm:gap-[10px] gap-[8px] ">
                                Language: <span className="text-white2">English</span>
                            </div>

                            {!isMovie && (<div className="flex items-center sm:gap-[10px] gap-[8px]">
                                <div className="flex items-center gap-[10px] ">
                                    Number of Episodes: <span className="text-white2">73</span>
                                </div>
                            </div>)}

                            {!isMovie && (<div className="flex items-center sm:gap-[10px] gap-[8px]">
                                <div className="flex items-center gap-[10px] ">
                                    Number of Seasons: <span className="text-white2">8</span>
                                </div>
                            </div>)}

                            {isMovie && (<div className="flex items-center sm:gap-[10px] gap-[8px]">
                                <p className="flex items-center xl:gap-[6px] lg:gap-[5px] sm:gap-[4px] gap-[3px] xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px]  text-[14px]">
                                    <span className="bg-light-budget dark:bg-budget w-fit lg:h-[30px] md:h-[27px] sm:h-[25px] h-[23px] lg:px-3 md:px-[10px] sm:px-[8px] px-[6px] flex items-center justify-center text-black">Budget</span>:
                                </p>
                                <span className="text-white2">$165M</span>
                            </div>)}

                            {isMovie && (<div className="flex items-center sm:gap-[10px] gap-[8px]">
                                <p className="flex items-center xl:gap-[6px] lg:gap-[5px] sm:gap-[4px] gap-[3px] xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px]  text-[14px]">
                                    <span className="bg-light-revenue dark:bg-revenue w-fit lg:h-[30px] md:h-[27px] sm:h-[25px] h-[23px] lg:px-3 md:px-[10px] sm:px-[8px] px-[6px] flex items-center justify-center text-white">Revenue</span>:
                                </p>
                                <span className="text-white2">$700M</span>
                            </div>)}

                            <div className="flex flex-col items-start lg:gap-[13px] md:gap-[10px] sm:gap-[8px] gap-[6px]">
                                <p>Studio</p>

                                <div className="flex flex-col items-start">
                                    <div className="xl:h-[50px] xl:w-[50px] lg:h-[49px] lg:w-[49px] md:h-[48px] md:w-[48px] sm:h-[47px] sm:w-[47px] h-[43px] w-[43px] relative">
                                        <Image
                                            src="/assets/images.jpg"
                                            alt="Created by"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="xl:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] text-white2 mt-[3px]">
                                        Legendary Pictures
                                    </p>
                                </div>
                            </div>

                            {!isMovie && (<div className="flex flex-col items-start lg:gap-[13px] md:gap-[10px] sm:gap-[8px] gap-[6px]">
                                <p>Created by</p>

                                <div className="flex flex-col items-start">
                                    <div className="xl:h-[70px] xl:w-[70px] lg:h-[68px] lg:w-[68px] md:h-[66px] md:w-[66px] sm:h-[60px] sm:w-[60px] h-[54px] w-[54px] relative rounded-full">
                                        <Image
                                            src="/assets/images.jpg"
                                            alt="Created by"
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                    <p className="xl:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] text-white2 mt-[3px]">
                                        Legendary Pictures
                                    </p>
                                </div>
                            </div>)}

                        </div>
                    </div>

                    {open2 && (
                        <div
                            ref={popupRef}
                            className="absolute xl:bottom-[70px] lg:bottom-[67px] md:bottom-[41px] sm:bottom-[45px] bottom-[36px] right-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                        >
                            <WatchlistPopup />
                        </div>
                    )}

                    <AddButton
                        ref={btnRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen2((prev) => !prev);
                        }}
                        className="absolute lg:bottom-[34px] md:bottom-[10px] sm:bottom-[15px] bottom-[8px] right-2 xl:h-[30px] xl:w-[30px] lg:h-[28px] lg:w-[28px] md:h-[26px] md:w-[26px] sm:h-[24px] sm:w-[24px] h-[22px] w-[22px] bg-dropdown-hover dark:bg-white/85 hover:bg-dropdown-hover/85 dark:hover:bg-white/75 flex items-center justify-center rounded-sm"
                        iconClassName="xl:h-[21px] xl:w-[21px] lg:h-[20px] lg:w-[20px] md:h-[18px] md:w-[18px] sm:h-[16px] sm:w-[16px] h-[14px] w-[14px] dark:text-black dark:hover:text-black/85"
                    />
                </div>

                <div className="relative container-1440 lg:hidden flex justify-center md:gap-[80px] sm:gap-[70px] gap-[55px] md:text-[16px] sm:text-[14px] text-[12px] md:font-medium font-normal text-white md:mt-20 sm:mt-[65px] mt-[60px] md:mb-3 sm:mb-4 mb-6">

                    <div className="flex flex-col items-start md:gap-[2px] sm:gap-[1px] gap-[0px]">
                        <p className="tracking-wider">YOUR RATING</p>
                        <Button
                            onClick={() => setOpen(true)}
                            className="bg-white/10 border-none hover:bg-white/5 text-[#8792F2] hover:text-[#8792F2]/70 flex items-center md:gap-[5px] gap-[4px] transition-colors duration-75 mt-1"
                        >
                            <IoMdStarOutline className="md:w-[24px] md:h-[24px] sm:w-[20px] sm:h-[20px] h-[18px] w-[18px]" />
                            <span className="md:text-[18px] sm:text-[16px] text-[14px] font-inter">Rate</span>
                        </Button>
                    </div>

                    <div className="flex flex-col items-start md:gap-[7px] gap-[5px]">
                        <p className="tracking-wider">RATING</p>
                        <Rating value={8.4} className="md:gap-[7px] gap-[5px]" className1="md:text-[18px] sm:text-[16px] text-[14px] text-white2" />
                    </div>

                    <div className="flex flex-col items-start md:gap-[7px] gap-[5px]">
                        <p className="tracking-wider">VOTES</p>

                        <div className="flex items-center md:gap-[7px] gap-[5px]">
                            <FcApproval className="md:w-[24px] md:h-[24px] sm:w-[20px] sm:h-[20px] w-[18px] h-[18px] [filter:hue-rotate(500deg)_saturate(5)_brightness(0.9)]" />
                            <span className="md:text-[18px] sm:text-[16px] text-[14px] text-white2">34,000</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:gap-[7px] gap-[5px]">
                        <p className="tracking-wider">POPULARITY</p>

                        <div className="flex items-center md:gap-[7px] gap-[5px]">
                            <MdFavorite className="md:w-[24px] md:h-[24px] sm:w-[20px] sm:h-[20px] w-[18px] h-[18px] text-red-500" />
                            <span className="md:text-[18px] sm:text-[16px] text-[14px] text-white2">256.42</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}