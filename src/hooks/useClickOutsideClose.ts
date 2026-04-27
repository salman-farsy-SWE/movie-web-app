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

            const isInside = selectors.some((selector) =>
                target.closest(selector)
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