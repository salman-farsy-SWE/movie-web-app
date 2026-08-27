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
          "flex items-center justify-center align-baseline lg:rounded-[3px] rounded-[2px] p-[2px] transition-colors duration-75",
          className
        )}
        {...props}
      >
        <Plus className={cn(" text-white hover:text-white/85 font-bold", iconClassName)} />
      </button>
    );
  }
);

AddButton.displayName = "AddButton";