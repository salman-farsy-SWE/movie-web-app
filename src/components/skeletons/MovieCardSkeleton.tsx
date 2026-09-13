export function MovieCardSkeleton() {
  return (
    <article className="relative xl:pt-[40px] lg:pt-[38px] md:pt-[36px] sm:pt-[34px] pt-[29px] pb-1 xl:w-[325px] lg:w-[300px] md:w-[285px] sm:w-[270px] w-[220px] animate-pulse">
      {/* Thumbnail */}
      <div className="w-full xl:h-[180px] lg:h-[170px] md:h-[160px] sm:h-[150px] h-[120px] rounded-md md:rounded-lg bg-black/[0.07] dark:bg-white/[0.07] border border-black/5 dark:border-white/5" />

      {/* Meta + Add Button */}
      <div className="flex items-start justify-between mt-3 w-full gap-3 px-0.5">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="h-4 w-4/5 bg-black/15 dark:bg-white/15 rounded" />
          <div className="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded" />
        </div>

        <div className="shrink-0 xl:h-[30px] xl:w-[30px] lg:h-[28px] lg:w-[28px] md:h-[26px] md:w-[26px] sm:h-[24px] sm:w-[24px] h-[24px] w-[24px] bg-black/[0.08] dark:bg-white/[0.08] rounded-[4px]" />
      </div>
    </article>
  );
}

export function MovieRowSkeleton({ title, count = 5 }: { title?: string; count?: number }) {
  return (
    <section className="xl:px-0 lg:px-5 md:px-7 px-9">
      {title ? (
        <h2 className="font-akshar font-medium xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[25px] text-[23px] text-black dark:text-white">
          {title}
        </h2>
      ) : (
        <div className="h-7 w-36 bg-black/10 dark:bg-white/10 rounded mb-2 animate-pulse" />
      )}

      <div className="flex gap-4 sm:gap-6 overflow-hidden xl:-mt-[32px] lg:-mt-[30px] md:-mt-[28px] sm:-mt-[26px] -mt-[22px]">
        {Array.from({ length: count }).map((_, i) => (
          <div key={`row-skeleton-${i}`} className="flex-[0_0_auto]">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

