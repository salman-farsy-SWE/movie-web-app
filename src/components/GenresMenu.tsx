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

                <span className="md:block hidden xl:w-[37px] xl:h-[18px] lg:w-[31px] lg:h-[14px] sm:w-[27px] sm:h-[12px] bg-light-dropdown dark:bg-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)] translate-x-[25px]"></span>

                <div className="flex justify-center md:bg-light-dropdown bg-white dark:bg-dropdown xl:w-[440px] xl:h-[318px] lg:w-[400px] lg:h-[290px] md:w-[370px] md:h-[230px] sm:w-[370px] sm:h-[250px] w-[350px] h-[235px] lg:rounded-md rounded-[4px] -translate-y-[2px]">
                    <div className="grid grid-cols-3 w-full xl:px-5 lg:px-7 sm:px-[20px] px-[18px] lg:gap-y-[22px] sm:gap-y-[13px] gap-y-[17px] xl:gap-x-20 lg:gap-x-[75px] sm:gap-x-[70px] gap-x-[70px] h-fit xl:mt-4 lg:mt-[18px] sm:mt-[14px] mt-[16px]">

                        {genres.map((genre, i) => (
                            <Link
                                key={i}
                                href={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={onItemClick}
                                className="text-black/85 dark:text-white/85 dark:hover:text-white hover:text-black xl:text-base lg:text-[14px] text-[12px] font-poppins font-normal text-left w-fit border-b-[1px] border-transparent lg:pb-[2px] pb-[1px] hover:border-black dark:hover:border-white transition-[border-color, color] duration-75"
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