"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { User, Heart, Bookmark, List, Star, LogOut } from "lucide-react";

interface ProfileDropdownProps {
    user: {
        name: string;
        image?: string;
    };
    onClose?: () => void;
}

export function ProfileDropdown({ user, onClose }: ProfileDropdownProps) {
    return (
        <div className="absolute xl:top-[48px] lg:top-[42px] md:top-[40px] sm:-top-7 -top-[26px] right-0 xl:-right-[70px] lg:-right-[60px] md:-right-[55px] xl:w-[180px] lg:w-[160px] md:w-[145px] sm:w-[165px] w-[140px] h-fit lg:rounded-[5px] md:rounded-[3px] sm:rounded rounded-[3px] md:bg-light-dropdown bg-white dark:bg-dropdown drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_10px_28px_rgba(0,0,0,0.85)] z-50 overflow-y-hidden">
            <div className="hidden md:block text-center xl:text-[14px] lg:text-[13px] md:text-[12px] md:py-[3px] font-medium font-inter text-light-profile-dropdown-username dark:text-profile-dropdown-username">
                {user.name}
            </div>

            <div className="hidden md:block h-[1px] bg-light-profile-dropdown-username dark:bg-profile-dropdown-username mx-auto" />

            <div className="flex flex-col xl:text-lg lg:text-base md:text-sm font-normal font-poppins">
                {[
                    { label: "Profile", href: "/123/profile", Icon: User },
                    { label: "Favorite", href: "/123/favorite", Icon: Heart },
                    { label: "Watchlist", href: "/123/watchlist", Icon: Bookmark },
                    { label: "My List", href: "/123/list", Icon: List },
                    { label: "My Rating", href: "/123/rating", Icon: Star },
                ].map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center xl:h-[37px] lg:h-[33px] md:h-[29px] sm:h-[33px] h-[31px] xl:pl-[19px] lg:pl-[17px] md:pl-[15px] sm:pl-[17px] pl-[13px] xl:py-[22px] lg:py-[20px] md:py-[17px] sm:py-[22px] py-[20px] text-black/75  hover:text-black dark:text-white/85 dark:hover:text-white md:hover:bg-light-dropdown-hover dark:hover:bg-dropdown-hover hover:bg-light-dropdown transition-colors duration-75"
                    >
                        <item.Icon size={16} className="xl:mr-[12px] lg:mr-[10px] md:mr-[8px] sm:mr-[10px] mr-[8px] text-black dark:text-white" />
                        {item?.label}
                    </Link>
                ))}

                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="hidden md:flex items-center justify-start xl:h-[37px] lg:h-[33px] md:h-[29px] xl:pl-[19px] lg:pl-[17px] md:pl-[15px] xl:py-[22px] lg:py-[20px] md:py-[17px] xl:text-lg lg:text-base md:text-sm font-medium text-light-logout-font/75 hover:text-light-logout-font dark:text-red-400 dark:hover:text-black md:hover:bg-light-dropdown-hover hover:bg-light-dropdown dark:hover:bg-white/90 rounded-none"
                >
                    <LogOut size={16} className="xl:mr-[12px] lg:mr-[10px] md:mr-[8px] mr-2" />
                    Log out
                </Button>
            </div>
        </div>
    );
}