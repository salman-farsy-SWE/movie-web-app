"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const checkboxClass = `
  w-[14px] h-[14px] rounded-none 
  border-2 border-black/50 
  data-[state=checked]:bg-white
  data-[state=unchecked]:bg-white 
  [&_svg]:text-black [&_svg]:w-[22px] [&_svg]:h-[22px] 
  [&_svg]:-translate-y-[1.5px] [&_svg]:stroke-[1.5]
`;

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
        <div className="flex items-center gap-[5px]">
            <Checkbox id={id} className={checkboxClass} />
            <Label
                htmlFor={id}
                className="font-inter text-[16px] cursor-pointer flex items-center font-normal text-black gap-[2px]"
            >
                {children || label}
            </Label>
        </div>
    );
}