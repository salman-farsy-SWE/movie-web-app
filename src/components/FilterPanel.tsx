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
          ? "filter-container opacity-100 scale-y-100 max-h-[2000px] max-w-[1440px] w-fit h-fit xl:px-[31px] lg:px-[29px] md:px-[27px] sm:px-[25px] px-[23px] xl:py-[31px] lg:py-[29px] md:py-[25px] sm:py-[23px] py-[21px] bg-light-dropdown dark:bg-dropdown xl:mt-[21px] lg:mt-[20px] md:mt-[18px] sm:mt-[12px] mt-[10px] xl:mb-[30px] lg:mb-[28px] md:mb-[26px] sm:mb-[22px] mb-[20px] flex flex-col items-center origin-top transition-all duration-300 ease-in-out overflow-hidden  will-change-transform"
          : "opacity-0 scale-y-95 max-h-0 pointer-events-none"
      )}
    >
      <div className=" flex flex-col xl:gap-[20px] lg:gap-[19px] gap-[13px]">
        <FilterSection title="Media">
          <RadioGroup
            defaultValue="All"
            className="xl:pl-[9px] lg:pl-[8px] sm:pl-[7px] pl-[6px] flex flex-wrap xl:gap-x-[13px] lg:gap-x-[12px] sm:gap-x-[11px] gap-x-[10px] lg:gap-y-[8px] sm:gap-y-[7px] gap-y-[6px]"
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
              <IoIosStar className="xl:w-[14px] xl:h-[14px] lg:w-[13px] lg:h-[13px] sm:w-[12px] sm:h-[12px] w-[11px] h-[11px]" />
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
        className="xl:w-[113px] xl:h-[37px] lg:w-[110px] lg:h-[35px] sm:w-[95px] sm:h-[33px] w-[85px] h-[31px] flex items-center justify-center font-inter md:font-medium font-normal lg:text-base sm:text-sm text-[12px] bg-black dark:bg-reset hover:bg-black/90 dark:hover:bg-reset/90 text-white hover:text-white/90 dark:text-dark dark:hover:text-dark/90 mt-[1px] xl:mr-[30px] lg:mr-[28px] md:mr-[20px] sm:mr-[16px] mr-[8px] self-end rounded-none transition-colors duration-75"
      >
        Reset
      </Button>
    </form>
  );
}