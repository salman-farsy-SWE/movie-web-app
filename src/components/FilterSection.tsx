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
      <h2 className="font-inter font-medium text-[18px] text-black">{title}</h2>

      {(items?.length || children) && (
        <div className="mt-[8px] pl-[9px] flex flex-wrap gap-x-[13px] gap-y-[7px]">
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