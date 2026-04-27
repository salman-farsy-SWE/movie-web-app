"use client";

import { Search, Moon, Sun, ChevronLeft } from "lucide-react";
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
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv-shows" },
  { label: "Genres", href: "/genres" },
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top-rated" },
];

export function Navbar() {
  const pathname = usePathname();
  const { setOpen } = useSearch();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(false);
  const [topRatedOpen, setTopRatedOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  function usePrevRoute() {
    const prev = useRef<string | null>(null);

    useEffect(() => {
      prev.current = pathname;
    }, [pathname]);

    return prev.current;
  }

  const prev = usePrevRoute();

  const isTransparent =
    pathname === "/" ||
    (pathname === "/login" && prev === "/");

  return (
    <header suppressHydrationWarning className="absolute left-0 top-0 z-30 w-screen bg-transparent">
      <nav className={cn("flex xl:h-[72px] lg:h-[62px] sm:h-[56px] h-[54px] w-full items-center justify-between bg-light-nav", isTransparent && "bg-transparent")}>
        <Link href={"/"} className="font-poppins xl:text-3xl lg:text-[28px] md:text-[26px] sm:text-[24px] text-[20px] lg:font-semibold font-medium leading-none md:ml-[30px] sm:ml-[20px] ml-[15px]">
          <span className="text-white">Movie</span>
          <span className={cn("text-trails-red dark:text-trails-red sm:ml-1 ml-[2px]", isActive("/") && "!text-white bg-trails-blue lg:px-2 md:px-[6px] px-[4px]")}>Trails</span>
        </Link>

        <div className="hidden md:flex items-center lg:gap-[13px] md:gap-[11px] xl:text-base lg:text-[15px] md:text-sm font-medium text-white/85 xl:mt-1 lg:mt-[6px] md:mt-[6px] xl:ml-24 lg:ml-[90px] md:ml-[40px] select-none">
          {navLinks.map((link) => (
            link.label === "Genres" ? (
              <div
                key={link.label}
                className="group relative flex items-center"
                onMouseEnter={() => setGenresOpen(true)}
                onMouseLeave={() => setGenresOpen(false)}
              >
                <div
                  className={cn(
                    isActive(link.href) && "border-white/65 text-white after:scale-x-100",
                    "nav-btn-underline group-hover:text-white group-hover:border-transparent leading-none after:scale-x-0 group-hover:after:scale-x-100 cursor-pointer"
                  )}
                >
                  {link.label}
                </div>

                <div
                  className={cn(
                    "absolute top-full lg:-translate-x-2/4 md:-translate-x-[51%] transition-all duration-200 ease-out",
                    genresOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                >
                  <GenresMenu onItemClick={() => setGenresOpen(false)} />
                </div>
              </div>
            ) : link.label === "Trending" ? (
              <div
                key={link.label}
                className="group relative flex items-center"
                onMouseEnter={() => setTrendingOpen(true)}
                onMouseLeave={() => setTrendingOpen(false)}
              >
                <div
                  className={cn(isActive(link.href) && "border-white/65 text-white after:scale-x-100", "nav-btn-underline group-hover:text-white leading-none group-hover:border-transparent after:scale-x-0 group-hover:after:scale-x-100 cursor-pointer")}
                >
                  {link.label}
                </div>

                <div
                  className={cn(
                    "absolute top-full lg:-translate-x-[36%] md:-translate-x-[33%] transition-all duration-200 ease-out",
                    trendingOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                >
                  <TrendingMenu onItemClick={() => setTrendingOpen(false)} />
                </div>
              </div>
            ) : link.label === "Top Rated" ? (
              <div
                key={link.label}
                className="group relative flex items-center"
                onMouseEnter={() => setTopRatedOpen(true)}
                onMouseLeave={() => setTopRatedOpen(false)}
              >
                <div
                  className={cn(isActive(link.href) && "border-white/65 text-white after:scale-x-100", "nav-btn-underline group-hover:text-white leading-none group-hover:border-transparent after:scale-x-0 group-hover:after:scale-x-100 cursor-pointer")}
                >
                  {link.label}
                </div>

                <div
                  className={cn(
                    "absolute top-full lg:-translate-x-[34%] md:-translate-x-[31%] transition-all duration-200 ease-out",
                    topRatedOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                >
                  <TopRatedMenu onItemClick={() => setTopRatedOpen(false)} />
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  isActive(link.href) && "border-white/65 text-white after:scale-x-100",
                  "nav-btn-underline hover:text-white leading-none after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center lg:gap-6 sm:gap-[24px] gap-[22px] xl:text-base lg:text-[15px] sm:text-sm text-[12px]
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
          <div className="flex items-center gap-[14px]">
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
                className="absolute top-full sm:mt-[6px] mt-1 left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 
               whitespace-nowrap md:rounded-md rounded-[4px] bg-black text-white lg:text-[11px] md:text-[10px] text-[9px]
               md:px-[6px] px-[5px] opacity-0 invisible 
               group-hover:opacity-100 group-hover:visible 
               transition-all duration-200 ease-out z-50"
              >
                {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Light mode"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="sm:flex md:hidden p-1 bg-transparent hover:bg-transparent w-fit h-fit"
            >
              <Menu className="sm:h-[22px] sm:w-[22px] h-[21px] w-[21px] text-white [stroke-width:2.5]" />
            </Button>
          </div>
        </div>
      </nav>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="right"
          className="sm:w-[35vw] w-[35vw] sm:px-6 sm:py-5 
  bg-white dark:bg-dropdown border-none

  data-[state=open]:animate-in data-[state=closed]:animate-out
  data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right
  duration-300 ease-in-out

  [&>button]:text-black dark:[&>button]:text-white
  sm:[&>button]:scale-125
  [&>button]:top-4 [&>button]:right-4
"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>

          <div className="flex flex-col h-full sm:mt-2 mt-3">
            <div className="font-poppins sm:text-[20px] text-[18px] font-medium leading-none sm:mb-4 mb-3 sm:border-b-2 border-b-[1px] border-black dark:border-white sm:pb-[16px] pb-[14px] sm:mx-5 mx-2">
              <span className="text-black dark:text-white">Movie</span>
              <span className={cn("bg-trails-red dark:bg-trails-blue ml-1 px-1 text-white")}>Trails</span>
            </div>

            <nav className="flex flex-col sm:gap-6 gap-4 sm:text-base text-[14px] font-medium text-black/85 dark:text-white/90 relative">
              {navLinks.map((link) =>
                link.label === "Genres" ? (
                  <div key={link.label} className="relative group">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="flex items-center sm:gap-1 gap-[2px] hover:text-black hover:dark:text-white transition-colors duration-75"
                      >
                        <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                        {link.label}
                      </Link>
                    </SheetClose>

                    <div className="absolute -top-1 -translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <GenresMenu onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                ) : link.label === "Trending" ? (
                  <div key={link.label} className="relative group">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="flex items-center sm:gap-1 gap-[2px] hover:text-black hover:dark:text-white transition-colors duration-75"
                      >
                        <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                        {link.label}
                      </Link>
                    </SheetClose>

                    <div className="absolute -top-1 -translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <TrendingMenu onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                ) : link.label === "Top Rated" ? (
                  <div key={link.label} className="relative group">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="flex items-center sm:gap-1 gap-[2px] hover:text-black hover:dark:text-white transition-colors duration-75"
                      >
                        <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                        {link.label}
                      </Link>
                    </SheetClose>

                    <div className="absolute -top-1 -translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <TopRatedMenu onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                ) : (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-black hover:dark:text-white sm:ml-5 ml-[17px] transition-colors duration-75"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                )
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}