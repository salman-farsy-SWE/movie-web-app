import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function WatchlistPopup() {
    return (
        <div className="relative xl:w-[173px] xl:min-h-[155px] lg:w-[163px] lg:min-h-[145px] md:w-[153px] md:min-h-[135px] sm:w-[143px] sm:min-h-[125px] w-[123px] min-h-[108px] inset-0 sm:rounded-[5px] rounded-none bg-watchlist/90 text-white shadow-[2px_2px_6px_rgba(107,114,128,0.25)] sm:mt-5 mt-[19px] flex flex-col">

            <div className="flex items-center xl:gap-[10px] md:gap-[8px] sm:gap-[6px] gap-[4px] xl:mt-[12px] md:mt-[10px] sm:mt-2 mt-[6px] xl:pb-[8px] md:pb-[6px] sm:pb-[5px] pb-[2px] md:ps-[2px] sm:ps-[1px] ps-[-1px] border-b border-white/50">
                <Checkbox
                    id="watchlist"
                    className="lg:h-[13px] lg:w-[13px] sm:h-3 sm:w-3 h-[10px]
w-[10px] ms-[10px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke"
                />
                <Label
                    htmlFor="watchlist"
                    className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                >
                    Watchlist
                </Label>
            </div>

            <div className="sm:pt-2 pt-1 flex flex-col xl:gap-[10px] md:gap-[8px] sm:gap-[6px] gap-[4px] xl:h-[87px] lg:h-[84px] md:h-[73px] sm:h-[69px] h-[60px] overflow-y-auto custom-scrollbar xl:pb-[10px] md:pb-[8px] sm:pb-[6px] pb-[4px] md:pr-[6px] sm:pr-1 pr-[2px]">
                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] md:ms-[12px] ms-[10px]">
                    <Checkbox
                        id=""
                        className="lg:h-[13px] lg:w-[13px] sm:h-3 sm:w-3 h-[10px] w-[10px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie flex Create
                    </Label>
                </div>

                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] md:ms-[12px] ms-[10px]">
                    <Checkbox
                        id=""
                        className="lg:h-[13px] lg:w-[13px] sm:h-3 sm:w-3 h-[10px] w-[10px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie Flex
                    </Label>
                </div>
                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] md:ms-[12px] ms-[10px]">
                    <Checkbox
                        id=""
                        className="lg:h-[13px] lg:w-[13px] sm:h-3 sm:w-3 h-[10px] w-[10px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie Flex
                    </Label>
                </div>
                <div className="flex items-center lg:gap-[10px] md:gap-[8px] gap-[6px] md:ms-[12px] ms-[10px]">
                    <Checkbox
                        id=""
                        className="lg:h-[13px] lg:w-[13px] sm:h-3 sm:w-3 h-[10px] w-[10px] bg-checked border border-checked-stroke rounded-none
          data-[state=checked]:bg-checked data-[state=checked]:border-checked-stroke"
                    />
                    <Label
                        htmlFor=""
                        className="cursor-pointer truncate min-w-0 lg:text-[13px] sm:text-xs text-[11px] font-normal font-inter"
                    >
                        Movie Flex
                    </Label>
                </div>
            </div>

            <button className="absolute bottom-0 left-0 right-0 flex items-center justify-center xl:h-[31px] md:h-[29px] sm:h-[27px] h-[23px] hover:bg-watchlist transition-colors duration-75 border-t border-white pb-[1px] sm:text-xs text-[11px] font-normal font-inter sm:rounded-b-[5px] rounded-none">
                Create New List
            </button>

        </div>
    );
}