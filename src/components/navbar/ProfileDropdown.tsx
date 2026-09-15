"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, Bookmark, List, Star, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  user: {
    name: string;
    username?: string;
    image?: string;
    id?: number | string;
  };
  onClose?: () => void;
  className?: string;
  showName?: boolean;
}

export function ProfileDropdown({ user, onClose, className, showName = true }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const userSlug = user.id ? String(user.id) : (user.username || "");
  const displayName = user.name || user.username || "User";

  const handleLogout = async () => {
    onClose?.();
    await logout();
  };

  const navItems = [
    { label: "Profile", href: `/${userSlug}/profile`, Icon: User },
    { label: "Favorite", href: `/${userSlug}/favorite`, Icon: Heart },
    { label: "Watchlist", href: `/${userSlug}/watchlist`, Icon: Bookmark },
    { label: "My List", href: `/${userSlug}/list`, Icon: List },
    { label: "My Rating", href: `/${userSlug}/rating`, Icon: Star },
  ];

  return (
    <div
      className={cn(
        "absolute top-[calc(100%+10px)] right-0 z-50",
        "w-[180px] sm:w-[190px] xl:w-[200px]",
        "rounded-xl select-none overflow-hidden p-1.5",
        "bg-white dark:bg-dropdown md:bg-light-dropdown md:dark:bg-dropdown",
        "border border-black/10 dark:border-white/10",
        "shadow-lg drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]",
        "animate-in fade-in-0 zoom-in-95 duration-150",
        className
      )}
    >
      {/* Simple Username Header */}
      {showName && (
        <>
          <div className="px-3 py-2 text-center text-xs sm:text-sm font-medium font-inter text-black/75 dark:text-profile-dropdown-username truncate">
            {displayName}
          </div>

          <div className="h-[1px] my-1 bg-dropdown-underline/25 dark:bg-white/10" />
        </>
      )}

      {/* Navigation Items */}
      <div className="flex flex-col gap-0.5 font-poppins text-xs sm:text-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors duration-150",
                isActive
                  ? "bg-black/10 dark:bg-white/15 text-black dark:text-white"
                  : "text-black/75 hover:text-black dark:text-white/85 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              <item.Icon
                size={15}
                className={cn(
                  "mr-2.5 shrink-0",
                  isActive
                    ? "text-black dark:text-white"
                    : "text-black/70 dark:text-white/75"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="h-[1px] my-1 bg-dropdown-underline/25 dark:bg-white/10" />

      {/* Simple Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          "flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors duration-150 cursor-pointer",
          "text-light-logout-font/85 hover:text-light-logout-font dark:text-red-400 dark:hover:text-red-300",
          "hover:bg-black/5 dark:hover:bg-white/10",
          "font-medium font-poppins text-xs sm:text-sm"
        )}
      >
        <LogOut
          size={15}
          className="mr-2.5 shrink-0 text-light-logout-font/85 hover:text-light-logout-font dark:text-red-400"
        />
        <span className="truncate">Log out</span>
      </button>
    </div>
  );
}