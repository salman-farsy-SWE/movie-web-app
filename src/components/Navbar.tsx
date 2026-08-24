"use client";

import { Search, Moon, Sun, ChevronLeft, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { GenresMenu } from "@/components/GenresMenu";
import { TrendingMenu } from "@/components/TrendingMenu";
import { TopRatedMenu } from "@/components/TopRatedMenu";
import { useSearch } from "@/contexts/SearchContext";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ProfileDropdown } from "./ProfileDropdown";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv-shows" },
  { label: "Genres", href: "/genres" },
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top-rated" },
];

interface NavUser {
  name: string;
  image?: string;
}

const user: NavUser | null = null

export function Navbar() {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname === "/login" ? "/" : pathname);
  if (pathname !== "/login" && pathname !== prevPathname) {
    setPrevPathname(pathname);
  }
  const currentPathname = pathname === "/login" ? prevPathname : pathname;
  const { setOpen } = useSearch();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMdUp = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(min-width: 900px)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(min-width: 900px)").matches,
    () => false,
  );
  const [genresOpen, setGenresOpen] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(false);
  const [topRatedOpen, setTopRatedOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration flag, no cascading risk
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const navHeight = headerRef.current?.offsetHeight || 0;
        setIsPastHero(heroBottom <= navHeight);
      } else {
        setIsPastHero(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [currentPathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- syncing UI state with media query changes */
  useEffect(() => {
    if (isMdUp) {
      setSidebarOpen(false);
    } else {
      setProfileOpen(false);
    }
  }, [isMdUp]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const isActive = (path: string) => {
    if (path === "/") return currentPathname === "/";
    return currentPathname === path || currentPathname.startsWith(path + "/");
  };

  const isTransparent = currentPathname === "/";

  return (
    <header
      ref={headerRef}
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300 ease-in-out",
        isTransparent
          ? isPastHero
            ? "bg-light-nav shadow-lg shadow-black/25 border-transparent"
            : scrolled
              ? "bg-white/10 dark:bg-black/25 backdrop-blur-md border-white/10"
              : "bg-transparent border-white/0"
          : scrolled
            ? "bg-light-nav shadow-lg shadow-black/25 border-transparent"
            : "bg-light-nav border-transparent"
      )}
    >
      <nav className="flex xl:h-[72px] lg:h-[62px] sm:h-[56px] h-[54px] w-full items-center justify-between">
        <Link href={"/"} className="font-poppins xl:text-3xl lg:text-[28px] md:text-[26px] sm:text-[24px] text-[20px] lg:font-semibold font-medium leading-none md:ml-[30px] sm:ml-[20px] ml-[15px]">
          <span className="text-white">Movie</span>
          <span className={cn("text-trails-red dark:text-trails-red xl:ml-[7px] lg:ml-[5px] ml-[3px]", (isActive("/") && !isPastHero) && "!text-white bg-trails-blue lg:px-2 md:px-[6px] px-[4px]")}>Trails</span>
        </Link>

        <div className="hidden md:flex items-center xl:gap-[15px] lg:gap-[13px] md:gap-[11px] xl:text-lg lg:text-base md:text-sm font-medium text-white/75 xl:mt-1 lg:mt-[6px] md:mt-[4px] xl:ml-24 lg:ml-[40px] md:ml-[20px] select-none">
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
                    "absolute top-full xl:-translate-x-[49.5%] lg:-translate-x-[50%] md:-translate-x-[51%] transition-all duration-200 ease-out",
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
                    "absolute top-full md:-translate-x-[35%] transition-all duration-200 ease-out",
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
                    "absolute top-full md:-translate-x-[33%] transition-all duration-200 ease-out",
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

        <div className="flex items-center xl:gap-[28px] lg:gap-[24px] gap-[20px] xl:text-lg lg:text-base text-sm
         text-white/85 font-medium xl:mr-[60px] lg:mr-[45px] mr-[40px]">
          <div
            onClick={() => setOpen(true)}
            className="flex items-center sm:gap-[5px] gap-[3px] xl:w-[96px] lg:w-[86px] md:w-[74px] sm:w-[70px] w-[64px] border-b-2 border-white xl:pb-[4px] lg:pb-[3px] sm:pb-[2px] pb-[1px] xl:mr-3 lg:mr-[8px] md:mr-[4px] mr-[20px]  cursor-text"
          >
            <Search className="text-white xl:w-[25px] xl:h-[25px] lg:w-[23px]
lg:h-[23px] sm:w-[21px] sm:h-[21px] w-[19px] h-[19px]" />
            <span className="xl:text-[16px] lg:text-sm sm:text-[12px] text-[11px] text-nav-search font-medium leading-none lg:mt-[2px] sm:mt-[-1px]">Search</span>
          </div>
          {user ? (
            <div ref={profileRef} className="hidden relative sm:flex items-center ">
              <div
                onClick={() => setProfileOpen(prev => !prev)}
                className="hidden relative xl:w-[38px] xl:h-[38px] lg:w-[36px] lg:h-[36px] md:w-[32px] md:h-[32px] rounded-full overflow-hidden border-[0px] border-white cursor-pointer md:flex items-center justify-center
                      transition-opacity duration-150 hover:opacity-95 select-none"
              >
                {user?.image ? (
                  <Image
                    src={user?.image}
                    alt={user?.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-[#5275A3] text-white xl:text-2xl lg:text-[22px] md:text-xl font-medium font-inter select-none">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {profileOpen && (
                <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center lg:gap-[9px] md:gap-[7px] sm:gap-[7px]">
              <Link href="/login" scroll={false} className="font-poppins hover:text-white leading-none">
                Login
              </Link>
              <span className="xl:h-[23px] lg:h-[20px] sm:h-[17px] lg:w-[1.5px] sm:w-[1px] bg-white" />
              <Link href="#" className="font-poppins hover:text-white leading-none">
                Sign up
              </Link>
            </div>
          )}
          <div className="flex items-center sm:gap-[22px] gap-[16px]">
            <div className="relative group flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "xl:p-[5px] sm:p-[3px] p-[4px] bg-transparent hover:bg-transparent w-fit h-fit",
                  (mounted && theme !== "dark" && isActive("/")) && "bg-slate-900 hover:bg-slate-800"
                )}
              >
                {mounted ? (theme === "dark" ? (
                  <Sun className="xl:h-[24px] xl:w-[24px] lg:h-[22px] lg:w-[22px] sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] fill-white text-white" />
                ) : (
                  <Moon className="xl:h-[24px] xl:w-[24px] lg:h-[22px] lg:w-[22px] sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] text-white" />
                )) : (
                  <Sun className="xl:h-[24px] xl:w-[24px] lg:h-[22px] lg:w-[22px] sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] fill-white text-white" />
                )}
              </Button>

              <span
                className="absolute top-full lg:mt-[6px] sm:mt-[4px] mt-[4px] left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 
               whitespace-nowrap md:rounded-md rounded-[4px] bg-black text-white xl:text-[14px] lg:text-[12px] text-[10px]
               md:px-[6px] xl:py-0 lg:py-[2px] sm:py-[1px] px-[5px] opacity-0 invisible 
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
              <Menu className="sm:h-[27px] sm:w-[27px] h-[21px] w-[21px] text-white sm:[stroke-width:2] [stroke-width:2.2]" />
            </Button>
          </div>
        </div>
      </nav>

      <Sheet open={sidebarOpen && !isMdUp} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="right"
          className="sm:w-[40vw] w-[35vw] 
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

          <div className="flex flex-col h-full sm:mt-4 mt-[14px]">
            <div className="font-poppins sm:text-[24px] text-[20px] font-medium leading-none sm:ml-[22px] ml-[16px] sm:mb-[18px] mb-[14px]">
              <span className="text-black dark:text-white">Movie</span>
              <span className="text-trails-red sm:ml-[10px] ml-[6px]">Trails</span>
            </div>

            <div className="h-[1px] w-full bg-black"/> 

            <nav className="flex flex-col sm:gap-8 gap-[30px] sm:text-lg text-base sm:mt-[26px] mt-[16px] sm:ml-[20px] ml-[14px] font-medium text-black/75 dark:text-white/90 relative">
              {user ? (
                <div className="relative group">
                  <div
                    className="flex items-center sm:gap-2 gap-[3px] hover:text-black hover:dark:text-white transition-colors duration-75 cursor-pointer"
                  >
                    <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                    Profile
                  </div>

                  <div className="-translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                    <ProfileDropdown user={user} onClose={() => setSidebarOpen(false)} />
                  </div>
                </div>
              ) : (
                <div className="sm:hidden flex items-center gap-[10px] ml-[17px]">
                  <SheetClose asChild>
                    <Link href="/login" scroll={false} className="font-poppins hover:text-black leading-none">
                      Login
                    </Link>
                  </SheetClose>
                  <span className="h-[16px] w-[1px] bg-black" />
                  <SheetClose asChild>
                    <Link href="#" className="font-poppins hover:text-black leading-none">
                      Sign up
                    </Link>
                  </SheetClose>
                </div>
              )}
              {navLinks.map((link) =>
                link.label === "Genres" ? (
                  <div key={link.label} className="relative group">
                    <div
                      className="flex items-center sm:gap-2 gap-[3px] hover:text-black hover:dark:text-white transition-colors duration-75 cursor-pointer"
                    >
                      <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                      {link.label}
                    </div>

                    <div className="absolute sm:-top-1 top-[0px] -translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <GenresMenu onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                ) : link.label === "Trending" ? (
                  <div key={link.label} className="relative group">
                    <div
                      className="flex items-center sm:gap-2 gap-[3px] hover:text-black hover:dark:text-white transition-colors duration-75 cursor-pointer"
                    >
                      <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                      {link.label}
                    </div>

                    <div className="absolute sm:-top-1 top-[0px] -translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <TrendingMenu onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                ) : link.label === "Top Rated" ? (
                  <div key={link.label} className="relative group">
                    <div
                      className="flex items-center sm:gap-2 gap-[3px] hover:text-black hover:dark:text-white transition-colors duration-75 cursor-pointer"
                    >
                      <ChevronLeft className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                      {link.label}
                    </div>

                    <div className="absolute sm:-top-1 top-[0px] -translate-x-[102%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <TopRatedMenu onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                ) : (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-black hover:dark:text-white sm:ml-[27px] ml-[17px] transition-colors duration-75"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                )
              )}

              {user && (
                <SheetClose asChild>
                  <Button
                    className="w-fit h-fit bg-transparent hover:bg-transparent rounded-none flex items-center sm:gap-[9px] gap-[5px] m-0 p-0 sm:pl-1 pl-[6px] sm:mt-[42px] mt-[38px] text-start sm:text-lg text-base text-light-logout-font/75 hover:text-light-logout-font dark:text-red-400 hover:dark:text-white transition-colors duration-75 cursor-pointer"
                  >
                    <LogOut className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px]" />
                    Log out
                  </Button>
                </SheetClose>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}