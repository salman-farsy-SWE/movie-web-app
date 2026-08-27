import { Button } from "@/components/ui/button";

interface FilterButtonProps {
    onClick: () => void;
    className?: string;
}

export function FilterButton({ onClick, className }: FilterButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={`filter-btn xl:w-[113px] xl:h-[37px] lg:w-[109px] lg:h-[35px] sm:w-[100px] sm:h-[33px] w-[90px] h-[31px] flex items-center justify-center text-sortby-font dark:text-white hover:text-sortby-font/95 dark:hover:text-white/95 font-inter font-medium xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] bg-light-dropdown dark:bg-dropdown hover:bg-light-dropdown/95 dark:hover:bg-dropdown/95 rounded-none ${className}`}
        >
            Filter
        </Button>
    );
}
