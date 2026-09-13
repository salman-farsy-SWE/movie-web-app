"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TableItem } from "@/types/items";
import { Rating } from "@/components/Rating";
import { MoreOptionsButton } from "@/components/MoreOptionsButton";
import { WatchlistPopup, type CollectionPageType } from "@/components/WatchlistPopup";
import { cn, slugify } from "@/lib/utils";
import type { CollectionMediaItem } from "@/stores/useUserCollectionsStore";

interface TableRowProps {
  item: TableItem;
  isFirst?: boolean;
  isLast?: boolean;
  isRatingView?: boolean;
  currentListId?: string | number;
  pageType?: CollectionPageType;
}

const DEFAULT_POSTER_IMAGE = "/assets/movie-placeholder.jpg";

export function TableRow({ item, isFirst = false, isRatingView, currentListId, pageType }: TableRowProps) {
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  const [popupPos, setPopupPos] = useState<{ top?: number; bottom?: number; left: number } | null>(null);

  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(open);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 5;

  const imgSrc = hasError || !item?.image ? DEFAULT_POSTER_IMAGE : item.image;
  const isTv =
    item?.media?.toLowerCase() === "tv show" ||
    item?.media?.toLowerCase() === "tv";
  const itemSlug =
    slugify(item?.name || "") || item?.id || encodeURIComponent(item?.name || "");
  const href = `${isTv ? "/tv-shows" : "/movies"}/${itemSlug}`;

  const mediaId = item?.id || item?.name;
  const mediaItem: CollectionMediaItem = {
    id: mediaId,
    title: item?.name || "",
    posterImage: item?.image,
    rating: typeof item?.rating === "number" ? item.rating : undefined,
    userRating: item?.yourRating,
    releaseDate: item?.released,
    mediaType: isTv ? "tv" : "movie",
    isMovie: !isTv,
  };

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const getActiveBtn = () => {
      if (btnRef.current && (btnRef.current.offsetWidth > 0 || btnRef.current.getClientRects().length > 0)) {
        return btnRef.current;
      }
      if (mobileBtnRef.current && (mobileBtnRef.current.offsetWidth > 0 || mobileBtnRef.current.getClientRects().length > 0)) {
        return mobileBtnRef.current;
      }
      return btnRef.current || mobileBtnRef.current;
    };

    const update = () => {
      const activeBtn = getActiveBtn();
      if (!activeBtn) return;
      const btnRect = activeBtn.getBoundingClientRect();
      const h = window.innerHeight;
      const left = Math.min(btnRect.right, window.innerWidth - 8);

      if (isFirst) {
        setPopupPos({ top: btnRect.bottom + 6, left });
      } else {
        setPopupPos({ bottom: h - btnRect.top + 6, left });
      }
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, isFirst]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!openRef.current) return;
      if (popupRef.current?.contains(e.target as Node)) return;
      if (
        (btnRef.current && btnRef.current.contains(e.target as Node)) ||
        (mobileBtnRef.current && mobileBtnRef.current.contains(e.target as Node))
      ) {
        return;
      }
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
        (!btnRef.current || !btnRef.current.contains(e.target as Node)) &&
        (!mobileBtnRef.current || !mobileBtnRef.current.contains(e.target as Node))
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
    <>
      {/* Options Popup Portal */}
      {open && popupPos && createPortal(
        <div
          ref={popupRef}
          className={cn(
            "fixed z-50",
            isFirst ? "origin-top-right" : "origin-bottom-right"
          )}
          style={{
            ...(popupPos.top !== undefined
              ? { top: popupPos.top }
              : { bottom: popupPos.bottom }),
            left: popupPos.left,
            transform: "translateX(-100%)",
          }}
        >
          <div className="animate-in fade-in zoom-in-95 duration-150">
            <WatchlistPopup
              media={mediaItem}
              currentListId={currentListId}
              pageType={pageType}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Desktop Table Row View (md and up) */}
      <div className="group hidden md:grid grid-cols-[76px_minmax(220px,1.6fr)_120px_130px_110px_48px] lg:grid-cols-[84px_minmax(260px,1.6fr)_140px_150px_120px_52px] items-center gap-4 lg:gap-6 px-5 sm:px-6 py-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04] hover:border-black/10 dark:hover:border-white/10 bg-black/[0.015] dark:bg-white/[0.015] hover:bg-black/[0.035] dark:hover:bg-white/[0.045] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Poster */}
        <div className="flex justify-center">
          <Link href={href} className="block">
            <div className="relative w-[58px] h-[84px] lg:w-[64px] lg:h-[94px] rounded-lg overflow-hidden shadow-sm border border-black/10 dark:border-white/10">
              <Image
                src={imgSrc}
                alt={item?.name || "Movie poster"}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setHasError(true)}
              />
            </div>
          </Link>
        </div>

        {/* Title */}
        <div className="flex flex-col justify-center min-w-0 w-fit pr-2">
          <Link
            href={href}
            className="font-inter font-medium text-[15px] lg:text-[16px] text-black/85 dark:text-white/85 hover:text-black dark:hover:text-white group-hover:text-black dark:group-hover:text-white transition-colors duration-150 line-clamp-2 leading-snug"
          >
            {item?.name}
          </Link>
        </div>

        {/* Column 3: Your Rating (in rating view) or Rating (otherwise) */}
        <div className="flex justify-center">
          {isRatingView ? (
            item?.yourRating !== undefined && item?.yourRating !== null ? (
              <Rating
                value={
                  typeof item.yourRating === "number" && !isNaN(item.yourRating)
                    ? item.yourRating.toFixed(1)
                    : item.yourRating
                }
                className="gap-2"
                className1="w-[18px] h-[18px] lg:w-[19px] lg:h-[19px] text-yellow-400 fill-yellow-400"
                className2="text-[14px] lg:text-[15px] text-black/90 dark:text-white/90 font-semibold"
              />
            ) : (
              <span className="text-light-genre-font dark:text-genre-font font-inter text-sm">
                —
              </span>
            )
          ) : (
            <Rating
              value={item?.rating ?? "—"}
              className="gap-2"
              className1="w-[18px] h-[18px] lg:w-[19px] lg:h-[19px]"
              className2="text-[14px] lg:text-[15px] font-medium text-black/85 dark:text-white/85"
            />
          )}
        </div>

        {/* Column 4: Media Type */}
        <div className="flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-[13px] font-medium font-inter bg-black/5 dark:bg-white/10 text-black/75 dark:text-white/75 border border-black/10 dark:border-white/10 select-none">
            {item?.media || "Movie"}
          </span>
        </div>

        {/* Release Year */}
        <div className="flex justify-center">
          <span className="font-inter text-[14px] lg:text-[15px] font-medium text-light-genre-font dark:text-genre-font">
            {item?.released || "—"}
          </span>
        </div>

        {/* Actions Button */}
        <div className="flex justify-end">
          <MoreOptionsButton
            ref={btnRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="w-[32px] h-[32px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            className2="w-[16px] h-[16px] text-black/75 dark:text-white/80 hover:text-black dark:hover:text-white"
          />
        </div>
      </div>

      {/* Mobile / Tablet Card View (< md) */}
      <div className="group flex md:hidden items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-black/5 dark:border-white/5 transition-all duration-200 shadow-sm">
        <Link href={href} className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Poster */}
          <div className="relative w-[65px] h-[95px] sm:w-[72px] sm:h-[105px] shrink-0 rounded-lg overflow-hidden shadow-sm border border-black/10 dark:border-white/10">
            <Image
              src={imgSrc}
              alt={item?.name || "Movie poster"}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setHasError(true)}
            />
          </div>

          {/* Item Details */}
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <h3 className="font-inter font-medium text-[15px] sm:text-[16px] text-black/90 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
              {item?.name}
            </h3>

            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-inter text-light-genre-font dark:text-genre-font">
              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-black/75 dark:text-white/75 border border-black/10 dark:border-white/10 font-medium text-[11px]">
                {item?.media || "Movie"}
              </span>
              {item?.released && (
                <span className="font-medium text-[12px]">{item.released}</span>
              )}
            </div>

            {/* Ratings Line */}
            <div className="flex items-center gap-3 mt-0.5">
              {isRatingView && item?.yourRating !== undefined && item?.yourRating !== null && (
                <div className="flex items-center gap-1 font-inter text-xs text-black/80 dark:text-white/80">
                  <span className="text-light-genre-font dark:text-genre-font">You:</span>
                  <span className="font-semibold text-yellow-500 dark:text-yellow-400">
                    ★ {typeof item.yourRating === "number" && !isNaN(item.yourRating) ? item.yourRating.toFixed(1) : item.yourRating}
                  </span>
                </div>
              )}
              <Rating
                value={item?.rating ?? "—"}
                className="gap-1.5"
                className1="w-[15px] h-[15px]"
                className2="text-xs sm:text-[13px] text-black/80 dark:text-white/80 font-medium"
              />
            </div>
          </div>
        </Link>

        {/* Options Button */}
        <div className="shrink-0">
          <MoreOptionsButton
            ref={mobileBtnRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="w-[32px] h-[32px] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            className2="w-[16px] h-[16px] text-black/75 dark:text-white/80"
          />
        </div>
      </div>
    </>
  );
}