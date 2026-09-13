"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { Bookmark, Heart, Plus, Trash2, Edit3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserCollectionsStore, type CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import { useUIStore } from "@/stores/useUIStore";
import { useAuth } from "@/contexts/AuthContext";

export type CollectionPageType = "favorite" | "watchlist" | "rating" | "list" | "general";

interface WatchlistPopupProps {
    media?: CollectionMediaItem;
    currentListId?: string | number;
    pageType?: CollectionPageType;
    onClose?: () => void;
}

export function WatchlistPopup({ media, currentListId, pageType, onClose }: WatchlistPopupProps) {
    const pathname = usePathname() || "";
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const toggleFavorite = useUserCollectionsStore((state) => state.toggleFavorite);
    const removeFavorite = useUserCollectionsStore((state) => state.removeFavorite);
    const toggleWatchlist = useUserCollectionsStore((state) => state.toggleWatchlist);
    const removeWatchlist = useUserCollectionsStore((state) => state.removeWatchlist);
    const removeUserRating = useUserCollectionsStore((state) => state.removeUserRating);
    const customLists = useUserCollectionsStore((state) => state.customLists);
    const toggleListItem = useUserCollectionsStore((state) => state.toggleListItem);
    const removeItemFromList = useUserCollectionsStore((state) => state.removeItemFromList);
    const isItemInList = useUserCollectionsStore((state) => state.isItemInList);

    const openRating = useUIStore((state) => state.openRating);
    const openCreate = useUIStore((state) => state.openCreateList);

    const mediaId = media?.id;
    const mediaTitle = media?.title?.trim().toLowerCase();

    const isFav = useUserCollectionsStore((state) =>
        isAuthenticated && mediaId !== undefined
            ? state.favorites.some(
                (f) =>
                    String(f.id) === String(mediaId) ||
                    Boolean(mediaTitle && f.title && f.title.trim().toLowerCase() === mediaTitle)
            )
            : false
    );
    const inWatchlist = useUserCollectionsStore((state) =>
        isAuthenticated && mediaId !== undefined
            ? state.watchlist.some(
                (w) =>
                    String(w.id) === String(mediaId) ||
                    Boolean(mediaTitle && w.title && w.title.trim().toLowerCase() === mediaTitle)
            )
            : false
    );
    const storeRating = useUserCollectionsStore((state) =>
        isAuthenticated && mediaId !== undefined ? state.ratings[String(mediaId)]?.rating : undefined
    );
    const userRating = isAuthenticated ? (storeRating ?? media?.userRating) : undefined;

    const resolvedPageType: CollectionPageType = useMemo(() => {
        if (pageType) return pageType;
        if (currentListId !== undefined) return "list";
        if (pathname.includes("/favorite")) return "favorite";
        if (pathname.includes("/watchlist")) return "watchlist";
        if (pathname.includes("/rating")) return "rating";
        if (pathname.includes("/list/") && pathname.split("/list/")[1]?.length > 0) return "list";
        return "general";
    }, [pageType, currentListId, pathname]);

    const requireAuth = (): boolean => {
        if (!isAuthenticated) {
            if (onClose) onClose();
            const returnUrl = pathname || "/";
            router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`, { scroll: false });
            return false;
        }
        return true;
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (media) {
            toggleFavorite(media);
        }
    };

    const handleRemoveFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (mediaId !== undefined) {
            removeFavorite(mediaId);
        }
        if (onClose) onClose();
    };

    const handleToggleWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (media) {
            toggleWatchlist(media);
        }
    };

    const handleRemoveWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (mediaId !== undefined) {
            removeWatchlist(mediaId);
        }
        if (onClose) onClose();
    };

    const handleRemoveRating = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (mediaId !== undefined) {
            removeUserRating(mediaId, media?.mediaType);
        }
        if (onClose) onClose();
    };

    const handleOpenRating = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (media) {
            openRating(media);
        }
        if (onClose) onClose();
    };

    const handleCreateList = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        openCreate();
        if (onClose) onClose();
    };

    const handleRemoveFromCurrentList = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (media && currentListId !== undefined) {
            removeItemFromList(currentListId, media.id, media.title);
        }
        if (onClose) onClose();
    };

    const handleToggleList = (e: React.MouseEvent, listId: string | number) => {
        e.stopPropagation();
        if (!requireAuth()) return;
        if (media) {
            toggleListItem(listId, media);
        }
    };

    const formattedRating =
        userRating !== undefined && typeof userRating === "number" && !isNaN(userRating)
            ? userRating % 1 === 0
                ? userRating.toFixed(0)
                : userRating.toFixed(1)
            : userRating;

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "relative w-[155px] sm:w-[165px] md:w-[172px] lg:w-[178px] xl:w-[182px] flex flex-col overflow-hidden rounded-md sm:rounded-lg select-none",
                "bg-[#383838]",
                "border border-white/10",
                "text-white/90",
                "shadow-lg drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]",
                "font-inter transition-all duration-200"
            )}
        >
            {resolvedPageType === "favorite" && (
                <button
                    type="button"
                    onClick={handleRemoveFavorite}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red transition-all w-full text-left text-[11px] sm:text-[11.5px] group cursor-pointer border-b border-white/10 font-medium"
                >
                    <Trash2 className="h-3.5 w-3.5 text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate">Remove Favorite</span>
                </button>
            )}

            {resolvedPageType === "watchlist" && (
                <button
                    type="button"
                    onClick={handleRemoveWatchlist}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red transition-all w-full text-left text-[11px] sm:text-[11.5px] group cursor-pointer border-b border-white/10 font-medium"
                >
                    <Trash2 className="h-3.5 w-3.5 text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate">Remove Watchlist</span>
                </button>
            )}

            {resolvedPageType === "rating" && (
                <button
                    type="button"
                    onClick={handleRemoveRating}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red transition-all w-full text-left text-[11px] sm:text-[11.5px] group cursor-pointer border-b border-white/10 font-medium"
                >
                    <Trash2 className="h-3.5 w-3.5 text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate">
                        Remove Rating {formattedRating ? `(${formattedRating}★)` : ""}
                    </span>
                </button>
            )}

            {resolvedPageType === "list" && currentListId !== undefined && (
                <button
                    type="button"
                    onClick={handleRemoveFromCurrentList}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-trails-red/10 hover:bg-trails-red/20 text-trails-red transition-all w-full text-left text-[11px] sm:text-[11.5px] group cursor-pointer border-b border-white/10 font-medium"
                >
                    <Trash2 className="h-3.5 w-3.5 text-trails-red transition-transform group-hover:scale-110 shrink-0" />
                    <span className="truncate">Remove from List</span>
                </button>
            )}

            <div className="flex flex-col py-0.5 sm:py-1 border-b border-white/10">
                <span className="px-2.5 sm:px-3 pt-1 pb-0.5 text-[9px] sm:text-[9.5px] uppercase font-bold tracking-wider text-genre-font">
                    Quick Actions
                </span>

                {userRating !== undefined ? (
                    <div className="flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-white/[0.08] transition-colors w-full group">
                        <button
                            type="button"
                            onClick={handleOpenRating}
                            className="flex items-center gap-2 flex-1 min-w-0 text-left text-[11px] sm:text-[11.5px] lg:text-[12px] cursor-pointer"
                        >
                            <FaStar className="h-3.5 w-3.5 text-fill-star shrink-0" />
                            <span className="truncate font-medium text-white/90">
                                Rated <span className="font-semibold text-fill-star">{formattedRating}★</span>
                            </span>
                            <Edit3 className="h-3 w-3 text-white/40 group-hover:text-white/80 transition-colors shrink-0 ml-auto mr-1 opacity-0 group-hover:opacity-100" />
                        </button>
                        <button
                            type="button"
                            title="Remove Rating"
                            onClick={handleRemoveRating}
                            className="p-0.5 rounded hover:bg-trails-red/15 text-white/40 hover:text-trails-red transition-colors cursor-pointer shrink-0"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleOpenRating}
                        className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-white/[0.08] transition-colors w-full text-left text-[11px] sm:text-[11.5px] lg:text-[12px] group cursor-pointer"
                    >
                        <FaRegStar className="h-3.5 w-3.5 text-white/60 group-hover:text-fill-star transition-colors shrink-0" />
                        <span className="truncate font-medium text-white/85 group-hover:text-white">
                            Rate Title
                        </span>
                    </button>
                )}

                {resolvedPageType !== "favorite" && (
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        className="flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-white/[0.08] transition-colors w-full text-left text-[11px] sm:text-[11.5px] lg:text-[12px] group cursor-pointer"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <Heart
                                className={cn(
                                    "h-3.5 w-3.5 transition-colors shrink-0",
                                    isFav
                                        ? "fill-trails-red text-trails-red"
                                        : "fill-transparent text-white/60 group-hover:text-trails-red"
                                )}
                            />
                            <span
                                className={cn(
                                    "truncate font-medium transition-colors",
                                    isFav
                                        ? "text-trails-red font-semibold"
                                        : "text-white/85 group-hover:text-white"
                                )}
                            >
                                {isFav ? "Favorited" : "Add to Favorites"}
                            </span>
                        </div>
                        {isFav && (
                            <span className="text-[9.5px] font-semibold text-trails-red/90 uppercase tracking-tight shrink-0">
                                Added
                            </span>
                        )}
                    </button>
                )}
            </div>

            <div className="flex flex-col py-0.5 sm:py-1">

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
                    className="flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-white/[0.08] transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <Bookmark
                            className={cn(
                                "h-3.5 w-3.5 shrink-0 transition-colors",
                                inWatchlist
                                    ? "fill-trails-blue text-trails-blue"
                                    : "text-white/60 group-hover:text-trails-blue"
                            )}
                        />
                        <span
                            className={cn(
                                "truncate text-[11px] sm:text-[11.5px] lg:text-[12px] font-medium transition-colors select-none",
                                inWatchlist
                                    ? "text-white font-semibold"
                                    : "text-white/80 group-hover:text-white"
                            )}
                        >
                            Watchlist
                        </span>
                    </div>
                    <Checkbox
                        checked={inWatchlist}
                        tabIndex={-1}
                        className="pointer-events-none h-3.5 w-3.5 rounded-[2px] border-trails-blue/50 data-[state=checked]:bg-trails-blue data-[state=checked]:border-trails-blue data-[state=checked]:text-white [&_svg]:h-2.5 [&_svg]:w-2.5 shrink-0"
                    />
                </div>

                {customLists.length > 0 && (
                    <div className="flex flex-col border-t border-white/10 mt-0.5 pt-0.5 max-h-[85px] sm:max-h-[95px] md:max-h-[105px] lg:max-h-[130px] overflow-y-auto custom-scrollbar">
                        <span className="px-2.5 sm:px-3 pt-1 pb-0.5 text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-genre-font">
                            Save to Lists
                        </span>
                        {customLists.map((list) => {
                            const inList = mediaId !== undefined ? isItemInList(list.id, mediaId, media?.title) : false;
                            return (
                                <div
                                    key={list.id}
                                    role="button"
                                    tabIndex={0}
                                    className="flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-white/[0.08] transition-colors cursor-pointer group"
                                    onClick={(e) => handleToggleList(e, list.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            if (media) toggleListItem(list.id, media);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <List
                                            className={cn(
                                                "h-3.5 w-3.5 shrink-0 transition-colors",
                                                inList
                                                    ? "text-white/90"
                                                    : "text-white/40 group-hover:text-white/70"
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "truncate text-[11px] sm:text-[11.5px] lg:text-[12px] transition-colors select-none",
                                                inList
                                                    ? "text-white font-semibold"
                                                    : "text-white/75 group-hover:text-white"
                                            )}
                                        >
                                            {list.title}
                                        </span>
                                    </div>
                                    <Checkbox
                                        checked={inList}
                                        tabIndex={-1}
                                        className="pointer-events-none h-3.5 w-3.5 rounded-[2px] border-white/30 data-[state=checked]:bg-white/90 data-[state=checked]:border-white/90 data-[state=checked]:text-[#1e1e1e] [&_svg]:h-2.5 [&_svg]:w-2.5 shrink-0"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={handleCreateList}
                className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 bg-white/[0.03] hover:bg-white/[0.08] border-t border-white/10 transition-colors text-[11px] sm:text-[11.5px] font-semibold text-white/85 hover:text-white cursor-pointer"
            >
                <Plus className="h-3.5 w-3.5 text-white" />
                <span>Create New List</span>
            </button>
        </div>
    );
}