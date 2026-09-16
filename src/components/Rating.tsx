import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
    value: number | string;
    className?: string;
    className1?: string;
    className2?: string;
}

export const Rating = ({ value, className, className1, className2 }: RatingProps) => {
    const formattedValue =
        typeof value === "number"
            ? isNaN(value)
                ? "—"
                : value.toFixed(1)
            : typeof value === "string" && value.trim() !== "" && value !== "—" && value !== "-" && !isNaN(Number(value))
            ? Number(value).toFixed(1)
            : value;

    return (
        <div className={cn("flex items-center justify-center align-baseline", className)}>
            <Star className={cn("text-yellow-400 fill-yellow-400 md:w-[24px] md:h-[24px] sm:w-[20px] sm:h-[20px] h-[18px] w-[18px]", className1)} />
            <span className={cn("font-inter font-medium", className2)}>
                {formattedValue}
            </span>
        </div>
    );
};