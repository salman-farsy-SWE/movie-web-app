"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { WatchlistPopup } from "@/components/WatchlistPopup";
import { AddButton } from "@/components/AddButton";
import { slugify } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { CollectionMediaItem } from "@/stores/useUserCollectionsStore";

const DEFAULT_MOVIE_IMAGE = "/assets/movie-placeholder.jpg";

interface MovieCardProps {
  id?: string | number;
  title: string;
  genre?: string;
  image?: string | null;
  trailerKey?: string | null;
  basePath?: string;
  mediaType?: "movie" | "tv";
  rating?: number | string;
  releaseDate?: string | number;
}

function formatTime(seconds: number) {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const MovieCard = memo(function MovieCard({
  id,
  title,
  genre = "Movie",
  image,
  trailerKey,
  basePath,
  mediaType,
  rating,
  releaseDate,
}: MovieCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const resolvedMediaType: "movie" | "tv" =
    mediaType || (basePath?.startsWith("/tv-shows") ? "tv" : "movie");
  const mediaId = id || title;
  const numericRating = typeof rating === "number" ? rating : (rating ? Number(rating) || undefined : undefined);
  const releaseStr = releaseDate !== undefined ? String(releaseDate) : undefined;

  const mediaItem: CollectionMediaItem = useMemo(() => ({
    id: mediaId,
    title,
    posterImage: image,
    genre,
    rating: numericRating,
    releaseDate: releaseStr,
    mediaType: resolvedMediaType,
    isMovie: resolvedMediaType !== "tv",
  }), [mediaId, title, image, genre, numericRating, releaseStr, resolvedMediaType]);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerReady, setTrailerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [trailerDuration, setTrailerDuration] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingTimelineRef = useRef(false);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 5;
  const [popupPos, setPopupPos] = useState<{ bottom: number; left: number } | null>(null);

  const exactTrailerKey = trailerKey;

  useEffect(() => {
    if (hovered && exactTrailerKey && !hasEnded) {
      const timer = setTimeout(() => setShowTrailer(true), 350);
      return () => clearTimeout(timer);
    }
  }, [hovered, exactTrailerKey, hasEnded]);

  // Send postMessage to YouTube player iframe for sound and seeking
  const sendYouTubeCommand = useCallback((func: string, args: unknown[] = []) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func,
          args,
        }),
        "*"
      );
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      if (e.source !== iframeRef.current?.contentWindow) return;

      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "infoDelivery") {
          if (data.info?.duration) {
            setTrailerDuration(data.info.duration);
          }
          if (data.info?.playerState === 1) {
            setTrailerReady(true);
            setIsPaused(false);
            clearTimeout(timer);
          }
          if (data.info?.playerState === 0) {
            setHasEnded(true);
            setShowTrailer(false);
            setTrailerReady(false);
            setElapsedTime(0);
            setIsPaused(false);
          }
          if (data.info?.playerState === 2) {
            setIsPaused(true);
          }
        }
        if (data.event === "onStateChange") {
          if (data.info === 0) {
            setHasEnded(true);
            setShowTrailer(false);
            setTrailerReady(false);
            setElapsedTime(0);
            setIsPaused(false);
          } else if (data.info === 2) {
            setIsPaused(true);
          } else if (data.info === 1) {
            setIsPaused(false);
          }
        }
        if (data.event === "onReady") {
          setTrailerReady(true);
          sendYouTubeCommand("playVideo");
        }
      } catch {
      }
    };

    if (showTrailer) {
      window.addEventListener("message", handleMessage);
      timer = setTimeout(() => {
        setTrailerReady(true);
      }, 700);
      return () => {
        window.removeEventListener("message", handleMessage);
        clearTimeout(timer);
      };
    }
  }, [showTrailer, sendYouTubeCommand]);



  // Timeline progress timer
  useEffect(() => {
    if (!trailerReady || !hovered) {
      return;
    }

    const interval = setInterval(() => {
      if (isDraggingTimelineRef.current) return;
      if (isPaused) return;
      setElapsedTime((prev) => {
        const next = prev + 0.2;
        if (next >= trailerDuration && trailerDuration > 0) {
          // Stop at end duration instead of infinite looping
          return trailerDuration;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [trailerReady, hovered, trailerDuration, isPaused]);

  const toggleSound = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsMuted((prev) => {
        const nextMuted = !prev;
        if (nextMuted) {
          sendYouTubeCommand("mute");
        } else {
          sendYouTubeCommand("unMute");
          sendYouTubeCommand("setVolume", [100]);
        }
        return nextMuted;
      });
    },
    [sendYouTubeCommand]
  );

  // Timeline seeking logic
  const seekFromPointer = useCallback(
    (clientX: number) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = ratio * trailerDuration;
      setElapsedTime(newTime);
      sendYouTubeCommand("seekTo", [newTime, true]);
    },
    [sendYouTubeCommand, trailerDuration]
  );

  const handleTimelinePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      isDraggingTimelineRef.current = true;
      seekFromPointer(e.clientX);

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (!isDraggingTimelineRef.current) return;
        seekFromPointer(moveEvent.clientX);
      };

      const onPointerUp = () => {
        isDraggingTimelineRef.current = false;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [seekFromPointer]
  );



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
    if (!open) return;

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
        setOpen(false);
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
  }, [open]);

  const [hasError, setHasError] = useState(false);

  const rawThumbnail = exactTrailerKey
    ? `https://img.youtube.com/vi/${exactTrailerKey}/hqdefault.jpg`
    : image;
  const thumbnailUrl = hasError || !rawThumbnail ? DEFAULT_MOVIE_IMAGE : rawThumbnail;

  const itemSlug = slugify(title) || (id ? String(id) : encodeURIComponent(title));

  const href = basePath
    ? `${basePath.replace(/\/+$/, "")}/${itemSlug}`
    : `${mediaType === "tv" ? "/tv-shows" : "/movies"}/${itemSlug}`;

  const progressPercent = Math.min(100, Math.max(0, (elapsedTime / (trailerDuration || 1)) * 100));

  return (
    <article
      ref={articleRef}
      className={`relative xl:pt-[40px] lg:pt-[38px] md:pt-[36px] sm:pt-[34px] pt-[29px] pb-1 xl:w-[325px] lg:w-[300px] md:w-[285px] sm:w-[270px] w-[220px] hover:z-50 ${open ? "z-50" : ""}`}
    >
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

      <div
        className="group/card relative w-full xl:h-[180px] lg:h-[170px] md:h-[160px] sm:h-[150px] h-[120px] overflow-hidden rounded-md md:rounded-lg select-none shadow-sm transition-all duration-300 ease-out transform-gpu origin-bottom hover:scale-[1.18] hover:-translate-y-1.5 z-10 hover:z-30 hover:shadow-[0_14px_20px_-6px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_14px_24px_-6px_rgba(5,5,5,0.75)] cursor-pointer will-change-transform"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setShowTrailer(false);
          setTrailerReady(false);
          setIsMuted(true);
          setElapsedTime(0);
          setHasEnded(false);
          setIsPaused(false);
        }}
        onClick={() => {
          if (hasEnded) {
            setHasEnded(false);
            setShowTrailer(true);
            setElapsedTime(0);
          } else if (showTrailer) {
            if (isPaused) {
              sendYouTubeCommand("playVideo");
            } else {
              sendYouTubeCommand("pauseVideo");
            }
          }
        }}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 700px) 220px, (max-width: 900px) 270px, (max-width: 1060px) 285px, (max-width: 1200px) 300px, 325px"
          className="object-cover select-none"
          onError={() => setHasError(true)}
        />

        {/* Play preview badge before video loads */}
        {hovered && (
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-[15] ${trailerReady ? "opacity-0" : "opacity-100"
            }`}>
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white shadow-lg">
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Exact Movie Trailer Player */}
        {showTrailer && exactTrailerKey && (
          <div className={`absolute inset-0 bg-black pointer-events-none transition-opacity duration-700 ease-in-out z-10 ${trailerReady ? "opacity-100" : "opacity-0"
            }`}>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${exactTrailerKey}?enablejsapi=1&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&loop=0&cc_load_policy=0`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0 pointer-events-none"
              onLoad={() => {
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: "listening" }),
                    "*"
                  );
                }
              }}
            />
          </div>
        )}

        {/* Hover Video Controls & Subtitles Overlay */}
        {trailerReady && hovered && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20 animate-in fade-in duration-300">
            {/* Top Bar Controls (Sound) */}
            <div className="flex items-center justify-end gap-1.5 p-1.5 sm:p-2">
              {/* Sound Control */}
              <button
                type="button"
                onClick={toggleSound}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="pointer-events-auto flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all duration-200 shadow-md"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                ) : (
                  <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                )}
              </button>
            </div>

            {/* Spacer to push timeline to bottom */}
            <div className="flex-1" />

            <div className="w-full flex flex-col items-center px-2 pb-1 sm:pb-1.5">
              {/* Timeline Bar & Time Display (Running Seconds / Duration) */}
              <div className="w-full flex items-center gap-1.5 sm:gap-2">
                <div
                  ref={timelineRef}
                  onPointerDown={handleTimelinePointerDown}
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto flex-1 py-1 cursor-pointer group/timeline relative flex items-center"
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={trailerDuration}
                  aria-valuenow={Math.floor(elapsedTime)}
                  tabIndex={0}
                >
                  {/* Track */}
                  <div className="w-full h-[3px] sm:h-1 bg-white/35 group-hover/timeline:bg-white/45 rounded-full overflow-hidden relative transition-colors">
                    <div
                      className="h-full bg-trails-red rounded-full transition-[width] duration-75 ease-linear shadow-[0_0_8px_rgba(232,83,85,0.9)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Scrubber Knob */}
                  <div
                    className="absolute h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.7)] top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/timeline:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `${progressPercent}%` }}
                  />
                </div>

                {/* Running seconds & duration */}
                <span className="shrink-0 text-[8.5px] sm:text-[9.5px] text-white/95 font-medium font-inter tracking-tight select-none">
                  {formatTime(elapsedTime)} / {formatTime(trailerDuration)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between mt-3 w-full gap-3 px-0.5">
        <div className="flex flex-col gap-0.5 overflow-hidden justify-center min-w-0">
          <Link
            href={href}
            className="group/title block truncate"
          >
            <h3 className="text-left font-inter font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-black/90 dark:text-white/90 leading-snug truncate group-hover/title:text-black dark:group-hover/title:text-white transition-colors duration-200 group">
              {title}
            </h3>
            <p className="text-left font-inter font-medium text-[12px] sm:text-[13px] text-light-genre-font dark:text-genre-font leading-tight truncate transition-colors duration-200">
              {genre}
            </p>
          </Link>
        </div>

        <AddButton
          ref={btnRef}
          aria-label={`Add ${title} to watchlist`}
          aria-haspopup="dialog"
          aria-expanded={open}
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
          className="shrink-0 xl:h-[30px] xl:w-[30px] lg:h-[28px] lg:w-[28px] md:h-[26px] md:w-[26px] sm:h-[24px] sm:w-[24px] h-[24px] w-[24px] bg-light-plus-btn dark:bg-plus-btn hover:bg-light-plus-btn/95 dark:hover:bg-plus-btn/95 rounded-[4px] transition-all duration-200 transform-gpu will-change-transform hover:scale-105 active:scale-95"
          iconClassName="xl:h-[18px] xl:w-[18px] lg:h-[17px] lg:w-[17px] md:h-[16px] md:w-[16px] sm:h-[15px] sm:w-[15px] h-[15px] w-[15px]"
        />
      </div>
    </article>
  );
});