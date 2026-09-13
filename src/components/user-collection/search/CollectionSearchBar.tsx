"use client";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getBasePage, saveBasePage, isFilterActive } from "@/lib/tmdb";
import type { SearchBarBaseProps } from "@/types";

export function CollectionSearchBar(props: SearchBarBaseProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "group/search xl:w-[320px] xl:h-[37px] lg:w-[290px] lg:h-[35px] md:w-[260px] md:h-[33px] sm:w-[230px] sm:h-[33px] w-[210px] h-[31px] p-[2px] sm:p-[2.5px] flex items-center bg-light-dropdown dark:bg-dropdown xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] select-none",
            props.className
          )}
        >
          <div className="w-full h-full flex items-center xl:gap-2 lg:gap-1.5 gap-1.5 xl:px-2.5 lg:px-2 px-2 bg-white/70 dark:bg-dark xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px] shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)] dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)]">
            <Search className="xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] opacity-75 text-dark/85 dark:text-white/85 shrink-0" />
            <div className="w-full h-full bg-transparent" />
          </div>
        </div>
      }
    >
      <CollectionSearchBarContent {...props} />
    </Suspense>
  );
}

function CollectionSearchBarContent({
  placeholder = "Search collection...",
  value: controlledValue,
  defaultValue = "",
  onChange,
  onClear,
  className,
  syncWithUrl = true,
  paramName = "q",
  debounceMs = 300,
}: SearchBarBaseProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlQuery = searchParams.get(paramName) || searchParams.get("search") || "";
  const isControlled = controlledValue !== undefined;

  const [pendingTargetQuery, setPendingTargetQuery] = useState<string | null>(null);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (syncWithUrl) return urlQuery;
    return defaultValue;
  });

  if (syncWithUrl && !isControlled && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (pendingTargetQuery !== null) {
      if (urlQuery === pendingTargetQuery) {
        setPendingTargetQuery(null);
      }
    } else if (urlQuery !== internalValue.trim()) {
      setInternalValue(urlQuery);
    }
  }

  const isInitialMount = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    setPendingTargetQuery("");
    onChange?.("");
    onClear?.();

    if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramName);
      params.delete("search");

      if (!isFilterActive(params) && !params.get("sort_by")) {
        const returnPage = getBasePage(pathname, 1);
        if (returnPage > 1) {
          params.set("page", String(returnPage));
        } else {
          params.delete("page");
        }
      }

      const queryString = params.toString();
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    if (!syncWithUrl || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = internalValue.trim();
      const currentParam = searchParams.get(paramName) || searchParams.get("search") || "";

      if (trimmed === currentParam) {
        setPendingTargetQuery(null);
        return;
      }

      setPendingTargetQuery(trimmed);
      const urlPage = Number(searchParams.get("page")) || 1;
      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        if (!currentParam && !isFilterActive(searchParams) && !searchParams.get("sort_by")) {
          saveBasePage(pathname, urlPage);
        }
        params.set(paramName, trimmed);
        params.delete("page");

        const queryString = params.toString();
        startTransition(() => {
          router.replace(`${pathname}?${queryString}`, { scroll: false });
        });
      } else {
        params.delete(paramName);
        params.delete("search");

        if (!isFilterActive(params) && !params.get("sort_by")) {
          const returnPage = getBasePage(pathname, 1);
          if (returnPage > 1) {
            params.set("page", String(returnPage));
          } else {
            params.delete("page");
          }
        }

        const queryString = params.toString();
        startTransition(() => {
          router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, syncWithUrl, paramName, pathname, searchParams, router, debounceMs]);

  const hasValue = Boolean(currentValue && currentValue.length > 0);

  return (
    <div
      className={cn(
        "relative group/search xl:w-[320px] xl:h-[37px] lg:w-[290px] lg:h-[35px] md:w-[260px] md:h-[33px] sm:w-[230px] sm:h-[33px] w-[210px] h-[31px] p-[2px] sm:p-[2.5px] flex items-center bg-light-dropdown hover:bg-light-dropdown/90 dark:bg-dropdown dark:hover:bg-dropdown/90 xl:rounded-[7px] lg:rounded-[6px] md:rounded-[5px] sm:rounded-[4px] rounded-[3px] transition-all duration-150 focus-within:ring-1 focus-within:ring-light-nav/40 dark:focus-within:ring-trails-red/40",
        className
      )}
    >
      <div className="w-full h-full flex items-center xl:gap-2 lg:gap-1.5 gap-1.5 xl:px-2.5 lg:px-2 px-2 bg-white/70 hover:bg-white dark:bg-dark dark:hover:bg-dark/95 focus-within:!bg-white dark:focus-within:!bg-dark xl:rounded-[5px] lg:rounded-[4px] md:rounded-[3px] rounded-[2px] transition-all duration-150 shadow-[inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.06),inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.06)] dark:shadow-[inset_-0.5px_-0.5px_1.5px_rgba(0,0,0,0.25),inset_0.5px_0.5px_1.5px_rgba(0,0,0,0.25)] focus-within:shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.12)] dark:focus-within:shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.35)]">
        <Search className="xl:w-[15px] xl:h-[15px] lg:w-[14px] lg:h-[14px] sm:w-[13px] sm:h-[13px] w-[12px] h-[12px] opacity-75 group-focus-within/search:opacity-100 group-focus-within/search:text-light-nav dark:group-focus-within/search:text-trails-red text-dark/85 dark:text-white/85 shrink-0 transition-colors duration-150" />

        <Input
          ref={inputRef}
          value={currentValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-inter font-normal xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] text-dark dark:text-white placeholder:text-light-input-font dark:placeholder:text-white/40 placeholder:font-normal h-full p-0 flex-1 leading-none tracking-normal"
        />

        {hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="p-0.5 text-dark/50 hover:text-dark dark:text-white/50 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-150 cursor-pointer rounded-full focus:outline-none shrink-0"
          >
            <X className="xl:w-[14px] xl:h-[14px] lg:w-[13px] lg:h-[13px] sm:w-[12px] sm:h-[12px] w-[11px] h-[11px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
