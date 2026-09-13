import { PosterDetailsSkeleton } from "./PosterDetailsSkeleton";
import { PostersGridSkeleton } from "./PostersGridSkeleton";

export function MediaDetailsSkeleton() {
  return (
    <div className="container-1440 mt-[72px]">
      {/* Top bar with back button & search */}
      <div className="flex justify-between items-center xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-7 w-40 bg-black/15 dark:bg-white/15 rounded" />
        </div>
        <div className="h-9 w-44 sm:w-60 rounded-full bg-black/10 dark:bg-white/10" />
      </div>

      {/* Hero Section */}
      <PosterDetailsSkeleton />

      {/* Cast Section Skeleton */}
      <div className="mt-10 sm:mt-12 animate-pulse xl:px-0 px-2">
        <div className="h-7 w-28 bg-black/15 dark:bg-white/15 rounded mb-4" />
        <div className="flex gap-4 sm:gap-6 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`cast-skel-${i}`} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-16 bg-black/10 dark:bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section Skeleton */}
      <div className="mt-12 sm:mt-14 mb-16 xl:px-0 px-2">
        <div className="h-7 w-36 bg-black/15 dark:bg-white/15 rounded mb-4 animate-pulse" />
        <PostersGridSkeleton count={8} />
      </div>
    </div>
  );
}

