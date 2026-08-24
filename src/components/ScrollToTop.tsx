"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Go Up"
      title="Go Up"
      className={cn(
        "group fixed xl:bottom-14 xl:right-14 lg:bottom-12 lg:right-12 md:bottom-11 md:right-6 sm:bottom-10 sm:right-5 bottom-9 right-3 z-40",
        "flex items-center justify-center",
        "xl:w-[68px] xl:h-[68px] lg:w-[64px] lg:h-[64px] md:w-[62px] md:h-[62px] sm:w-[58px] sm:h-[58px] w-[52px] h-[52px] rounded-full",
        "bg-black/60 dark:bg-zinc-800/80 text-white",
        "backdrop-blur-md border border-white/20 dark:border-white/10",
        "shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50",
        "hover:bg-light-nav dark:hover:bg-trails-red hover:border-transparent",
        "transition-all duration-300 ease-in-out cursor-pointer",
        "active:scale-90",
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      )}
    >
      <ChevronUp className="xl:w-[42px] xl:h-[42px] lg:w-[38px] lg:h-[38px] md:w-[36px] md:h-[36px] sm:w-[34px] sm:h-[34px] w-[30px] h-[30px] transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}

