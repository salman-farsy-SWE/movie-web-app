import { TableSkeleton } from "./TableSkeleton";
import { ListGridSkeleton } from "./ListGridSkeleton";

interface UserCollectionSkeletonProps {
  title?: string;
  isListView?: boolean;
  isRatingView?: boolean;
}

export function UserCollectionSkeleton({
  title,
  isListView = false,
  isRatingView = false,
}: UserCollectionSkeletonProps) {
  return (
    <section className="container-1440 mt-[72px]">
      <div className="flex justify-between lg:items-center items-start xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2 animate-pulse">
        {/* Title */}
        <div className="flex items-baseline gap-2">
          {title ? (
            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] font-medium text-black dark:text-white capitalize">
              {title}
            </h1>
          ) : (
            <div className="h-8 w-44 bg-black/15 dark:bg-white/15 rounded" />
          )}
        </div>

        {/* Controls: SearchBar + Sort + Filter */}
        <div className="flex lg:items-center items-end lg:justify-normal justify-center lg:flex-row flex-col">
          <div className="xl:mr-[30px] lg:mr-[25px] lg:mt-0 md:mt-6 mt-4 lg:order-1 order-2">
            <div className="w-[180px] sm:w-[240px] md:w-[280px] h-[34px] sm:h-[38px] rounded-full bg-black/10 dark:bg-white/10" />
          </div>

          <div className="flex items-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px] lg:order-2 order-1">
            <div className="xl:w-[126px] xl:h-[37px] lg:w-[122px] lg:h-[35px] sm:w-[110px] sm:h-[33px] w-[100px] h-[31px] rounded bg-black/10 dark:bg-white/10" />
            <div className="xl:w-[42px] xl:h-[37px] lg:w-[40px] lg:h-[35px] sm:w-[38px] sm:h-[33px] w-[34px] h-[31px] rounded bg-black/10 dark:bg-white/10" />
            {isListView ? (
              <div className="w-[140px] sm:w-[170px] xl:h-[37px] lg:h-[35px] sm:h-[33px] h-[31px] rounded bg-black/10 dark:bg-white/10" />
            ) : (
              <div className="xl:w-[42px] xl:h-[37px] lg:w-[40px] lg:h-[35px] sm:w-[38px] sm:h-[33px] w-[34px] h-[31px] rounded bg-black/10 dark:bg-white/10" />
            )}
          </div>
        </div>
      </div>

      {isListView ? (
        <ListGridSkeleton />
      ) : (
        <TableSkeleton isRatingView={isRatingView} />
      )}
    </section>
  );
}

