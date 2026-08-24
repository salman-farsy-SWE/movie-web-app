"use client";

import { useEffect, useRef, useState } from "react";
import { useList } from "@/contexts/ListContext";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

export function ListOverlay() {
    const { open, setOpen } = useList();

    const [language, setLanguage] = useState("en");
    const [langOpen, setLangOpen] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                nameRef.current?.focus({ preventScroll: true });
            }, 0);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, setOpen]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setLangOpen(false);
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    if (!open) return null;

    const languages = ["fl", "bn", "fr", "es", "el", "bw", "ff", "eh", "bd", "fg", "er"];

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center xl:pt-[140px] lg:pt-[130px] md:pt-[120px] sm:pt-[100px] pt-[90px] bg-light-screen-shadow/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
        >
            <div
                className="relative flex flex-col items-center xl:gap-[22px] lg:gap-[24px] md:gap-[30px] gap-[35px] lg:w-[545px] xl:h-[546px] lg:h-[570px] md:w-[560px] md:h-[590px] sm:w-[490px] sm:h-[550px] w-screen h-[510px] bg-white lg:rounded-[15px] md:rounded-[11px] sm:rounded-[9px] xl:pt-[50px] md:pt-[60px] pt-[55px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="absolute xl:top-[17px] xl:right-[17px] lg:top-[17px] lg:right-[18px] sm:top-[18px] sm:right-[20px] top-[16px] right-[16px]" 
                >
                    <X className="lg:w-[23px] lg:h-[23px] md:w-[25px] md:h-[25px] sm:w-[23px] sm:h-[23px] w-[21px] h-[21px] text-black hover:text-black/90 transition-colors duration-75" />
                </button>

                <div className="flex flex-col lg:gap-[8px] md:gap-[6px] gap-[4px]">
                    <Label htmlFor="name" className="lg:text-[18px] md:text-[17px] sm:text-[15px] text-[14px] font-inter md:font-medium font-normal text-black">
                        Name
                    </Label>
                    <Input
                        ref={nameRef}
                        id="name"
                        placeholder="Enter name"
                        className="lg:w-[387px] md:h-[45px] md:w-[400px] sm:w-[330px] sm:h-[40px] w-[400px] h-[35px] lg:rounded-[8px] md:rounded-[6px] rounded-[4px] bg-light-dropdown lg:px-4 md:px-[14px] px-[12px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-inter font-light placeholder:text-light-input-font text-black border border-light-stroke shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex flex-col lg:gap-[8px] md:gap-[6px] gap-[4px]">
                    <Label htmlFor="description" className="lg:text-[18px] md:text-[17px] sm:text-[15px] text-[14px] font-inter md:font-medium font-normal text-black">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Enter description"
                        className="lg:w-[387px] md:h-[188px] md:w-[400px] sm:w-[330px] sm:h-[170px] w-[400px] h-[140px] lg:rounded-[8px] md:rounded-[6px] rounded-[4px] bg-light-dropdown lg:px-4 md:px-[14px] px-[12px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-inter font-light placeholder:text-light-input-font text-black border border-light-stroke shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)] resize-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex items-start">
                    <div ref={dropdownRef} className="flex flex-col items-start justify-start lg:gap-[8px] md:gap-[6px] gap-[4px]">
                        <p onClick={() => setLangOpen((prev) => !prev)} className="lg:text-[18px] md:text-[17px] sm:text-[15px] text-[14px] font-inter md:font-medium font-normal text-black cursor-pointer">Language</p>
                        <div className="relative">
                            <div
                                onClick={() => setLangOpen((prev) => !prev)}
                                className={cn(
                                    "lg:w-[80px] lg:h-[37px] md:w-[90px] md:h-[40px] sm:w-[80px] sm:h-[37px] w-[70px] h-[34px] bg-light-dropdown border border-light-stroke outline-none flex items-center justify-center lg:gap-[9px] sm:gap-[7px] gap-[5px]  cursor-pointer",
                                    langOpen
                                        ? "lg:rounded-t-[8px] md:rounded-t-[6px] rounded-t-[4px] rounded-b-none shadow-[inset_0px_1px_2px_rgba(0,0,0,0.25)]"
                                        : "lg:rounded-[8px] md:rounded-[6px] rounded-[4px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)]"
                                )}
                            >
                                <span className="lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-inter font-light">
                                    {language}
                                </span>
                                <ChevronDown strokeWidth={1.5} className="lg:w-[17px] lg:h-[17px] sm:w-[16px] sm:h-[16px] w-[15px] h-[15px]" />
                            </div>

                            {langOpen && (
                                <div
                                    className={cn(
                                        "absolute top-full lg:w-[80px] md:w-[90px] sm:w-[80px] w-[70px] flex flex-col items-center justify-start bg-light-dropdown border border-light-stroke border-t-0 z-50",
                                        "lg:rounded-b-[8px] rounded-b-[6px] shadow-[0_4px_8px_rgba(0,0,0,0.15)]",
                                        "max-h-[160px] overflow-auto custom-scrollbar"
                                    )}
                                >
                                    {languages.map((lang) => (
                                        <div
                                            key={lang}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setLangOpen(false);
                                            }}
                                            className={cn(
                                                "w-full h-[23px] flex items-center justify-start lg:pl-[21px] md:pl-[26px] sm:pl-[22px] pl-[20px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-inter font-light cursor-pointer",
                                                "hover:bg-light-dropdown-input2"
                                            )}
                                        >
                                            {lang}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center lg:ml-[166px] md:ml-[170px] sm:ml-[115px] ml-[205px] xl:mt-[64px] lg:mt-[66px] sm:mt-[68px] mt-[70px] xl:w-[139px] lg:w-[133px] lg:h-[39px] md:w-[125px] sm:w-[117px] sm:h-[37px] w-[110px] h-[35px] rounded-full tracking-wide bg-black text-white md:text-[14px] sm:text-[13px] text-[12px] font-inter font-medium hover:bg-black/90 transition-colors duration-75"
                    >
                        Create List
                    </Button>
                </div>
            </div>
        </div>
    );
}