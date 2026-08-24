import Link from "next/link";

const topRatedItems = [
  { label: "Top Rated Movies", slug: "movies" },
  { label: "Top Rated TV Shows", slug: "tv-shows" },
];

export function TopRatedMenu({ onItemClick }: { onItemClick?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                <span className="block xl:w-[37px] xl:h-[20px] lg:w-[31px] lg:h-[16px] md:w-[27px] md:h-[14px] bg-light-dropdown dark:bg-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></span>

                <div className="flex justify-center md:bg-light-dropdown bg-white dark:bg-dropdown xl:w-[240px] lg:w-[210px] md:w-[180px] sm:w-[230px] w-[210px] md:rounded-none sm:rounded rounded-[3px] -translate-y-[2px] ">
                    <div className="flex flex-col w-full">
                        {topRatedItems.map((item, i) => (
                            <Link
                                key={i}
                                href={`/top-rated/${item.slug}`}
                                onClick={onItemClick}
                                className="relative flex items-center w-full xl:h-[40px] lg:h-[38px] md:h-[36px] sm:h-[33px] h-[31px] xl:px-[22px] lg:px-[20px] md:px-[16px] sm:px-[22px] px-[20px] xl:py-[28px] lg:py-[24px] md:py-[20px] sm:py-[22px] py-[20px] xl:text-lg lg:text-base md:text-sm sm:text-lg text-base font-poppins font-normal text-left
                           md:hover:bg-light-dropdown-hover hover:bg-light-dropdown dark:hover:bg-dropdown-hover dark:text-white/85 dark:hover:text-white transition-colors duration-75
                           text-black/75 dark:hover:border-white hover:text-black"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}