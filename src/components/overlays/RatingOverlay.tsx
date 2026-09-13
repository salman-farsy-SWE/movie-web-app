"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { X, Trash2, Loader2 } from "lucide-react";
import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { useUIStore } from "@/stores/useUIStore";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCollectionsStore, type CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getRatingDescriptor(score: number): string {
  if (score === 0) return "Tap stars to rate";
  if (score <= 2) return "Appalling";
  if (score <= 4) return "Poor";
  if (score <= 6) return "Average";
  if (score <= 8) return "Good";
  if (score < 10) return "Superb";
  return "Masterpiece";
}

interface RatingModalContentProps {
  targetMedia: CollectionMediaItem | null;
  onClose: () => void;
}

function RatingModalContent({ targetMedia, onClose }: RatingModalContentProps) {
  const setUserRating = useUserCollectionsStore((state) => state.setUserRating);
  const getUserRating = useUserCollectionsStore((state) => state.getUserRating);
  const removeUserRating = useUserCollectionsStore((state) => state.removeUserRating);

  const existingRating = targetMedia?.id !== undefined ? (getUserRating(targetMedia.id) ?? targetMedia.userRating) : targetMedia?.userRating;
  const [rating, setRating] = useState<number>(existingRating ?? 0);
  const [hover, setHover] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const itemTitle = targetMedia?.title || "Rate Media";
  const posterImage = targetMedia?.posterImage || "/assets/movie-placeholder.jpg";
  const releaseYear = targetMedia?.releaseDate
    ? new Date(targetMedia.releaseDate).getFullYear() || targetMedia.releaseDate
    : null;
  const mediaTypeLabel = targetMedia?.mediaType === "tv" || targetMedia?.isMovie === false ? "TV Series" : "Movie";

  const displayRating = hover ?? rating;

  const handleSubmit = async () => {
    if (!targetMedia || rating === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await setUserRating(targetMedia, rating);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!targetMedia?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await removeUserRating(targetMedia.id, targetMedia.mediaType);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-overlay-title"
      className="relative flex flex-col w-full max-w-[460px] rounded-2xl bg-white dark:bg-dropdown border border-black/10 dark:border-white/10 shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header Context (Media Thumbnail + Details) */}
      <div className="flex items-center gap-3.5 pr-8 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="relative w-12 h-16 sm:w-14 sm:h-20 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 flex-shrink-0 border border-black/10 dark:border-white/10 shadow-xs">
          <Image
            src={posterError ? "/assets/movie-placeholder.jpg" : posterImage}
            alt={itemTitle}
            fill
            className="object-cover select-none"
            onError={() => setPosterError(true)}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-trails-blue">
            Rate {mediaTypeLabel}
          </span>
          <h2
            id="rating-overlay-title"
            className="font-inter text-base sm:text-lg font-semibold text-black dark:text-white truncate"
            title={itemTitle}
          >
            {itemTitle}
          </h2>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-light-genre-font dark:text-genre-font">
            {releaseYear && <span>{releaseYear}</span>}
            {releaseYear && targetMedia?.genre && <span>•</span>}
            {targetMedia?.genre && <span className="truncate">{targetMedia.genre}</span>}
          </div>
        </div>
      </div>

      {/* Rating Score Card */}
      <div className="flex flex-col items-center justify-center py-4 my-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 select-none">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-bold font-inter tracking-tight text-black dark:text-white">
            {displayRating > 0 ? displayRating : "—"}
          </span>
          <span className="text-sm sm:text-base font-medium text-light-genre-font dark:text-genre-font">
            / 10
          </span>
        </div>

        <p className="mt-1 text-xs sm:text-sm font-medium font-inter text-light-genre-font dark:text-genre-font transition-colors">
          {getRatingDescriptor(displayRating)}
        </p>
      </div>

      {/* 10 Interactive Stars */}
      <div
        className="flex items-center justify-center gap-1 sm:gap-1.5 py-1 select-none"
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const index = i + 1;
          const activeValue = displayRating;

          let Icon = FaRegStar;
          let colorClass = "text-light-unfill-star dark:text-unfill-star";

          if (activeValue >= index) {
            Icon = FaStar;
            colorClass = "text-fill-star";
          } else if (activeValue >= index - 0.5) {
            Icon = FaRegStarHalfStroke;
            colorClass = "text-fill-star";
          }

          return (
            <button
              key={index}
              type="button"
              disabled={isSubmitting}
              className="relative p-0.5 rounded-sm transition-transform duration-100 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-trails-blue disabled:pointer-events-none"
              aria-label={`Rate ${index} out of 10`}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                setHover(isLeftHalf ? index - 0.5 : index);
              }}
              onClick={() => {
                setRating(hover ?? index);
              }}
            >
              <Icon
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-100",
                  colorClass
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5 dark:border-white/5">
        {existingRating !== undefined ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={handleRemove}
            className="h-9 px-3 text-xs sm:text-sm font-inter text-trails-red hover:bg-trails-red/10 hover:text-trails-red cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Remove</span>
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-9 px-3.5 rounded-lg text-xs sm:text-sm font-inter text-black/75 dark:text-white/75 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isSubmitting || rating === 0}
            onClick={handleSubmit}
            className="h-9 px-4 rounded-lg bg-light-create-new-btn hover:bg-light-create-new-btn/90 dark:bg-create-new-btn dark:hover:bg-create-new-btn/90 text-white text-xs sm:text-sm font-inter font-medium shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{existingRating !== undefined ? "Update Rating" : "Submit Rating"}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RatingOverlay() {
  const open = useUIStore((state) => state.isRatingOpen);
  const setOpen = useUIStore((state) => state.setRatingOpen);
  const targetMedia = useUIStore((state) => state.ratingTargetMedia);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (open && !isAuthenticated) {
      setOpen(false);
      const returnUrl = pathname || "/";
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`, { scroll: false });
    }
  }, [open, isAuthenticated, setOpen, router, pathname]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpen]);

  if (!open || !isAuthenticated) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <RatingModalContent
        key={String(targetMedia?.id ?? "default")}
        targetMedia={targetMedia}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}