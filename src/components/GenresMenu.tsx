import Link from "next/link";

const genres = [
    "Action", "Drama", "Mystery",
    "Adventure", "Family", "Romance",
    "Animation", "Fantasy", "Sci-Fi",
    "Comedy", "History", "Thriller",
    "Crime", "Horror", "War",
    "Documentary", "Music", "Western",
];

export function GenresMenu() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">

                <span className="block w-[37px] h-[18px] bg-light-dropdown [clip-path:polygon(50%_0%,0%_100%,100%_100%)] translate-x-[25px]"></span>

                <div className="flex justify-center bg-light-dropdown w-[440px] h-[318px] rounded-md -translate-y-[2px]">
                    <div className="grid grid-cols-3 w-full px-5 gap-y-[22px] gap-x-20   h-fit mt-4">

                        {genres.map((genre, i) => (
                            <Link
                                key={i}
                                href={"#"}
                                className="text-black/85 hover:text-black text-base font-poppins font-medium text-left w-fit border-b-2 border-transparent pb-[2px] hover:border-black transition-[border-color, color] duration-75"
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