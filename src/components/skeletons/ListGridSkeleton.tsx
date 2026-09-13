export function ListCardSkeleton() {
  return (
    <div className="flex flex-col w-full animate-pulse">
      {/* Cover Image Frame */}
      <div className="w-full aspect-[16/10] rounded-[8px] bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5" />

      {/* Title and Options */}
      <div className="flex items-start justify-between gap-2 mt-2.5">
        <div className="h-4 w-3/4 bg-black/15 dark:bg-white/15 rounded" />
        <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 shrink-0" />
      </div>

      {/* Description */}
      <div className="h-3 w-full bg-black/10 dark:bg-white/10 rounded mt-1.5" />
      <div className="h-3 w-2/3 bg-black/10 dark:bg-white/10 rounded mt-1" />
    </div>
  );
}

export function ListGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full">
      {/* Create new button skeleton */}
      <div className="mt-5 sm:mt-6">
        <div className="h-[36px] sm:h-[38px] w-32 rounded-[6px] sm:rounded-[8px] bg-black/10 dark:bg-white/10 animate-pulse" />
      </div>

      {/* Grid */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-7 gap-y-7 sm:gap-y-9 lg:gap-y-10 pb-12">
        {Array.from({ length: count }).map((_, i) => (
          <ListCardSkeleton key={`list-card-skel-${i}`} />
        ))}
      </div>
    </div>
  );
}

