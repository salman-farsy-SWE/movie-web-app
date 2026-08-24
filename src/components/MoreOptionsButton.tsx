"use client";

import { forwardRef } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoreOptionsButtonProps {
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    className2?: string;
}

export const MoreOptionsButton = forwardRef<
    HTMLButtonElement,
    MoreOptionsButtonProps
>(function MoreOptionsButton(
    { onClick, className, className2 },
    ref
) {
    return (
        <Button
            ref={ref} 
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.(e);
            }}
            className={cn(
                "rounded-full p-0 transition-colors duration-150 relative z-[2]",
                className
            )}
        >
            <MoreVertical
                strokeWidth={2.5}
                className={cn(
                    "w-[16px] h-[16px] text-black",
                    className2
                )}
            />
        </Button>
    );
});