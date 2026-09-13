"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { hasInternalHistory } from "@/components/navigation/NavigationTracker";

export function useSmartBack() {
  const router = useRouter();

  const goBack = useCallback(
    (fallbackUrl: string = "/") => {
      if (typeof window !== "undefined" && hasInternalHistory()) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    },
    [router]
  );

  return { goBack };
}

