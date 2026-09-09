"use client";

import { useState } from "react";
import { SortDropdown } from "@/components/SortDropdown";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { FilterButton } from "@/components/filters/FilterButton";
import { PostersGrid } from "@/components/media/PostersGrid";
import { Pagination } from "@/components/Pagination";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SearchBar } from "@/components/SearchBar";
import { PersonsGrid } from "@/components/media/PersonsGrid";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BasePathContext from "@/contexts/BasePathContext";
import { cn, slugify } from "@/lib/utils";
import type { MovieItem } from "@/data/mock-home";
import type { Person } from "@/components/media/PersonCard";
import { type FilterContextType, resolveGenreDef, type SearchMediaType } from "@/lib/tmdb";

type MediaType = "movie" | "tv" | "genre" | "trending" | "top-rated" | "search";

interface MediaPageProps {
    param?: string;
    type: MediaType;
    showSearch?: boolean;
    searchQuery?: string;
    searchMediaType?: SearchMediaType;
    trendingMedia?: string;
    trendingTimeWindow?: string;
    param2?: string;
    children?: React.ReactNode;
    hidePagination?: boolean;
    isMovie?: boolean;
    items?: MovieItem[];
    personItems?: Person[];
    currentPage?: number;
    totalPages?: number;
    totalResults?: number;
}

export function MediaPage({
    param,
    type,
    showSearch,
    searchQuery,
    searchMediaType,
    trendingMedia,
    trendingTimeWindow,
    param2,
    children,
    hidePagination,
    isMovie,
    items,
    personItems,
    currentPage,
    totalPages,
    totalResults,
}: MediaPageProps) {

    const [filterOpen, setFilterOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useClickOutsideClose({
        enabled: filterOpen,
        selectors: [
            ".filter-container",
            ".filter-btn",
            ".year-popover",
        ],
        onClose: () => setFilterOpen(false),
    });

    const hasParam = !!param;
    const hasParam2 = !!param2;

    const isPersonsList =
        (pathname === "/trending/persons" || param === "persons") && !hasParam2;

    const isPersonDetails =
        (pathname.startsWith("/trending/persons/") || (param === "persons" && hasParam2)) &&
        !isPersonsList;

    const isPosterDetails =
        type === "movie" || type === "tv"
            ? hasParam
            : hasParam && hasParam2;

    const shouldHideControls =
        type === "search" ||
        isPersonDetails ||
        isPosterDetails ||
        showSearch;


    const filterContext: FilterContextType = (() => {
        if (type === "movie" || (type === "trending" && param === "movies") || (type === "top-rated" && param === "movies")) {
            return "movie";
        }
        if (type === "tv" || (type === "trending" && param === "tv-shows") || (type === "top-rated" && param === "tv-shows")) {
            return "tv";
        }
        if (type === "genre") {
            return "genre";
        }
        if (type === "trending") {
            return "trending";
        }
        return "mixed";
    })();

    const basePath = (() => {
        switch (type) {
            case "movie":
                return "/movies";
            case "tv":
                return "/tv-shows";
            case "genre":
                return `/genres/${slugify(param || "")}`;
            case "trending":
                return `/trending/${slugify(param || "")}`;
            case "top-rated":
                return `/top-rated/${slugify(param || "")}`;
            case "search":
                return "/search";
            default:
                return "/";
        }
    })();

    return (
        <section className="container-1440 mt-[72px]">
            <div className="flex justify-between items-center xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2">
                {
                    (isPersonDetails || isPosterDetails) ? (
                        <div
                            onClick={() => {
                                if (window.history.length > 1) {
                                    router.back();
                                } else {
                                    router.push(basePath);
                                }
                            }}
                            className="group flex items-center gap-[4px] cursor-pointer select-none transition-colors duration-75"
                        >
                            <ChevronLeft className="w-[28px] h-[28px] text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90" />

                            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] text-[25px] md:font-medium font-normal text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90">
                                {isPersonDetails
                                    ? "Person Details"
                                    : isMovie
                                        ? "Movie Details"
                                        : "TV Shows Details"}
                            </h1>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
                            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] md:font-medium font-normal text-black dark:text-white capitalize">
                                {isPersonsList
                                    ? searchQuery
                                        ? `Trending Persons - Results for "${searchQuery}"`
                                        : "Trending Persons"
                                    : type === "tv"
                                    ? "TV Shows"
                                    : type === "movie"
                                        ? "Movies"
                                        : type === "genre"
                                        ? resolveGenreDef(param || "")?.canonical || param?.replace(/-/g, " ")
                                            : type === "trending"
                                                ? "Trending " + (param === "tv-shows" ? "TV Shows" : param?.replace(/-/g, " ")) 
                                                : type === "top-rated"
                                                    ? "Top Rated " + (param === "tv-shows" ? "TV Shows" : param?.replace(/-/g, " "))
                                                    : type === "search"
                                                        ? searchQuery
                                                            ? `Search - Results for "${searchQuery}"`
                                                            : param
                                                            ? `Search - Results for "${param.replace(/-/g, " ")}"`
                                                            : "Search Results" : ""}
                            </h1>
                            {type === "search" && totalResults !== undefined && (
                                <span className="font-inter text-xs sm:text-sm md:text-base text-black/60 dark:text-white/60 font-normal whitespace-nowrap">
                                    ({totalResults.toLocaleString()} {totalResults === 1 ? "result" : "results"})
                                </span>
                            )}
                        </div>
                    )
                }

                <div className="flex items-center justify-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px]">
                    {isPersonsList ? (
                        <>
                            <SearchBar placeholder="Search persons..." searchType="person" syncWithUrl />
                            <TrendingFilterTabs
                                param={param}
                                currentTimeWindow={trendingTimeWindow}
                                searchQuery={searchQuery}
                            />
                        </>
                    ) : isPersonDetails ? (
                        <SearchBar
                            placeholder="Search persons..."
                            searchType="person"
                            defaultValue={searchQuery || ""}
                        />
                    ) : type === "search" ? (
                        <SearchMediaTypeTabs query={searchQuery} currentType={searchMediaType || "all"} />
                    ) : type === "trending" ? (
                        <TrendingFilterTabs
                            param={param}
                            currentMedia={trendingMedia}
                            currentTimeWindow={trendingTimeWindow}
                        />
                    ) : shouldHideControls ? (
                        <SearchBar
                            placeholder="Search movies, TV shows..."
                            defaultValue={searchQuery || ""}
                        />
                    ) : (
                        <>
                            {type !== "top-rated" && (
                                <SortDropdown context={filterContext} />
                            )}
                            {type !== "top-rated" && (
                                <FilterButton onClick={() => setFilterOpen((prev) => !prev)} />
                            )}
                        </>
                    )}
                </div>
            </div>

            {(hasParam || (hasParam && hasParam2)) ? (
                <Breadcrumb subRoute={param} type={type} subRoute2={param2} />
            ) : null}

            {!shouldHideControls && type !== "top-rated" && type !== "trending" && (
                <FilterPanel
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    context={filterContext}
                    pageType={type}
                    param={param}
                />
            )}
            {
                children ? (
                    <BasePathContext.Provider value={{ basePath }}>
                        {children}
                    </BasePathContext.Provider>
                ) : isPersonsList ? (
                    <PersonsGrid basePath={basePath} items={personItems} searchQuery={searchQuery} />
                ) : (
                    <PostersGrid basePath={basePath} items={items} context={filterContext} />
                )

            }
            {!hidePagination && totalPages !== undefined && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
        </section >
    );
}

