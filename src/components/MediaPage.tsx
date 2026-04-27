"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SortDropdown } from "@/components/SortDropdown";
import { FilterPanel } from "@/components/FilterPanel";
import { PostersGrid } from "@/components/PostersGrid";
import { Pagination } from "@/components/Pagination";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SearchBar } from "./SearchBar";
import { PersonsGrid } from "./PersonsGrid";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import BasePathContext from "@/contexts/BasePathContext";

type MediaType = "movie" | "tv" | "genre" | "trending" | "top-rated";

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
                return `/genres/${param?.toLowerCase().replace(/\s+/g, "-")}`;
            case "trending":
                return `/trending/${param?.toLowerCase().replace(/\s+/g, "-")}`;
            case "top-rated":
                return `/top-rated/${param?.toLowerCase().replace(/\s+/g, "-")}`;
            default:
                return "/";
        }
    })();

    return (
        <section className="container-1440 mt-[72px]">
            <div className="flex justify-between items-center mt-[110px]">
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
                            <ChevronLeft className="w-[28px] h-[28px] text-black/85 group-hover:text-black" />

                            <h1 className="font-akshar text-[28px] font-medium text-black/85 group-hover:text-black">
                                {isPersonDetails
                                    ? "Person Details"
                                    : isMovie
                                        ? "Movie Details"
                                        : "TV Shows Details"}
                            </h1>
                        </div>
                    ) : (
                        <h1 className="font-akshar text-[28px] font-medium text-black/85">
                            {type === "tv"
                                ? "TV Shows"
                                : type === "movie"
                                    ? "Movies"
                                    : type === "genre"
                                        ? param
                                        : type === "trending"
                                            ? "Trending " + param
                                            : type === "top-rated"
                                                ? "Top Rated " + param
                                                : ""}
                        </h1>
                    )
                }

                <div className="flex gap-[18px]">
                    {(isPersonDetails || isPosterDetails) ? (
                        <SearchBar />
                    ) : (
                        <>
                            {showSearch ? <SearchBar /> : <SortDropdown />}

                            <Button
                                onClick={() => setFilterOpen((prev) => !prev)}
                                className="filter-btn w-[113px] h-[37px] flex items-center justify-center text-dark font-inter font-medium text-sm bg-light-dropdown hover:bg-light-dropdown/95 rounded-none"
                            >
                                Filter
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {hasParam || hasParam2 ? (
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