import Link from "next/link";

const genres = [
  "Action", "Drama", "Mystery",
  "Adventure", "Family", "Reality",
  "Animation", "Fantasy", "Romance",
  "Comedy", "History", "Sci-Fi",
  "Crime", "Horror", "Thriller",
  "Documentary", "Kids", "War",
  "Music", "News", "Western",
];

export function GenresMenu({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center pt-2">
      <div className="flex flex-col items-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_10px_28px_rgba(0,0,0,0.85)]">
        <span className="md:block hidden w-4 h-2.5 bg-white dark:bg-dropdown md:bg-light-dropdown md:dark:bg-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></span>

        <div className="flex justify-center bg-white dark:bg-dropdown md:bg-light-dropdown md:dark:bg-dropdown xl:w-[480px] lg:w-[430px] md:w-[380px] sm:w-[420px] w-[320px] rounded-xl border border-black/10 dark:border-white/10 -translate-y-[1px] p-3.5 lg:p-4.5">
          <div className="grid grid-cols-3 w-full gap-x-2 sm:gap-x-3 lg:gap-x-4 gap-y-1 sm:gap-y-1.5 lg:gap-y-2">
            {genres.map((genre, i) => (
              <Link
                key={i}
                href={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={onItemClick}
                className="text-black/75 dark:text-white/85 hover:text-black dark:hover:text-white xl:text-[15px] lg:text-sm md:text-xs text-sm font-poppins font-normal text-left px-2.5 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-150 truncate"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}