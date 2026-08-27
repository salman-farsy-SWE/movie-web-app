"use client";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioItemProps {
    id: string;
    value: string;
    label: string;
}

export function RadioItem({ id, value, label }: RadioItemProps) {
    return (
        <label
            htmlFor={id}
            className="flex items-center lg:gap-[5px] sm:gap-[4px] gap-[3px] cursor-pointer"
        >
            <RadioGroupItem
                id={id}
                value={value}
                className={cn(
                    "xl:w-[14px] xl:h-[14px] lg:w-[13px] lg:h-[13px] sm:w-[12px] sm:h-[12px] w-[11px] h-[11px] rounded-full border-2 border-black/50 dark:border-light-unfill-star",
                    "bg-white dark:bg-dropdown transition-all duration-150",
                    "data-[state=checked]:border-black/30 dark:data-[state=checked]:border-light-unfill-star/30 data-[state=checked]:bg-bullet-circle dark:data-[state=checked]:bg-white",
                    "[&>span]:hidden outline-none"
                )}
            />

            <span className="font-inter xl:text-[16px] lg:text-[15px] sm:text-[14px] text-[13px] font-normal text-black dark:text-white/85">
                {label}
            </span>
        </label>
    );
}