"use client";

import { useEffect, useState } from "react";
import { useRating } from "@/contexts/RatingContext";
import { cn } from "@/lib/utils";
import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import { Button } from "./ui/button";

export function RatingOverlay() {
  const { open, setOpen } = useRating();

  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center xl:pt-32 lg:pt-[120px] md:pt-36 sm:pt-40 pt-40 bg-light-screen-shadow/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative xl:w-[708px] xl:h-[401px] lg:w-[690px] lg:h-[390px] md:w-[670px] md:h-[360px] sm:h-[340px] w-screen h-[300px] bg-light-dropdown md:rounded-md rounded-none flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute xl:-top-[54px] lg:-top-[50px] md:-top-[48px] sm:-top-[46px] -top-[38px] left-1/2 -translate-x-1/2 xl:w-[108px] xl:h-[108px] lg:w-[100px] lg:h-[100px] md:w-[95px] md:h-[95px] sm:w-[90px] sm:h-[90px] w-[75px] h-[75px] bg-transparent rounded-full flex items-center justify-center">
          <IoIosStar className="w-full h-full fill-blue-600" />
        </div>

        <h2 className="xl:mt-[71px] lg:mt-[67px] md:mt-[65px] sm:mt-[61px] mt-[52px] xl:text-[28px] lg:text-[27px] md:text-[26px] sm:text-[23px] text-[18px] font-inter font-medium text-black flex justify-center">
          Interstellar
        </h2>

        <p className="xl:mt-[40px] lg:mt-[38px] md:mt-[36px] sm:mt-[34px] mt-[32px] md:ml-[137px] xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[16px] text-[14px] font-inter font-medium text-light-give-a-rating-font md:self-start self-center">
          Give a Rating
        </p>

        <div
          className="lg:mt-[7px] sm:mt-[6px] mt-[5px] flex xl:gap-[15px] lg:gap-[14px] md:gap-[13px] sm:gap-[12px] gap-[11px] self-center"
          onMouseLeave={() => setHover(null)}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const index = i + 1;
            const value = hover ?? rating;

            let Icon;
            let className = "xl:w-[30px] xl:h-[30px] lg:w-[29px] lg:h-[29px] md:w-[28px] md:h-[28px] sm:w-[26px] sm:h-[26px] w-[24px] h-[24px] cursor-pointer";

            if (value >= index) {
              Icon = FaStar;
              className += " text-[#CAD52A]";
            } else if (value >= index - 0.5) {
              Icon = FaRegStarHalfStroke;
              className += " text-[#CAD52A]";
            } else {
              Icon = FaRegStar;
              className += " text-light-unfill-star";
            }

            return (
              <div
                key={i}
                className="relative xl:w-[30px] xl:h-[30px] lg:w-[29px] lg:h-[29px] md:w-[28px] md:h-[28px] sm:w-[26px] sm:h-[26px] w-[24px] h-[24px] cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
                onMouseMove={(e) => {
                  const { left, width } =
                    e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - left;

                  const isHalf = x < width / 2;
                  setHover(isHalf ? index - 0.5 : index);
                }}
                onClick={() => setRating(hover ?? index)}
              >
                <Icon
                  className={cn(
                    className,
                    "transition-all duration-200 ease-out",
                    (hover ?? rating) >= index && "scale-110"
                  )}
                />
              </div>
            );
          })}
        </div>

        <Button
          className="xl:mt-[58px] lg:mt-[54px] sm:mt-[50px] mt-[46px] xl:w-[170px] xl:h-[53px] lg:w-[165px] lg:h-[50px] md:w-[150px] md:h-[45px] sm:w-[135px] sm:h-[40px] w-[120px] h-[37px] border-none rounded-full bg-black hover:bg-black/90 text-white lg:text-[20px] md:text-[18px] sm:text-[16px] text-[14px] font-inter font-semibold transition-colors duration-75"
          onClick={() => {
            console.log("Submitted rating:", rating);
            setOpen(false);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}