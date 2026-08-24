"use client";

import { useState } from "react";
import { SortDropdown } from "@/components/SortDropdown";
import { FilterPanel } from "@/components/FilterPanel";
import { FilterButton } from "@/components/FilterButton";
import { PostersGrid } from "@/components/PostersGrid";
import { Pagination } from "@/components/Pagination";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SearchBar } from "./SearchBar";
import { PersonsGrid } from "./PersonsGrid";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import BasePathContext from "@/contexts/BasePathContext";
import { slugify } from "@/lib/utils";

type MediaType = "movie" | "tv" | "genre" | "trending" | "top-rated" | "search";

interface MediaPageProps {
    param?: string;
    type: MediaType;
    showSearch?: boolean;
    param2?: string;
    children?: React.ReactNode;
    hidePagination?: boolean;
    isMovie?: boolean;
}

export function MediaPage({ param, type, showSearch, param2, children, hidePagination, isMovie }: MediaPageProps) {
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

    const isPersonsList = pathname === "/trending/persons";

    const isPersonDetails =
        pathname.startsWith("/trending/persons/") &&
        !isPersonsList;

    const hasParam = !!param;
    const hasParam2 = !!param2;

    const isPosterDetails =
        type === "movie" || type === "tv"
            ? hasParam
            : hasParam && hasParam2;

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
            default:
                return "/";
        }
    })();

    return (
        <section className="container-1440 mt-[72px]">
            <div className="flex justify-between items-center xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2">
                {
                    (isPersonDetails || isPosterDetails || type === "search") ? (
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
                            <ChevronLeft className="w-[28px] h-[28px] text-black group-hover:text-black/75" />

                            <h1 className="font-akshar xl:text-[28px] lg:text-[27px] text-[25px] font-medium text-black group-hover:text-black/75">
                                {isPersonDetails
                                    ? "Person Details"
                                    : isMovie
                                        ? "Movie Details"
                                        : "TV Shows Details"}
                            </h1>
                        </div>
                    ) : (
                        <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] font-medium text-black capitalize">
                            {type === "tv"
                                ? "TV Shows"
                                : type === "movie"
                                    ? "Movies"
                                    : type === "genre"
                                        ? param
                                        : type === "trending"
                                            ? "Trending " + param?.replace(/-/g, " ") 
                                            : type === "top-rated"
                                                ? "Top Rated " + param
                                                : type === "search"
                                                    ? "Search - 24 Results Found" : ""}
                        </h1>
                    )
                }

                <div className="flex items-center justify-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px]">
                    {(isPersonDetails || isPosterDetails) ? (
                        <SearchBar />
                    ) : (
                        <>
                            {showSearch ? <SearchBar /> : <SortDropdown />}

                            <FilterButton onClick={() => setFilterOpen((prev) => !prev)} />
                        </>
                    )}
                </div>
            </div>

            {(hasParam || (hasParam && hasParam2)) ? (
                <Breadcrumb subRoute={param} type={type} subRoute2={param2} />
            ) : null}

            <FilterPanel open={filterOpen} />
            {
                children ? (
                    <BasePathContext.Provider value={{ basePath }}>
                        {children}
                    </BasePathContext.Provider>
                ) : isPersonsList ? (
                    <PersonsGrid basePath={basePath} />
                ) : (
                    <PostersGrid basePath={basePath} />
                )
            }
            {!hidePagination && <Pagination />}
        </section >
    );
}