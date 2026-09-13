import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RadioItemProps } from "@/types";

export function RadioItem({
  id,
  value,
  label,
  className,
}: RadioItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 py-1 px-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none",
        className
      )}
    >
      <RadioGroupItem
        id={id}
        value={value}
        className="w-4 h-4 border-black/30 dark:border-white/30 text-light-nav dark:text-trails-red focus:ring-light-nav dark:focus:ring-trails-red"
      />
      <Label
        htmlFor={id}
        className="text-xs sm:text-sm font-inter text-black/80 dark:text-white/80 cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}

