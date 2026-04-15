"use client";

import Image from "next/image";
import { Plus, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WatchlistPopup } from "@/components/WatchlistPopup";
import { BsCcSquare, BsCcSquareFill } from "react-icons/bs";

interface MovieCardProps {
  title: string;
  genre: string;
  image?: string;
  trailer?: string;
}

export function MovieCard({ title, genre, image, trailer }: MovieCardProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [subtitles, setSubtitles] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(open);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragThreshold = 5;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = 1;
    v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (hovered && !hasEnded) {
      const t = setTimeout(() => {
        setShowVideo(true);
        v.currentTime = 0;
        v.muted = true;
        setMuted(true);
        v.load();
        v.play().catch(() => {});
      }, 500);

      return () => clearTimeout(t);
    }

    setShowVideo(false);
    v.pause();
  }, [hovered, hasEnded]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const update = () => {
      if (isFinite(v.duration)) setDuration(v.duration);
    };

    v.addEventListener("loadedmetadata", update);
    v.addEventListener("durationchange", update);

    return () => {
      v.removeEventListener("loadedmetadata", update);
      v.removeEventListener("durationchange", update);
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
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

  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100 || 0);
  };

  const handleEnded = () => {
    setHasEnded(true);
    setHovered(false);
  };

  const handleSeek = (value: number) => {
    const v = videoRef.current;
    if (!v) return;

    v.currentTime = (value / 100) * v.duration;
    setProgress(value);
  };

  return (
    <article className="relative w-fit py-1">
      {open && (
        <div
          ref={popupRef}
          className="absolute xl:right-[6px] xl:top-[4px] md:right-[5px] md:top-[5px] sm:right-[4.5px] sm:top-[5px] right-[5px] top-[-7px] z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <WatchlistPopup />
        </div>
      )}

      <div
        className="relative xl:h-[180px] xl:w-[320px] lg:h-[170px] lg:w-[310px] md:h-[160px] md:w-[300px] sm:h-[150px] sm:w-[290px] h-[120px] w-[240px] overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setHasEnded(false);
        }}
      >
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-300 lg:rounded-[7px] rounded-[5px] ${
              showVideo ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

        {trailer && (
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              showVideo && !hasEnded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <video
              ref={videoRef}
              src={trailer}
              muted={muted}
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMuted((p) => !p);
              }}
              className="absolute right-2 sm:top-[10px] top-[8px] z-10 flex md:h-8 md:w-8 sm:h-[30px] sm:w-[30px] h-[28px] w-[28px] items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              {muted ? (
                <VolumeX className="md:h-4 md:w-4 sm:h-[14px] sm:w-[14px] h-[13px] w-[13px]" />
              ) : (
                <Volume2 className="md:h-4 md:w-4 sm:h-[14px] sm:w-[14px] h-[13px] w-[13px]" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSubtitles((p) => !p);
              }}
              className="absolute right-2 md:top-[47px] sm:top-[45px] top-[41px] z-10 flex md:h-8 md:w-8 sm:h-[30px] sm:w-[30px] h-[28px] w-[28px] items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              {subtitles ? (
                <BsCcSquareFill className="md:h-4 md:w-4 sm:h-[14px] sm:w-[14px] h-[13px] w-[13px]" />
              ) : (
                <BsCcSquare className="md:h-4 md:w-4 sm:h-[14px] sm:w-[14px] h-[13px] w-[13px]" />
              )}
            </button>

            <div
              className="absolute bottom-0 left-0 right-0 z-20 px-2 pb-1"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                handleSeek(percent);
              }}
            >
              <div className="relative h-[3px] md:hover:h-[5px] hover:h-[4px] transition-transform duration-75 w-full bg-white/30 rounded-full cursor-pointer group">
                <div
                  className="absolute left-0 top-0 h-full bg-red-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition"
                  style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>

              <div className="mt-1 flex justify-between md:text-xs sm:text-[11px] text-[10px] sm:font-medium text-white/80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!open) setOpen(true);
        }}
        className="absolute right-0 flex lg:h-[25px] lg:w-[25px] md:h-[23px] md:w-[23px] sm:h-[21px] sm:w-[21px] h-[18px] w-[18px] items-center justify-center lg:rounded-[3px] md:rounded-[2px] rounded-[1px] bg-light-plus-btn dark:bg-plus-btn hover:bg-light-plus-btn/95 dark:hover:bg-plus-btn/95 transition-colors lg:mt-[8px] md:mt-[6px] sm:mt-[5px] mt-[4px]"
      >
        <Plus className="lg:h-[18px] lg:w-[18px] md:h-[17px] md:w-[17px] sm:h-[16px] sm:w-[16px] h-[15px] w-[15px] text-white" />
      </button>

      <p className="lg:mt-[6px] md:mt-[4px] sm:mt-[7px] mt-[5px] text-center font-inter sm:font-medium xl:text-[15px] md:text-sm sm:text-[13px] text-[12px] leading-none text-light-genre-font dark:text-genre-font">
        {genre}
      </p>
      <h3 className="xl:mt-[4px] lg:mt-[3px] md:mt-[2px] sm:mt-[5px] mt-[3px] text-center font-inter md:font-semibold sm:font-medium lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] leading-none text-black dark:text-white">
        {title}
      </h3>
    </article>
  );
}