function SearchMediaTypeTabs({
    query,
    currentType = "all",
}: {
    query?: string;
    currentType?: SearchMediaType;
}) {
    const tabs: { label: string; value: SearchMediaType }[] = [
        { label: "All", value: "all" },
        { label: "Movies", value: "movie" },
        { label: "TV Shows", value: "tv" },
    ];

    const getHref = (typeVal: SearchMediaType) => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (typeVal !== "all") params.set("type", typeVal);
        const qs = params.toString();
        return qs ? `/search?${qs}` : "/search";
    };

    return (
        <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-light-dropdown/60 dark:bg-dropdown/60 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5">
            {tabs.map((tab) => {
                const isActive = currentType === tab.value;
                return (
                    <Link
                        key={tab.value}
                        href={getHref(tab.value)}
                        className={cn(
                            "px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-inter font-medium rounded-md transition-all duration-150 select-none",
                            isActive
                                ? "bg-light-nav dark:bg-trails-red text-white shadow-sm font-semibold"
                                : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}

function TrendingFilterTabs({
    param,
    currentMedia = "all",
    currentTimeWindow = "week",
    searchQuery,
}: {
    param?: string;
    currentMedia?: string;
    currentTimeWindow?: string;
    searchQuery?: string;
}) {
    const isTodayOrWeek = param === "today" || param === "this-week";
    const isMoviesOrTvOrPersons =
        param === "movies" || param === "tv-shows" || param === "persons";

    if (isTodayOrWeek) {
        const mediaTabs = [
            { label: "All", value: "all" },
            { label: "Movies", value: "movies" },
            { label: "TV Shows", value: "tv_shows" },
        ];

        const normalizedMedia =
            currentMedia === "movies" || currentMedia === "movie"
                ? "movies"
                : currentMedia === "tv_shows" || currentMedia === "tv"
                ? "tv_shows"
                : "all";

        const getHref = (mediaVal: string) => {
            const params = new URLSearchParams();
            if (mediaVal !== "all") {
                params.set("media", mediaVal);
            }
            const qs = params.toString();
            return qs ? `/trending/${param}?${qs}` : `/trending/${param}`;
        };

        return (
            <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-light-dropdown/60 dark:bg-dropdown/60 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5">
                {mediaTabs.map((tab) => {
                    const isActive = normalizedMedia === tab.value;
                    return (
                        <Link
                            key={tab.value}
                            href={getHref(tab.value)}
                            className={cn(
                                "px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-inter font-medium rounded-md transition-all duration-150 select-none",
                                isActive
                                    ? "bg-light-nav dark:bg-trails-red text-white shadow-sm font-semibold"
                                    : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        );
    }

    if (isMoviesOrTvOrPersons) {
        const timeTabs = [
            { label: "Today", value: "day" },
            { label: "This Week", value: "week" },
        ];

        const normalizedTime =
            currentTimeWindow === "day" || currentTimeWindow === "today"
                ? "day"
                : "week";

        const getHref = (timeVal: string) => {
            const params = new URLSearchParams();
            if (searchQuery) {
                params.set("q", searchQuery);
            }
            if (timeVal !== "week") {
                params.set("time_window", timeVal);
            }
            const qs = params.toString();
            return qs ? `/trending/${param}?${qs}` : `/trending/${param}`;
        };

        return (
            <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-light-dropdown/60 dark:bg-dropdown/60 backdrop-blur-sm rounded-lg border border-black/5 dark:border-white/5">
                {timeTabs.map((tab) => {
                    const isActive = normalizedTime === tab.value;
                    return (
                        <Link
                            key={tab.value}
                            href={getHref(tab.value)}
                            className={cn(
                                "px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-[13px] font-inter font-medium rounded-md transition-all duration-150 select-none",
                                isActive
                                    ? "bg-light-nav dark:bg-trails-red text-white shadow-sm font-semibold"
                                    : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        );
    }

    return null;
}