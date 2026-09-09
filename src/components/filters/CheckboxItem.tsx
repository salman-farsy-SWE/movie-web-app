"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function CheckboxItem({
  id,
  label,
  checked,
  onCheckedChange,
  children,
  className,
}: {
  id: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group inline-flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-md transition-all duration-150 border",
        checked
          ? "bg-light-nav/10 border-light-nav/35 text-light-nav font-medium dark:bg-trails-red/15 dark:border-trails-red/50 dark:text-trails-red"
          : "border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white",
        className
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] transition-all duration-150 border shrink-0",
          "border-black/30 dark:border-white/30 bg-white/80 dark:bg-dark group-hover:border-black/50 dark:group-hover:border-white/50",
          "data-[state=checked]:bg-light-nav data-[state=checked]:border-light-nav data-[state=checked]:text-white",
          "dark:data-[state=checked]:bg-trails-red dark:data-[state=checked]:border-trails-red dark:data-[state=checked]:text-white"
        )}
      />
      <span className="font-inter text-xs sm:text-[13px] lg:text-sm font-normal flex items-center gap-1.5 transition-colors duration-150 leading-tight">
        {children || label}
      </span>
    </label>
  );
}