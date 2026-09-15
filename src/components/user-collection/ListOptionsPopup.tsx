"use client";

import { Pencil, Share2, Trash2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListOptionsPopupProps {
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  isPrivate?: boolean;
  className?: string;
}

export function ListOptionsPopup({
  onEdit,
  onShare,
  onDelete,
  onClose,
  isPrivate = false,
  className,
}: ListOptionsPopupProps) {
  return (
    <div
      className={cn(
        "relative w-[140px] sm:w-[155px] flex flex-col overflow-hidden sm:rounded-xl rounded-lg",
        "bg-dropdown/95 backdrop-blur-xl",
        "border border-white/10",
        "text-white/95",
        "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
        "font-inter transition-all duration-150 select-none py-1",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
          onClose?.();
        }}
        className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group text-white/85 hover:text-white cursor-pointer"
      >
        <Pencil className="h-3.5 w-3.5 text-white/70 group-hover:text-white transition-colors" />
        <span className="truncate font-medium">Edit list</span>
      </button>

      {isPrivate ? (
        <div
          title="Private lists cannot be shared. Change privacy to Public to share."
          className="flex items-center justify-between px-3 py-2 opacity-50 w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] text-white/60 cursor-not-allowed select-none"
        >
          <div className="flex items-center gap-2.5">
            <Share2 className="h-3.5 w-3.5 text-white/50" />
            <span className="truncate font-medium">Share list</span>
          </div>
          <Lock className="h-3 w-3 text-amber-400/70" />
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare?.();
            onClose?.();
          }}
          className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group text-white/85 hover:text-white cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5 text-white/70 group-hover:text-white transition-colors" />
          <span className="truncate font-medium">Share list</span>
        </button>
      )}

      <div className="h-[1px] bg-white/10 my-0.5" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
          onClose?.();
        }}
        className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 transition-colors w-full text-left text-[11px] sm:text-[12px] lg:text-[13px] group text-white/85 hover:text-trails-red cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5 text-white/70 group-hover:text-trails-red transition-colors" />
        <span className="truncate font-medium">Delete list</span>
      </button>
    </div>
  );
}

