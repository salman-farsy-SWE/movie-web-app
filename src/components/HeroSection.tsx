"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { HeroContent } from "@/data/mock-home";
import { GenreBadge } from "./GenreBadge";
import { Rating } from "./Rating";

export function HeroSection({
  heroContents
}: { heroContents: HeroContent[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <section id="hero-section" className="relative w-screen xl:min-h-[700px] lg:min-h-[650px] md:min-h-[550px] sm:min-h-[450px] min-h-[350px]">
      <div ref={emblaRef} className="absolute inset-0 h-full">
        <div className="flex h-full">
          {heroContents.map((data, index) => (
            <div key={index} className="min-w-full relative">
              <Image
                src={data.image}
                alt={data.title}
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="100vw"
              />

              <div className="mix-blend-luminosity absolute inset-0 w-full h-full bg-hero-shadow z-10 opacity-40" />

              <div className="font-inter absolute w-full h-full z-20 text-white select-text xl:left-[220px] xl:top-[320px] lg:left-[190px] lg:top-[295px] md:left-[165px] md:top-[235px] sm:left-[130px] sm:top-[197px] left-[100px] top-[150px]">
                <h1 className="xl:mb-[14px] lg:mb-[8px] md:mb-[6px] mb-1 xl:text-[50px] lg:text-[46px] md:text-4xl sm:text-[26px] text-[22px] lg:font-semibold sm:font-medium leading-none">
                  {data.title}
                </h1>

                <p className="xl:mb-[18px] md:mb-[12px] sm:mb-[10px] mb-2 lg:w-3/5 md:w-3/4 w-4/6 xl:text-[25px] lg:text-[23px] md:text-[22px] sm:text-[19px] text-[14px] lg:font-medium lg:leading-[1.40] leading-[1.25] text-hero-desc">
                  {data.description}
                </p>

                <div className="xl:mb-5 md:mb-4 sm:mb-[14px] mb-3 flex items-center xl:gap-[12px] lg:gap-[10px] md:gap-[8px] gap-[6px] mt-1 xl:text-xl lg:text-lg md:text-base sm:text-[14px] text-[13px] lg:font-medium font-normal text-white">
                  <Rating value={7} className="lg:gap-[6px] md:gap-[5px] gap-[3px]" className1="xl:h-6 xl:w-6 lg:h-[20px] lg:w-[20px] md:h-[18px] md:w-[18px] sm:h-[16px] sm:w-[16px] h-[13px] w-[13px]" />
                  <span className="lg:h-[6px] lg:w-[6px] md:h-[5px] md:w-[5px] h-[4px] w-[4px] rounded-full bg-white" />
                  <span>{data.year}</span>
                  <div className="flex items-center justify-center xl:ml-[18px] lg:ml-4 md:ml-[12px] sm:ml-[10px] ml-[8px] lg:gap-[9px] md:gap-2 gap-[6px]">
                    {data.genres.map((genre) => (
                      <GenreBadge key={genre} genre={genre} className="bg-genre/50" />
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  className="xl:w-[157px] xl:h-12 lg:w-[150px] lg:h-[44px] md:w-[140px] md:h-[40px] sm:w-[120px] sm:h-[35px] w-[100px] h-[30px] lg:rounded-[5px] md:rounded-[3px] rounded-[1px] hover:bg-hero-trailer bg-hero-trailer/85 font-poppins xl:text-lg lg:text-[17px] md:text-base sm:text-[14px] text-[12px] lg:font-semibold sm:font-medium"
                >
                  Watch Trailer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute w-full h-full flex items-center justify-between text-white/50 z-20 pointer-events-none">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous"
          onClick={() => emblaApi?.scrollPrev()}
          className="pointer-events-auto relative xl:left-[60px] lg:left-[50px] md:left-[44px] sm:left-[36px] left-[30px] xl:h-[100px] xl:w-20 lg:h-[96px] lg:w-[76px] md:h-[92px] md:w-[72px] sm:h-[80px] sm:w-[64px] h-[56px] w-[44px] lg:rounded-[5px] md:rounded-[3px] rounded-sm bg-nav-carousal/25 hover:bg-nav-carousal/55 hover:text-white hover:shadow-[-2px_0_5px_rgba(0,0,0,0.10),0_-2px_5px_rgba(0,0,0,0.10),0_2px_5px_rgba(0,0,0,0.10)] transition-all duration-100 ease-in p-0 flex items-center justify-center"
        >
          <ChevronLeft className="xl:w-20 xl:h-20 lg:w-[78px] lg:h-[78px] md:w-[76px] md:h-[76px] sm:w-[72px] sm:h-[72px] w-[68px]
h-[68px] xl:[stroke-width:2] lg:[stroke-width:1.8] md:[stroke-width:1.5] [stroke-width:1]" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next"
          onClick={() => emblaApi?.scrollNext()}
          className="pointer-events-auto relative xl:right-[60px] lg:right-[50px] md:right-[44px] sm:right-[36px] right-[30px] xl:h-[100px] xl:w-20 lg:h-[96px] lg:w-[76px] md:h-[92px] md:w-[72px] sm:h-[80px] sm:w-[64px] h-[56px] w-[44px] lg:rounded-[5px] md:rounded-[3px] rounded-sm bg-nav-carousal/25 hover:bg-nav-carousal/55 hover:text-white hover:shadow-[-2px_0_5px_rgba(0,0,0,0.10),0_-2px_5px_rgba(0,0,0,0.10),0_2px_5px_rgba(0,0,0,0.10)] transition-all duration-100 ease-in p-0 flex items-center justify-center"
        >
          <ChevronRight className="xl:w-20 xl:h-20 lg:w-[78px] lg:h-[78px] md:w-[76px] md:h-[76px] sm:w-[72px] sm:h-[72px] w-[68px] h-[68px] xl:[stroke-width:2] lg:[stroke-width:1.8] md:[stroke-width:1.5] [stroke-width:1]" />
        </Button>
      </div>
    </section>  
  );
}