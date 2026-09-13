import { PosterCardSkeleton } from "./PosterCardSkeleton";

interface PostersGridSkeletonProps {
  count?: number;
}

export function PostersGridSkeleton({ count = 24 }: PostersGridSkeletonProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="max-w-[1440px] w-full flex justify-center flex-wrap xl:gap-[24px] lg:gap-[23px] gap-[22px] xl:mt-[30px] md:mt-[27px] sm:mt-[25px] mt-[23px] xl:px-0 lg:px-2 px-1">
        {Array.from({ length: count }).map((_, i) => (
          <PosterCardSkeleton key={`poster-skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}

