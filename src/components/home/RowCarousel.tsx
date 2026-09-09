"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useSyncExternalStore } from "react";
import { SectionControls } from "@/components/SectionControls";

import { cn } from "@/lib/utils";

interface RowCarouselProps {
  children: React.ReactNode;
  className?: string;
  gapClassName?: string;
  controlsClassName?: string;
  scrollStep?: number;
}

export function RowCarousel({
  children,
  className,
  gapClassName = "xl:gap-[15px] sm:gap-[13px] gap-[11px]",
  controlsClassName = "xl:top-[49px] lg:top-[43px] md:top-[45px] sm:top-[43px] top-[33px]",
  scrollStep = 3,
}: RowCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!emblaApi) return () => {};

      emblaApi.on("select", callback);
      emblaApi.on("reInit", callback);

      return () => {
        emblaApi.off("select", callback);
        emblaApi.off("reInit", callback);
      };
    },
    [emblaApi]
  );

  const canScrollLeft = useSyncExternalStore(
    subscribe,
    () => (emblaApi ? emblaApi.canScrollPrev() : false),
    () => false
  );

  const canScrollRight = useSyncExternalStore(
    subscribe,
    () => (emblaApi ? emblaApi.canScrollNext() : false),
    () => false
  );

  return (
    <div
      className={cn(
        "relative xl:mt-[15px] lg:mt-[14px] md:mt-[13px] sm:mt-[12px] mt-[10px]",
        className
      )}
    >
      <div ref={emblaRef} className="overflow-hidden active:cursor-grabbing">
        <div className={cn("flex", gapClassName)}>{children}</div>
      </div>

      <SectionControls
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        onRight={() => {
          if (!emblaApi) return;

          const snaps = emblaApi.scrollSnapList();
          const currentIndex = emblaApi.selectedScrollSnap();

          const nextIndex = Math.min(currentIndex + scrollStep, snaps.length - 1);
          emblaApi.scrollTo(nextIndex);
        }}
        onLeft={() => {
          if (!emblaApi) return;

          const currentIndex = emblaApi.selectedScrollSnap();
          const prevIndex = Math.max(currentIndex - scrollStep, 0);

          emblaApi.scrollTo(prevIndex);
        }}
        className={controlsClassName}
      />
    </div>
  );
}

