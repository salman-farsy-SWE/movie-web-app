import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MdBookmarkAdded, MdDeleteForever } from "react-icons/md";
import { FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { TiPin } from "react-icons/ti";
import { cn } from "@/lib/utils";


const type: "rating" | "rated" | "" = "rating";

export function WatchlistPopup() {
    return (
        <div className={cn(
            "relative inset-0 sm:rounded-[5px] rounded-[3px] bg-watchlist/90 text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] dark:shadow-[0_8px_24px_rgba(30,30,30,0.8)] flex flex-col",

            "xl:w-[175px] xl:min-h-[155px] lg:w-[173px] lg:min-h-[145px] md:w-[163px] md:min-h-[135px] sm:w-[155px] sm:min-h-[125px] w-[143px] min-h-[108px]",

            type === "rated" &&
            "xl:w-[175px] xl:min-h-[211px] lg:w-[173px] lg:min-h-[198px] md:w-[163px] md:min-h-[186.5px] sm:w-[155px] sm:min-h-[174px] w-[143px] min-h-[153px]",

            type === "rating" &&
            "xl:w-[190px] xl:min-h-[239px] lg:w-[186px] lg:min-h-[180px] md:w-[172px] md:min-h-[160px] sm:w-[162px] sm:min-h-[140px] w-[145px] min-h-[120px]"
        )}>

            {type === "rating" && (<>
                <div className="flex items-center lg:gap-[8px] md:gap-[7px] sm:gap-[6px] gap-[5px] xl:mt-[14px] lg:mt-[12px] md:mt-[10px] sm:mt-2 mt-[6px] xl:ps-[6px] lg:ps-[5px] md:ps-[4px] sm:ps-[3px] ps-[2px] text-white hover:text-white/90 transition-colors duration-75">
                    <MdDeleteForever
                        className="lg:h-[16px] lg:w-[16px] md:h-[15px] md:w-[15px] h-[14px] w-[14px] ms-[9px]"
                    />
                    <span
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Remove Rating
                    </span>
                </div>
                <div className="flex items-center lg:gap-[8px] md:gap-[7px] sm:gap-[6px] gap-[5px] xl:mt-[14px] lg:mt-[12px] md:mt-[10px] sm:mt-2 mt-[6px] xl:ps-[6px] lg:ps-[5px] md:ps-[4px] sm:ps-[3px] ps-[2px] text-white hover:text-white/90 transition-colors duration-75">
                    <FaRegStarHalfStroke
                        className="lg:h-[16px] lg:w-[16px] md:h-[15px] md:w-[15px] h-[14px] w-[14px] ms-[9px]"
                    />
                    <span
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Update Rating
                    </span>
                </div>
            </>)}
            {type === "rated" && (
                <div className="flex items-center lg:gap-[8px] md:gap-[7px] sm:gap-[6px] gap-[5px] xl:mt-[14px] lg:mt-[12px] md:mt-[10px] sm:mt-2 mt-[6px] xl:ps-[6px] lg:ps-[5px] md:ps-[4px] sm:ps-[3px] ps-[2px] text-white hover:text-white/90 transition-colors duration-75">
                    <FaStar
                        className="lg:h-[16px] lg:w-[16px] md:h-[15px] md:w-[15px] h-[14px] w-[14px] ms-[9px]"
                    />
                    <span
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Give Rating
                    </span>
                </div>
            )}

            <div className="flex items-center lg:gap-[8px] md:gap-[7px] sm:gap-[6px] gap-[5px] xl:mt-[14px] lg:mt-[12px] md:mt-[10px] sm:mt-2 mt-[6px] xl:ps-[6px] lg:ps-[5px] md:ps-[4px] sm:ps-[3px] ps-[2px] text-white hover:text-white/90 transition-colors duration-75">
                <MdBookmarkAdded
                    className="lg:h-[16px] lg:w-[16px] md:h-[15px] md:w-[15px] h-[14px] w-[14px] ms-[9px]"
                />
                <span
                    className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                >
                    Remove Favorite
                </span>
            </div>
            <div className="flex items-center xl:gap-[7px] md:gap-[8px] sm:gap-[6px] gap-[4px] xl:mt-[14px] lg:mt-[12px] md:mt-[10px] sm:mt-2 mt-[6px] xl:pb-[10px] lg:pb-[8px] md:pb-[6px] sm:pb-[5px] pb-[5px] xl:ps-[6px] lg:ps-[5px] md:ps-[4px] sm:ps-[3px] ps-[2px] border-b border-white/50">
                <Checkbox
                    id="watchlist"
                    className="xl:h-[16px] xl:w-[16px] lg:h-[15px] lg:w-[15px] md:h-[14px] md:w-[14px] sm:h-[13px] sm:w-[13px] h-[12px]
w-[12px] ms-[10px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke
          [&_svg]:xl:h-[18px] [&_svg]:xl:w-[18px] [&_svg]:md:h-[17px] [&_svg]:md:w-[17px] [&_svg]:sm:h-[15px] [&_svg]:sm:w-[15px] [&_svg]:h-[14px] [&_svg]:w-[14px]"
                />
                <Label htmlFor="watchlist" className="flex items-center xl:gap-[6px] md:gap-[5px] sm:gap-[4px] gap-[3px] cursor-pointer">
                    <TiPin
                        className="xl:h-[18px] xl:w-[18px] lg:h-[17px] lg:w-[17px] sm:h-[16px] sm:w-[16px] h-[15px] w-[15px]"
                    />
                    <span

                        className="truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter inline-block"
                    >
                        Watchlist
                    </span>
                </Label>
            </div>

            <div className="xl:pt-[10px] lg:pt-[9px] md:pt-[8px] sm:pt-[7px] pt-[5px] flex flex-col xl:gap-[12px] lg:gap-[10px] md:gap-[8px] sm:gap-[6px] gap-[4px] xl:h-[90px] lg:h-[78px] md:h-[73px] sm:h-[69px] h-[53px] overflow-y-auto custom-scrollbar xl:pb-[10px] lg:pb-[8px] sm:pb-[6px] pb-[4px] md:pr-[6px] sm:pr-1 pr-[2px]">
                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] xl:ms-[16px] lg:ms-[15px] md:ms-[14px] sm:ms-[13px] ms-[12px]">
                    <Checkbox
                        id=""
                        className="xl:h-[16px] xl:w-[16px] lg:h-[15px] lg:w-[15px] md:h-[14px] md:w-[14px] sm:h-[13px] sm:w-[13px] h-[12px]
w-[12px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke
          [&_svg]:xl:h-[18px] [&_svg]:xl:w-[18px] [&_svg]:lg:h-[16px] [&_svg]:lg:w-[16px] [&_svg]:md:h-[15px] [&_svg]:md:w-[15px] [&_svg]:sm:h-[13px] [&_svg]:sm:w-[13px] [&_svg]:h-[12px] [&_svg]:w-[12px]"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie flex Create
                    </Label>
                </div>

                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] xl:ms-[16px] lg:ms-[15px] md:ms-[14px] sm:ms-[13px] ms-[12px]">
                    <Checkbox
                        id=""
                        className="xl:h-[16px] xl:w-[16px] lg:h-[15px] lg:w-[15px] md:h-[14px] md:w-[14px] sm:h-[13px] sm:w-[13px] h-[12px]
w-[12px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke
          [&_svg]:xl:h-[18px] [&_svg]:xl:w-[18px] [&_svg]:lg:h-[16px] [&_svg]:lg:w-[16px] [&_svg]:md:h-[15px] [&_svg]:md:w-[15px] [&_svg]:sm:h-[13px] [&_svg]:sm:w-[13px] [&_svg]:h-[12px] [&_svg]:w-[12px]"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie Flex
                    </Label>
                </div>
                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] xl:ms-[16px] lg:ms-[15px] md:ms-[14px] sm:ms-[13px] ms-[12px]">
                    <Checkbox
                        id=""
                        className="xl:h-[16px] xl:w-[16px] lg:h-[15px] lg:w-[15px] md:h-[14px] md:w-[14px] sm:h-[13px] sm:w-[13px] h-[12px] w-[12px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke
          [&_svg]:xl:h-[18px] [&_svg]:xl:w-[18px] [&_svg]:lg:h-[16px] [&_svg]:lg:w-[16px] [&_svg]:md:h-[15px] [&_svg]:md:w-[15px] [&_svg]:sm:h-[13px] [&_svg]:sm:w-[13px] [&_svg]:h-[12px] [&_svg]:w-[12px]"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie Flex
                    </Label>
                </div>
                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] xl:ms-[16px] lg:ms-[15px] md:ms-[14px] sm:ms-[13px] ms-[12px]">
                    <Checkbox
                        id=""
                        className="xl:h-[16px] xl:w-[16px] lg:h-[15px] lg:w-[15px] md:h-[14px] md:w-[14px] sm:h-[13px] sm:w-[13px] h-[12px] w-[12px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke
          [&_svg]:xl:h-[18px] [&_svg]:xl:w-[18px] [&_svg]:lg:h-[16px] [&_svg]:lg:w-[16px] [&_svg]:md:h-[15px] [&_svg]:md:w-[15px] [&_svg]:sm:h-[13px] [&_svg]:sm:w-[13px] [&_svg]:h-[12px] [&_svg]:w-[12px]"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie Flex
                    </Label>
                </div>
            </div>

            <button className="flex items-center justify-center xl:h-[35px] lg:h-[33px] md:h-[31px] sm:h-[29px] h-[27px] hover:bg-light-create-new-btn dark:hover:bg-create-new-btn transition-colors duration-75 border-t border-white pb-[1px] sm:text-xs text-[11px] font-normal font-inter sm:rounded-b-[5px] rounded-none">
                Create New List
            </button>

        </div >
    );
}