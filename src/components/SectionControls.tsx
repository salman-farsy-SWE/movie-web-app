import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onLeft: () => void;
  onRight: () => void;
  className?: string;
}

export function SectionControls({
  canScrollLeft,
  canScrollRight,
  onLeft,
  onRight,
  className,
}: Props) {
  return (
    <div className={cn("w-full absolute" , className)}>

      <Button
        type="button"
        onClick={onLeft}
        size="icon"
        aria-label="Previous"
        className={cn(
          "absolute xl:left-[-20px] lg:left-[-23px] md:left-[-22px] sm:left-[-21px] left-[-20px] z-10 xl:h-[63px] xl:w-[63px] lg:h-[61px] lg:w-[61px] md:h-[58px] md:w-[58px] sm:h-[55px] sm:w-[55px] h-[46px] w-[46px] rounded-full",
          "bg-light-carousal-btn/20 dark:bg-carousal-btn/20 backdrop-blur-[30px]",
          "flex items-center justify-center transition",
          "hover:bg-light-carousal-btn/20 dark:hover:bg-carousal-btn/20",
          canScrollLeft
            ? "text-white hover:bg-light-carousal-btn/10 dark:hover:bg-carousal-btn/30 shadow-[0_1px_3px_rgba(0,0,0,0.10)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.14)]"
            : "text-white/30 cursor-default"
        )}
      >
        <ChevronLeft className="lg:h-[53px] lg:w-[53px] md:h-[51px] md:w-[51px] sm:h-[49px] sm:w-[49px] h-[45px] w-[45px] xl:[stroke-width:2] lg:[stroke-width:1.8] md:[stroke-width:1.5] [stroke-width:1] mr-1" />
      </Button >

      <Button
        type="button"
        onClick={onRight}
        size="icon"
        aria-label="Next"
        className={cn(
          "absolute xl:right-[-20px] lg:right-[-23px] md:right-[-22px] sm:right-[-21px] right-[-20px] z-10 xl:h-[63px] xl:w-[63px] lg:h-[61px] lg:w-[61px] md:h-[58px] md:w-[58px] sm:h-[55px] sm:w-[55px] h-[46px] w-[46px] rounded-full",
          "bg-light-carousal-btn/20 dark:bg-carousal-btn/20 backdrop-blur-[30px]",
          "flex items-center justify-center transition",
          "hover:bg-light-carousal-btn/20 dark:hover:bg-carousal-btn/20",
          canScrollRight
            ? "text-white hover:bg-light-carousal-btn/10 dark:hover:bg-carousal-btn/30 shadow-[0_1px_3px_rgba(0,0,0,0.10)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.14)]"
            : "text-white/30 cursor-default"
        )}
      >
        <ChevronRight className="lg:h-[53px] lg:w-[53px] md:h-[51px] md:w-[51px] sm:h-[49px] sm:w-[49px] h-[45px] w-[45px] xl:[stroke-width:2] lg:[stroke-width:1.8] md:[stroke-width:1.5] [stroke-width:1] ml-1" />
      </Button>
    </div>
  );
}