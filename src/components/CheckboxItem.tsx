"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxItem({
    id,
    label,
    children,
}: {
    id: string;
    label?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex items-center lg:gap-[6px] gap-[5px]">
            <Checkbox id={id} className="lg:w-[14px] lg:h-[14px] md:w-[13px] md:h-[13px] w-[12px] h-[12px] rounded-none 
  md:border-2 border-black/50 
  data-[state=checked]:bg-white
  data-[state=unchecked]:bg-white 
  [&_svg]:text-black xl:[&_svg]:w-[22px] xl:[&_svg]:h-[22px] lg:[&_svg]:w-[21px] lg:[&_svg]:h-[21px] sm:[&_svg]:w-[19px] sm:[&_svg]:h-[19px] [&_svg]:w-[18px] [&_svg]:h-[18px] 
  xl:[&_svg]:-translate-y-[1.5px] sm:[&_svg]:-translate-y-[1.3px] [&_svg]:-translate-y-[1px] md:[&_svg]:stroke-[1.5] sm:[&_svg]:stroke-[1.3] [&_svg]:stroke-[1.2]" />
            <Label
                htmlFor={id}
                className="font-inter xl:text-[16px] lg:text-[15px] sm:text-[14px] text-[13px] cursor-pointer flex items-center font-normal text-black gap-[2px]"
            >
                {children || label}
            </Label>
        </div>
    );
}