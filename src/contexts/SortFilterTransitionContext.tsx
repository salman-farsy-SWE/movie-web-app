"use client";

import React, {
  createContext,
  useContext,
  useTransition,
  useState,
  useRef,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SortFilterTransitionContextType {
  isPending: boolean;
  startSortFilterTransition: (callback: () => void) => void;
  navigateWithTransition: (url: string) => void;
}

const SortFilterTransitionContext = createContext<SortFilterTransitionContextType>({
  isPending: false,
  startSortFilterTransition: (cb) => cb(),
  navigateWithTransition: () => {},
});

function SearchParamsWatcher({ onChange }: { onChange: (params: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onChange(searchParams.toString());
  }, [searchParams, onChange]);
  return null;
}

export function SortFilterTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isManualLoading, setIsManualLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevSearchParamsRef = useRef<string | null>(null);

  const handleParamsChange = useCallback((currentParams: string) => {
    if (prevSearchParamsRef.current !== null && prevSearchParamsRef.current !== currentParams) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsManualLoading(false);
        timerRef.current = null;
      }, 180);
    }
    prevSearchParamsRef.current = currentParams;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const navigateWithTransition = useCallback(
    (url: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setIsManualLoading(true);
      startTransition(() => {
        router.push(url);
      });
      // Safety timer in case url parameters did not change
      timerRef.current = setTimeout(() => {
        setIsManualLoading(false);
        timerRef.current = null;
      }, 250);
    },
    [router]
  );

  const startSortFilterTransition = useCallback((callback: () => void) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsManualLoading(true);
    startTransition(() => {
      callback();
    });
    timerRef.current = setTimeout(() => {
      setIsManualLoading(false);
      timerRef.current = null;
    }, 250);
  }, []);

  const isLoading = isPending || isManualLoading;

  return (
    <SortFilterTransitionContext.Provider
      value={{
        isPending: isLoading,
        startSortFilterTransition,
        navigateWithTransition,
      }}
    >
      <Suspense fallback={null}>
        <SearchParamsWatcher onChange={handleParamsChange} />
      </Suspense>
      {children}
    </SortFilterTransitionContext.Provider>
  );
}

export function useSortFilterTransition() {
  return useContext(SortFilterTransitionContext);
}

