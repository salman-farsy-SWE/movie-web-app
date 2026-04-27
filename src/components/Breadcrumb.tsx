
interface BreadcrumbProps {
  subRoute?: string;
  type: string;
  subRoute2?: string;
}

export function Breadcrumb({ subRoute, type, subRoute2 }: BreadcrumbProps) {
  return (
    <div className="mt-[15px] mb-[11px] font-inter font-medium text-[18px] text-black/90 dark:text-white/90 capitalize">
      <span className="hover:text-black dark:hover:text-white">
        {type === "genre" ? "Genres" : type === "trending" ? "Trending" : "Top Rated"}
      </span>
      <span className="mx-2">/</span>
      <span>{subRoute}</span>
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