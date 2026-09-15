"use client";

import { useEffect } from "react";

type Params = {
    enabled: boolean;
    selectors: string[];
    onClose: () => void;
};

export function useClickOutsideClose({
    enabled,
    selectors,
    onClose,
}: Params) {
    useEffect(() => {
        if (!enabled) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const isInside =
                selectors.some((selector) => target.closest(selector)) ||
                Boolean(
                    target.closest("[data-radix-popper-content-wrapper]") ||
                    target.closest(".year-popover") ||
                    target.closest("[data-radix-portal]")
                );

            if (!isInside) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [enabled, selectors, onClose]);
}