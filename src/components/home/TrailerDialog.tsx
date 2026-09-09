"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Loader2, Film } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TrailerDialogProps {
  trailerKey?: string | null;
  title?: string;
  className?: string;
  buttonText?: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const emptySubscribe = () => () => {};

export function TrailerDialog({
  trailerKey,
  title,
  className,
  buttonText = "Watch Trailer",
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
}: TrailerDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      onOpenChange?.(open);
      if (open) {
        setIsLoading(true);
      }
    },
    [isControlled, onOpenChange]
  );

  // Keyboard navigation: Escape key closes the dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Lock body scroll when dialog is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const dialogContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} Trailer` : "Movie Trailer"}
    >
      <div
        className="relative z-10 w-full max-w-[95vw] sm:max-w-[620px] md:max-w-[760px] lg:max-w-[880px] xl:max-w-[980px] bg-dark2 dark:bg-dropdown rounded-xl sm:rounded-2xl border border-white/15 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 sm:px-5 sm:py-3.5 bg-black/40 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
            {title && (
              <h3 className="font-poppins font-medium text-white text-[13px] sm:text-[15px] md:text-[16px] truncate text-shadow-sm">
                {title}
              </h3>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close trailer"
            className="group flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-150 border border-white/10 hover:border-white/25 active:scale-95 shrink-0"
          >
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />
          </button>
        </div>

        {/* Video Embed Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isOpen && trailerKey ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black text-white/70">
                  <Loader2 className="w-8 h-8 animate-spin text-trails-red" />
                  <span className="text-xs font-inter text-white/60">Loading trailer...</span>
                </div>
              )}
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={title ? `${title} Official Trailer` : "Official Trailer"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-0"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-white/70 gap-2">
              <Film className="w-10 h-10 text-white/30" />
              <p className="font-inter text-sm font-medium">Trailer currently unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const customTrigger = trigger || children;

  return (
    <>
      {customTrigger ? (
        <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
          {customTrigger}
        </div>
      ) : !isControlled ? (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "xl:w-[160px] xl:h-[46px] lg:w-[148px] lg:h-[42px] md:w-[136px] md:h-[38px] sm:w-[120px] sm:h-[34px] w-[108px] h-[30px] lg:rounded-[6px] md:rounded-[4px] rounded-[3px] hover:bg-hero-trailer bg-hero-trailer/90 font-poppins xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] text-[11px] lg:font-semibold font-medium text-white shadow-md transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",
            className
          )}
        >
          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-white shrink-0" />
          <span>{buttonText}</span>
        </Button>
      ) : null}

      {mounted && isOpen && createPortal(dialogContent, document.body)}
    </>
  );
}
