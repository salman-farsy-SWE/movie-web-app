"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showTooltip?: boolean;
}

export function ThemeToggle({ className, showTooltip = true }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    const isDark = (resolvedTheme || theme) === "dark" || document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className={cn("relative group flex items-center justify-center", className)}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Toggle theme"
        className={cn(
          "relative inline-flex items-center justify-center rounded-full cursor-pointer select-none",
          "p-1.5 sm:p-2",
          "text-white/85 hover:text-white hover:bg-white/10 active:bg-white/20",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "transition-colors duration-150"
        )}
      >
        {/* In Dark mode: Sun icon (click to switch to light) */}
        <Sun className="xl:h-[21px] xl:w-[21px] lg:h-[19px] lg:w-[19px] sm:h-[18px] sm:w-[18px] h-[17px] w-[17px] stroke-[2] hidden dark:block transition-colors duration-150" />

        {/* In Light mode: Moon icon (click to switch to dark) */}
        <Moon className="xl:h-[21px] xl:w-[21px] lg:h-[19px] lg:w-[19px] sm:h-[18px] sm:w-[18px] h-[17px] w-[17px] stroke-[2] block dark:hidden transition-colors duration-150" />

        <span className="sr-only">Toggle theme</span>
      </button>

      {showTooltip && (
        <span
          role="tooltip"
          className={cn(
            "absolute top-full mt-2 left-1/2 -translate-x-1/2",
            "whitespace-nowrap rounded-[4px] bg-black/95 dark:bg-neutral-900/95 backdrop-blur-md",
            "border border-white/10 text-white font-poppins font-medium",
            "xl:text-[12px] lg:text-[11px] text-[10px] leading-tight",
            "px-2 py-1 shadow-lg shadow-black/40",
            "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
            "transition-opacity duration-150 z-50 pointer-events-none select-none"
          )}
        >
          <span className="hidden dark:inline">Light mode</span>
          <span className="inline dark:hidden">Dark mode</span>
        </span>
      )}
    </div>
  );
}
