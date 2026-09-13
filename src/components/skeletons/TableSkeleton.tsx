export function TableRowSkeleton({ isRatingView = false }: { isRatingView?: boolean }) {
  return (
    <>
      {/* Desktop Row Skeleton (md and up) */}
      <div className="hidden md:grid grid-cols-[76px_minmax(220px,1.6fr)_120px_130px_110px_48px] lg:grid-cols-[84px_minmax(260px,1.6fr)_140px_150px_120px_52px] items-center gap-4 lg:gap-6 px-5 sm:px-6 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] bg-black/[0.015] dark:bg-white/[0.015] animate-pulse">
        {/* Poster */}
        <div className="flex justify-center">
          <div className="w-[58px] h-[84px] lg:w-[64px] lg:h-[94px] rounded-lg bg-black/10 dark:bg-white/10" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5 justify-center pr-2">
          <div className="h-4 w-4/5 bg-black/15 dark:bg-white/15 rounded" />
          <div className="h-3 w-1/3 bg-black/10 dark:bg-white/10 rounded" />
        </div>

        {/* Rating */}
        <div className="flex justify-center">
          <div className={`h-4 ${isRatingView ? "w-14 bg-yellow-500/20" : "w-12 bg-black/10 dark:bg-white/10"} rounded`} />
        </div>

        {/* Media Type */}
        <div className="flex justify-center">
          <div className="h-6 w-16 rounded-full bg-black/10 dark:bg-white/10" />
        </div>

        {/* Released */}
        <div className="flex justify-center">
          <div className="h-4 w-10 bg-black/10 dark:bg-white/10 rounded" />
        </div>

        {/* Options button */}
        <div className="flex justify-end">
          <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      {/* Mobile Card Skeleton (< md) */}
      <div className="flex md:hidden items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 animate-pulse">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-[65px] h-[95px] sm:w-[72px] sm:h-[105px] shrink-0 rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="h-4 w-4/5 bg-black/15 dark:bg-white/15 rounded" />
            <div className="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded" />
            <div className="h-3 w-1/3 bg-black/10 dark:bg-white/10 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 shrink-0" />
      </div>
    </>
  );
}

export function TableSkeleton({
  isRatingView = false,
  count = 8,
}: {
  isRatingView?: boolean;
  count?: number;
}) {
  return (
    <div className="w-full mt-6 sm:mt-8 md:mt-10">
      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-[76px_minmax(220px,1.6fr)_120px_130px_110px_48px] lg:grid-cols-[84px_minmax(260px,1.6fr)_140px_150px_120px_52px] items-center gap-4 lg:gap-6 px-5 sm:px-6 py-3.5 mb-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 font-inter font-medium text-xs lg:text-[13px] text-light-table-heading-font dark:text-table-heading-font uppercase tracking-wider select-none">
        <div className="text-center">Poster</div>
        <div className="text-left pl-1">Title</div>
        <div className="text-center">{isRatingView ? "Your Rating" : "Rating"}</div>
        <div className="text-center">Media</div>
        <div className="text-center">Released</div>
        <div />
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <TableRowSkeleton key={`table-row-skel-${i}`} isRatingView={isRatingView} />
        ))}
      </div>
    </div>
  );
}
