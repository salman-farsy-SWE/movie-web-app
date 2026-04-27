"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilterSection } from "@/components/FilterSection";
import { YearFilter } from "@/components/YearFilter";
import { CheckboxItem } from "@/components/CheckboxItem";
import { IoIosStar } from "react-icons/io";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/RadioItem";

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Adventure", "Comedyy", "Dramaa", "Horrorr", "Sci-Fii", "Romancee", "Adventuree", "Comedyyy", "Dramaaa", "Horrorrr", "Sci-Fiii", "Romanceee"];
const countries = ["USA", "UK", "India", "South Korea", "Japan", "France"];
const languages = ["English", "Spanish", "Hindi", "Korean", "Japanese", "French", "Englishh", "Spanishh", "Hindii", "Koreann", "Japanesee", "Frenchh", "Englishhh", "Spanishhh", "Hin", "Koreannn", "Japaneseee", "Frenchhh"];
const ratings = ["3", "4", "5", "6", "7", "8", "9"];
const durations = ["0-60", "60-90", "90-120", "120-150", "150+"];

export function FilterPanel({ open }: { open: boolean }) {
  return (
    <form
      className={cn(
        open
          ? "filter-container opacity-100 scale-y-100 max-h-[2000px] w-[1440px] h-fit pb-[31px] bg-light-dropdown mt-[21px] mb-[30px] flex flex-col origin-top transition-all duration-300 ease-in-out overflow-hidden will-change-transform"
          : "opacity-0 scale-y-95 max-h-0 pointer-events-none"
      )}
    >
      <div className="px-[31px] pt-[31px] flex flex-col gap-[20px]">
        <FilterSection title="Media">
          <RadioGroup
            defaultValue="All"
            className="pl-[9px] flex flex-wrap gap-x-[13px] gap-y-[7px]"
          >
            <RadioItem id="media-all" value="All" label="All" />
            <RadioItem id="media-movies" value="Movies only" label="Movies only" />
            <RadioItem id="media-tv" value="TV shows only" label="TV shows only" />
          </RadioGroup>
        </FilterSection>
        <FilterSection title="Genre" items={genres} />
        <FilterSection title="Country" items={countries} />
        <FilterSection title="Language" items={languages} />

        <YearFilter />

        <FilterSection
          title="Rating"
          items={ratings}
          renderItem={(item) => (
            <CheckboxItem key={item} id={`rating-${item}`}>
              <IoIosStar className="w-[14px] h-[14px]" />
              {item}+
            </CheckboxItem>
          )}
        />

        <FilterSection
          title="Duration"
          items={durations}
          renderItem={(item) => (
            <CheckboxItem
              key={item}
              id={`duration-${item}`}
              label={`${item} min`}
            />
          )}
        />
      </div>

      <Button
        type="reset"
        className="w-[113px] h-[37px] bg-black text-white mt-[1px] mr-[30px] self-end rounded-none"
      >
        Reset
      </Button>
    </form>
  );
}