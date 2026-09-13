import { PostersGridSkeleton } from "./PostersGridSkeleton";

interface MediaPageSkeletonProps {
  title?: string;
  isPersons?: boolean;
}

export function MediaPageSkeleton({ title }: MediaPageSkeletonProps) {
  return (
    <section className="container-1440 mt-[72px]">
      <div className="flex justify-between items-center xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2 animate-pulse">
        {/* Title */}
        <div className="flex items-baseline gap-2">
          {title ? (
            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] md:font-medium font-normal text-black dark:text-white capitalize">
              {title}
            </h1>
          ) : (
            <div className="h-8 w-40 bg-black/15 dark:bg-white/15 rounded" />
          )}
        </div>

        {/* Controls (Sort + Filter) */}
        <div className="flex items-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px]">
          <div className="xl:w-[126px] xl:h-[37px] lg:w-[122px] lg:h-[35px] sm:w-[110px] sm:h-[33px] w-[100px] h-[31px] rounded bg-black/10 dark:bg-white/10" />
          <div className="xl:w-[42px] xl:h-[37px] lg:w-[40px] lg:h-[35px] sm:w-[38px] sm:h-[33px] w-[34px] h-[31px] rounded bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      {/* Grid */}
      <PostersGridSkeleton count={24} />
    </section>
  );
}

