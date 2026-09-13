import { PersonCard } from "@/components/media/PersonCard";
import { PersonsGridSkeleton } from "@/components/skeletons/PersonsGridSkeleton";
import type { Person } from "@/types";

interface PersonsGridProps {
  basePath?: string;
  items?: Person[];
  searchQuery?: string;
  isLoading?: boolean;
}

const fallbackPersons: Person[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Actor/Director",
    image: "/assets/movie-placeholder.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Director/Producer",
    image: "/assets/movie-placeholder.jpg",
  },
  {
    id: "3",
    name: "Michael Lee",
    role: "Producer/Writer",
    image: "/assets/movie-placeholder.jpg",
  },
  {
    id: "4",
    name: "Emma Brown",
    role: "Actress/Producer",
    image: "/assets/movie-placeholder.jpg",
  },
  {
    id: "5",
    name: "David Kim",
    role: "Writer/Producer",
    image: "/assets/movie-placeholder.jpg",
  },
  {
    id: "6",
    name: "Sophia Wilson",
    role: "Cinematographer/Producer",
    image: "/assets/movie-placeholder.jpg",
  },
];

export function PersonsGrid({
  basePath,
  items,
  searchQuery,
  isLoading = false,
}: PersonsGridProps) {
  if (isLoading) {
    return <PersonsGridSkeleton count={18} />;
  }

  if (searchQuery) {
    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[320px] text-center px-4 xl:mt-[40px] md:mt-[35px] mt-[30px]">
          <p className="font-akshar text-[22px] md:text-[24px] text-black/80 dark:text-white/80">
            No persons found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="font-inter text-[14px] text-black/50 dark:text-white/50 mt-1.5">
            Try searching with a different name or keyword.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[1440px] grid justify-items-center justify-center place-items-center xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:gap-x-[96px] lg:gap-x-[86px] md:gap-x-[70px] sm:gap-x-[60px] gap-x-[30px] lg:gap-y-[60px] md:gap-y-[50px] sm:gap-y-[35px] gap-y-[30px] xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] xl:px-0 lg:px-2 px-1">
          {items.map((person) => (
            <PersonCard basePath={basePath} key={person.id} person={person} />
          ))}
        </div>
      </div>
    );
  }

  const list = items && items.length > 0 ? items : fallbackPersons;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full grid justify-items-center justify-center place-items-center xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 xl:gap-x-[96px] lg:gap-x-[86px] md:gap-x-[70px] sm:gap-x-[60px] gap-x-[30px] lg:gap-y-[60px] md:gap-y-[50px] sm:gap-y-[35px] gap-y-[30px] xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] xl:px-0 lg:px-2 px-1">
        {list.map((person) => (
          <PersonCard basePath={basePath} key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}
