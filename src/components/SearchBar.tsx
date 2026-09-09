"use client";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { Search, X, Star, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn, slugify } from "@/lib/utils";
import { getBasePage, saveBasePage } from "@/lib/tmdb";
import type { MovieItem } from "@/data/mock-home";
import type { Person } from "@/components/media/PersonCard";

export type SearchBarSearchType = "media" | "person";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  syncWithUrl?: boolean;
  paramName?: string;
  debounceMs?: number;
  enableSuggestions?: boolean;
  searchType?: SearchBarSearchType;
}

export function SearchBar(props: SearchBarProps) {
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
      <SearchBarContent {...props} />
    </Suspense>
  );
}

function SearchBarContent({
  placeholder: propPlaceholder,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onClear,
  className,
  syncWithUrl = false,
  paramName = "q",
  debounceMs = 350,
  enableSuggestions,
  searchType = "media",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const isPersonSearch = searchType === "person";
  const placeholder = propPlaceholder || (isPersonSearch ? "Search persons..." : "Search");

  const urlQuery = searchParams.get(paramName) || "";
  const isControlled = controlledValue !== undefined;
  
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (syncWithUrl) return urlQuery;
    return defaultValue;
  });

  if (syncWithUrl && !isControlled && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setInternalValue(urlQuery);
  }

  const isInitialMount = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentValue = isControlled ? controlledValue : internalValue;

  const showSuggestions = enableSuggestions ?? !syncWithUrl;
  const [movieSuggestions, setMovieSuggestions] = useState<MovieItem[]>([]);
  const [personSuggestions, setPersonSuggestions] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const totalSuggestions = isPersonSearch ? personSuggestions.length : movieSuggestions.length;

  // Close suggestions popover when clicking outside
  useEffect(() => {
    if (!showSuggestions) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSuggestions]);

  // Fetch live suggestions on query change
  useEffect(() => {
    if (!showSuggestions) return;

    const trimmed = internalValue.trim();
    if (!trimmed) return;

    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      setSelectedIndex(-1);

      try {
        const fetchUrl = isPersonSearch
          ? `/api/search?type=person&q=${encodeURIComponent(trimmed)}`
          : `/api/search?q=${encodeURIComponent(trimmed)}`;

        const res = await fetch(fetchUrl, {
          signal: abortController.signal,
        });

        if (res.ok) {
          const data = await res.json();
          if (isPersonSearch) {
            setPersonSuggestions((data as Person[]).slice(0, 6));
          } else {
            setMovieSuggestions((data as MovieItem[]).slice(0, 6));
          }
        } else {
          if (isPersonSearch) {
            setPersonSuggestions([]);
          } else {
            setMovieSuggestions([]);
          }
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          if (isPersonSearch) {
            setPersonSuggestions([]);
          } else {
            setMovieSuggestions([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [internalValue, showSuggestions, isPersonSearch]);

  const handleSelectMovie = (item: MovieItem) => {
    const itemSlug = slugify(item.title) || (item.id ? String(item.id) : "");
    const targetPath = item.mediaType === "tv" ? `/tv-shows/${itemSlug}` : `/movies/${itemSlug}`;
    setIsOpen(false);
    router.push(targetPath);
  };

  const handleSelectPerson = (person: Person) => {
    const personSlug = slugify(person.name) || (person.id ? String(person.id) : "");
    const targetPath = `/trending/persons/${personSlug}`;
    setIsOpen(false);
    router.push(targetPath);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    setMovieSuggestions([]);
    setPersonSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    onChange?.("");
    onClear?.();

    if (syncWithUrl) {
      const returnPage = getBasePage(pathname, 1);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramName);
      params.delete("search");

      if (returnPage > 1) {
        params.set("page", String(returnPage));
      } else {
        params.delete("page");
      }

      const queryString = params.toString();
      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (!nextValue.trim()) {
      setMovieSuggestions([]);
      setPersonSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
    onChange?.(nextValue);
  };

  const handleEnter = () => {
    const trimmed = internalValue.trim();
    if (!trimmed) return;

    if (isPersonSearch) {
      if (showSuggestions) {
        if (selectedIndex >= 0 && personSuggestions[selectedIndex]) {
          handleSelectPerson(personSuggestions[selectedIndex]);
        } else if (personSuggestions.length > 0) {
          handleSelectPerson(personSuggestions[0]);
        } else {
          setIsOpen(false);
          router.push(`/trending/persons/${slugify(trimmed)}`);
        }
      } else if (!syncWithUrl) {
        router.push(`/trending/persons/${slugify(trimmed)}`);
      }
      return;
    }

    if (showSuggestions) {
      if (selectedIndex >= 0 && movieSuggestions[selectedIndex]) {
        handleSelectMovie(movieSuggestions[selectedIndex]);
      } else if (movieSuggestions.length > 0) {
        handleSelectMovie(movieSuggestions[0]);
      } else {
        setIsOpen(false);
        router.push(`/movies/${slugify(trimmed)}`);
      }
    } else if (!syncWithUrl) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (isOpen) {
        setIsOpen(false);
      } else {
        handleClear();
      }
    } else if (e.key === "ArrowDown") {
      if (showSuggestions && totalSuggestions > 0) {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex((prev) => (prev + 1) % totalSuggestions);
      }
    } else if (e.key === "ArrowUp") {
      if (showSuggestions && totalSuggestions > 0) {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex((prev) => (prev <= 0 ? totalSuggestions - 1 : prev - 1));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    }
  };

  const handleFocus = () => {
    if (showSuggestions && internalValue.trim()) {
      setIsOpen(true);
    }
  };

  // Debounced URL synchronization
  useEffect(() => {
    if (!syncWithUrl || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = internalValue.trim();
      const currentParam = searchParams.get(paramName) || "";

      if (trimmed === currentParam) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      if (trimmed) {
        if (!currentParam) {
          const currentPageNum = Number(searchParams.get("page")) || 1;
          saveBasePage(pathname, currentPageNum);
        }

        params.set(paramName, trimmed);
        params.set("page", "1");

        const queryString = params.toString();
        startTransition(() => {
          router.push(`${pathname}?${queryString}`);
        });
      } else {
        const returnPage = getBasePage(pathname, 1);
        params.delete(paramName);
        params.delete("search");

        if (returnPage > 1) {
          params.set("page", String(returnPage));
        } else {
          params.delete("page");
        }

        const queryString = params.toString();
        startTransition(() => {
          router.push(queryString ? `${pathname}?${queryString}` : pathname);
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, syncWithUrl, paramName, pathname, searchParams, router, debounceMs]);

  const hasValue = Boolean(currentValue && currentValue.length > 0);

  return (
    <div
      ref={containerRef}
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
          onFocus={handleFocus}
          placeholder={placeholder}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-inter font-normal xl:text-sm lg:text-[13px] sm:text-[12px] text-[11px] text-dark dark:text-white placeholder:text-light-input-font dark:placeholder:text-white/40 placeholder:font-normal h-full p-0 flex-1 leading-none tracking-normal"
        />

        {isLoading && showSuggestions && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-dark/40 dark:text-white/40 shrink-0 mr-1" />
        )}

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

      {/* Suggestions Dropdown */}
      {showSuggestions && isOpen && internalValue.trim() && (
        <div className="absolute top-[calc(100%+6px)] right-0 w-[280px] sm:w-[320px] md:w-[340px] xl:w-[360px] bg-white dark:bg-dark border border-black/10 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150 font-inter">
          {isLoading && totalSuggestions === 0 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-black/60 dark:text-white/60 text-xs sm:text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-black/60 dark:text-white/60" />
              <span>{isPersonSearch ? "Searching persons..." : "Searching movies, tv shows..."}</span>
            </div>
          ) : isPersonSearch && personSuggestions.length > 0 ? (
            <div className="flex flex-col max-h-[340px] overflow-y-auto custom-scrollbar">
              {personSuggestions.map((person, index) => (
                <PersonSuggestionItem
                  key={`${person.id}-${index}`}
                  person={person}
                  isSelected={index === selectedIndex}
                  onSelect={() => handleSelectPerson(person)}
                />
              ))}
            </div>
          ) : !isPersonSearch && movieSuggestions.length > 0 ? (
            <div className="flex flex-col max-h-[340px] overflow-y-auto custom-scrollbar">
              {movieSuggestions.map((item, index) => (
                <MovieSuggestionItem
                  key={`${item.id}-${index}`}
                  item={item}
                  isSelected={index === selectedIndex}
                  onSelect={() => handleSelectMovie(item)}
                />
              ))}
            </div>
          ) : !isLoading ? (
            <div className="px-4 py-4 text-center text-xs sm:text-sm text-black/50 dark:text-white/50">
              No results found for &ldquo;{internalValue.trim()}&rdquo;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function PersonSuggestionItem({
  person,
  isSelected,
  onSelect,
}: {
  person: Person;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hasError, setHasError] = useState(false);
  const imgSrc = hasError || !person.image ? "/assets/persons-image.jpg" : person.image;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-left select-none",
        isSelected
          ? "bg-light-dropdown-hover dark:bg-dropdown-hover"
          : "hover:bg-light-dropdown-hover/50 dark:hover:bg-dropdown-hover"
      )}
    >
      {/* Avatar Thumbnail */}
      <div className="relative w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full overflow-hidden shrink-0 bg-neutral-800 border border-black/10 dark:border-white/10 shadow-sm">
        <Image
          src={imgSrc}
          alt={person.name}
          fill
          sizes="80px"
          className="object-cover object-[center_15%] select-none"
          onError={() => setHasError(true)}
        />
      </div>

      {/* Person Details */}
      <div className="flex flex-col flex-1 min-w-0 font-inter">
        <h4 className="text-[13px] sm:text-[14px] font-medium font-poppins text-black dark:text-white truncate">
          {person.name}
        </h4>

        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-black/60 dark:text-white/60 mt-0.5">
          <span className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 text-[10px] rounded font-medium text-black/80 dark:text-white/80">
            {person.role || "Actor"}
          </span>

          {person.knownFor && (
            <span className="truncate max-w-[170px] sm:max-w-[210px] text-light-genre-font dark:text-genre-font text-[11px]">
              {person.knownFor}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MovieSuggestionItem({
  item,
  isSelected,
  onSelect,
}: {
  item: MovieItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hasError, setHasError] = useState(false);
  const imgSrc = hasError || !item.image ? "/assets/movie-placeholder.jpg" : item.image;
  const isTv = item.mediaType === "tv";
  const releaseYear = item.year || item.releaseYear;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-left select-none",
        isSelected
          ? "bg-light-dropdown-hover dark:bg-dropdown-hover"
          : "hover:bg-light-dropdown-hover/50 dark:hover:bg-dropdown-hover"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-[34px] h-[50px] sm:w-[38px] sm:h-[54px] rounded overflow-hidden shrink-0 bg-neutral-800 shadow-sm">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="80px"
          className="object-cover select-none"
          onError={() => setHasError(true)}
        />
      </div>

      {/* Movie / Show Details */}
      <div className="flex flex-col flex-1 min-w-0 font-inter">
        <h4 className="text-[13px] sm:text-[14px] font-medium font-poppins text-black dark:text-white truncate">
          {item.title}
        </h4>

        <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-black/60 dark:text-white/60 mt-0.5">
          <span className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 text-[10px] rounded font-medium text-black/80 dark:text-white/80">
            {isTv ? "TV Show" : "Movie"}
          </span>

          {releaseYear && (
            <span>{releaseYear}</span>
          )}

          {item.rating && (
            <span className="flex items-center gap-0.5 font-medium text-black/80 dark:text-white/80">
              <Star className="w-3 h-3 fill-fill-star text-fill-star" />
              {item.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


