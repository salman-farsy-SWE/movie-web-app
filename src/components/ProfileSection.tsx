"use client";

import Image from "next/image";
import {
    MdOutlineFavorite,
    MdStars,
} from "react-icons/md";
import { BsPinAngleFill } from "react-icons/bs";
import { IoIosListBox } from "react-icons/io";

export function ProfileSection() {
    return (
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[380px] xl:h-[454px] lg:h-[448px] md:h-[430px] sm:h-[420px] bg-light-dropdown mt-[21px]">
            <div className="container-1440 flex md:flex-row flex-col gap-[10px] xl:gap-[160px] lg:gap-[120px] md:gap-[80px] sm:gap-[15px]">

                <div className="xl:ml-[36px] lg:ml-[30px] md:ml-[28px] flex flex-col items-center mt-8 xl:mt-10 lg:mt-12 md:mt-[52px] md:order-1 order-2">
                    <div className="flex flex-col items-center">
                        <div className="relative w-[100px] h-[100px] xl:w-[158px] xl:h-[158px] lg:w-[154px] lg:h-[154px] md:w-[148px] md:h-[148px] sm:w-[120px] sm:h-[120px] rounded-full border border-light-search-font overflow-hidden">
                            <Image
                                src="/assets/images.jpg"
                                alt="profile"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <p className="mt-[4px] lg:mt-[7px] md:mt-[6px] sm:mt-[5px] font-inter md:font-semibold font-medium text-[16px] xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-black text-center">
                            Salman Farsy
                        </p>
                    </div>

                    <button className="mt-[20px] lg:mt-[40px] md:mt-[35px] sm:mt-[25px] w-[155px] h-[44px] xl:w-[197px] xl:h-[53px] lg:w-[190px] lg:h-[52px] md:w-[175px] md:h-[50px] sm:w-[165px] sm:h-[48px] bg-black hover:bg-black/85 transition-colors duration-75 rounded-[50px] font-poppins md:font-semibold font-medium text-[14px] xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-white">
                        Update Profile
                    </button>
                </div>

                <div className="mt-[30px] xl:mt-[68px] lg:mt-[78px] md:mt-[82px] sm:mt-[35px] md:order-2 order-1 md:self-auto self-center">

                    <div className="flex gap-[40px] lg:gap-[60px] xl:text-[28px] lg:text-[24px] md:text-[20px] sm:text-[18px] text-[16px] font-inter md:font-semibold font-medium">
                        <div className="text-center flex flex-col items-center justify-start gap-2.5 lg:gap-5 md:gap-4 sm:gap-3">
                            <p className="  text-light-user-states-font">
                                Favorites Count
                            </p>
                            <div className="flex items-center gap-[5px]">
                                <MdOutlineFavorite className="xl:w-[38px] xl:h-[38px] lg:w-[34px] lg:h-[34px] md:w-[30px] md:h-[30px] sm:w-[26px] sm:h-[26px] w-[22px] h-[22px] text-red-500" />
                                <span className="  text-black">
                                    20
                                </span>
                            </div>
                        </div>

                        <div className="text-center flex flex-col items-center justify-start gap-2.5 lg:gap-5 md:gap-4 sm:gap-3">
                            <p className="  text-light-user-states-font">
                                Watchlist Count
                            </p>
                            <div className="flex items-center gap-[5px]">
                                <BsPinAngleFill className="xl:w-[38px] xl:h-[38px] lg:w-[34px] lg:h-[34px] md:w-[30px] md:h-[30px] sm:w-[26px] sm:h-[26px] w-[22px] h-[22px] text-black" />
                                <span className="  text-black">
                                    20
                                </span>
                            </div>
                        </div>

                        <div className="text-center flex flex-col items-center justify-start gap-2.5 lg:gap-5 md:gap-4 sm:gap-3">
                            <p className="  text-light-user-states-font">
                                Ratings Count
                            </p>
                            <div className="flex items-center gap-[5px]">
                                <MdStars className="xl:w-[38px] xl:h-[38px] lg:w-[34px] lg:h-[34px] md:w-[30px] md:h-[30px] sm:w-[26px] sm:h-[26px] w-[22px] h-[22px] text-black" />
                                <span className="  text-black">
                                    20
                                </span>
                            </div>
                        </div>

                        <div className="text-center flex flex-col items-center justify-start gap-2.5 lg:gap-5 md:gap-4 sm:gap-3">
                            <p className="  text-light-user-states-font">
                                Lists Count
                            </p>
                            <div className="flex items-center gap-[5px]">
                                <IoIosListBox className="xl:w-[38px] xl:h-[38px] lg:w-[34px] lg:h-[34px] md:w-[30px] md:h-[30px] sm:w-[26px] sm:h-[26px] w-[22px] h-[22px] text-blue-500" />
                                <span className="  text-black">
                                    20
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}