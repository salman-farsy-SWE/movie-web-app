import { create } from "zustand";
import type { CollectionMediaItem } from "@/stores/useUserCollectionsStore";
import type { UserList } from "@/types";

interface UIState {
  // Search Overlay
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Rating Overlay
  isRatingOpen: boolean;
  ratingTargetMedia: CollectionMediaItem | null;
  setRatingOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setRatingTargetMedia: (media: CollectionMediaItem | null) => void;
  openRating: (item?: CollectionMediaItem) => void;
  closeRating: () => void;

  // List Overlay
  isListOpen: boolean;
  editingList: UserList | null;
  setListOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setEditingList: (list: UserList | null) => void;
  openCreateList: () => void;
  openEditList: (list: UserList) => void;
  closeList: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Search state
  isSearchOpen: false,
  setSearchOpen: (open) =>
    set((state) => {
      const nextOpen = typeof open === "function" ? open(state.isSearchOpen) : open;
      if (nextOpen) {
        return { isSearchOpen: true, isRatingOpen: false, isListOpen: false };
      }
      return { isSearchOpen: false };
    }),
  openSearch: () =>
    set({
      isSearchOpen: true,
      isRatingOpen: false,
      isListOpen: false,
    }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () =>
    set((state) => {
      const next = !state.isSearchOpen;
      if (next) {
        return { isSearchOpen: true, isRatingOpen: false, isListOpen: false };
      }
      return { isSearchOpen: false };
    }),

  // Rating state
  isRatingOpen: false,
  ratingTargetMedia: null,
  setRatingOpen: (open) =>
    set((state) => {
      const nextOpen = typeof open === "function" ? open(state.isRatingOpen) : open;
      return { isRatingOpen: nextOpen };
    }),
  setRatingTargetMedia: (media) => set({ ratingTargetMedia: media }),
  openRating: (item) =>
    set((state) => ({
      isRatingOpen: true,
      ratingTargetMedia: item !== undefined ? item : state.ratingTargetMedia,
      isSearchOpen: false,
    })),
  closeRating: () => set({ isRatingOpen: false }),

  // List state
  isListOpen: false,
  editingList: null,
  setListOpen: (open) =>
    set((state) => {
      const nextOpen = typeof open === "function" ? open(state.isListOpen) : open;
      return { isListOpen: nextOpen };
    }),
  setEditingList: (list) => set({ editingList: list }),
  openCreateList: () =>
    set({
      isListOpen: true,
      editingList: null,
      isSearchOpen: false,
    }),
  openEditList: (list) =>
    set({
      isListOpen: true,
      editingList: list,
      isSearchOpen: false,
    }),
  closeList: () =>
    set({
      isListOpen: false,
      editingList: null,
    }),
}));

