"use client";

import { forwardRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> { iconClassName?: string; }

export const AddButton = forwardRef<HTMLButtonElement, AddButtonProps>(
  ({ className, iconClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center justify-center lg:rounded-[3px] md:rounded-[2px] rounded-[1px] transition-colors duration-75",
          className
        )}
        {...props}
      >
        <Plus className={cn(" text-white", iconClassName)} />
      </button>
    );
  }
);

AddButton.displayName = "AddButton";