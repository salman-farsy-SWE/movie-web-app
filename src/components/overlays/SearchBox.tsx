"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Star, Loader2 } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { slugify } from "@/lib/utils";
import type { MovieItem } from "@/types";

export function SearchBox() {
  const setOpen = useUIStore((state) => state.setSearchOpen);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Fetch actual items from TMDB based on user query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: abortController.signal }
        );
        if (res.ok) {
          const data: MovieItem[] = await res.json();
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          setItems([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setItems([]);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setItems([]);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleSearch = (searchQuery?: string) => {
    const target = searchQuery ?? query;
    const trimmed = target.trim();
    if (!trimmed) return;

    setOpen(false);
    setTimeout(() => {
      router.push(`/search/${slugify(trimmed.toLowerCase())}`);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }, 50);
  };

  const handleSelectMovie = (title: string) => {
    setOpen(false);
    setTimeout(() => {
      router.push(`/search/${slugify(title.toLowerCase())}`);
      router.push(`/search?q=${encodeURIComponent(title)}`);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      if (query) {
        e.preventDefault();
        e.stopPropagation();
        handleClear();
      } else {
        setOpen(false);
      }
    }
  };

  const MAX_SEARCH_ITEMS = 6;
  const displayedItems = items.slice(0, MAX_SEARCH_ITEMS);

  return (
    <div className="w-[95vw] sm:w-[90vw] md:w-[840px] lg:w-[960px] xl:w-[1060px] max-h-[82vh] flex flex-col rounded-xl md:rounded-2xl bg-white dark:bg-dropdown shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden text-black dark:text-white transition-all">
      {/* Search Header Area */}
      <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10">
        <div className="relative flex items-center w-full gap-3">
          <Search className="w-5 h-5 text-black/60 dark:text-white/60 shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder="Search movies, TV shows..."
            className="flex-1 bg-transparent text-base sm:text-lg font-normal font-inter text-black dark:text-white placeholder:text-light-search-font dark:placeholder:text-white/40 focus:outline-none tracking-wide"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSearch()}
            className="px-3.5 py-1.5 rounded-lg bg-light-nav hover:bg-light-nav/90 dark:bg-trails-red dark:hover:bg-trails-red/90 text-white text-xs sm:text-sm font-poppins font-medium transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Grid Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-[160px] max-h-[460px] custom-scrollbar">
        {query.trim() === "" ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-black/50 dark:text-white/50">
            <Search className="w-8 h-8 mb-2 text-black/30 dark:text-white/30" />
            <p className="text-sm sm:text-base font-medium font-poppins text-black/70 dark:text-white/70">
              Type to search movies and TV shows
            </p>
          </div>
        ) : isLoading && displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-black/50 dark:text-white/50">
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-light-nav dark:text-trails-red" />
            <p className="text-sm font-medium">Searching TMDB for &ldquo;{query}&rdquo;...</p>
          </div>
        ) : displayedItems.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayedItems.map((item) => (
                <SearchBoxItem
                  key={item.id}
                  item={item}
                  onSelect={(title) => handleSelectMovie(title)}
                />
              ))}
            </div>

            {/* See all results - directly below SearchBoxItems */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => handleSearch()}
                className="inline-flex items-center gap-1 text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white font-medium font-poppins text-xs sm:text-sm transition-colors cursor-pointer hover:underline"
              >
                <span>See all results</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-black/50 dark:text-white/50">
            <Search className="w-7 h-7 mb-2 text-black/30 dark:text-white/30" />
            <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Press Enter section - above the bottom line of searchbox */}
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center text-xs sm:text-sm text-black/60 dark:text-white/60 font-inter">
        <div className="flex items-center gap-1.5">
          <span>Press</span>
          <kbd className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-mono font-medium text-black dark:text-white bg-black/5 dark:bg-white/10 border border-black/15 dark:border-white/15 rounded shadow-sm">
            ↵ Enter
          </kbd>
          <span>to see full search results page</span>
        </div>
      </div>
    </div>
  );
}

function SearchBoxItem({
  item,
  onSelect,
}: {
  item: MovieItem;
  onSelect: (title: string) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const imgSrc = hasError || !item.image ? "/assets/movie-placeholder.jpg" : item.image;

  return (
    <div
      onClick={() => onSelect(item.title)}
      className="group flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
    >
      {/* Poster Thumbnail */}
      <div className="relative w-[48px] h-[68px] sm:w-[52px] sm:h-[74px] rounded overflow-hidden shrink-0 bg-neutral-800">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="100px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      </div>

      {/* Movie Info */}
      <div className="flex flex-col flex-1 min-w-0 font-inter">
        <h3 className="text-sm sm:text-[15px] font-medium font-poppins text-black dark:text-white transition-colors truncate">
          {item.title}
        </h3>
        <p className="text-xs text-light-genre-font dark:text-genre-font truncate mt-0.5">
          {item.genre || "Movie"}
        </p>
        <div className="flex items-center gap-2 text-xs text-black/70 dark:text-white/70 mt-1">
          {item.rating && (
            <span className="flex items-center gap-1 font-medium text-black dark:text-white">
              <Star className="w-3 h-3 fill-fill-star text-fill-star" />
              {item.rating}
            </span>
          )}
          {(item.year || item.releaseYear) && (
            <>
              {item.rating && <span className="text-black/30 dark:text-white/30">•</span>}
              <span className="text-black/60 dark:text-white/60">
                {item.year || item.releaseYear}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
