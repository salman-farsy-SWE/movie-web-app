import Link from "next/link";

const footerLinks = ["Home", "Movies", "TV Shows", "Trending", "Top Rated"];

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center container-1440 xl:mt-[80px] lg:mt-[65px] md:mt-[58px] sm:mt-[50px] mt-[38px] lg:mb-[12px] sm:mb-[10px] mb-[8px]">
        <div className="flex flex-wrap items-center justify-center w-fit xl:gap-[12px] lg:gap-[10px] md:gap-[8px] gap-[6px] xl:text-base lg:text-[15px] md:text-sm sm:text-[13px] text-xs font-poppins font-medium text-black/85 dark:text-white/95 md:border-b-2 border-b-[1px] border-black dark:border-white xl:pb-[10px] lg:pb-[8px] md:pb-[6px] sm:pb-[5px] pb-[4px]">
          {footerLinks.map((label, index) => (
            <div key={label} className="flex items-center xl:gap-[12px] lg:gap-[10px] md:gap-[8px] gap-[6px]">
              <Link href="#" className="leading-none hover:text-black dark:hover:text-white">
                {label}
              </Link>
              {index < footerLinks.length - 1 && (
                <span className="md:h-[5px] md:w-[5px] sm:h-[4px] sm:w-[4px] h-[3px] w-[3px] rounded-full bg-light-footer-circle dark:bg-footer-circle" />
              )}
            </div>
          ))}
        </div>
        <p className="xl:mt-[8px] lg:mt-[6px] md:mt-[4px] sm:mt-[3px] mt-[2px] text-center font-inter md:text-sm sm:text-[12px] text-[11px] font-normal text-light-footer-rights dark:text-footer-rights">
          {"\u00A9 2026 Movie Trails. All rights reserved."}
        </p>
    </footer>
  );
}
