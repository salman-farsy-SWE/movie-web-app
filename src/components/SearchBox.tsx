import { Search } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";

export function SearchBox() {
  return (
    <section className="xl:w-[1289px] lg:w-[1060px] md:w-[880px] w-[100vw] h-fit xl:pb-6 lg:pb-5 md:pb-4 sm:pb-2 pb-3 flex flex-col items-center lg:rounded-[9px] md:rounded-[7px] bg-white dark:bg-search-box overflow-x-auto">
      <div className="relative xl:w-[1214px] lg:w-[990px] md:w-[820px] w-[90vw] h-fit border-b-2 border-black/75 dark:border-white/75 xl:mt-[66px] lg:mt-[60px] md:mt-[50px] mt-[45px] flex items-center justify-center">
        <div className="absolute xl:-top-[24px] lg:-top-[22px] md:-top-[18px] -top-[16px] w-full h-full flex items-center justify-between">
          <Input autoFocus placeholder="Search" className="xl:text-[22px] lg:text-[20px] md:text-lg text-base font-normal font-inter text-black dark:text-white tracking-wide placeholder:text-light-search-font bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none" />
          <Search className="xl:h-8 xl:w-8 lg:h-7 lg:w-7 md:h-6 md:w-6 h-5 w-5 text-black/75 dark:text-white/75 mr-[14px]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="relative xl:w-[1214px] xl:h-[300px] lg:w-[990px] lg:h-[265px] md:w-[820px] md:h-[230px] sm:w-[760px] sm:h-[220px] w-[590px] h-[180px] overflow-y-auto xl:px-3 sm:px-5 px-3 xl:pt-[14px] lg:pt-[14px] sm:pt-[12px] pt-[8px] xl:pb-11 lg:pb-2 sm:pb-3 pb-2 custom-scrollbar">
        <div className="grid grid-cols-3 xl:gap-x-10 xl:gap-y-6 lg:gap-x-8 lg:gap-y-4 md:gap-x-6 md:gap-y-3 sm:gap-x-8 sm:gap-y-4 gap-x-4 gap-y-[10px] w-full">

          {[...Array(21)].map((_, i) => (
            <div key={i} className="flex items-start xl:gap-3 lg:gap-[10px] md:gap-[8px] gap-[6px]">
              <div className="relative xl:w-[54px] xl:h-[75px] lg:w-[49px] lg:h-[70px] md:w-[45px] md:h-[63px] sm:w-[40px] sm:h-[55px] w-[36px] h-[51px]">
                <Image
                  src="/assets/card-sand.jpg"
                  alt="Search Box Image"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col font-inter lg:mt-[2px] md:mt-[4px] sm:mt-[2px] mt-[3px]">
                <h2 className="xl:text-lg lg:text-base sm:text-[13px] text-[10px] text-black dark:text-white">
                  Avengers Endgame (2010)
                </h2>
                <p className="xl:text-base lg:text-sm sm:text-xs text-[10px] text-light-search-genres-font dark:text-search-genres-font">
                  Horror/Fantasy
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
