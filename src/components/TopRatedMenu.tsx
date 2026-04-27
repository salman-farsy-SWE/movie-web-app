import Link from "next/link";

const topRatedItems = [
  { label: "Top Rated Movies", slug: "movies" },
  { label: "Top Rated TV Shows", slug: "tv-shows" },
];

export function TopRatedMenu({ onItemClick }: { onItemClick?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                <span className="block xl:w-[37px] xl:h-[18px] lg:w-[31px] lg:h-[14px] md:w-[27px] md:h-[12px] bg-light-dropdown dark:bg-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></span>

                <div className="flex justify-center md:bg-light-dropdown bg-white dark:bg-dropdown xl:w-[217px] xl:h-[116px] lg:w-[200px] lg:h-[106px] w-[160px] h-[98px] -translate-y-[2px]  md:rounded-none rounded-[4px]">
                    <div className="flex flex-col w-full xl:mt-3 lg:mt-[10px] mt-[8px] xl:gap-[10px] lg:gap-[8px] gap-[5px]">
                        {topRatedItems.map((item, i) => (
                            <Link
                                key={i}
                                href={`/top-rated/${item.slug}`}
                                onClick={onItemClick}
                                className="relative flex items-center w-full xl:h-[40px] lg:h-[38px] h-[36px] xl:px-[22px] lg:px-[20px] px-[14px] xl:text-base lg:text-[14px] text-[12px] font-poppins font-normal text-left
                           md:hover:bg-light-dropdown-hover hover:bg-light-dropdown dark:hover:bg-dropdown-hover dark:text-white/85 dark:hover:text-white transition-colors duration-75
                           text-black/85 dark:hover:border-white hover:text-black"
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