import { HeroSection } from "@/components/HeroSection";
import { HomeSection } from "@/components/HomeSection";
import { heroContents, movieSections } from "@/data/mock-home";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection {... {heroContents} } />

        <div className="container-1440 flex flex-col lg:gap-[50px] md:gap-[46px] sm:gap-[42px] gap-[36px] lg:mt-[40px] md:mt-[36px] sm:mt-[32px] mt-[28px]">
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
