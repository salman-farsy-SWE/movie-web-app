export function PersonCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2.5 animate-pulse">
      {/* Circle Avatar */}
      <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[130px] md:h-[130px] rounded-full bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/5" />

      {/* Name and Role */}
      <div className="h-3.5 sm:h-4 w-24 bg-black/15 dark:bg-white/15 rounded" />
      <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded" />
    </div>
  );
}

export function PersonsGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1440px] grid justify-items-center justify-center place-items-center xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xl:gap-x-[96px] lg:gap-x-[86px] md:gap-x-[70px] sm:gap-x-[60px] gap-x-[30px] lg:gap-y-[60px] md:gap-y-[50px] sm:gap-y-[35px] gap-y-[30px] xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] xl:px-0 lg:px-2 px-1">
        {Array.from({ length: count }).map((_, i) => (
          <PersonCardSkeleton key={`person-skel-${i}`} />
        ))}
      </div>
    </div>
  );
}

