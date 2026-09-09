import Image from "next/image";

import { HeroContent } from "@/data/mock-home";
import { GenreBadge } from "@/components/GenreBadge";
import { Rating } from "@/components/Rating";
import { HeroCarousel } from "./HeroCarousel";
import { TrailerDialog } from "./TrailerDialog";

export function HeroSection({
  heroContents
}: { heroContents: HeroContent[] }) {
  return (
    <section
      id="hero-section"
      className="relative w-full h-[500px] sm:h-[580px] md:h-[660px] lg:h-[740px] xl:h-[800px] overflow-hidden"
    >
      <HeroCarousel>
        {heroContents.map((data, index) => (
          <div key={index} className="min-w-full h-full relative group">
            <Image
              src={data.image}
              alt={data.title}
              fill
              priority={index === 0}
              quality={90}
              className="object-cover object-[center_20%] sm:object-center select-none pointer-events-none transition-transform duration-1000 ease-out"
              sizes="(max-width: 700px) 100vw, (max-width: 1060px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />

            {/* Standard subtle gradient for text readability while keeping the image bright */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent z-10 pointer-events-none" />

            <div className="font-inter absolute inset-0 z-20 flex flex-col justify-center text-white select-text xl:left-[190px] lg:left-[165px] md:left-[150px] sm:left-[130px] left-[70px] xl:max-w-[720px] lg:max-w-[600px] md:max-w-[500px] sm:max-w-[420px] max-w-[calc(100vw-140px)] xl:pt-[70px] lg:pt-[60px] md:pt-[50px] sm:pt-[40px] pt-[20px]">
              <h1 className="font-poppins font-bold xl:text-[48px] lg:text-[38px] md:text-[32px] sm:text-[28px] text-[24px] uppercase tracking-wide leading-[1.1] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6),0_4px_20px_rgba(0,0,0,0.3)] xl:mb-[16px] lg:mb-[14px] md:mb-[12px] sm:mb-[10px] mb-[8px]">
                {data.title}
              </h1>

              <p className="font-inter font-normal xl:text-[23px] lg:text-[20px] md:text-[18px] sm:text-[15px] text-[13px] xl:leading-[34px] lg:leading-[30px] md:leading-[27px] sm:leading-[22px] leading-[19px] text-hero-desc line-clamp-2 sm:line-clamp-3 xl:mb-[22px] lg:mb-[18px] md:mb-[16px] sm:mb-[14px] mb-[12px]">
                {data.description}
              </p>

              <div className="flex items-center flex-wrap xl:gap-[14px] lg:gap-[12px] md:gap-[10px] sm:gap-[8px] gap-[6px] xl:mb-[26px] lg:mb-[22px] md:mb-[18px] sm:mb-[16px] mb-[14px]">
                <Rating
                  value={data.rating}
                  className="gap-[6px]"
                  className1="xl:w-[24px] xl:h-[24px] lg:w-[22px] lg:h-[22px] md:w-[20px] md:h-[20px] sm:w-[17px] sm:h-[17px] w-[15px] h-[15px]"
                  className2="xl:text-[20px] lg:text-[18px] md:text-[16px] sm:text-[14px] text-[13px] font-semibold text-white"
                />
                <span className="xl:w-[5px] xl:h-[5px] lg:w-[4px] lg:h-[4px] w-[3px] h-[3px] rounded-full bg-white/70 flex-shrink-0" />
                <span className="font-inter font-medium xl:text-[20px] lg:text-[18px] md:text-[16px] sm:text-[14px] text-[13px] text-white">
                  {data.year}
                </span>
                <span className="xl:w-[5px] xl:h-[5px] lg:w-[4px] lg:h-[4px] w-[3px] h-[3px] rounded-full bg-white/70 flex-shrink-0" />
                <div className="flex items-center flex-wrap xl:gap-[10px] lg:gap-[8px] md:gap-[7px] sm:gap-[6px] gap-[4px]">
                  {data.genres.map((genre) => (
                    <GenreBadge
                      key={genre}
                      genre={genre}
                      className="bg-genre/50 border border-white/10"
                    />
                  ))}
                </div>
              </div>

              <TrailerDialog trailerKey={data.trailerKey} title={data.title} />
            </div>
          </div>
        ))}
      </HeroCarousel>
    </section>  
  );
}