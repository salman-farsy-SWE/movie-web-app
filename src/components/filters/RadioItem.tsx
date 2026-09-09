"use client";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioItemProps {
  id: string;
  value: string;
  label: string;
  className?: string;
}

export function RadioItem({ id, value, label, className }: RadioItemProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group inline-flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-md transition-all duration-150 border border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white",
        "has-[button[data-state=checked]]:bg-light-nav/10 has-[button[data-state=checked]]:border-light-nav/35 has-[button[data-state=checked]]:text-light-nav has-[button[data-state=checked]]:font-medium",
        "dark:has-[button[data-state=checked]]:bg-trails-red/15 dark:has-[button[data-state=checked]]:border-trails-red/50 dark:has-[button[data-state=checked]]:text-trails-red",
        className
      )}
    >
      <RadioGroupItem
        id={id}
        value={value}
        className={cn(
          "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-black/30 dark:border-white/30 bg-white/80 dark:bg-dark group-hover:border-black/50 dark:group-hover:border-white/50 transition-all duration-150 shrink-0",
          "data-[state=checked]:border-light-nav data-[state=checked]:text-light-nav dark:data-[state=checked]:border-trails-red dark:data-[state=checked]:text-trails-red"
        )}
      />

      <span className="font-inter text-xs sm:text-[13px] lg:text-sm font-normal flex items-center gap-1.5 transition-colors duration-150 leading-tight">
        {label}
      </span>
    </label>
  );
}