import { cn } from "@/lib/utils";
import { IoIosStar } from "react-icons/io";

interface RatingProps {
    value: number | string;
    className?: string;
    className1?: string;
    className2?: string;
}

export const Rating = ({ value, className, className1, className2 }: RatingProps) => (
    <div className={cn("flex items-center justify-center", className)}>
        <IoIosStar className={cn(" text-yellow-400 fill-yellow-400 md:w-[24px] md:h-[24px] sm:w-[20px] sm:h-[20px] h-[18px] w-[18px]", className1)} />
        <span className={cn("font-inter font-medium", className2)}>
            {value}
        </span>
    </div>
);