
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
    <div className="mt-[15px] mb-[11px] ml-2 font-inter md:font-medium font-normal xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] text-light-breadcrumb dark:text-breadcrumb capitalize tracking-wide">
      <span>
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