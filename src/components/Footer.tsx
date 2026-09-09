import React from "react";
import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv-shows" },
  { label: "Genres", href: "/genres" },
  { label: "Trending", href: "/trending" },
  { label: "Top Rated", href: "/top-rated" },
];

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center container-1440 xl:mt-[80px] lg:mt-[70px] md:mt-[60px] sm:mt-[50px] mt-[40px] xl:mb-[40px] lg:mb-[35px] md:mb-[30px] sm:mb-[25px] mb-[20px]">
        <div className="flex flex-wrap items-center justify-center w-fit xl:gap-[18px] lg:gap-[16px] md:gap-[14px] sm:gap-[12px] gap-[10px] lg:text-base md:text-[15px] sm:text-sm text-[13px] font-poppins md:font-medium font-normal text-black/75 dark:text-white/85 md:border-b-2 border-b-[1px] border-black dark:border-white/85 xl:pb-[12px] md:pb-[10px] pb-[8px]">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.label}>
              <Link href={link.href} className="leading-none hover:text-black dark:hover:text-white">
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <span className="shrink-0 md:h-[5px] md:w-[5px] sm:h-[4px] sm:w-[4px] h-[3px] w-[3px] rounded-full bg-light-footer-circle dark:bg-footer-circle" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="lg:mt-[10px] md:mt-[9px] sm:mt-[7px] mt-[6px] text-center font-inter xl:text-[15px] lg:text-sm md:text-[13px] sm:text-[12px] text-[11px] font-normal text-light-footer-rights dark:text-footer-rights">
          {"\u00A9 2026 Movie Trails. All Rights Reserved."}
        </p>
    </footer>
  );
}
