"use client";

import { useEffect } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/useUIStore";

interface DeleteListModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  listTitle: string;
  isDeleting?: boolean;
}

export function DeleteListModal({
  open,
  onClose,
  onConfirm,
  listTitle,
  isDeleting = false,
}: DeleteListModalProps) {
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);

  // Close modal if search overlay is opened
  useEffect(() => {
    if (isSearchOpen && open && !isDeleting) {
      onClose();
    }
  }, [isSearchOpen, open, isDeleting, onClose]);
  // Lock body scroll on open
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isDeleting, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-list-dialog-title"
    >
      <div
        className="relative flex flex-col w-full max-w-[420px] rounded-2xl bg-white dark:bg-dropdown border border-black/10 dark:border-white/10 shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-trails-red shrink-0 border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="pr-4">
            <h2
              id="delete-list-dialog-title"
              className="font-inter text-lg font-semibold text-black dark:text-white tracking-tight leading-snug"
            >
              Delete List?
            </h2>
            <p className="mt-0.5 font-inter text-xs text-light-genre-font dark:text-genre-font">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Modal Description */}
        <div className="p-3.5 my-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 font-inter text-xs sm:text-sm text-black/80 dark:text-white/80 leading-relaxed">
          Are you sure you want to delete <strong className="text-black dark:text-white font-semibold">&quot;{listTitle}&quot;</strong>
          . All saved items inside this list will be removed.
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-black/5 dark:border-white/5">
          <Button
            type="button"
            variant="ghost"
            disabled={isDeleting}
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs sm:text-sm font-inter text-black/75 dark:text-white/75 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="h-9 px-4 rounded-lg bg-trails-red hover:bg-trails-red/90 text-white text-xs sm:text-sm font-inter font-medium shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete List</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

