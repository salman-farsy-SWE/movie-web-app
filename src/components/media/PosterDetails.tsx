"use client";

import Image from "next/image";
import { GenreBadge } from "@/components/GenreBadge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Heart, Play, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AddButton } from "@/components/AddButton";
import { Rating } from "@/components/Rating";
import { TrailerDialog } from "@/components/home/TrailerDialog";
import { useUIStore } from "@/stores/useUIStore";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useUserCollectionsStore, type CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import { getTmdbAccountStateAction } from "@/actions/collections";
import { cn } from "@/lib/utils";
import type { MediaDetailsData } from "@/lib/tmdb";

const WatchlistPopup = dynamic(
  () => import("@/components/WatchlistPopup").then((mod) => mod.WatchlistPopup),
  { ssr: false }
);

export function PosterDetails({
    data,
    isMovie: isMovieProp,
}: {
    data?: MediaDetailsData;
    isMovie?: boolean;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isMovie = data?.isMovie !== undefined ? data.isMovie : (isMovieProp ?? false);
    const [open2, setOpen2] = useState(false);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [bgError, setBgError] = useState(false);
    const [posterError, setPosterError] = useState(false);
    const [studioError, setStudioError] = useState(false);
    const [creatorError, setCreatorError] = useState(false);
    const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
    const [hasMoreOverview, setHasMoreOverview] = useState(false);

    const toggleFavorite = useUserCollectionsStore((state) => state.toggleFavorite);
    const setFavoriteStatus = useUserCollectionsStore((state) => state.setFavoriteStatus);
    const setWatchlistStatus = useUserCollectionsStore((state) => state.setWatchlistStatus);
    const setUserRatingStatus = useUserCollectionsStore((state) => state.setUserRatingStatus);

    const overviewRef = useRef<HTMLParagraphElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const dragThreshold = 5;
    const openRating = useUIStore((state) => state.openRating);

    const title = data?.title || (isMovie ? "Movie Details" : "TV Shows Details");
    const releaseDate = data?.releaseDate || "7 Nov, 2014";
    const overview = data?.overview || "Nine noble families wage war against each other in order to gain control over the mythical land of Westeros.";
    const genres = data?.genres && data.genres.length > 0
        ? data.genres
        : (isMovie ? ["Adventure", "Drama"] : ["Drama", "Sci-Fi & Fantasy"]);
    const duration = data?.duration || (isMovie ? "2h 49m" : "50m");
    const rating = data?.rating ?? 8.4;
    const voteCount = data?.voteCount || "34,000";
    const popularity = data?.popularity || "256.42";
    const bgImage = bgError || !data?.backdropImage ? (data?.posterImage || "/assets/movie-placeholder.jpg") : data.backdropImage;
    const posterImage = posterError || !data?.posterImage ? "/assets/movie-placeholder.jpg" : data.posterImage;
    const country = data?.country || "United States, United Kingdom";
    const language = data?.language || "English";
    const budget = data?.budget || "$165M";
    const revenue = data?.revenue || "$700M";
    const episodes = data?.numberOfEpisodes ?? 73;
    const seasons = data?.numberOfSeasons ?? 8;
    const studioName = data?.studio?.name || "Legendary Pictures";
    const studioImage = data?.studio?.image;
    const createdByName = data?.createdBy?.name || (isMovie ? "Christopher Nolan" : "David Benioff");
    const createdByImage = data?.createdBy?.image || "/assets/movie-placeholder.jpg";

    const mediaId = data?.id || title;
    const genre = genres[0];
    const mediaItem: CollectionMediaItem = useMemo(() => ({
        id: mediaId,
        title,
        posterImage: data?.posterImage || posterImage,
        backdropImage: data?.backdropImage || bgImage,
        rating,
        releaseDate,
        isMovie,
        mediaType: isMovie ? "movie" : "tv",
        genre,
    }), [mediaId, title, data?.posterImage, posterImage, data?.backdropImage, bgImage, rating, releaseDate, isMovie, genre]);

    const isFav = useUserCollectionsStore((state) =>
        isAuthenticated ? state.isFavorite(mediaId, title) : false
    );
    const inWatchlist = useUserCollectionsStore((state) =>
        isAuthenticated ? state.isInWatchlist(mediaId, title) : false
    );
    const userRating = useUserCollectionsStore((state) =>
        isAuthenticated ? state.getUserRating(mediaId, title) : undefined
    );

    const mediaItemRef = useRef(mediaItem);
    useEffect(() => {
        mediaItemRef.current = mediaItem;
    }, [mediaItem]);

    const isFavRef = useRef(isFav);
    const inWatchlistRef = useRef(inWatchlist);
    const userRatingRef = useRef(userRating);
    useEffect(() => {
        isFavRef.current = isFav;
        inWatchlistRef.current = inWatchlist;
        userRatingRef.current = userRating;
    }, [isFav, inWatchlist, userRating]);

    // Sync TMDB account state if authenticated and item is from TMDB (without clobbering in-flight mutations)
    const itemId = data?.id;
    useEffect(() => {
        if (!isAuthenticated || !itemId) return;
        let isCancelled = false;

        getTmdbAccountStateAction(itemId, isMovie ? "movie" : "tv")
            .then((state) => {
                if (isCancelled || !state) return;
                const currentItem = mediaItemRef.current;

                if (typeof state.favorite === "boolean" && state.favorite !== isFavRef.current) {
                    setFavoriteStatus(currentItem, state.favorite);
                }
                if (typeof state.watchlist === "boolean" && state.watchlist !== inWatchlistRef.current) {
                    setWatchlistStatus(currentItem, state.watchlist);
                }
                if (typeof state.rated === "object" && state.rated !== null && typeof state.rated.value === "number") {
                    if (state.rated.value !== userRatingRef.current) {
                        setUserRatingStatus(currentItem, state.rated.value);
                    }
                }
            })
            .catch(() => {});

        return () => {
            isCancelled = true;
        };
    }, [isAuthenticated, itemId, isMovie, setFavoriteStatus, setWatchlistStatus, setUserRatingStatus]);


    const [prevOverview, setPrevOverview] = useState(overview);
    if (prevOverview !== overview) {
        setPrevOverview(overview);
        setIsOverviewExpanded(false);
    }

    useEffect(() => {
        const el = overviewRef.current;
        if (!el) return;

        const checkOverflow = () => {
            if (!el) return;
            if (!isOverviewExpanded) {
                const isOverflow = el.scrollHeight > el.clientHeight;
                setHasMoreOverview((prev) => (prev !== isOverflow ? isOverflow : prev));
            }
        };

        checkOverflow();
        const rafId = requestAnimationFrame(checkOverflow);

        if (typeof ResizeObserver !== "undefined") {
            const resizeObserver = new ResizeObserver(() => {
                checkOverflow();
            });
            resizeObserver.observe(el);

            return () => {
                cancelAnimationFrame(rafId);
                resizeObserver.disconnect();
            };
        }

        window.addEventListener("resize", checkOverflow);
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", checkOverflow);
        };
    }, [overview, isOverviewExpanded]);

    useEffect(() => {
        if (!open2) return;

        const onDown = (e: PointerEvent) => {
            if (popupRef.current?.contains(e.target as Node)) return;
            if (btnRef.current?.contains(e.target as Node)) return;

            dragStartRef.current = { x: e.clientX, y: e.clientY };
        };

        const onMove = (e: PointerEvent) => {
            if (!dragStartRef.current) return;

            const dx = Math.abs(e.clientX - dragStartRef.current.x);
            const dy = Math.abs(e.clientY - dragStartRef.current.y);

            if (dx > dragThreshold || dy > dragThreshold) {
                setOpen2(false);
                dragStartRef.current = null;
            }
        };

        const onUp = () => {
            dragStartRef.current = null;
        };

        const onClick = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                btnRef.current &&
                !btnRef.current.contains(e.target as Node)
            ) {
                setOpen2(false);
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
    }, [open2]);

    return (
        <section className="relative xl:mt-[19px] lg:mt-[17px] md:mt-[15px] mt-[13px] left-1/2 right-1/2 w-screen -translate-x-1/2">
            <div className="relative w-full min-h-[660px] md:px-8 sm:px-7 px-6 xl:py-[32px] lg:py-[28px] md:py-[24px] sm:py-[20px] py-[18px] pb-[56px] sm:pb-[60px] md:pb-[64px] lg:pb-[68px] xl:pb-[72px] overflow-hidden border-y border-white/40 dark:border-white/20 bg-[#050b14] dark:bg-[#030406]">

                {/* Backdrop Image - Soft Balanced Blur */}
                <Image
                    src={bgImage}
                    alt={`${title} Background`}
                    fill
                    sizes="100vw"
                    className="object-cover object-center select-none blur-[5px] scale-105 transition-all duration-300"
                    priority
                    onError={() => setBgError(true)}
                />

                {/* Atmospheric Overlays - Richer Gradient Color Tones */}
                <div className="absolute inset-0 bg-gradient-to-bl from-[#1d4ed8]/70 via-[#1e3a8a]/65 via-[#0e1c31]/82 to-[#050b14]/92 dark:from-[#dc2626]/45 dark:via-[#581c87]/50 dark:to-[#1e1b4b]/65 dark:to-[#030406]/92 backdrop-blur-[2px] z-10 transition-colors duration-300" />

                {/* Ambient Rich Color Accents */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.45),transparent_65%),radial-gradient(ellipse_at_bottom_left,rgba(30,58,138,0.35),transparent_70%),radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.2),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.42),transparent_65%),radial-gradient(ellipse_at_bottom_left,rgba(88,28,135,0.4),transparent_70%),radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.2),transparent_60%)] pointer-events-none z-10 transition-colors duration-300" />

                {/* Top/Bottom Grounding Gradient for Edge Blending */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/25 to-[#050b14]/45 dark:from-[#030406] dark:via-[#030406]/30 dark:to-[#030406]/45 z-10 pointer-events-none transition-colors duration-300" />

                {/* Main Content Container */}
                <div className="relative z-20 container-1440 text-white font-inter">

                    {/* Top Row: Title, Release Date & Heart Action */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="font-poppins font-bold xl:text-[34px] lg:text-[30px] md:text-[27px] sm:text-[24px] text-[22px] tracking-tight leading-tight text-white drop-shadow-sm">
                                {title}
                            </h1>
                            <p className="font-inter font-normal xl:text-[17px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] text-white/80 xl:mt-[6px] lg:mt-[5px] mt-[4px]">
                                {releaseDate}
                            </p>
                        </div>

                        {/* Favorite Button */}
                        <button
                            type="button"
                            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                            title={isFav ? "Favorited" : "Add to Favorites"}
                            onMouseEnter={() => {
                                if (!isAuthenticated) {
                                    router.prefetch("/login");
                                }
                            }}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    const returnUrl = pathname || "/";
                                    router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`, { scroll: false });
                                    return;
                                }
                                toggleFavorite(mediaItem);
                            }}
                            className="flex-shrink-0 cursor-pointer flex items-center justify-center xl:w-[44px] xl:h-[44px] lg:w-[40px] lg:h-[40px] md:w-[38px] md:h-[38px] sm:w-[35px] sm:h-[35px] w-[32px] h-[32px] rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shadow-sm"
                        >
                            <Heart
                                className={cn(
                                    "xl:w-[22px] xl:h-[22px] lg:w-[20px] lg:h-[20px] md:w-[19px] md:h-[19px] sm:w-[17px] sm:h-[17px] w-[15px] h-[15px] transition-all duration-200 ease-out",
                                    isFav
                                        ? "fill-white text-white scale-105"
                                        : "text-white/80 hover:text-white"
                                )}
                            />
                        </button>
                    </div>

                    {/* Overview Paragraph */}
                    <div className="xl:w-[72%] lg:w-[68%] md:w-[80%] w-full xl:mt-[16px] lg:mt-[14px] md:mt-[12px] mt-[10px]">
                        <p
                            ref={overviewRef}
                            className={cn(
                                "xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] font-normal leading-relaxed text-white/85 transition-all duration-200",
                                !isOverviewExpanded && "line-clamp-3"
                            )}
                        >
                            {overview}
                        </p>
                        {hasMoreOverview && (
                            <button
                                type="button"
                                onClick={() => setIsOverviewExpanded((prev) => !prev)}
                                className="text-rate-btn hover:text-rate-btn/80 text-[13px] sm:text-[14px] md:text-[15px] font-medium mt-1 cursor-pointer transition-colors focus:outline-none select-none inline-flex items-center"
                            >
                                {isOverviewExpanded ? "See less" : "See more"}
                            </button>
                        )}
                    </div>

                    {/* Sub-Bar: Genres + Duration on Left | Stats on Right */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 xl:mt-[26px] lg:mt-[22px] md:mt-[20px] mt-[18px] pb-4 border-b border-white/15">
                        {/* Genres and Duration */}
                        <div className="flex flex-col gap-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                                {genres.map((g, i) => (
                                    <GenreBadge
                                        key={`${g}-${i}`}
                                        genre={g}
                                        className="bg-white/15 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-colors"
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 xl:text-[17px] lg:text-[16px] md:text-[15px] text-[14px] text-white">
                                <span className="font-medium text-white">{isMovie ? "Duration:" : "Episode Duration:"}</span>
                                <span className="text-white2 font-normal">{duration}</span>
                            </div>
                        </div>

                        {/* Ratings & Stats Group */}
                        <div className="flex items-center flex-wrap gap-5 sm:gap-7 lg:gap-8 xl:gap-11 xl:text-[17px] lg:text-[16px] md:text-[15px] text-[13px] font-medium">
                            {/* Rate Button */}
                            <div className="flex flex-col items-start gap-1">
                                <p className="tracking-wider text-white/70 text-[11px] sm:text-[12px] uppercase font-semibold">YOUR RATING</p>
                                <Button
                                    type="button"
                                    onMouseEnter={() => {
                                        if (!isAuthenticated) {
                                            router.prefetch("/login");
                                        }
                                    }}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            const returnUrl = pathname || "/";
                                            router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`, { scroll: false });
                                            return;
                                        }
                                        openRating(mediaItem);
                                    }}
                                    className="bg-white/15 hover:bg-white/25 border border-white/20 text-white hover:text-white flex items-center gap-1.5 h-8 px-2.5 rounded-[4px] transition-colors cursor-pointer shadow-md backdrop-blur-sm"
                                >
                                    <Star className={cn("w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]", userRating !== undefined && "fill-yellow-400")} />
                                    <span className="font-inter text-[13px] sm:text-[14px] font-medium text-white">
                                        {userRating !== undefined ? `${userRating}/10` : "Rate"}
                                    </span>
                                </Button>
                            </div>

                            {/* Community Rating */}
                            <div className="flex flex-col items-start gap-1">
                                <p className="tracking-wider text-white/70 text-[11px] sm:text-[12px] uppercase font-semibold">RATING</p>
                                <Rating
                                    value={rating}
                                    className="gap-1.5 h-8"
                                    className1="w-5 h-5 text-fill-star fill-fill-star"
                                    className2="text-white2 xl:text-[18px] lg:text-[17px] text-[15px] font-medium"
                                />
                            </div>

                            {/* Vote Count */}
                            <div className="flex flex-col items-start gap-1">
                                <p className="tracking-wider text-white/70 text-[11px] sm:text-[12px] uppercase font-semibold">VOTES</p>
                                <div className="flex items-center gap-1.5 h-8 text-white2 xl:text-[18px] lg:text-[17px] text-[15px] font-medium">
                                    <BadgeCheck className="w-5 h-5 text-blue-400" />
                                    <span>{voteCount}</span>
                                </div>
                            </div>

                            {/* Popularity */}
                            <div className="flex flex-col items-start gap-1">
                                <p className="tracking-wider text-white/70 text-[11px] sm:text-[12px] uppercase font-semibold">POPULARITY</p>
                                <div className="flex items-center gap-1.5 h-8 text-white2 xl:text-[18px] lg:text-[17px] text-[15px] font-medium">
                                    <Heart className="w-5 h-5 text-trails-red fill-trails-red" />
                                    <span>{popularity}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Media Section: Poster on Left, Details on Right */}
                    <div className="flex flex-col sm:flex-row gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-6 relative">
                        {/* Poster Card & Trailer CTA */}
                        <div className="flex flex-col items-center flex-shrink-0 w-full sm:w-[210px] md:w-[230px] lg:w-[245px] xl:w-[255px]">
                            <div className="relative w-[200px] h-[300px] sm:w-full sm:h-[315px] md:h-[345px] lg:h-[365px] xl:h-[380px] border-2 md:border-[3px] border-white/90 shadow-lg dark:shadow-2xl rounded-[4px] overflow-hidden bg-dark2 group flex-shrink-0">
                                <Image
                                    src={posterImage}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 640px) 200px, (max-width: 768px) 210px, (max-width: 1024px) 230px, (max-width: 1280px) 245px, 255px"
                                    priority
                                    className="object-cover select-none"
                                    onError={() => setPosterError(true)}
                                />

                                {/* Play Trailer Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => setIsTrailerOpen(true)}
                                    aria-label="Play Trailer"
                                    className="group/btn absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-10"
                                >
                                    <div className="xl:w-[110px] xl:h-[110px] lg:w-[100px] lg:h-[100px] md:w-[92px] md:h-[92px] w-[80px] h-[80px] bg-play rounded-full flex items-center justify-center transition-all duration-300 ease-out transform group-hover:scale-100 group-hover/btn:scale-110 active:scale-95 shadow-lg">
                                        <Play className="text-white fill-white xl:w-[50px] xl:h-[50px] lg:w-[45px] lg:h-[45px] md:w-[40px] md:h-[40px] w-[35px] h-[35px] ml-1" />
                                    </div>
                                </button>
                            </div>

                            {/* Official Trailer Button */}
                            <Button
                                onClick={() => setIsTrailerOpen(true)}
                                className="w-[180px] sm:w-full xl:h-[44px] lg:h-[42px] md:h-[40px] h-[38px] mt-3.5 bg-trails-red hover:bg-trails-red/90 text-white xl:text-[16px] lg:text-[15px] md:text-[15px] text-[14px] font-medium font-inter rounded-[4px] transition-colors cursor-pointer shadow-sm"
                            >
                                Official Trailer
                            </Button>
                        </div>

                        {/* Details List (Country, Language, Format/Financials, Studio, Director) */}
                        <div className="flex-1 flex flex-col items-start gap-4 sm:gap-5 xl:text-[18px] lg:text-[17px] md:text-[16px] text-[14px] text-white font-medium">
                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-medium">Country:</span>
                                <span className="text-white2 font-normal">{country}</span>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-medium">Language:</span>
                                <span className="text-white2 font-normal">{language}</span>
                            </div>

                            {!isMovie && (
                                <>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-white font-medium">Number of Episodes:</span>
                                        <span className="text-white2 font-normal">{episodes}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-white font-medium">Number of Seasons:</span>
                                        <span className="text-white2 font-normal">{seasons}</span>
                                    </div>
                                </>
                            )}

                            {isMovie && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-light-budget dark:bg-budget text-black font-semibold text-[12px] sm:text-[13px] px-2.5 py-0.5 rounded-[3px] shadow-sm">
                                            Budget
                                        </span>
                                        <span className="text-white2 font-normal">{budget}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-light-revenue dark:bg-revenue text-white font-semibold text-[12px] sm:text-[13px] px-2.5 py-0.5 rounded-[3px] shadow-sm">
                                            Revenue
                                        </span>
                                        <span className="text-white2 font-normal">{revenue}</span>
                                    </div>
                                </>
                            )}

                            {/* Studio */}
                            <div className="flex flex-col items-start gap-1.5 mt-1">
                                <span className="text-white font-medium">Studio</span>
                                <div className="flex items-center gap-3">
                                    <div className="xl:h-[46px] xl:w-[78px] lg:h-[42px] lg:w-[72px] md:h-[40px] md:w-[68px] h-[36px] w-[62px] relative rounded-[3px] bg-white p-1 flex items-center justify-center overflow-hidden border border-white/20 shadow-sm">
                                        {studioImage && !studioError ? (
                                            <Image
                                                src={studioImage}
                                                alt={studioName}
                                                fill
                                                className="object-contain p-1 select-none"
                                                onError={() => setStudioError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-black font-semibold text-[10px] text-center px-0.5 leading-tight">
                                                {studioName}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[13px] sm:text-[14px] text-white2 font-normal">{studioName}</span>
                                </div>
                            </div>

                            {/* Director / Created by */}
                            <div className="flex flex-col items-start gap-1.5 mt-1">
                                <span className="text-white font-medium">{isMovie ? "Director" : "Created by"}</span>
                                <div className="flex items-center gap-3">
                                    <div className="xl:w-[62px] xl:h-[62px] lg:w-[56px] lg:h-[56px] md:w-[52px] md:h-[52px] w-[46px] h-[46px] relative rounded-full overflow-hidden border-2 border-white/30 bg-white/10 flex-shrink-0 shadow-sm">
                                        <Image
                                            src={creatorError || !createdByImage ? "/assets/persons-image.jpg" : createdByImage}
                                            alt={createdByName}
                                            fill
                                            sizes="64px"
                                            className="object-cover object-[center_25%]"
                                            onError={() => setCreatorError(true)}
                                        />
                                    </div>
                                    <span className="text-[13px] sm:text-[14px] text-white2 font-normal">{createdByName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Add to Watchlist Button & Popup cleanly anchored at the bottom-right */}
                    <div className="absolute xl:bottom-0 lg:bottom-1 md:bottom-2 bottom-2 right-0 z-30">
                        {open2 && (
                            <div
                                ref={popupRef}
                                className="absolute bottom-[calc(100%+8px)] right-0 z-50 animate-in fade-in zoom-in-95 duration-150"
                            >
                                <WatchlistPopup media={mediaItem} onClose={() => setOpen2(false)} />
                            </div>
                        )}
                        <AddButton
                            ref={btnRef}
                            aria-label={`Add ${title} to watchlist`}
                            aria-haspopup="dialog"
                            aria-expanded={open2}
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
                                setOpen2((prev) => !prev);
                            }}
                            className="xl:w-[32px] xl:h-[32px] lg:w-[30px] lg:h-[30px] md:w-[28px] md:h-[28px] sm:w-[26px] sm:h-[26px] w-[24px] h-[24px] bg-white/20 hover:bg-white/30 dark:bg-white/15 dark:hover:bg-white/25 rounded-[3px] flex items-center justify-center cursor-pointer border border-white/30 dark:border-white/25 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
                            iconClassName="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] text-white"
                        />
                    </div>

                </div>
            </div>

            {/* Trailer Dialog */}
            <TrailerDialog
                open={isTrailerOpen}
                onOpenChange={setIsTrailerOpen}
                trailerKey={data?.trailerKey}
                title={title}
            />
        </section>
    );
}