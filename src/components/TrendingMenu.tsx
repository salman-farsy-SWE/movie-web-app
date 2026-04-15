import Link from "next/link";

const trendingItems = [
    "Trending Today",
    "Trending This Week",
    "Trending Movies",
    "Trending TV Shows",
    "Trending Persons",
];

export function TrendingMenu() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                <span className="block w-[37px] h-[18px] bg-light-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></span>

                <div className="flex justify-center bg-light-dropdown w-[217px] h-[271px] -translate-y-[2px]">
                    <div className="flex flex-col w-full mt-3 gap-[15px]">
                        {trendingItems.map((item, i) => (
                            <Link
                                key={i}
                                href="#"
                                className="relative flex items-center w-full h-[36px] px-[22px] text-base font-poppins font-medium text-left
                           hover:bg-light-dropdown-hover transition-colors duration-75
                           text-black/85 hover:text-black"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}