import { Search } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";

export function SearchBox() {
  return (
    <section className="w-[1289px] min-h-[398px] pb-11 flex flex-col items-center gap-[19px] rounded-[9px] bg-white">
      <div className="relative w-[1214px] h-fit border-b-2 border-black mt-[66px] flex items-center justify-center">
        <div className="absolute -top-[22px] w-full h-full flex items-center justify-between gap-2">
          <Input placeholder="Search" className="text-[22px] font-normal font-inter text-black placeholder:text-light-search-font bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none" />
          <Search className="h-8 w-8 text-black mr-[14px]" strokeWidth={1.5} />
        </div>
      </div>
      <div className="relative w-[1214px] h-fit max-h-[400px] overflow-y-auto px-3 custom-scrollbar">
        <div className="grid grid-cols-3 gap-x-10 gap-y-6 w-full">

          {[...Array(21)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="relative w-[54px] h-[75px]">
                <Image
                  src="/assets/card-sand.jpg"
                  alt="Search Box Image"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col font-inter mt-[2px]">
                <h2 className="text-lg text-black">
                  Avengers Endgame (2010)
                </h2>
                <p className="text-base text-light-search-genres-font">
                  Horror/Fantasy
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
