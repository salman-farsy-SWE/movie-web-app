

import { cn } from "@/lib/utils";

interface GenreBadgeProps {
    genre: string;
    className?: string;
}

export function GenreBadge({ genre, className }: GenreBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center xl:h-7 lg:h-[27px] md:h-[26px] sm:h-[24px] h-[18px] xl:min-w-[86px] lg:min-w-[82px] md:min-w-[76px] sm:min-w-[68px] min-w-[50px] lg:px-2 px-1 w-auto lg:rounded-[10px] md:rounded-lg rounded-md backdrop-blur-md xl:text-[16px] lg:text-[15px] md:text-sm sm:text-[12px] text-[11px] leading-none", className
            )}
        >
            {genre}
        </span>
    );
}