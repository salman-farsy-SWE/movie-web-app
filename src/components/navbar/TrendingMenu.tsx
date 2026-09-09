import Link from "next/link";

const trendingItems = [
  { label: "Trending Today", slug: "today" },
  { label: "Trending This Week", slug: "this-week" },
  { label: "Trending Movies", slug: "movies" },
  { label: "Trending TV Shows", slug: "tv-shows" },
  { label: "Trending Persons", slug: "persons" },
];

export function TrendingMenu({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center pt-2">
      <div className="flex flex-col items-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]">
        <span className="md:block hidden w-4 h-2.5 bg-white dark:bg-dropdown md:bg-light-dropdown md:dark:bg-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></span>

        <div className="flex justify-center bg-white dark:bg-dropdown md:bg-light-dropdown md:dark:bg-dropdown xl:w-[220px] lg:w-[200px] md:w-[185px] sm:w-[210px] w-[190px] rounded-xl border border-black/10 dark:border-white/10 -translate-y-[1px] p-1.5 sm:p-2">
          <div className="flex flex-col w-full">
            {trendingItems.map((item, i) => (
              <Link
                key={i}
                href={`/trending/${item.slug}`}
                onClick={onItemClick}
                className="relative flex items-center w-full px-3 py-2 sm:py-2.5 rounded-lg xl:text-[15px] lg:text-sm md:text-xs text-sm font-poppins font-normal text-left text-black/75 dark:text-white/85 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-150"
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