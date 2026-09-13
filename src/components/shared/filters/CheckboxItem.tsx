import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CheckboxItemProps } from "@/types";

export function CheckboxItem({
  id,
  label,
  checked,
  onCheckedChange,
  disabled,
  className,
  children,
}: CheckboxItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 py-1 px-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none",
        className
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="w-4 h-4 rounded border-black/30 dark:border-white/30 data-[state=checked]:bg-light-nav dark:data-[state=checked]:bg-trails-red data-[state=checked]:border-light-nav dark:data-[state=checked]:border-trails-red"
      />
      <Label
        htmlFor={id}
        className="text-xs sm:text-sm font-inter text-black/80 dark:text-white/80 cursor-pointer flex items-center gap-1"
      >
        {children ?? label}
      </Label>
    </div>
  );
}

