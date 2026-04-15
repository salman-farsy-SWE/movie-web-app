"use client";

import { Search, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { GenresMenu } from "@/components/GenresMenu";
import { TrendingMenu } from "@/components/TrendingMenu";
import { TopRatedMenu } from "@/components/TopRatedMenu";
import { useSearch } from "@/contexts/SearchContext";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Movies", href: "#" },
  { label: "TV Shows", href: "#" },
  { label: "Genres", href: "#" },
  { label: "Trending", href: "#" },
  { label: "Top Rated", href: "#" },
];

export function Navbar() {
  const isActive = (path: string) => usePathname() === path;
  const { setOpen } = useSearch();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header suppressHydrationWarning className="absolute left-0 top-0 z-30 w-screen bg-transparent">
      <nav className="flex xl:h-[72px] lg:h-[62px] sm:h-[56px] h-[54px] w-full items-center justify-between ">
        <div className="font-poppins xl:text-3xl lg:text-[28px] md:text-[26px] sm:text-[24px] text-[20px] lg:font-semibold font-medium leading-none md:ml-[30px] sm:ml-[20px] ml-[15px]">
          <span className="text-white">Movie</span>
          <span className={cn("text-trails-blue dark:text-trails-red sm:ml-1 ml-[2px]", isActive("/") && "!text-white bg-trails-blue lg:px-2 md:px-[6px] px-[4px]")}>Trails</span>
        </div>

        <div className="hidden md:flex items-center lg:gap-[13px] md:gap-[11px] xl:text-base lg:text-[15px] md:text-sm font-medium text-white/85 xl:mt-1 lg:mt-[6px] md:mt-[6px] xl:ml-24 lg:ml-[90px] md:ml-[40px]">
          {navLinks.map((link) => (
            link.label === "Genres" ? (
              <div key={link.label} className="relative group flex items-center">

                <Link
                  href={link.href}
                  className="nav-btn-underline hover:text-white group-hover:text-white leading-none"
                >
                  {link.label}
                </Link>

                <div className="absolute top-full -translate-x-2/4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                  <GenresMenu />
                </div>

              </div>
            ) : link.label === "Trending" ? (
              <div key={link.label} className="relative group flex items-center">

                <Link
                  href={link.href}
                  className="nav-btn-underline hover:text-white group-hover:text-white leading-none"
                >
                  {link.label}
                </Link>

                <div className="absolute top-full -translate-x-[35%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                  <TrendingMenu />
                </div>

              </div>
            ) : link.label === "Top Rated" ? (
              <div key={link.label} className="relative group flex items-center">

                <Link
                  href={link.href}
                  className="nav-btn-underline hover:text-white group-hover:text-white leading-none"
                >
                  {link.label}
                </Link>

                <div className="absolute top-full -translate-x-[35%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                  <TopRatedMenu />
                </div>

              </div>) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  link.label === "Home" && "border-white/65 text-white",
                  "nav-btn-underline hover:text-white leading-none"
                )}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center lg:gap-5 gap-[18px] xl:text-base lg:text-[15px] sm:text-sm text-[12px]
         text-white/85 font-medium xl:mr-[55px] lg:mr-[50px] md:mr-[40px] mr-[30px]">
          <div
            onClick={() => setOpen(true)}
            className="flex items-center sm:gap-[5px] gap-[3px] xl:w-[103px] lg:w-24 sm:w-20 w-[70px] border-b-2 border-white xl:pb-[3px] pb-[2px] mr-3 cursor-text"
          >
            <Search className="text-white xl:w-[23px] xl:h-[23px] lg:w-[21px]
lg:h-[21px] sm:w-[19px] sm:h-[19px] w-[18px] h-[18px]" />
            <span className="xl:text-[15px] lg:text-sm text-[13px] text-nav-search sm:font-medium leading-none lg:mt-[2px] mt-[1px]">Search</span>
          </div>
          <div className="hidden sm:flex items-center lg:gap-[9px] md:gap-[7px] gap-[6px]">
            <Link href="/login" className="font-poppins hover:text-white leading-none">
              Login
            </Link>
            <span className="lg:h-[22px] sm:h-[20px] lg:w-[1.5px] sm:w-[1px] bg-white" />
            <Link href="#" className="font-poppins hover:text-white leading-none">
              Sign up
            </Link>
          </div>
          <div className="flex items-center sm:gap-2 gap-3">
            <div className="relative group flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "lg:p-[4px] p-[3px] bg-transparent hover:bg-transparent w-fit h-fit",
                  mounted && theme !== "dark" && "bg-slate-900 hover:bg-slate-800"
                )}
              >
                {mounted ? (theme === "dark" ? (
                  <Sun className="xl:h-[23px] xl:w-[23px] lg:h-[21px] lg:w-[21px] md:h-[19px] md:w-[19px] sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] fill-white text-white" />
                ) : (
                  <Moon className="xl:h-[23px] xl:w-[23px] lg:h-[21px] lg:w-[21px] md:h-[19px] md:w-[19px] sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] text-white" />
                )) : (
                  <Sun className="xl:h-[23px] xl:w-[23px] lg:h-[21px] lg:w-[21px] md:h-[19px] md:w-[19px] sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] fill-white text-white" />
                )}
              </Button>

              <span
                className="absolute top-full sm:mt-2 mt-1 left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 
               whitespace-nowrap md:rounded-md rounded-[4px] bg-black text-white xl:text-xs lg:text-[11px] md:text-[10px] text-[9px]
               lg:px-2 md:px-[6px] px-[5px] lg:py-1 md:py-[2px] py-[1px] opacity-0 invisible 
               group-hover:opacity-100 group-hover:visible 
               transition-all duration-200 ease-out z-50"
              >
                {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Light mode"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="sm:flex md:hidden p-1 bg-transparent hover:bg-transparent w-fit h-fit"
            >
              <Menu className="sm:h-[22px] sm:w-[22px] h-[21px] w-[21px] text-white sm:[stroke-width:2.5] [stroke-width:2]"
              />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
