export function PosterDetailsSkeleton() {
  return (
    <section className="relative xl:mt-[19px] lg:mt-[17px] md:mt-[15px] mt-[13px] left-1/2 right-1/2 w-screen -translate-x-1/2 animate-pulse">
      <div className="relative w-full min-h-[660px] md:px-8 sm:px-7 px-6 xl:py-[32px] lg:py-[28px] md:py-[24px] sm:py-[20px] py-[18px] pb-[56px] sm:pb-[60px] md:pb-[64px] lg:pb-[68px] xl:pb-[72px] overflow-hidden border-y border-white/20 bg-[#050b14] dark:bg-[#030406]">
        {/* Ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/40 via-slate-900/50 to-black/80 pointer-events-none" />

        <div className="relative z-20 container-1440 text-white font-inter">
          {/* Top Row: Title, Date & Heart */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="h-8 sm:h-10 w-2/3 max-w-[380px] bg-white/20 rounded" />
              <div className="h-4 w-28 bg-white/15 rounded mt-2" />
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 shrink-0" />
          </div>

          {/* Overview */}
          <div className="xl:w-[72%] lg:w-[68%] md:w-[80%] w-full xl:mt-[16px] lg:mt-[14px] md:mt-[12px] mt-[10px] flex flex-col gap-2">
            <div className="h-4 w-full bg-white/15 rounded" />
            <div className="h-4 w-5/6 bg-white/15 rounded" />
            <div className="h-4 w-2/3 bg-white/15 rounded" />
          </div>

          {/* Sub-bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 xl:mt-[26px] lg:mt-[22px] md:mt-[20px] mt-[18px] pb-4 border-b border-white/15">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-white/15 rounded-full" />
                <div className="h-6 w-20 bg-white/15 rounded-full" />
              </div>
              <div className="h-4 w-32 bg-white/15 rounded" />
            </div>

            {/* Stats group */}
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="h-9 w-20 bg-white/15 rounded" />
              <div className="h-9 w-20 bg-white/15 rounded" />
              <div className="h-9 w-20 bg-white/15 rounded" />
            </div>
          </div>

          {/* Main Media Section: Poster & Meta */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-6">
            {/* Poster + Trailer Button */}
            <div className="flex flex-col items-center shrink-0 w-full sm:w-[210px] md:w-[230px] lg:w-[245px] xl:w-[255px]">
              <div className="w-[200px] h-[300px] sm:w-full sm:h-[315px] md:h-[345px] lg:h-[365px] xl:h-[380px] rounded-[4px] bg-white/10 border border-white/20" />
              <div className="w-[180px] sm:w-full h-10 mt-3.5 bg-trails-red/60 rounded-[4px]" />
            </div>

            {/* Details Column */}
            <div className="flex-1 flex flex-col gap-4 text-white">
              <div className="h-4 w-48 bg-white/15 rounded" />
              <div className="h-4 w-36 bg-white/15 rounded" />
              <div className="h-5 w-40 bg-white/15 rounded" />
              {/* Studio */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-16 h-10 bg-white/20 rounded" />
                <div className="h-4 w-28 bg-white/15 rounded" />
              </div>
              {/* Creator */}
              <div className="flex items-center gap-3 mt-1">
                <div className="w-12 h-12 rounded-full bg-white/20" />
                <div className="h-4 w-32 bg-white/15 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

