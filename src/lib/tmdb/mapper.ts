import { getTmdbImageUrl } from "./tmdb";
import type { TmdbMovie, TmdbTvShow, TmdbPerson } from "./types";
import type { MovieItem, Person } from "@/types";


export const LANG_CODE_TO_NAME: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  mr: "Marathi",
  pa: "Punjabi",
  ur: "Urdu",
  gu: "Gujarati",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  cn: "Cantonese",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  tl: "Filipino",
  ms: "Malay",
  ar: "Arabic",
  tr: "Turkish",
  fa: "Persian",
  he: "Hebrew",
  pl: "Polish",
  nl: "Dutch",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  fi: "Finnish",
  el: "Greek",
  uk: "Ukrainian",
  cs: "Czech",
  hu: "Hungarian",
  ro: "Romanian",
  sw: "Swahili",
};

export const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  US: "USA",
  GB: "UK",
  CA: "Canada",
  AU: "Australia",
  IN: "India",
  JP: "Japan",
  KR: "South Korea",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  ES: "Spain",
  CN: "China",
  HK: "Hong Kong",
  TW: "Taiwan",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  NL: "Netherlands",
  BE: "Belgium",
  PL: "Poland",
  IE: "Ireland",
  RU: "Russia",
  TR: "Turkey",
  TH: "Thailand",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  NG: "Nigeria",
  ZA: "South Africa",
  EG: "Egypt",
  IR: "Iran",
  IL: "Israel",
  NZ: "New Zealand",
  BD: "Bangladesh",
  PK: "Pakistan",
  GR: "Greece",
  PT: "Portugal",
  CO: "Colombia",
  CL: "Chile",
  AT: "Austria",
  CH: "Switzerland",
  CZ: "Czech Republic",
  HU: "Hungary",
  RO: "Romania",
  UA: "Ukraine",
  SA: "Saudi Arabia",
  AE: "UAE",
};

export function inferCountryFromLanguage(langCode: string): string | undefined {
  const code = langCode.toLowerCase();
  switch (code) {
    case "ko":
      return "South Korea";
    case "ja":
      return "Japan";
    case "hi":
    case "ta":
    case "te":
    case "ml":
    case "bn":
    case "kn":
    case "mr":
    case "gu":
    case "pa":
      return "India";
    case "fr":
      return "France";
    case "de":
      return "Germany";
    case "es":
      return "Spain";
    case "it":
      return "Italy";
    case "zh":
    case "cn":
      return "China";
    case "pt":
      return "Brazil";
    case "ru":
      return "Russia";
    case "tr":
      return "Turkey";
    case "th":
      return "Thailand";
    case "vi":
      return "Vietnam";
    case "id":
      return "Indonesia";
    case "tl":
      return "Philippines";
    case "sv":
      return "Sweden";
    case "da":
      return "Denmark";
    case "no":
      return "Norway";
    case "fi":
      return "Finland";
    case "nl":
      return "Netherlands";
    case "pl":
      return "Poland";
    case "el":
      return "Greek";
    case "uk":
      return "Ukraine";
    case "cs":
      return "Czech Republic";
    case "hu":
      return "Hungary";
    case "ro":
      return "Romania";
    case "ar":
      return "Egypt";
    case "fa":
      return "Iran";
    case "he":
      return "Israel";
    case "ur":
      return "Pakistan";
    case "en":
      return "USA";
    default:
      return undefined;
  }
}

export function mapTmdbToMovieItem(
  item: TmdbMovie | TmdbTvShow,
  movieGenreMap: Map<number, string>,
  tvGenreMap: Map<number, string>
): MovieItem {
  const isMovie =
    item.media_type === "movie" ||
    ("title" in item && !("name" in item)) ||
    !("first_air_date" in item && "name" in item);

  const genreMap = isMovie ? movieGenreMap : tvGenreMap;
  const genreNames = (item.genre_ids || [])
    .map((id) => genreMap.get(id))
    .filter((name): name is string => Boolean(name));

  const title = isMovie
    ? "title" in item
      ? item.title || item.original_title
      : (item as unknown as TmdbTvShow).name
    : "name" in item
    ? item.name || item.original_name
    : (item as unknown as TmdbMovie).title;

  const rawDate = isMovie
    ? "release_date" in item
      ? item.release_date
      : undefined
    : "first_air_date" in item
    ? item.first_air_date
    : undefined;

  const releaseYear = rawDate
    ? new Date(rawDate).getFullYear().toString()
    : undefined;

  const rawLang = item.original_language || "";
  const language =
    LANG_CODE_TO_NAME[rawLang.toLowerCase()] ||
    (rawLang ? rawLang.toUpperCase() : undefined);

  let country: string | undefined;
  if (
    "origin_country" in item &&
    Array.isArray((item as unknown as { origin_country?: string[] }).origin_country) &&
    ((item as unknown as { origin_country?: string[] }).origin_country?.length || 0) > 0
  ) {
    const originCodes = (item as unknown as { origin_country: string[] }).origin_country;
    country = COUNTRY_CODE_TO_NAME[originCodes[0]] || originCodes[0];
  }
  if (!country && rawLang) {
    country = inferCountryFromLanguage(rawLang);
  }

  let mediaStatus: string | undefined;
  if (isMovie && rawDate) {
    const relDate = new Date(rawDate);
    const now = new Date();
    const diffDays = (now.getTime() - relDate.getTime()) / (1000 * 60 * 60 * 24);
    if (relDate > now) {
      mediaStatus = "upcoming";
    } else if (diffDays <= 60 && diffDays >= -7) {
      mediaStatus = "now_playing";
    } else {
      mediaStatus = "released";
    }
  } else if (!isMovie && rawDate) {
    const relDate = new Date(rawDate);
    const now = new Date();
    const diffDays = (now.getTime() - relDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays >= 0 && diffDays <= 14) {
      mediaStatus = "airing_today";
    } else {
      mediaStatus = "on_the_air";
    }
  }

  return {
    id: item.id.toString(),
    title: title || (isMovie ? `Movie ${item.id}` : `TV Show ${item.id}`),
    genre:
      genreNames.length > 0
        ? genreNames.slice(0, 2).join(" / ")
        : isMovie
        ? "Movie"
        : "TV Show",
    image: getTmdbImageUrl(
      item.poster_path || item.backdrop_path,
      "w500"
    ),
    trailerKey: null,
    mediaType: (isMovie ? "movie" : "tv") as "movie" | "tv",
    mediaStatus,
    year: releaseYear,
    releaseYear,
    releaseDate: rawDate || releaseYear,
    rating: item.vote_average ? item.vote_average.toFixed(1) : undefined,
    voteCount: item.vote_count,
    popularity: item.popularity,
    country,
    language,
    duration: isMovie ? 110 : 45,
  };
}

export function mapTmdbToPersonItem(item: TmdbPerson): Person {
  const knownForTitles = (item.known_for || [])
    .map((k) => ("title" in k ? k.title : "name" in k ? k.name : ""))
    .filter(Boolean);

  return {
    id: item.id.toString(),
    name: item.name || item.original_name || `Person ${item.id}`,
    role: item.known_for_department || "Actor",
    image: getTmdbImageUrl(item.profile_path, "w500"),
    popularity: item.popularity,
    knownFor: knownForTitles.length > 0 ? knownForTitles.slice(0, 2).join(", ") : undefined,
  };
}

