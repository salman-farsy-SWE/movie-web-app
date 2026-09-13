import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export function FilterButton({ onClick, className, isActive }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Filter options"
      className={cn(
        "filter-btn group xl:w-[42px] xl:h-[37px] lg:w-[40px] lg:h-[35px] sm:w-[38px] sm:h-[33px] w-[34px] h-[31px] p-[2px] sm:p-[2.5px] flex items-center justify-center bg-light-dropdown hover:bg-light-dropdown/90 dark:bg-dropdown dark:hover:bg-dropdown/90 xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] transition-all duration-150 cursor-pointer select-none",
        className
      )}
    >
      <div
        className={cn(
          "w-full h-full flex items-center justify-center xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px] transition-all duration-150",
          "bg-white/70 hover:bg-white dark:bg-dark dark:hover:bg-dark/95 shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)] dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)]",
          isActive && "text-light-nav dark:text-trails-red"
        )}
      >
        <Filter
          className={cn(
            "xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] opacity-75 group-hover:opacity-100 text-dark/85 group-hover:text-dark dark:text-white/85 dark:group-hover:text-white shrink-0 transition-colors duration-150",
            isActive && "opacity-100 text-light-nav dark:text-trails-red"
          )}
        />
      </div>
    </button>
  );
}

