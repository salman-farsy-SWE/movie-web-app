
interface BreadcrumbProps {
  subRoute?: string;
  type: string;
  subRoute2?: string;
}

export function Breadcrumb({ subRoute, type, subRoute2 }: BreadcrumbProps) {

  const title = {
    trending: "Trending",
    "top-rated": "Top Rated",
  }[type] || "";

  return (
    <div className="mt-[15px] mb-[11px] font-inter font-medium xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] text-black/90 dark:text-white/90 capitalize tracking-wide">
      <span className="hover:text-black dark:hover:text-white">
        {type === "movie" ? "Movies" : type === "tv" ? "TV Shows" : type === "genre" ? "Genres" : type === "trending" ? "Trending" : type === "top-rated" ? "Top Rated" : type === "list" ? "List" : "Search"}
      </span>
      {subRoute && (<>
        <span className="mx-2">/</span>
        <span>
          {title} {subRoute?.replace(/-/g, " ")}
        </span>
      </>)}
      {subRoute2 && (
        <>
          <span className="mx-2">/</span>
          <span>
            {subRoute2}
          </span>
        </>
      )}
    </div>
  );
}