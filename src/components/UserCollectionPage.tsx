"use client";

import { useState } from "react";
import { SortDropdown } from "@/components/SortDropdown";
import { FilterPanel } from "@/components/FilterPanel";
import { FilterButton } from "@/components/FilterButton";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { useClickOutsideClose } from "@/hooks/useClickOutsideClose";
import { Item } from "./Item";
import { List } from "./List";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "./Breadcrumb";
import { slugify } from "@/lib/utils";
import { ProfileSection } from "./ProfileSection";

type MediaType = "favorite" | "watchlist" | "rating" | "list" | "profile";

interface UserCollectionPageProps {
    param?: string;
    param2?: string;
    type: MediaType;
    hidePagination?: boolean;
}

export function UserCollectionPage({
    param,
    param2,
    type,
    hidePagination,
}: UserCollectionPageProps) {
    const [filterOpen, setFilterOpen] = useState(false);

    const router = useRouter();

    const hasParam = !!param;
    const hasParam2 = !!param2;

    const isListDetails = type === "list" && (hasParam && hasParam2);
    const isProfile = type === "profile";

    useClickOutsideClose({
        enabled: filterOpen,
        selectors: [
            ".filter-container",
            ".filter-btn",
            ".year-popover",
        ],
        onClose: () => setFilterOpen(false),
    });

    return (
        <section className="container-1440 mt-[72px]">
            <div className="flex justify-between lg:items-center items-start xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2">
                {isListDetails ? (
                    <div
                        onClick={() => {
                            if (window.history.length > 1) {
                                router.back();
                            } else {
                                router.push(`/${slugify(param)}/list`);
                            }
                        }}
                        className="group flex items-center gap-[4px] cursor-pointer select-none transition-colors duration-75"
                    >
                        <ChevronLeft className="w-[28px] h-[28px] text-black dark:text-white  group-hover:text-black/75 dark:group-hover:text-white/90" />

                        <h1 className="font-akshar text-[28px] font-medium text-black dark:text-white group-hover:text-black/75 dark:group-hover:text-white/90 capitalize">
                            My List - {param2}
                        </h1>
                    </div>
                ) : (
                    <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] font-medium text-black dark:text-white capitalize">
                        {type === "favorite"
                            ? "favorite item"
                            : type === "watchlist"
                                ? "watchlist item"
                                : type === "rating"
                                    ? "my rating"
                                    : type === "list"
                                        ? "my list" : type === "profile"
                                            ? "profile"
                                            : ""}
                    </h1>
                )}

                {!isProfile && (
                    <div className="flex lg:items-center items-end lg:justify-normal justify-center lg:flex-row flex-col">
                        <div className="xl:mr-[30px] lg:mr-[25px] lg:mt-0 md:mt-6 mt-4 lg:order-1 order-2">
                            <SearchBar />
                        </div>

                        <div className="flex items-center xl:gap-[18px] lg:gap-[16px] sm:gap-[14px] gap-[12px] lg:order-2 order-1">
                            <SortDropdown />

                            {(type !== "list" || (type === "list" && hasParam2)) && (
                                <FilterButton
                                    onClick={() => setFilterOpen((prev) => !prev)} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {!isProfile && (type !== "list" || (type === "list" && hasParam2)) && (
                <FilterPanel open={filterOpen} />
            )}

            {(isListDetails && !isProfile) && (
                <Breadcrumb type={type} subRoute2={param2} />
            )}

            {isProfile ? (
                <ProfileSection />
            ) : (
                type === "list" ? (
                    isListDetails ? (
                        <Item
                            headers={[
                                "Image",
                                "Name",
                                "Rating",
                                "Media",
                                "Released",
                                "",
                            ]}
                        />
                    ) : (
                        <List basePath={`/${param}/list`} />
                    )
                ) : (
                    <Item
                        headers={[
                            "Image",
                            "Name",
                            "Rating",
                            type === "rating" ? "Your Rating" : "Media",
                            "Released",
                            "",
                        ]}
                    />
                )
            )}

            {!isProfile && !hidePagination && <Pagination />}
        </section>
    );
}