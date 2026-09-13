export function ProfileSkeleton() {
  return (
    <div className="w-full bg-light-dropdown dark:bg-dropdown rounded-2xl md:rounded-3xl mt-6 sm:mt-8 p-6 sm:p-8 md:p-12 animate-pulse">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-20">
        {/* User Identity */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-[100px] h-[100px] xl:w-[150px] xl:h-[150px] lg:w-[140px] lg:h-[140px] md:w-[130px] md:h-[130px] sm:w-[115px] sm:h-[115px] rounded-full bg-black/10 dark:bg-white/10 border-2 border-black/15 dark:border-white/30" />
          <div className="h-5 sm:h-6 w-32 bg-black/15 dark:bg-white/15 rounded mt-3 sm:mt-4" />
          <div className="h-9 sm:h-10 w-36 bg-black/10 dark:bg-white/10 rounded-full mt-4 sm:mt-6" />
        </div>

        {/* Stats Grid */}
        <div className="w-full md:w-auto flex-1 flex justify-center md:justify-end">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-14">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`stat-skel-${i}`} className="flex flex-col items-center gap-3">
                <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-black/15 dark:bg-white/15" />
                  <div className="h-7 w-8 bg-black/20 dark:bg-white/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <section className="container-1440 mt-[72px]">
      <div className="flex justify-between lg:items-center items-start xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2 animate-pulse">
        <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] font-medium text-black dark:text-white capitalize">
          profile
        </h1>
      </div>

      <ProfileSkeleton />
    </section>
  );
}

