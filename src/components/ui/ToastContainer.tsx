"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  Heart,
  Bookmark,
  ListPlus,
  LogIn,
  LogOut,
  Check,
  CircleAlert,
  AlertTriangle,
  X,
} from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { toast, type ToastItem, type ToastType } from "@/lib/toast";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    return toast.subscribe((updated) => {
      setToasts(updated);
    });
  }, []);

  if (!mounted || toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className={cn(
        "fixed z-[10000] pointer-events-none flex flex-col gap-3",
        "bottom-5 inset-x-4 sm:inset-x-auto sm:right-7 sm:bottom-7",
        "sm:w-[410px] w-auto max-w-full"
      )}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} />
      ))}
    </div>
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  const getThemeConfig = (type: ToastType) => {
    switch (type) {
      case "favorite":
        return {
          tag: "FAVORITE",
          tagBg: "bg-trails-red/10 text-trails-red border-trails-red/25 dark:bg-trails-red/20 dark:text-trails-red dark:border-trails-red/35",
          borderLeft: "border-l-trails-red",
          icon: <Heart className="w-5 h-5 fill-trails-red text-trails-red" />,
          iconBg: "bg-trails-red/10 border-trails-red/20 dark:bg-trails-red/15 dark:border-trails-red/30",
          progressBar: "bg-trails-red",
        };
      case "watchlist":
        return {
          tag: "WATCHLIST",
          tagBg: "bg-blue1/10 text-blue-600 border-blue1/25 dark:bg-blue1/20 dark:text-blue1 dark:border-blue1/35",
          borderLeft: "border-l-blue1",
          icon: <Bookmark className="w-5 h-5 fill-blue1 text-blue1" />,
          iconBg: "bg-blue1/10 border-blue1/20 dark:bg-blue1/15 dark:border-blue1/30",
          progressBar: "bg-blue1",
        };
      case "rating":
        return {
          tag: "RATING",
          tagBg: "bg-yellow-500/10 text-yellow-700 border-yellow-500/25 dark:bg-fill-star/20 dark:text-fill-star dark:border-fill-star/35",
          borderLeft: "border-l-fill-star",
          icon: <FaStar className="w-4.5 h-4.5 text-yellow-500 dark:text-fill-star" />,
          iconBg: "bg-yellow-500/10 border-yellow-500/20 dark:bg-fill-star/15 dark:border-fill-star/30",
          progressBar: "bg-yellow-500 dark:bg-fill-star",
        };
      case "list":
        return {
          tag: "CUSTOM LIST",
          tagBg: "bg-trails-blue/10 text-purple-700 border-trails-blue/25 dark:bg-trails-blue/20 dark:text-trails-blue dark:border-trails-blue/35",
          borderLeft: "border-l-trails-blue",
          icon: <ListPlus className="w-5 h-5 text-purple-600 dark:text-trails-blue" />,
          iconBg: "bg-trails-blue/10 border-trails-blue/20 dark:bg-trails-blue/15 dark:border-trails-blue/30",
          progressBar: "bg-purple-500 dark:bg-trails-blue",
        };
      case "login":
        return {
          tag: "AUTHENTICATION",
          tagBg: "bg-blue1/10 text-blue-600 border-blue1/25 dark:bg-blue1/20 dark:text-blue1 dark:border-blue1/35",
          borderLeft: "border-l-blue1",
          icon: <LogIn className="w-5 h-5 text-blue1" />,
          iconBg: "bg-blue1/10 border-blue1/20 dark:bg-blue1/15 dark:border-blue1/30",
          progressBar: "bg-blue1",
        };
      case "logout":
        return {
          tag: "ACCOUNT",
          tagBg: "bg-neutral-500/10 text-neutral-600 border-neutral-500/25 dark:bg-neutral-500/20 dark:text-neutral-300 dark:border-neutral-500/35",
          borderLeft: "border-l-neutral-400",
          icon: <LogOut className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />,
          iconBg: "bg-neutral-500/10 border-neutral-500/20 dark:bg-neutral-500/15 dark:border-neutral-500/30",
          progressBar: "bg-neutral-400",
        };
      case "error":
        return {
          tag: "ERROR",
          tagBg: "bg-trails-red/10 text-trails-red border-trails-red/25 dark:bg-trails-red/20 dark:text-trails-red dark:border-trails-red/35",
          borderLeft: "border-l-trails-red",
          icon: <CircleAlert className="w-5 h-5 text-trails-red" />,
          iconBg: "bg-trails-red/10 border-trails-red/20 dark:bg-trails-red/15 dark:border-trails-red/30",
          progressBar: "bg-trails-red",
        };
      case "warning":
        return {
          tag: "WARNING",
          tagBg: "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/35",
          borderLeft: "border-l-amber-400",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
          iconBg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30",
          progressBar: "bg-amber-500 dark:bg-amber-400",
        };
      case "success":
      default:
        return {
          tag: "SUCCESS",
          tagBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/35",
          borderLeft: "border-l-emerald-500 dark:border-l-emerald-400",
          icon: <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />,
          iconBg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30",
          progressBar: "bg-emerald-500 dark:bg-emerald-400",
        };
    }
  };

  const theme = getThemeConfig(item.type);
  const durationMs = item.duration || 3500;

  return (
    <div
      className={cn(
        "pointer-events-auto select-none relative group overflow-hidden",
        "flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border-l-[5px]",
        theme.borderLeft,
        "bg-white dark:bg-[#181818] text-neutral-900 dark:text-white",
        "border-y border-r border-neutral-200/90 dark:border-white/15",
        "shadow-[0_12px_36px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)]",
        "ring-1 ring-black/5 dark:ring-white/5",
        "transition-colors duration-200"
      )}
    >
      {/* Icon Badge or Poster Thumbnail */}
      {item.image ? (
        <div className="relative w-12 h-16 sm:w-13 sm:h-18 rounded-lg overflow-hidden shrink-0 border border-black/10 dark:border-white/25 shadow-xs bg-neutral-100 dark:bg-black/40">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs",
            theme.iconBg
          )}
        >
          {theme.icon}
        </div>
      )}

      {/* Text Context */}
      <div className="flex flex-col min-w-0 flex-1 pr-1 font-inter">
        {/* Top Tag & Badges */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border",
              theme.tagBg
            )}
          >
            {theme.tag}
          </span>

          {item.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:bg-fill-star/25 dark:text-fill-star dark:border-fill-star/40 shrink-0 shadow-2xs">
              {item.badge}
            </span>
          )}
        </div>

        {/* Primary Title */}
        <h4 className="text-[14px] sm:text-[15px] font-semibold text-neutral-900 dark:text-white tracking-tight leading-snug">
          {item.title}
        </h4>

        {/* Secondary Description */}
        {item.description && (
          <p className="text-[12.5px] sm:text-[13px] font-medium text-neutral-600 dark:text-neutral-300 mt-0.5 leading-snug line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Action button if provided */}
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick();
            toast.dismiss(item.id);
          }}
          className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/15 dark:hover:bg-white/25 text-neutral-900 dark:text-white border border-black/10 dark:border-white/20 cursor-pointer shadow-2xs transition-colors"
        >
          {item.action.label}
        </button>
      )}

      {/* Close button */}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => toast.dismiss(item.id)}
        className="shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/15 cursor-pointer transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Working Bottom Time/Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3.5px] bg-neutral-100 dark:bg-white/10 overflow-hidden pointer-events-none">
        <div
          className={cn("h-full", theme.progressBar)}
          style={{
            width: "100%",
            animation: `toastProgress ${durationMs}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
