# AGENTS.md

## Project Overview

Next.js 16 movie browsing app ("Movie Trails") with React 19, TypeScript, and shadcn/ui. No backend — all data is mock/hardcoded.

## Dev Commands

```bash
npm run dev          # Standard dev server
npm run dev:polling  # Fallback for Windows HMR issues (uses webpack polling)
npm run lint         # ESLint 9 (flat config): next core-web-vitals + typescript
npm run build        # Production build
```

No test framework is configured. There are no test commands to run.

## Key Architecture

- **App Router** with two route groups:
  - `(auth)` — standalone login page
  - `(main)` — all app routes: home, movies, tv-shows, trending, top-rated, search, genres, and `[id]` dynamic routes (favorite, list, profile, rating, watchlist)
- **Parallel route** `@modal` intercepts `(.)login` for modal login over any main route
- **Path alias**: `@/*` resolves to `./src/*`
- **No API layer**: content comes from `src/data/mock-home.ts`
- **Provider stack** (inside `(main)/layout.tsx`): `ListProvider > RatingProvider > SearchProvider` wrap all main routes; `ThemeWrapper` wraps the root

## UI Conventions

- **shadcn/ui**: components in `src/components/ui/`, use `cn()` from `@/lib/utils` for merging classes
- **Tailwind v3** with `darkMode: "class"`. Custom breakpoints: `sm:700`, `md:900`, `lg:1060`, `xl:1200` (non-standard — check before adding responsive classes)
- **Extensive custom color palette** in `tailwind.config.ts` — prefer using the named colors (`trails-red`, `hero-shadow`, `genre`, etc.) over raw hex values
- **Fonts**: Poppins, Inter, Akshar, Monda loaded via `next/font/google` with CSS variables. Use `font-poppins`, `font-inter`, `font-akshar`, `font-monda` utility classes
- **Dark mode is the default** (set in `ThemeWrapper` via `next-themes`). `suppressHydrationWarning` is set on `<html>` — do not remove

## Windows Dev Notes

- File-watch events are unreliable when running dev from WSL against `/mnt/c/...` — run from native Windows shell instead
- If HMR appears stuck, delete `.next/dev` and restart
- Only one dev server at a time
