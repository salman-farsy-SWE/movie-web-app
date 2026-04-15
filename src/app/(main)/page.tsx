import { HeroSection } from "@/components/HeroSection";
import { HomeSection } from "@/components/HomeSection";
import { heroContents, movieSections } from "@/data/mock-home";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection {... {heroContents} } />

        <div className="container-1440 flex flex-col md:gap-[32px] sm:gap-[28px] gap-[26px] md:mt-[32px] sm:mt-[28px] mt-[26px]">
          {movieSections.map((section) => (
            <HomeSection
              key={section.id}
              id={section.id}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
    </main>
  );
}
