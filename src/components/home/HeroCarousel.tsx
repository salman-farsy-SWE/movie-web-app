"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroCarousel({ children }: { children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <div className="relative w-full h-full group/hero">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">{children}</div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 z-30">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous slide"
          onClick={() => emblaApi?.scrollPrev()}
          className="pointer-events-auto h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-13 lg:w-13 xl:h-14 xl:w-14 rounded-full bg-black/40 hover:bg-black/65 active:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-sm shadow-md transition-colors duration-200 p-0 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <ChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 stroke-[2]" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next slide"
          onClick={() => emblaApi?.scrollNext()}
          className="pointer-events-auto h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-13 lg:w-13 xl:h-14 xl:w-14 rounded-full bg-black/40 hover:bg-black/65 active:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-sm shadow-md transition-colors duration-200 p-0 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <ChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 stroke-[2]" />
        </Button>
      </div>
    </div>
  );
}

