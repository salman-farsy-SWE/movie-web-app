"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Heart } from "lucide-react";
import { WatchlistPopup } from "@/components/WatchlistPopup";
import { useUserCollectionsStore, type CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import { cn, slugify } from "@/lib/utils";
import { AddButton } from "@/components/AddButton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_POSTER_IMAGE = "/assets/movie-placeholder.jpg";

export function PosterCard({
    id,
    title,
    image,
    basePath,
    mediaType,
    rating,
    releaseDate,
    genre,
}: {
    id?: string | number;
    title: string;
    image?: string | null;
    basePath?: string;
    mediaType?: "movie" | "tv";
    rating?: number | string;
    releaseDate?: string | number;
    genre?: string;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const mediaId = id || title;
    const isFav = useUserCollectionsStore((state) =>
        isAuthenticated && state.favorites.some((f) => String(f.id) === String(mediaId))
    );
    const toggleFavorite = useUserCollectionsStore((state) => state.toggleFavorite);

    const [open, setOpen] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [popupPos, setPopupPos] = useState<{ bottom: number; left: number } | null>(null);

    const numericRating = typeof rating === "number" ? rating : (rating ? Number(rating) || undefined : undefined);
    const releaseStr = releaseDate !== undefined ? String(releaseDate) : undefined;

    const mediaItem: CollectionMediaItem = {
        id: mediaId,
        title,
        posterImage: image,
        rating: numericRating,
        releaseDate: releaseStr,
        genre,
        mediaType,
        isMovie: mediaType !== "tv",
    };

    const imgSrc = hasError || !image ? DEFAULT_POSTER_IMAGE : image;


    const popupRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const openRef = useRef(open);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const dragThreshold = 5;

    const isSearch = pathname.startsWith("/search") || basePath === "/search";
    const isPersonsList = pathname === "/trending/persons";

    const isPersonDetails =
        pathname.startsWith("/trending/persons/") &&
        !isPersonsList;

    const itemSlug = slugify(title) || (id ? String(id) : encodeURIComponent(title));

    const href = (() => {
        if (isSearch || isPersonDetails) {
            return `${mediaType === "tv" ? "/tv-shows" : "/movies"}/${itemSlug}`;
        }
        if (basePath) {
            return `${basePath.replace(/\/+$/, "")}/${itemSlug}`;
        }
        return `${mediaType === "tv" ? "/tv-shows" : "/movies"}/${itemSlug}`;
    })();

    useEffect(() => {
        openRef.current = open;
    }, [open]);

    useEffect(() => {
        if (!open || !btnRef.current) {
            setPopupPos(null);
            return;
        }
        const update = () => {
            if (!btnRef.current) return;
            const btnRect = btnRef.current.getBoundingClientRect();
            const h = window.innerHeight;
            setPopupPos({ bottom: h - btnRect.top + 7, left: btnRect.right });
        };
        const raf = requestAnimationFrame(update);
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [open]);

    useEffect(() => {
        const onDown = (e: PointerEvent) => {
            if (!openRef.current) return;
            if (popupRef.current?.contains(e.target as Node)) return;
            if (btnRef.current?.contains(e.target as Node)) return;

            dragStartRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMove = (e: PointerEvent) => {
            if (!dragStartRef.current) return;

            const dx = Math.abs(e.clientX - dragStartRef.current.x);
            const dy = Math.abs(e.clientY - dragStartRef.current.y);

            if (dx > dragThreshold || dy > dragThreshold) {
                setOpen(false);
                dragStartRef.current = null;
            }
        };

        const onUp = () => {
            dragStartRef.current = null;
        };

        const onClick = (e: MouseEvent) => {
            if (!openRef.current) return;
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                btnRef.current &&
                !btnRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", onDown);
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.removeEventListener("click", onClick);
        };
    }, []);

    return (
        <div className="flex flex-col items-end relative">
            {open && popupPos && createPortal(
                <div
                    ref={popupRef}
                    className="fixed z-30 origin-bottom-right"
                    style={{ bottom: popupPos.bottom, left: popupPos.left, transform: "translateX(-100%)" }}
                >
                    <div className="animate-in fade-in zoom-in-95 duration-150">
                        <WatchlistPopup media={mediaItem} onClose={() => setOpen(false)} />
                    </div>
                </div>,
                document.body
            )}

            <div className="group/poster relative xl:w-[220px] xl:h-[310px] lg:w-[210px] lg:h-[300px] md:w-[200px] md:h-[290px] sm:w-[185px] sm:h-[265px] w-[175px] h-[250px] overflow-hidden rounded-md md:rounded-lg shadow-sm transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]">
                <Image
                    src={imgSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 700px) 175px, (max-width: 900px) 185px, (max-width: 1060px) 200px, (max-width: 1200px) 210px, 220px"
                    className="object-cover select-none"
                    onError={() => setHasError(true)}
                />

                <button
                    type="button"
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    title={isFav ? "Favorited" : "Add to Favorites"}
                    onMouseEnter={() => {
                        if (!isAuthenticated) {
                            router.prefetch("/login");
                        }
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isAuthenticated) {
                            const returnUrl = pathname || "/";
                            router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`, { scroll: false });
                            return;
                        }
                        toggleFavorite(mediaItem);
                    }}
                    className={cn(
                        "absolute xl:top-2.5 xl:right-2.5 lg:top-2 lg:right-2 top-1.5 right-1.5 z-20 flex items-center justify-center xl:w-[32px] xl:h-[32px] lg:w-[30px] lg:h-[30px] md:w-[28px] md:h-[28px] sm:w-[26px] sm:h-[26px] w-[24px] h-[24px] rounded-full backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                        isFav
                            ? "bg-black/65 hover:bg-black/80 border-white/40 text-white"
                            : "bg-black/40 hover:bg-black/60 border-white/20 text-white/80 hover:text-white"
                    )}
                >
                    <Heart
                        className={cn(
                            "xl:w-[17px] xl:h-[17px] lg:w-[16px] lg:h-[16px] md:w-[15px] md:h-[15px] sm:w-[14px] sm:h-[14px] w-[13px] h-[13px] transition-all duration-200 ease-out",
                            isFav
                                ? "fill-white text-white scale-105"
                                : "text-white/80 hover:text-white fill-transparent"
                        )}
                    />
                </button>

                <Link
                    href={href}
                    className="absolute inset-0 flex items-end justify-center xl:pb-[14px] lg:pb-[13px] sm:pb-[12px] pb-[10px] px-3 pt-12 cursor-pointer z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover/poster:from-black/95 group-hover/poster:via-black/50 transition-all duration-300"
                >
                    <div className="font-inter font-semibold xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] text-[12px] text-white/95 transition-colors duration-200 text-center select-none leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2">
                        {title}
                    </div>
                </Link>
            </div>

            <AddButton
                ref={btnRef}
                onMouseEnter={() => {
                    if (!isAuthenticated) {
                        router.prefetch("/login");
                    }
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) {
                        const returnUrl = pathname || "/";
                        router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`, { scroll: false });
                        return;
                    }
                    setOpen((prev) => !prev);
                }}
                className="xl:h-[30px] xl:w-[30px] lg:h-[28px] lg:w-[28px] md:h-[26px] md:w-[26px] sm:h-[24px] sm:w-[24px] h-[22px] w-[22px] bg-light-plus-btn dark:bg-plus-btn hover:bg-light-plus-btn/95 dark:hover:bg-plus-btn/95 rounded-[3px] transition-all duration-200 transform-gpu will-change-transform hover:scale-105 active:scale-95 xl:mt-[12px] lg:mt-[11px] md:mt-[10px] sm:mt-[9px] mt-[8px]"
                iconClassName="xl:h-[19px] xl:w-[19px] lg:h-[18px] lg:w-[18px] md:h-[17px] md:w-[17px] sm:h-[16px] sm:w-[16px] h-[15px] w-[15px]"
            />
        </div>
    );
}