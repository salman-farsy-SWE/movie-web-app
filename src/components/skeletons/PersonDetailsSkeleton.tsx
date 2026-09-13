export function PersonDetailsSkeleton() {
  return (
    <section className="relative mt-[19px] left-1/2 right-1/2 w-screen -translate-x-1/2 bg-light-dropdown dark:bg-dropdown md:px-8 sm:px-7 px-6 xl:py-[32px] lg:py-[28px] md:py-[24px] sm:py-[20px] py-[18px] flex justify-center border-y border-black/5 dark:border-white/5 animate-pulse">
      <div className="container-1440 flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        {/* Left: Portrait photo + button */}
        <div className="flex flex-col items-center sm:items-start shrink-0 sm:self-start">
          <div className="relative xl:w-[320px] xl:h-[450px] lg:w-[290px] lg:h-[410px] md:w-[260px] md:h-[370px] sm:w-[230px] sm:h-[330px] w-[210px] h-[300px] rounded-md bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10" />
          <div className="w-[210px] sm:w-full h-[38px] sm:h-[40px] mt-3.5 bg-black/10 dark:bg-white/10 rounded" />
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col xl:gap-[20px] lg:gap-[18px] md:gap-[16px] gap-[14px]">
          {/* Header */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="h-8 sm:h-9 w-48 sm:w-64 bg-black/15 dark:bg-white/15 rounded" />
            <div className="h-6 w-28 rounded-full bg-blue-500/10 border border-blue-500/20" />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2 max-w-[950px]">
            <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-5/6 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-2/3 bg-black/10 dark:bg-white/10 rounded" />
          </div>

          {/* Metadata lines */}
          <div className="flex flex-col gap-3 sm:gap-3.5 pt-2">
            <div className="h-4 w-44 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-52 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-36 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-48 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-4 w-40 bg-black/10 dark:bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function PersonDetailsPageSkeleton() {
  return (
    <div className="container-1440 mt-[72px]">
      {/* Back button & search */}
      <div className="flex justify-between items-center xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-7 w-36 bg-black/15 dark:bg-white/15 rounded" />
        </div>
        <div className="h-9 w-44 sm:w-60 rounded-full bg-black/10 dark:bg-white/10" />
      </div>

      <PersonDetailsSkeleton />
    </div>
  );
}

