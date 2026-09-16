import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string | number | null | undefined): string {
  const str = String(value ?? "").trim();
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractReleaseYear(dateStr?: string | number | null): string {
  if (!dateStr || dateStr === "N/A" || dateStr === "—" || dateStr === "null" || dateStr === "undefined") {
    return "—";
  }
  const str = String(dateStr).trim();
  if (!str) return "—";

  // Match 4-digit year e.g. "2024", "2024-05-15", "7 Nov, 2014", "Nov 7, 2014", "1999"
  const match = str.match(/\b(18\d{2}|19\d{2}|20\d{2}|21\d{2})\b/);
  if (match) {
    return match[1];
  }

  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const fullYear = d.getFullYear();
      if (fullYear >= 1800 && fullYear <= 2200) {
        return fullYear.toString();
      }
    }
  } catch {}

  return "—";
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL.trim();
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }
  return "https://movie-trails.vercel.app";
}