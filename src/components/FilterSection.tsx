"use client";

import { CheckboxItem } from "@/components/CheckboxItem";

export function FilterSection({
  title,
  items,
  renderItem,
  children,
}: {
  title: string;
  items?: string[];
  renderItem?: (item: string) => React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="font-inter font-medium xl:text-[18px] lg:text-[17px] sm:text-[16px] text-[15px] text-black dark:text-white">{title}</h2>

      {(items?.length || children) && (
        <div className="xl:mt-[8px] lg:mt-[7px] sm:mt-[6px] mt-[4px] xl:pl-[9px] lg:pl-[8px] sm:pl-[7px] pl-[6px] flex flex-wrap lg:gap-x-[15px] md:gap-x-[14px] gap-x-[12px] lg:gap-y-[9px] gap-y-[7px]">
          {items?.map((item) =>
            renderItem ? (
              renderItem(item)
            ) : (
              <CheckboxItem key={item} id={`${title}-${item}`} label={item} />
            )
          )}
        </div>
      )}
      {children}
    </div>
  );
}