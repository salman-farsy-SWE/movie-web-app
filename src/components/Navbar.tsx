"use client";

import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { GenresMenu } from "@/components/navbar/GenresMenu";
import { TrendingMenu } from "@/components/navbar/TrendingMenu";
import { TopRatedMenu } from "@/components/navbar/TopRatedMenu";
import { useUIStore } from "@/stores/useUIStore";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import { SearchTrigger } from "@/components/navbar/SearchTrigger";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { ProfileDropdown } from "@/components/navbar/ProfileDropdown";
import { MobileNavSheet } from "@/components/navbar/MobileNavSheet";
import { UserAvatar } from "@/components/navbar/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { getTmdbAvatarUrl } from "@/lib/tmdb/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv-shows" },
  { label: "Genres", href: "/genres" },
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top-rated" },
];

export function Navbar() {
  const { user } = useAuth();
  const navUser = user
    ? {
        name: user.name || user.username,
        username: user.username,
        id: user.id,
        image: getTmdbAvatarUrl(user),
      }
    : null;
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname === "/login" ? "/" : pathname);
  if (pathname !== "/login" && pathname !== prevPathname) {
    setPrevPathname(pathname);
  }
  const currentPathname = pathname === "/login" ? prevPathname : pathname;
  const searchOpen = useUIStore((state) => state.isSearchOpen);
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


  /* eslint-disable react-hooks/set-state-in-effect -- syncing UI menus when search overlay opens */
  useEffect(() => {
    if (searchOpen) {
      setSidebarOpen(false);
      setProfileOpen(false);
      setGenresOpen(false);
      setTrendingOpen(false);
      setTopRatedOpen(false);
    }
  }, [searchOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
        "fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300 ease-in-out ",
        isTransparent
          ? isPastHero
            ? "bg-light-nav dark:bg-dark-nav shadow-lg shadow-black/25 dark:shadow-white/5 border-transparent"
            : scrolled
              ? "bg-black/30 backdrop-blur-md border-white/10"
              : "bg-transparent border-white/0"
          : scrolled
            ? "bg-light-nav dark:bg-dark-nav shadow-lg shadow-black/25 dark:shadow-white/5 border-white/5"
            : "bg-light-nav dark:bg-dark-nav border-transparent"
      )}
    >
      <nav className="flex xl:h-[72px] lg:h-[62px] sm:h-[56px] h-[54px] w-full items-center justify-between xl:px-8 lg:px-6 md:px-5 sm:px-4 px-3.5">
        <Link
          href="/"
          className="inline-flex items-center font-poppins xl:text-[28px] lg:text-[25px] md:text-[23px] sm:text-[22px] text-[20px] font-bold tracking-tight leading-none select-none outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md py-1"
        >
          <span className="text-white drop-shadow-sm">Movie</span>
          <span className="text-trails-red dark:text-blue1 ml-1 sm:ml-1.5 transition-colors duration-200">
            Trails
          </span>
        </Link>

        <div className="hidden md:flex items-center xl:gap-6 lg:gap-4.5 md:gap-3.5 xl:text-lg lg:text-base md:text-sm font-medium text-white/85 select-none">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const linkClasses = cn(
              "nav-btn-underline leading-none",
              active
                ? "text-white font-semibold after:scale-x-100 after:opacity-100"
                : "text-white/80 hover:text-white after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-100"
            );

            if (link.label === "Genres") {
              return (
                <div
                  key={link.label}
                  className="group relative flex items-center"
                  onMouseEnter={() => setGenresOpen(true)}
                  onMouseLeave={() => setGenresOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={genresOpen}
                    aria-haspopup="menu"
                    onClick={() => setGenresOpen((prev) => !prev)}
                    className={linkClasses}
                  >
                    {link.label}
                  </button>

                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 transition-all duration-200 ease-out",
                      genresOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                  >
                    <GenresMenu onItemClick={() => setGenresOpen(false)} />
                  </div>
                </div>
              );
            }

            if (link.label === "Trending") {
              return (
                <div
                  key={link.label}
                  className="group relative flex items-center"
                  onMouseEnter={() => setTrendingOpen(true)}
                  onMouseLeave={() => setTrendingOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={trendingOpen}
                    aria-haspopup="menu"
                    onClick={() => setTrendingOpen((prev) => !prev)}
                    className={linkClasses}
                  >
                    {link.label}
                  </button>

                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 transition-all duration-200 ease-out",
                      trendingOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                  >
                    <TrendingMenu onItemClick={() => setTrendingOpen(false)} />
                  </div>
                </div>
              );
            }

            if (link.label === "Top Rated") {
              return (
                <div
                  key={link.label}
                  className="group relative flex items-center"
                  onMouseEnter={() => setTopRatedOpen(true)}
                  onMouseLeave={() => setTopRatedOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={topRatedOpen}
                    aria-haspopup="menu"
                    onClick={() => setTopRatedOpen((prev) => !prev)}
                    className={linkClasses}
                  >
                    {link.label}
                  </button>

                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 transition-all duration-200 ease-out",
                      topRatedOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    )}
                  >
                    <TopRatedMenu onItemClick={() => setTopRatedOpen(false)} />
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={linkClasses}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 xl:text-lg lg:text-base text-sm text-white/85 font-medium">
          <SearchTrigger />
          {navUser ? (
            <div ref={profileRef} className="hidden relative md:flex items-center">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Open user profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className={cn(
                  "relative rounded-full p-[2px] transition-all duration-200 cursor-pointer select-none",
                  "border border-white/30 hover:border-white/90 hover:scale-105 active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20",
                  profileOpen && "ring-2 ring-white/70 border-white bg-white/10 scale-105 shadow-md"
                )}
              >
                <UserAvatar user={navUser} />
              </button>

              {profileOpen && (
                <ProfileDropdown user={navUser} onClose={() => setProfileOpen(false)} />
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 font-poppins">
              <Link
                href={
                  pathname && pathname !== "/login"
                    ? `/login?redirect=${encodeURIComponent(pathname)}`
                    : "/login"
                }
                scroll={false}
                className={cn(
                  "relative py-1 text-white/85 hover:text-white transition-colors duration-150 leading-none outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm",
                  currentPathname === "/login" && "text-white font-semibold"
                )}
              >
                Login
              </Link>
              <span className="h-3.5 lg:h-4 w-[1px] bg-white/40 rounded-full" aria-hidden="true" />
              <a
                href="https://www.themoviedb.org/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="relative py-1 text-white/85 hover:text-white transition-colors duration-150 leading-none outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
              >
                Sign up
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open mobile navigation menu"
              className="flex md:hidden p-1.5 sm:p-2 rounded-full text-white/85 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-150 w-8 h-8 sm:w-9 sm:h-9"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2]" />
            </Button>
          </div>
        </div>
      </nav>

      <MobileNavSheet
        open={sidebarOpen && !isMdUp}
        onOpenChange={setSidebarOpen}
        navLinks={navLinks}
        user={navUser}
      />
    </header>
  );
}