import { RowCarousel } from "@/components/home/RowCarousel";
import { PersonCard, type Person } from "@/components/media/PersonCard";

const persons: Person[] = [
    { id: "1", name: "John Doe", role: "Actor", image: "/assets/movie-placeholder.jpg" },
    { id: "2", name: "Jane Smith", role: "Director", image: "/assets/movie-placeholder.jpg" },
    { id: "3", name: "Michael Lee", role: "Producer", image: "/assets/movie-placeholder.jpg" },
    { id: "4", name: "Emma Brown", role: "Actress", image: "/assets/movie-placeholder.jpg" },
    { id: "5", name: "David Kim", role: "Writer", image: "/assets/movie-placeholder.jpg" },
    { id: "6", name: "Sophia Wilson", role: "Cinematographer", image: "/assets/movie-placeholder.jpg" },
];

export function PeopleYouMayKnow({
    title,
    items,
}: {
    title: string;
    items?: Person[];
}) {
    const displayPersons = items && items.length > 0 ? items : persons;

    return (
        <div className="xl:mt-[48px] lg:mt-[42px] md:mt-[38px] sm:mt-[32px] mt-[28px] xl:px-0 lg:px-5 md:px-7 px-9">
            <h2 className="font-akshar font-medium xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[25px] text-[23px] text-black dark:text-white">
                {title}
            </h2>

            <RowCarousel
                gapClassName="xl:gap-[96px] lg:gap-[86px] md:gap-[76px] sm:gap-[66px] gap-[56px]"
                controlsClassName="xl:top-[49px] lg:top-[44px] md:top-[43px] sm:top-[39px] top-[40px]"
                scrollStep={2}
            >
                {displayPersons.map((p, i) => (
                    <PersonCard
                        key={`${p.id}-${i}`}
                        person={p}
                        basePath="/trending/persons"
                        variant="carousel"
                    />
                ))}
            </RowCarousel>
        </div>
    );
}