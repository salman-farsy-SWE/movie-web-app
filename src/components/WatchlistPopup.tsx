"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { MdDeleteForever } from "react-icons/md";
import { FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { TiPin } from "react-icons/ti";
import { Plus, Heart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserCollectionsStore, type CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import { useRating } from "@/contexts/RatingContext";
import { useList } from "@/contexts/ListContext";

export type CollectionPageType = "favorite" | "watchlist" | "rating" | "list" | "general";

interface WatchlistPopupProps {
    media?: CollectionMediaItem;
    currentListId?: string | number;
    pageType?: CollectionPageType;
    onClose?: () => void;
}

export function WatchlistPopup({ media, currentListId, pageType, onClose }: WatchlistPopupProps) {
    const pathname = usePathname() || "";

    const toggleFavorite = useUserCollectionsStore((state) => state.toggleFavorite);
    const removeFavorite = useUserCollectionsStore((state) => state.removeFavorite);
    const toggleWatchlist = useUserCollectionsStore((state) => state.toggleWatchlist);
    const removeWatchlist = useUserCollectionsStore((state) => state.removeWatchlist);
    const removeUserRating = useUserCollectionsStore((state) => state.removeUserRating);
    const customLists = useUserCollectionsStore((state) => state.customLists);
    const toggleListItem = useUserCollectionsStore((state) => state.toggleListItem);
    const removeItemFromList = useUserCollectionsStore((state) => state.removeItemFromList);
    const isItemInList = useUserCollectionsStore((state) => state.isItemInList);

    const { openRating } = useRating();
    const { openCreate } = useList();

    const mediaId = media?.id;
    const mediaTitle = media?.title?.trim().toLowerCase();

    const isFav = useUserCollectionsStore((state) =>
        mediaId !== undefined
            ? state.favorites.some(
                  (f) =>
                      String(f.id) === String(mediaId) ||
                      Boolean(mediaTitle && f.title && f.title.trim().toLowerCase() === mediaTitle)
              )
            : false
    );
    const inWatchlist = useUserCollectionsStore((state) =>
        mediaId !== undefined
            ? state.watchlist.some(
                  (w) =>
                      String(w.id) === String(mediaId) ||
                      Boolean(mediaTitle && w.title && w.title.trim().toLowerCase() === mediaTitle)
              )
            : false
    );
    const storeRating = useUserCollectionsStore((state) =>
        mediaId !== undefined ? state.ratings[String(mediaId)]?.rating : undefined
    );
    const userRating = storeRating ?? media?.userRating;

    // Resolve active context (either explicit pageType or auto-detected from route/props)
    const resolvedPageType: CollectionPageType = useMemo(() => {
        if (pageType) return pageType;
        if (currentListId !== undefined) return "list";
        if (pathname.includes("/favorite")) return "favorite";
        if (pathname.includes("/watchlist")) return "watchlist";
        if (pathname.includes("/rating")) return "rating";
        if (pathname.includes("/list/") && pathname.split("/list/")[1]?.length > 0) return "list";
        return "general";
    }, [pageType, currentListId, pathname]);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (media) {
            toggleFavorite(media);
        }
    };

    const handleRemoveFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (mediaId !== undefined) {
            removeFavorite(mediaId);
        }
        if (onClose) onClose();
    };

    const handleToggleWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (media) {
            toggleWatchlist(media);
        }
    };

    const handleRemoveWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (mediaId !== undefined) {
            removeWatchlist(mediaId);
        }
        if (onClose) onClose();
    };

    const handleRemoveRating = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (mediaId !== undefined) {
            removeUserRating(mediaId, media?.mediaType);
        }
        if (onClose) onClose();
    };

    const handleOpenRating = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (media) {
            openRating(media);
        }
        if (onClose) onClose();
    };

    const handleCreateList = (e: React.MouseEvent) => {
        e.stopPropagation();
        openCreate();
        if (onClose) onClose();
    };

    const handleRemoveFromCurrentList = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (media && currentListId !== undefined) {
            removeItemFromList(currentListId, media.id, media.title);
        }
        if (onClose) onClose();
    };

    const handleToggleList = (e: React.MouseEvent, listId: string | number) => {
        e.stopPropagation();
        if (media) {
            toggleListItem(listId, media);
        }
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "relative w-[165px] sm:w-[185px] lg:w-[200px] xl:w-[215px] flex flex-col overflow-hidden sm:rounded-xl rounded-lg",
                "bg-dropdown/95 backdrop-blur-xl",
                "border border-white/10",
                "text-white/95",
                "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
                "font-inter transition-all duration-200 select-none"
            )}
        >
            {/* Smart Direct Delete Buttons for Specific Collection Pages */}
            {resolvedPageType === "favorite" && (
                <button
                    type="button"
                    onClick={handleRemoveFavorite}
                    className="flex items-center gap-2.5 px-3 py-2 sm:py-2.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red hover:text-white transition-all w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer border-b border-white/10"
                >
                    <Trash2 className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] lg:h-[16px] lg:w-[16px] text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate font-semibold tracking-tight">Remove from Favorites</span>
                </button>
            )}

            {resolvedPageType === "watchlist" && (
                <button
                    type="button"
                    onClick={handleRemoveWatchlist}
                    className="flex items-center gap-2.5 px-3 py-2 sm:py-2.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red hover:text-white transition-all w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer border-b border-white/10"
                >
                    <Trash2 className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] lg:h-[16px] lg:w-[16px] text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate font-semibold tracking-tight">Remove from Watchlist</span>
                </button>
            )}

            {resolvedPageType === "rating" && (
                <button
                    type="button"
                    onClick={handleRemoveRating}
                    className="flex items-center gap-2.5 px-3 py-2 sm:py-2.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red hover:text-white transition-all w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer border-b border-white/10"
                >
                    <Trash2 className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] lg:h-[16px] lg:w-[16px] text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate font-semibold tracking-tight">
                        Remove Rating {userRating !== undefined ? `(${typeof userRating === "number" && !isNaN(userRating) ? userRating.toFixed(1) : userRating}★)` : ""}
                    </span>
                </button>
            )}

            {resolvedPageType === "list" && currentListId !== undefined && (
                <button
                    type="button"
                    onClick={handleRemoveFromCurrentList}
                    className="flex items-center gap-2.5 px-3 py-2 sm:py-2.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red hover:text-white transition-all w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer border-b border-white/10"
                >
                    <Trash2 className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] lg:h-[16px] lg:w-[16px] text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate font-semibold tracking-tight">Remove from List</span>
                </button>
            )}

            {/* Top Action Items */}
            <div className="flex flex-col py-1.5 border-b border-white/10">
                {/* Rating Actions */}
                {resolvedPageType === "rating" ? (
                    <button
                        type="button"
                        onClick={handleOpenRating}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer"
                    >
                        <FaRegStarHalfStroke className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px] lg:h-[15px] lg:w-[15px] ml-[1px] text-white/70 group-hover:text-trails-blue transition-colors" />
                        <span className="truncate font-medium">Update Rating</span>
                    </button>
                ) : userRating !== undefined ? (
                    <>
                        <button
                            type="button"
                            onClick={handleRemoveRating}
                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer text-white/80 hover:text-trails-red"
                        >
                            <MdDeleteForever className="h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] lg:h-[16px] lg:w-[16px] text-white/70 group-hover:text-trails-red transition-colors" />
                            <span className="truncate font-medium">Remove Rating ({typeof userRating === "number" && !isNaN(userRating) ? userRating.toFixed(1) : userRating}★)</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenRating}
                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer"
                        >
                            <FaRegStarHalfStroke className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px] lg:h-[15px] lg:w-[15px] ml-[1px] text-white/70 group-hover:text-trails-blue transition-colors" />
                            <span className="truncate font-medium">Update Rating</span>
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={handleOpenRating}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer"
                    >
                        <FaStar className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px] lg:h-[15px] lg:w-[15px] ml-[1px] text-white/70 group-hover:text-fill-star transition-colors" />
                        <span className="truncate font-medium">Give Rating</span>
                    </button>
                )}

                {/* Favorite Action (Hide if already direct delete on Favorite page) */}
                {resolvedPageType !== "favorite" && (
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group cursor-pointer"
                    >
                        <Heart
                            className={cn(
                                "h-[14px] w-[14px] sm:h-[15px] sm:w-[15px] lg:h-[16px] lg:w-[16px] transition-colors shrink-0",
                                isFav ? "fill-white text-white" : "fill-transparent text-white/70 group-hover:text-white"
                            )}
                        />
                        <span className="truncate font-medium">
                            {isFav ? "Remove Favorite" : "Add Favorite"}
                        </span>
                    </button>
                )}
            </div>

            {/* Watchlist Section */}
            <div className="flex flex-col">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleToggleWatchlist}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (media) toggleWatchlist(media);
                        }
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-white/5 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                >
                    <Checkbox
                        checked={inWatchlist}
                        tabIndex={-1}
                        className="pointer-events-none h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 rounded-[3px] border-white/40 data-[state=checked]:bg-trails-blue data-[state=checked]:border-trails-blue data-[state=checked]:text-white [&_svg]:h-[10px] [&_svg]:w-[10px] sm:[&_svg]:h-3 sm:[&_svg]:w-3"
                    />
                    <span
                        className="flex items-center gap-1.5 text-[11px] sm:text-[12px] lg:text-[13px] font-medium hover:text-white transition-colors select-none"
                    >
                        <TiPin className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px] lg:h-[18px] lg:w-[18px] text-white/70" />
                        Watchlist
                    </span>
                </div>

                {/* Lists */}
                <div className="flex flex-col max-h-[75px] sm:max-h-[85px] md:max-h-[95px] lg:max-h-[105px] xl:max-h-[115px] overflow-y-auto custom-scrollbar p-1.5">
                    {customLists.map((list) => {
                        const inList = mediaId !== undefined ? isItemInList(list.id, mediaId, media?.title) : false;
                        return (
                            <div
                                key={list.id}
                                role="button"
                                tabIndex={0}
                                className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                                onClick={(e) => handleToggleList(e, list.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        if (media) toggleListItem(list.id, media);
                                    }
                                }}
                            >
                                <Checkbox
                                    checked={inList}
                                    tabIndex={-1}
                                    className="pointer-events-none h-[11px] w-[11px] sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 rounded-[3px] border-white/30 data-[state=checked]:bg-trails-blue data-[state=checked]:border-trails-blue data-[state=checked]:text-white [&_svg]:h-[8px] [&_svg]:w-[8px] sm:[&_svg]:h-[10px] sm:[&_svg]:w-[10px]"
                                />
                                <span
                                    className="truncate text-[10px] sm:text-[11px] lg:text-[13px] text-white/80 font-medium select-none"
                                >
                                    {list.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Action */}
            <button
                type="button"
                onClick={handleCreateList}
                className="flex items-center justify-center gap-2 py-2 sm:py-2.5 lg:py-3 bg-white/5 hover:bg-white/10 border-t border-white/10 transition-colors text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-white/90 cursor-pointer"
            >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                Create New List
            </button>
        </div>
    );
}