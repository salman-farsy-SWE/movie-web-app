export function HeroSectionSkeleton() {
  return (
    <section
      aria-label="Loading hero banner"
      className="relative w-full h-[500px] sm:h-[580px] md:h-[660px] lg:h-[740px] xl:h-[800px] overflow-hidden bg-black/10 dark:bg-zinc-900 animate-pulse"
    >
      {/* Background tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent z-10 pointer-events-none" />

      {/* Content skeleton matching layout */}
      <div className="font-inter absolute inset-0 z-20 flex flex-col justify-center text-white xl:left-[190px] lg:left-[165px] md:left-[150px] sm:left-[130px] left-[70px] xl:max-w-[720px] lg:max-w-[600px] md:max-w-[500px] sm:max-w-[420px] max-w-[calc(100vw-140px)] xl:pt-[70px] lg:pt-[60px] md:pt-[50px] sm:pt-[40px] pt-[20px]">
        {/* Title */}
        <div className="h-8 sm:h-10 md:h-12 w-3/4 max-w-[460px] bg-white/20 rounded xl:mb-[16px] lg:mb-[14px] md:mb-[12px] sm:mb-[10px] mb-[8px]" />

        {/* Description */}
        <div className="flex flex-col gap-2 w-full max-w-[560px] xl:mb-[22px] lg:mb-[18px] md:mb-[16px] sm:mb-[14px] mb-[12px]">
          <div className="h-4 sm:h-5 w-full bg-white/15 rounded" />
          <div className="h-4 sm:h-5 w-4/5 bg-white/15 rounded" />
        </div>

        {/* Rating, Year, Genres */}
        <div className="flex items-center flex-wrap gap-2.5 xl:mb-[26px] lg:mb-[22px] md:mb-[18px] sm:mb-[16px] mb-[14px]">
          <div className="h-5 w-16 bg-white/20 rounded" />
          <div className="h-5 w-12 bg-white/15 rounded" />
          <div className="h-6 w-20 bg-white/15 rounded-full" />
          <div className="h-6 w-20 bg-white/15 rounded-full" />
        </div>

        {/* Trailer Button */}
        <div className="h-10 sm:h-11 w-36 sm:w-40 bg-trails-red/60 rounded-[4px]" />
      </div>
    </section>
  );
}

