"use client";

import React from "react";

export type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "favorite"
  | "watchlist"
  | "rating"
  | "list"
  | "login"
  | "logout";

export interface ToastOptions {
  description?: string;
  duration?: number;
  image?: string | null;
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration: number;
  image?: string | null;
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getToasts(): ToastItem[] {
    return [...this.toasts];
  }

  show(type: ToastType, title: string, options?: ToastOptions): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = options?.duration ?? 3500;

    const toast: ToastItem = {
      id,
      type,
      title,
      description: options?.description,
      duration,
      image: options?.image,
      badge: options?.badge,
      action: options?.action,
      createdAt: Date.now(),
    };

    // Keep max 3 visible toasts to ensure clean prominence
    if (this.toasts.length >= 3) {
      const oldest = this.toasts[0];
      if (oldest) {
        this.dismiss(oldest.id);
      }
    }

    this.toasts = [...this.toasts, toast];
    this.notify();

    if (duration > 0 && duration !== Infinity) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  dismiss(id: string) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  dismissAll() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.toasts = [];
    this.notify();
  }

  // Helper convenience methods
  success(title: string, options?: ToastOptions) {
    return this.show("success", title, options);
  }

  error(title: string, options?: ToastOptions) {
    return this.show("error", title, { duration: 4500, ...options });
  }

  info(title: string, options?: ToastOptions) {
    return this.show("info", title, options);
  }

  warning(title: string, options?: ToastOptions) {
    return this.show("warning", title, options);
  }

  favorite(title: string, isFavorite: boolean, options?: ToastOptions) {
    const mainTitle = isFavorite
      ? `Added to Favorites`
      : `Removed from Favorites`;
    const subText = isFavorite
      ? `"${title}" was added to your favorites`
      : `"${title}" was removed from your favorites`;
    return this.show("favorite", mainTitle, {
      description: subText,
      ...options,
    });
  }

  watchlist(title: string, inWatchlist: boolean, options?: ToastOptions) {
    const mainTitle = inWatchlist
      ? `Added to Watchlist`
      : `Removed from Watchlist`;
    const subText = inWatchlist
      ? `"${title}" is now on your watchlist`
      : `"${title}" was removed from your watchlist`;
    return this.show("watchlist", mainTitle, {
      description: subText,
      ...options,
    });
  }

  rating(title: string, ratingValue: number, options?: ToastOptions) {
    const mainTitle =
      ratingValue > 0
        ? `Rated ${ratingValue}/10`
        : `Rating Removed`;
    const subText =
      ratingValue > 0
        ? `Your score for "${title}" has been saved`
        : `Your rating for "${title}" was cleared`;
    const formattedBadge = ratingValue > 0 ? `${ratingValue} ★` : undefined;
    return this.show("rating", mainTitle, {
      description: subText,
      badge: formattedBadge,
      ...options,
    });
  }

  list(title: string, description?: string, options?: ToastOptions) {
    return this.show("list", title, {
      description,
      ...options,
    });
  }

  login(nameOrUsername: string, options?: ToastOptions) {
    return this.show(
      "login",
      `Logged In Successfully`,
      {
        description: `Welcome back, ${nameOrUsername}!`,
        ...options,
      }
    );
  }

  logout(options?: ToastOptions) {
    return this.show("logout", "Logged Out", {
      description: "You have been safely signed out of your account.",
      ...options,
    });
  }
}

export const toast = new ToastManager();
