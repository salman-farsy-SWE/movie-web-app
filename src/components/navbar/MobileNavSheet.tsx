"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Film,
  Tv,
  LayoutGrid,
  TrendingUp,
  Award,
  ChevronDown,
  User,
  Heart,
  Bookmark,
  List,
  Star,
  LogOut,
  LogIn,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/navbar/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavUser {
  name: string;
  username?: string;
  image?: string;
  id?: number | string;
}

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks?: NavLink[];
  user: NavUser | null;
}

type OpenMenuKey = "profile" | "genres" | "trending" | "topRated" | null;

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Kids",
  "Music",
  "Mystery",
  "News",
  "Reality",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

const TRENDING_ITEMS = [
  { label: "Trending Today", href: "/trending/today" },
  { label: "Trending This Week", href: "/trending/this-week" },
  { label: "Trending Movies", href: "/trending/movies" },
  { label: "Trending TV Shows", href: "/trending/tv-shows" },
  { label: "Trending Persons", href: "/trending/persons" },
];

const TOP_RATED_ITEMS = [
  { label: "Top Rated Movies", href: "/top-rated/movies" },
  { label: "Top Rated TV Shows", href: "/top-rated/tv-shows" },
];

export function MobileNavSheet({
  open,
  onOpenChange,
  user,
}: MobileNavSheetProps) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [, startTransition] = useTransition();

  // Exactly one dropdown can be open at a time ("profile" | "genres" | "trending" | "topRated" | null)
  const [openMenu, setOpenMenu] = useState<OpenMenuKey>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  // Sync state during render: whenever the nav sheet is closed, reset openMenu to null
  if (!open && prevOpen) {
    setPrevOpen(false);
    if (openMenu !== null) {
      setOpenMenu(null);
    }
  } else if (open && !prevOpen) {
    setPrevOpen(true);
  }

  const toggleMenu = (menuKey: Exclude<OpenMenuKey, null>) => {
    setOpenMenu((current) => (current === menuKey ? null : menuKey));
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpenMenu(null);
    }
    onOpenChange(newOpen);
  };

  const handleToggleTheme = () => {
    const isDark =
      (resolvedTheme || theme) === "dark" ||
      (typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark"));
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    setOpenMenu(null);
    onOpenChange(false);
    await logout();
  };

  const closeNav = () => {
    setOpenMenu(null);
    startTransition(() => {
      onOpenChange(false);
    });
  };

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const userSlug = user?.id || user?.username || "me";
  const displayName = user?.name || user?.username || "User";

  const userLibraryItems = [
    { label: "Profile", href: `/${userSlug}/profile`, Icon: User },
    { label: "Favorites", href: `/${userSlug}/favorite`, Icon: Heart },
    { label: "Watchlist", href: `/${userSlug}/watchlist`, Icon: Bookmark },
    { label: "My Lists", href: `/${userSlug}/list`, Icon: List },
    { label: "My Ratings", href: `/${userSlug}/rating`, Icon: Star },
  ];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-[360px] sm:w-[420px] max-w-[92vw] sm:max-w-[440px] p-0 flex flex-col bg-white dark:bg-dropdown border-l border-black/10 dark:border-white/10 shadow-2xl text-foreground font-poppins [&>button]:text-black/80 dark:[&>button]:text-white [&>button]:opacity-80 dark:[&>button]:opacity-100 hover:[&>button]:opacity-100"
      >
        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

        {/* Top Header Branding */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10 shrink-0">
          <SheetClose asChild>
            <Link
              href="/"
              onClick={closeNav}
              className="inline-flex items-center text-[20px] font-bold tracking-tight leading-none select-none outline-none focus-visible:ring-2 focus-visible:ring-trails-red rounded"
            >
              <span className="text-black dark:text-white">Movie</span>
              <span className="text-trails-red dark:text-blue1 ml-1.5">Trails</span>
            </Link>
          </SheetClose>
        </div>

        {/* Scrollable Navigation Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-4">
          {/* User Account / Dropdown Section */}
          {user ? (
            <div className="rounded-xl bg-light-dropdown/70 dark:bg-dropdown-hover/60 border border-black/10 dark:border-white/10 p-2.5">
              {/* Profile Dropdown Trigger */}
              <button
                type="button"
                onClick={() => toggleMenu("profile")}
                className="w-full flex items-center justify-between p-1 rounded-lg text-left select-none cursor-pointer group"
                aria-expanded={openMenu === "profile"}
                aria-label="Toggle user profile menu"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    user={user}
                    sizeClassName="w-10 h-10 ring-2 ring-trails-red/30 dark:ring-blue1/30 shrink-0"
                    textSizeClassName="text-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-black dark:text-white truncate">
                      {displayName}
                    </p>
                    {user.username && (
                      <p className="text-xs text-black/50 dark:text-white/50 truncate">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-transform duration-200 shrink-0 ml-2",
                    openMenu === "profile" && "rotate-180"
                  )}
                />
              </button>

              {/* Profile Dropdown Items */}
              {openMenu === "profile" && (
                <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10 grid grid-cols-1 gap-1">
                  {userLibraryItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href}
                          onClick={closeNav}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150",
                            active
                              ? "bg-trails-red/10 text-trails-red dark:bg-blue1/15 dark:text-blue1"
                              : "text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                          )}
                        >
                          <item.Icon
                            className={cn(
                              "w-4 h-4 shrink-0",
                              active
                                ? "text-trails-red dark:text-blue1"
                                : "text-black/50 dark:text-white/50"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-light-dropdown/70 dark:bg-dropdown-hover/60 border border-black/10 dark:border-white/10 p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-black/75 dark:text-white/80">
                <LogIn className="w-4 h-4 text-trails-red dark:text-blue1" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Account
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SheetClose asChild>
                  <Link
                    href={
                      pathname && pathname !== "/login"
                        ? `/login?redirect=${encodeURIComponent(pathname)}`
                        : "/login"
                    }
                    onClick={closeNav}
                    className="flex items-center justify-center py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-trails-red text-white hover:bg-trails-red/90 dark:bg-blue1 dark:text-zinc-950 dark:hover:bg-blue1/90 transition-all shadow-sm active:scale-[0.98]"
                  >
                    Log in
                  </Link>
                </SheetClose>
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNav}
                  className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium border border-black/15 dark:border-white/15 text-black/80 dark:text-white/85 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <span>Sign up</span>
                  <ExternalLink className="w-3 h-3 text-black/40 dark:text-white/40" />
                </a>
              </div>
            </div>
          )}

          {/* Primary Top Links: Home, Movies, TV Shows */}
          <div className="space-y-1">
            <SheetClose asChild>
              <Link
                href="/"
                onClick={closeNav}
                className={cn(
                  "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                  isRouteActive("/")
                    ? "bg-trails-red/10 text-trails-red dark:bg-blue1/15 dark:text-blue1 font-semibold"
                    : "text-black/80 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                <Home
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isRouteActive("/")
                      ? "text-trails-red dark:text-blue1"
                      : "text-black/50 dark:text-white/50"
                  )}
                />
                <span>Home</span>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href="/movies"
                onClick={closeNav}
                className={cn(
                  "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                  isRouteActive("/movies")
                    ? "bg-trails-red/10 text-trails-red dark:bg-blue1/15 dark:text-blue1 font-semibold"
                    : "text-black/80 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                <Film
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isRouteActive("/movies")
                      ? "text-trails-red dark:text-blue1"
                      : "text-black/50 dark:text-white/50"
                  )}
                />
                <span>Movies</span>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href="/tv-shows"
                onClick={closeNav}
                className={cn(
                  "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                  isRouteActive("/tv-shows")
                    ? "bg-trails-red/10 text-trails-red dark:bg-blue1/15 dark:text-blue1 font-semibold"
                    : "text-black/80 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                <Tv
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isRouteActive("/tv-shows")
                      ? "text-trails-red dark:text-blue1"
                      : "text-black/50 dark:text-white/50"
                  )}
                />
                <span>TV Shows</span>
              </Link>
            </SheetClose>
          </div>

          {/* Genres Dropdown Section */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => toggleMenu("genres")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium select-none cursor-pointer transition-colors duration-150",
                isRouteActive("/genres")
                  ? "text-trails-red dark:text-blue1 font-semibold"
                  : "text-black/80 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-expanded={openMenu === "genres"}
            >
              <div className="flex items-center gap-3.5">
                <LayoutGrid className="w-4 h-4 shrink-0 text-black/50 dark:text-white/50" />
                <span>Genres</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-black/40 dark:text-white/40 transition-transform duration-200 shrink-0",
                  openMenu === "genres" && "rotate-180"
                )}
              />
            </button>

            {openMenu === "genres" && (
              <div className="grid grid-cols-2 gap-1.5 pl-3 pt-0.5">
                {GENRES.map((genre) => {
                  const slug = genre.toLowerCase().replace(/\s+/g, "-");
                  const href = `/genres/${slug}`;
                  const active = pathname === href;
                  return (
                    <SheetClose asChild key={genre}>
                      <Link
                        href={href}
                        onClick={closeNav}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg text-xs font-medium truncate transition-colors duration-150",
                          active
                            ? "bg-trails-red/15 text-trails-red dark:bg-blue1/20 dark:text-blue1 font-semibold"
                            : "text-black/70 dark:text-white/75 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                      >
                        {genre}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trending Dropdown Section */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => toggleMenu("trending")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium select-none cursor-pointer transition-colors duration-150",
                isRouteActive("/trending")
                  ? "text-trails-red dark:text-blue1 font-semibold"
                  : "text-black/80 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-expanded={openMenu === "trending"}
            >
              <div className="flex items-center gap-3.5">
                <TrendingUp className="w-4 h-4 shrink-0 text-black/50 dark:text-white/50" />
                <span>Trending</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-black/40 dark:text-white/40 transition-transform duration-200 shrink-0",
                  openMenu === "trending" && "rotate-180"
                )}
              />
            </button>

            {openMenu === "trending" && (
              <div className="flex flex-col gap-1 pl-3 pt-0.5">
                {TRENDING_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeNav}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150",
                          active
                            ? "bg-trails-red/15 text-trails-red dark:bg-blue1/20 dark:text-blue1 font-semibold"
                            : "text-black/70 dark:text-white/75 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Rated Dropdown Section */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => toggleMenu("topRated")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium select-none cursor-pointer transition-colors duration-150",
                isRouteActive("/top-rated")
                  ? "text-trails-red dark:text-blue1 font-semibold"
                  : "text-black/80 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-expanded={openMenu === "topRated"}
            >
              <div className="flex items-center gap-3.5">
                <Award className="w-4 h-4 shrink-0 text-black/50 dark:text-white/50" />
                <span>Top Rated</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-black/40 dark:text-white/40 transition-transform duration-200 shrink-0",
                  openMenu === "topRated" && "rotate-180"
                )}
              />
            </button>

            {openMenu === "topRated" && (
              <div className="flex flex-col gap-1 pl-3 pt-0.5">
                {TOP_RATED_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeNav}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150",
                          active
                            ? "bg-trails-red/15 text-trails-red dark:bg-blue1/20 dark:text-blue1 font-semibold"
                            : "text-black/70 dark:text-white/75 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions: Theme Toggle & Logout */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 space-y-2 shrink-0 bg-light-dropdown/40 dark:bg-dropdown-hover/30">
          {/* Fully Clickable Theme Toggle Button */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle theme appearance"
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-black/80 dark:text-white/85 bg-light-dropdown/70 dark:bg-dropdown-hover/60 hover:bg-light-dropdown dark:hover:bg-dropdown-hover active:scale-[0.99] transition-all duration-150 select-none cursor-pointer border border-black/10 dark:border-white/10"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-amber-500 shrink-0 hidden dark:block" />
              <Moon className="w-4 h-4 text-indigo-500 shrink-0 block dark:hidden" />
              <span className="font-medium text-black/80 dark:text-white/85">
                Appearance
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white dark:bg-dropdown text-black/75 dark:text-white/80 shadow-sm border border-black/10 dark:border-white/10">
              <span className="hidden dark:inline">Dark</span>
              <span className="inline dark:hidden">Light</span>
            </span>
          </button>

          {/* Logout Button if Authenticated */}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-light-logout-font dark:text-light-logout-font hover:bg-red-50 dark:hover:bg-white/5 active:scale-[0.99] transition-all duration-150 text-left select-none cursor-pointer border border-red-200/50 dark:border-red-900/40"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
