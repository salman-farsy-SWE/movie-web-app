"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { GenresMenu } from "@/components/navbar/GenresMenu";
import { TrendingMenu } from "@/components/navbar/TrendingMenu";
import { TopRatedMenu } from "@/components/navbar/TopRatedMenu";
import { ProfileDropdown } from "@/components/navbar/ProfileDropdown";
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
  navLinks: NavLink[];
  user: NavUser | null;
}

export function MobileNavSheet({
  open,
  onOpenChange,
  navLinks,
  user,
}: MobileNavSheetProps) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    onOpenChange(false);
    await logout();
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[280px] sm:w-[320px] max-w-[85vw] p-0
  bg-white dark:bg-dropdown border-none

  data-[state=open]:animate-in data-[state=closed]:animate-out
  data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right
  duration-300 ease-in-out

  [&>button]:text-black dark:[&>button]:text-white
  sm:[&>button]:scale-125
  [&>button]:top-4 [&>button]:right-4
"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full py-4 sm:py-5">
          <div className="px-5 sm:px-6 pb-4 border-b border-black/10 dark:border-white/10">
            <SheetClose asChild>
              <Link
                href="/"
                className="inline-flex items-center font-poppins sm:text-[22px] text-[20px] font-bold tracking-tight leading-none select-none transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] outline-none"
              >
                <span className="text-black dark:text-white">Movie</span>
                <span className="text-trails-red dark:text-blue1 ml-1 sm:ml-1.5">Trails</span>
              </Link>
            </SheetClose>
          </div>

          <nav className="flex flex-col gap-4 sm:gap-5 px-5 sm:px-6 pt-5 sm:pt-6 font-medium text-black/75 dark:text-white/85 relative font-poppins text-base sm:text-lg">
            {user ? (
              <div className="relative group w-fit">
                <div
                  className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-black/40 dark:text-white/40" />
                  <UserAvatar
                    user={user}
                    sizeClassName="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px]"
                    textSizeClassName="text-[11px] sm:text-[12px]"
                  />
                  <span className="truncate">{user.name || user.username || "Profile"}</span>
                </div>

                <div className="absolute right-full -top-1 pr-2 sm:pr-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                  <ProfileDropdown user={user} onClose={() => onOpenChange(false)} showName={false} className="static top-auto right-auto" />
                </div>
              </div>
            ) : (
              <div className="sm:hidden flex items-center gap-2.5 pl-[24px] w-fit font-poppins text-sm font-medium">
                <SheetClose asChild>
                  <Link
                    href={
                      pathname && pathname !== "/login"
                        ? `/login?redirect=${encodeURIComponent(pathname)}`
                        : "/login"
                    }
                    scroll={false}
                    className={cn(
                      "text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-150 leading-none",
                      pathname === "/login" && "text-trails-red dark:text-blue1 font-semibold"
                    )}
                  >
                    Login
                  </Link>
                </SheetClose>
                <span className="h-3.5 w-[1px] bg-black/20 dark:bg-white/25 rounded-full" aria-hidden="true" />
                <a
                  href="https://www.themoviedb.org/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors duration-150 leading-none"
                >
                  Sign up
                </a>
              </div>
            )}
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.label === "Genres") {
                return (
                  <div key={link.label} className="relative group w-fit">
                    <div
                      className={cn(
                        "flex items-center gap-2 transition-colors duration-150 cursor-pointer",
                        active
                          ? "text-trails-red dark:text-blue1 font-semibold"
                          : "text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-black/40 dark:text-white/40" />
                      {link.label}
                    </div>

                    <div className="absolute right-full -top-1 pr-2 sm:pr-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <GenresMenu onItemClick={() => onOpenChange(false)} />
                    </div>
                  </div>
                );
              }

              if (link.label === "Trending") {
                return (
                  <div key={link.label} className="relative group w-fit">
                    <div
                      className={cn(
                        "flex items-center gap-2 transition-colors duration-150 cursor-pointer",
                        active
                          ? "text-trails-red dark:text-blue1 font-semibold"
                          : "text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-black/40 dark:text-white/40" />
                      {link.label}
                    </div>

                    <div className="absolute right-full -top-1 pr-2 sm:pr-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <TrendingMenu onItemClick={() => onOpenChange(false)} />
                    </div>
                  </div>
                );
              }

              if (link.label === "Top Rated") {
                return (
                  <div key={link.label} className="relative group w-fit">
                    <div
                      className={cn(
                        "flex items-center gap-2 transition-colors duration-150 cursor-pointer",
                        active
                          ? "text-trails-red dark:text-blue1 font-semibold"
                          : "text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-black/40 dark:text-white/40" />
                      {link.label}
                    </div>

                    <div className="absolute right-full -top-1 pr-2 sm:pr-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                      <TopRatedMenu onItemClick={() => onOpenChange(false)} />
                    </div>
                  </div>
                );
              }

              return (
                <SheetClose asChild key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      "pl-[24px] sm:pl-[26px] transition-colors duration-150 w-fit",
                      active
                        ? "text-trails-red dark:text-blue1 font-semibold"
                        : "text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              );
            })}

            {user && (
              <Button
                onClick={handleLogout}
                className="w-fit h-fit bg-transparent hover:bg-transparent rounded-none flex items-center gap-2 m-0 p-0 pl-[24px] sm:pl-[26px] mt-4 text-start text-sm sm:text-base text-light-logout-font/80 dark:text-light-logout-font/90 hover:text-light-logout-font dark:hover:text-light-logout-font transition-colors duration-150 cursor-pointer shadow-none"
              >
                <LogOut className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                Log out
              </Button>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
