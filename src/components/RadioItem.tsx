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
            className="flex items-center gap-[5px] cursor-pointer"
        >
            <RadioGroupItem
                id={id}
                value={value}
                className={cn(
                    "w-[14px] h-[14px] rounded-full border-2 border-black/50",
                    "bg-white transition-all duration-150",
                    "data-[state=checked]:border-black/30 data-[state=checked]:bg-bullet-circle",
                    "[&>span]:hidden outline-none"
                )}
            />

            <span className="font-inter text-[16px] font-normal text-black">
                {label}
            </span>
        </label>
    );
}