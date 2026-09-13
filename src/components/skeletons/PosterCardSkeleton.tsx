export function PosterCardSkeleton() {
  return (
    <div className="flex flex-col items-end relative animate-pulse">
      {/* Poster Card Shape */}
      <div className="relative xl:w-[220px] xl:h-[310px] lg:w-[210px] lg:h-[300px] md:w-[200px] md:h-[290px] sm:w-[185px] sm:h-[265px] w-[175px] h-[250px] overflow-hidden rounded-md md:rounded-lg bg-black/[0.07] dark:bg-white/[0.07] border border-black/5 dark:border-white/5 flex flex-col justify-end p-3">
        {/* Title placeholder */}
        <div className="w-4/5 h-3.5 sm:h-4 bg-black/15 dark:bg-white/15 rounded mb-1 self-center" />
        <div className="w-1/2 h-3 bg-black/10 dark:bg-white/10 rounded self-center" />
      </div>

      {/* Add button placeholder */}
      <div className="xl:h-[30px] xl:w-[30px] lg:h-[28px] lg:w-[28px] md:h-[26px] md:w-[26px] sm:h-[24px] sm:w-[24px] h-[22px] w-[22px] bg-black/[0.08] dark:bg-white/[0.08] rounded-[3px] xl:mt-[12px] lg:mt-[11px] md:mt-[10px] sm:mt-[9px] mt-[8px]" />
    </div>
  );
}

