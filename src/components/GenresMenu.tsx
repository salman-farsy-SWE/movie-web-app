import Link from "next/link";

const genres = [
    "Action", "Drama", "Mystery",
    "Adventure", "Family", "Romance",
    "Animation", "Fantasy", "Sci-Fi",
    "Comedy", "History", "Thriller",
    "Crime", "Horror", "War",
    "Documentary", "Music", "Western",
];

export function GenresMenu({ onItemClick }: { onItemClick?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">

                <span className="md:block hidden xl:w-[37px] xl:h-[20px] lg:w-[31px] lg:h-[16px] sm:w-[27px] sm:h-[14px] bg-light-dropdown dark:bg-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)] translate-x-[25px]"></span>

                <div className="flex justify-center md:bg-light-dropdown bg-white dark:bg-dropdown xl:w-[520px] xl:h-[330px] lg:w-[440px] lg:h-[290px] md:w-[400px] md:h-[250px] sm:w-[460px] sm:h-[300px] w-[420px] h-[270px] lg:rounded-md rounded -translate-y-[2px]">
                    <div className="grid grid-cols-3 w-full lg:px-7 md:px-[22px] sm:px-[28px] px-[26px] lg:pt-1 sm:pt-[2px]  xl:gap-y-[20px] lg:gap-y-[18px] md:gap-y-[16px] sm:gap-y-[17px] gap-y-[15px] xl:gap-x-24 lg:gap-x-[73px] md:gap-x-[72px] sm:gap-x-[68px] gap-x-[70px] h-fit lg:mt-[20px] md:mt-[16px] sm:mt-[14px] mt-[18px]">

                        {genres.map((genre, i) => (
                            <Link
                                key={i}
                                href={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={onItemClick}
                                className="text-black/75 dark:text-white/85 dark:hover:text-white hover:text-black xl:text-lg lg:text-base md:text-sm sm:text-lg text-base font-poppins font-normal text-left w-fit border-b-[1px] border-transparent pb-[1px] hover:border-black dark:hover:border-white transition-[border-color, color] duration-75"
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