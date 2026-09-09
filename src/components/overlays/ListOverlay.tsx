"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useList } from "@/contexts/ListContext";
import { useUserCollectionsStore } from "@/stores/useUserCollectionsStore";
import { ChevronDown, X, Globe, Check, Search, Lock, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FILTER_LANGUAGES, TMDB_LANGUAGE_MAP } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import type { UserList } from "@/data/mock-lists";

const TMDB_LANGUAGES = FILTER_LANGUAGES.map((name) => ({
  name,
  code: TMDB_LANGUAGE_MAP[name] || name.toLowerCase().slice(0, 2),
}));

interface ListOverlayContentProps {
  editingList: UserList | null;
  onClose: () => void;
}

function ListOverlayContent({ editingList, onClose }: ListOverlayContentProps) {
  const [title, setTitle] = useState(() => editingList?.title || "");
  const [description, setDescription] = useState(() => editingList?.description || "");
  const [language, setLanguage] = useState(() => {
    const raw = editingList?.language || "en";
    const found = TMDB_LANGUAGES.find(
      (item) =>
        item.code.toLowerCase() === raw.toLowerCase() ||
        item.name.toLowerCase() === raw.toLowerCase()
    );
    return found ? found.code : (raw.toLowerCase().slice(0, 2) || "en");
  });
  const [isPrivate, setIsPrivate] = useState(() => editingList?.isPrivate ?? false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const langSearchInputRef = useRef<HTMLInputElement>(null);

  const createCustomList = useUserCollectionsStore((state) => state.createCustomList);
  const updateCustomList = useUserCollectionsStore((state) => state.updateCustomList);

  // Focus title input on open
  useEffect(() => {
    const timeout = setTimeout(() => {
      titleInputRef.current?.focus({ preventScroll: true });
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  // Focus search input when language dropdown opens
  useEffect(() => {
    if (langDropdownOpen) {
      const timeout = setTimeout(() => {
        langSearchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [langDropdownOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSubmitting) return;
        if (langDropdownOpen) {
          setLangDropdownOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [langDropdownOpen, onClose, isSubmitting]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (editingList) {
        await updateCustomList({
          id: editingList.id,
          title: cleanTitle,
          description: description.trim(),
          language: currentLanguage.code,
          isPrivate,
        });
      } else {
        await createCustomList({
          title: cleanTitle,
          description: description.trim(),
          language: currentLanguage.code,
          isPrivate,
        });
      }

      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save list."
      );
      setIsSubmitting(false);
    }
  };

  const filteredLanguages = useMemo(() => {
    const query = langSearch.trim().toLowerCase();
    if (!query) return TMDB_LANGUAGES;
    return TMDB_LANGUAGES.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );
  }, [langSearch]);

  const currentLanguage =
    TMDB_LANGUAGES.find(
      (item) => item.code.toLowerCase() === (language || "en").toLowerCase()
    ) ||
    TMDB_LANGUAGES.find(
      (item) => item.name.toLowerCase() === (language || "en").toLowerCase()
    ) ||
    TMDB_LANGUAGES[0];

  return (
    <div
      className="relative flex flex-col w-full max-w-[480px] rounded-2xl bg-white dark:bg-dropdown border border-black/10 dark:border-white/10 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        disabled={isSubmitting}
        type="button"
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="mb-5 pr-6">
        <h2
          id="list-overlay-title"
          className="font-inter text-xl sm:text-2xl font-semibold text-black dark:text-white tracking-tight leading-snug"
        >
          {editingList ? "Edit List" : "Create New List"}
        </h2>
        <p className="mt-1 font-inter text-xs sm:text-sm text-light-genre-font dark:text-genre-font">
          {editingList
            ? "Update your list details and privacy settings."
            : "Create and organize your favorite movies and TV shows."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title Field */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="list-title"
            className="text-xs sm:text-sm font-inter font-medium text-black/85 dark:text-white/85"
          >
            Title <span className="text-trails-red">*</span>
          </Label>
          <Input
            ref={titleInputRef}
            id="list-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Best Sci-Fi Movies of All Time"
            required
            disabled={isSubmitting}
            className="h-10 sm:h-11 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] px-3.5 text-xs sm:text-sm font-inter text-black dark:text-white placeholder:text-light-input-font dark:placeholder:text-genre-font border border-black/10 dark:border-white/15 focus:border-black/30 dark:focus:border-white/30 focus-visible:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="list-description"
            className="text-xs sm:text-sm font-inter font-medium text-black/85 dark:text-white/85"
          >
            Description
          </Label>
          <Textarea
            id="list-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add an optional description for your list..."
            disabled={isSubmitting}
            className="rounded-lg bg-black/[0.03] dark:bg-white/[0.05] p-3 text-xs sm:text-sm font-inter text-black dark:text-white placeholder:text-light-input-font dark:placeholder:text-genre-font border border-black/10 dark:border-white/15 focus:border-black/30 dark:focus:border-white/30 resize-none focus-visible:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Language Field */}
        <div className="flex flex-col gap-1.5">
          <Label
            id="list-language-label"
            className="text-xs sm:text-sm font-inter font-medium text-black/85 dark:text-white/85"
          >
            Language
          </Label>
          <div ref={langDropdownRef} className="relative">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => !isSubmitting && setLangDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={langDropdownOpen}
              aria-labelledby="list-language-label"
              className="flex items-center justify-between w-full h-10 sm:h-11 px-3.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 text-xs sm:text-sm font-inter text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Globe className="w-4 h-4 text-light-genre-font dark:text-genre-font shrink-0" />
                <span className="truncate">{currentLanguage.name}</span>
                <span className="text-[11px] font-inter text-light-genre-font dark:text-genre-font uppercase shrink-0">
                  ({currentLanguage.code})
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-light-genre-font dark:text-genre-font transition-transform duration-200 shrink-0",
                  langDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {langDropdownOpen && !isSubmitting && (
              <div
                role="listbox"
                className="absolute bottom-full mb-1 left-0 right-0 bg-white dark:bg-[#252525] border border-black/10 dark:border-white/15 rounded-lg shadow-xl py-1.5 z-50 flex flex-col"
              >
                {/* Language Search */}
                <div className="px-2.5 pb-1.5 border-b border-black/10 dark:border-white/10">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 w-3.5 h-3.5 text-light-genre-font dark:text-genre-font pointer-events-none" />
                    <input
                      ref={langSearchInputRef}
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search language..."
                      className="w-full h-8 pl-8 pr-2.5 rounded-md bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-xs font-inter text-black dark:text-white placeholder:text-light-input-font dark:placeholder:text-genre-font focus:outline-none focus:border-black/30 dark:focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Language Options List */}
                <div className="max-h-48 overflow-y-auto custom-scrollbar py-1">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((item) => {
                      const isSelected = item.code === language;
                      return (
                        <div
                          key={item.code}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setLanguage(item.code);
                            setLangDropdownOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-inter cursor-pointer transition-colors",
                            isSelected
                              ? "bg-black/5 dark:bg-white/10 font-medium text-black dark:text-white"
                              : "text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="truncate">{item.name}</span>
                            <span className="text-[11px] text-light-genre-font dark:text-genre-font uppercase">
                              ({item.code})
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-black dark:text-white shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-xs text-center text-light-genre-font dark:text-genre-font">
                      No languages found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Field */}
        <div className="flex flex-col gap-1.5">
          <Label
            id="list-privacy-label"
            className="text-xs sm:text-sm font-inter font-medium text-black/85 dark:text-white/85"
          >
            Privacy
          </Label>
          <div
            role="radiogroup"
            aria-labelledby="list-privacy-label"
            className="grid grid-cols-2 p-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/15 gap-1"
          >
            {/* Public Option */}
            <button
              type="button"
              role="radio"
              aria-checked={!isPrivate}
              disabled={isSubmitting}
              onClick={() => !isSubmitting && setIsPrivate(false)}
              className={cn(
                "flex items-center justify-center gap-2 h-9 rounded-md text-xs sm:text-sm font-inter font-medium border transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                !isPrivate
                  ? "bg-white dark:bg-[#333333] text-black dark:text-white shadow-xs border-black/5 dark:border-white/10"
                  : "border-transparent text-light-genre-font dark:text-genre-font hover:text-black dark:hover:text-white"
              )}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Public</span>
            </button>

            {/* Private Option */}
            <button
              type="button"
              role="radio"
              aria-checked={isPrivate}
              disabled={isSubmitting}
              onClick={() => !isSubmitting && setIsPrivate(true)}
              className={cn(
                "flex items-center justify-center gap-2 h-9 rounded-md text-xs sm:text-sm font-inter font-medium border transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
                isPrivate
                  ? "bg-white dark:bg-[#333333] text-black dark:text-white shadow-xs border-black/5 dark:border-white/10"
                  : "border-transparent text-light-genre-font dark:text-genre-font hover:text-black dark:hover:text-white"
              )}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Private</span>
            </button>
          </div>

          {/* Privacy Hint */}
          <p className="font-inter text-[11px] sm:text-xs text-light-genre-font dark:text-genre-font">
            {isPrivate
              ? "Only you can view and manage this list."
              : "Anyone can discover and view this list."}
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-inter text-xs">
            {errorMessage}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 mt-2 border-t border-black/5 dark:border-white/5">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs sm:text-sm font-inter text-black/75 dark:text-white/75 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="h-9 px-5 rounded-lg bg-light-create-new-btn hover:bg-light-create-new-btn/90 dark:bg-create-new-btn dark:hover:bg-create-new-btn/90 text-white text-xs sm:text-sm font-inter font-medium shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>{editingList ? "Saving..." : "Creating..."}</span>
              </>
            ) : (
              <span>{editingList ? "Save Changes" : "Create List"}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ListOverlay() {
  const { open, editingList, close } = useList();

  // Lock body scroll on open
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-overlay-title"
    >
      <ListOverlayContent
        key={editingList ? String(editingList.id) : "new-list"}
        editingList={editingList}
        onClose={close}
      />
    </div>
  );
}