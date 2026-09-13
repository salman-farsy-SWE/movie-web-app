"use client";

import React from "react";
import Link from "next/link";
import { Film, Bookmark, Video, Sparkles, Heart, Star, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const keyHighlights = [
  { icon: Film, label: "500K+ Movies & Shows" },
  { icon: Sparkles, label: "Real-Time TMDb Data" },
  { icon: Video, label: "Official HD Trailers" },
  { icon: Bookmark, label: "Custom Collections" },
];

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Shows", href: "/tv-shows" },
  { label: "Genres", href: "/genres/action" },
  { label: "Trending", href: "/trending/today" },
  { label: "Top Rated", href: "/top-rated/movies" },
];

const popularGenres = [
  { label: "Action", href: "/genres/action" },
  { label: "Sci-Fi", href: "/genres/sci-fi" },
  { label: "Animation", href: "/genres/animation" },
  { label: "Drama", href: "/genres/drama" },
  { label: "Comedy", href: "/genres/comedy" },
  { label: "Thriller", href: "/genres/thriller" },
];

export function Footer() {
  const { user } = useAuth();

  const libraryLinks = [
    { label: "Watchlist", href: user ? `/${user.id}/watchlist` : "/login", icon: Bookmark },
    { label: "Favorites", href: user ? `/${user.id}/favorite` : "/login", icon: Heart },
    { label: "Ratings", href: user ? `/${user.id}/rating` : "/login", icon: Star },
    { label: "My Lists", href: user ? `/${user.id}/list` : "/login", icon: Compass },
  ];

  return (
    <footer className="w-full mt-12 sm:mt-14 md:mt-16 border-t border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.01]">
      <div className="container-1440 xl:px-8 lg:px-6 md:px-5 sm:px-4 px-4 pt-10 md:pt-12 pb-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-8 lg:gap-12 pb-10">
          
          {/* Brand & Key Highlights Column */}
          <div className="sm:col-span-2 md:col-span-5 lg:col-span-5 flex flex-col items-start text-left">
            <Link
              href="/"
              className="inline-flex items-center font-poppins xl:text-[26px] lg:text-[24px] text-[22px] font-bold tracking-tight leading-none select-none outline-none"
            >
              <span className="text-black dark:text-white">Movie</span>
              <span className="text-trails-red dark:text-blue1 ml-1.5">
                Trails
              </span>
            </Link>

            <p className="mt-3.5 max-w-sm font-inter text-[13.5px] leading-relaxed text-black/65 dark:text-white/65">
              Your ultimate cinematic portal to discover trending movies, explore official trailers, and curate personal watchlists.
            </p>

            {/* Feature Highlights Mini Grid */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 w-full max-w-sm">
              {keyHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] text-black/75 dark:text-white/80 font-poppins text-xs font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-trails-red dark:text-blue1 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col items-start text-left">
            <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-black/90 dark:text-white/90 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 font-inter text-sm text-black/70 dark:text-white/70">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block hover:text-black dark:hover:text-blue1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Personal Library */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col items-start text-left">
            <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-black/90 dark:text-white/90 mb-4">
              Library
            </h4>
            <ul className="space-y-2.5 font-inter text-sm text-black/70 dark:text-white/70">
              {libraryLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 hover:text-black dark:hover:text-blue1"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Top Genres */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col items-start text-left">
            <h4 className="font-poppins text-xs font-semibold uppercase tracking-wider text-black/90 dark:text-white/90 mb-4">
              Popular Genres
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 font-inter text-sm text-black/70 dark:text-white/70">
              {popularGenres.map((genre) => (
                <Link
                  key={genre.label}
                  href={genre.href}
                  className="hover:text-black dark:hover:text-blue1"
                >
                  {genre.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & TMDb Attribution */}
        <div className="border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-inter text-light-footer-rights dark:text-footer-rights">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Movie Trails. All rights reserved.
          </p>

          <p className="text-center sm:text-right text-[11.5px] opacity-80 max-w-md">
            This product uses the{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-black dark:hover:text-white"
            >
              TMDb API
            </a>{" "}
            but is not endorsed or certified by TMDB.
          </p>
        </div>

      </div>
    </footer>
  );
}
