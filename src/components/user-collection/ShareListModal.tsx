"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Share2,
  Globe,
  Mail,
} from "lucide-react";
import {
  FaXTwitter,
  FaWhatsapp,
  FaFacebookF,
  FaTelegram,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShareListModalProps {
  open: boolean;
  onClose: () => void;
  list: {
    id?: string | number;
    title: string;
    description?: string;
    curator?: {
      name?: string;
      handle?: string;
      avatar?: string;
    };
    itemCount?: number;
    backdrop?: string;
    slug?: string;
  } | null;
  customUrl?: string;
}

const emptySubscribe = () => () => {};

export function ShareListModal({
  open,
  onClose,
  list,
  customUrl,
}: ShareListModalProps) {
  const [copied, setCopied] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Compute shareable URL
  const currentUrl = useSyncExternalStore(
    emptySubscribe,
    () => customUrl || (typeof window !== "undefined" ? window.location.href : ""),
    () => customUrl || ""
  );

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, [open, onClose]);

  const handleCopyLink = async () => {
    if (!currentUrl) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for older browsers
        const input = document.createElement("input");
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (!navigator?.share || !list) return;

    try {
      await navigator.share({
        title: `Movie Trails: ${list.title}`,
        text: list.description || `Check out "${list.title}" collection on Movie Trails!`,
        url: currentUrl,
      });
    } catch {
      // User cancelled share
    }
  };

  if (!open || !list) return null;

  const shareTitle = encodeURIComponent(`Check out "${list.title}" list on Movie Trails!`);
  const encodedUrl = encodeURIComponent(currentUrl);
  const shareText = encodeURIComponent(
    list.description
      ? `${list.title} - ${list.description}`
      : `Check out "${list.title}" collection on Movie Trails!`
  );

  const socialLinks = [
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`,
      bgColor: "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodedUrl}`,
      bgColor: "bg-[#25D366] text-white hover:bg-[#20bd5a]",
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgColor: "bg-[#1877F2] text-white hover:bg-[#1465cc]",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
      bgColor: "bg-[#229ED9] text-white hover:bg-[#1e8ec3]",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${shareTitle}&body=${shareText}%0A%0A${encodedUrl}`,
      bgColor: "bg-neutral-700 text-white hover:bg-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600",
    },
  ];

  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-list-modal-title"
    >
      <div
        className="relative flex flex-col w-full max-w-[460px] rounded-2xl bg-white dark:bg-dropdown border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close share dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4 pr-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Share2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2
              id="share-list-modal-title"
              className="font-inter text-lg sm:text-xl font-semibold text-black dark:text-white tracking-tight leading-tight"
            >
              Share List
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-inter text-[10.5px] font-medium border border-emerald-500/20">
                <Globe className="w-2.5 h-2.5" />
                Public Collection
              </span>
            </div>
          </div>
        </div>

        {/* List Info Card Preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 mb-4">
          {(list.backdrop || hasImageError) && (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
              <Image
                src={hasImageError || !list.backdrop ? "/assets/movie-placeholder.jpg" : list.backdrop}
                alt={list.title}
                fill
                className="object-cover"
                sizes="64px"
                onError={() => setHasImageError(true)}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-inter font-semibold text-[14px] sm:text-[15px] text-black dark:text-white truncate">
              {list.title}
            </h3>
            {list.description ? (
              <p className="font-inter text-xs text-light-genre-font dark:text-genre-font line-clamp-1 mt-0.5">
                {list.description}
              </p>
            ) : null}
            <div className="flex items-center gap-2 mt-1 text-[11px] font-inter text-light-genre-font dark:text-genre-font">
              {list.curator?.name && (
                <span>By {list.curator.name}</span>
              )}
              {typeof list.itemCount === "number" && (
                <>
                  <span>•</span>
                  <span>{list.itemCount} {list.itemCount === 1 ? "Item" : "Items"}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Share Link Copy Box */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-xs font-inter font-medium text-black/80 dark:text-white/80">
            Shareable link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-10 px-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 flex items-center overflow-hidden">
              <span className="font-inter text-xs text-black/85 dark:text-white/85 truncate select-all">
                {currentUrl || "Loading link..."}
              </span>
            </div>
            <Button
              type="button"
              onClick={handleCopyLink}
              className={cn(
                "h-10 px-3.5 sm:px-4 rounded-lg font-inter text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer shrink-0 shadow-xs",
                copied
                  ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                  : "bg-light-create-new-btn hover:bg-light-create-new-btn/90 dark:bg-create-new-btn dark:hover:bg-create-new-btn/90 text-white"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-inter font-medium animate-in fade-in duration-150">
              Link copied to clipboard! Anyone with this link can view the list.
            </p>
          )}
        </div>

        {/* Social Share Options */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-inter font-medium text-black/80 dark:text-white/80">
            Share via
          </span>

          <div className="grid grid-cols-5 gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${social.name}`}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border border-black/5 dark:border-white/5 transition-transform duration-150 active:scale-95 cursor-pointer shadow-xs",
                    social.bgColor
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-inter font-medium truncate max-w-[55px] text-center">
                    {social.name.split(" ")[0]}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Native Share button if available */}
          {hasNativeShare && (
            <Button
              type="button"
              onClick={handleNativeShare}
              variant="outline"
              className="mt-1 h-9 rounded-lg border-black/10 dark:border-white/15 text-xs font-inter text-black/85 dark:text-white/85 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer w-full"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>More sharing options</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
