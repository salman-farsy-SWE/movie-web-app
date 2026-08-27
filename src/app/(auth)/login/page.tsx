"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { ChevronLeft, CircleAlert, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage({ isModal = false }: { isModal?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const userNameRef = useRef<HTMLInputElement>(null);
    const { pending } = useFormStatus();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        userNameRef.current?.focus({ preventScroll: true });
    }, []);

    const handleLogin = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const username = formData.get("username")?.toString().trim() || "";
        const password = formData.get("password")?.toString().trim() || "";

        if (!username) {
            setError("Username is required");
            return;
        }
        if (!password) {
            setError("Password is required");
            return;
        }

        if (username === "testuser" && password === "123456") {
            console.log("Logged in:", { username, password });
            setError(null);
            form.reset();
            if (isModal) router.back();
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className={cn(
            "relative flex flex-col items-center justify-center",
            !isModal && "h-screen w-screen",
            isModal ? "bg-transparent" : "bg-white dark:bg-dropdown"
        )}>
            {!isModal && (
                <div
                    className="absolute top-[60px] container-1440 xl:px-0 lg:px-5 sm:px-7 px-4"
                >
                    <div
                        onClick={() => {
                            if (window.history.length > 1) {
                                router.back();
                            } else {
                                router.push("/");
                            }
                        }}
                        className="group flex items-center xl:gap-1 gap-[2px] h-fit w-fit text-black hover:text-black/75 dark:text-white/85 dark:hover:text-white/75 cursor-pointer select-none transition-colors duration-75">
                        <ChevronLeft className="md:h-[26px] md:w-[26px] sm:h-[24px] sm:w-[24px] h-[22px] w-[22px] " />
                        <span className="font-akshar md:text-[22px] sm:text-[20px] text-[18px] sm:font-medium">Back</span>
                    </div>
                </div>
            )}

            <div className={cn("relative xl:w-[631px] xl:h-[459px] lg:w-[560px] lg:h-[420px] md:w-[580px] md:h-[380px] sm:w-[520px] sm:h-[360px] w-[100vw] h-[350px] flex flex-col items-center", isModal ? "bg-light-dropdown dark:bg-dropdown xl:rounded-[15px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[13px]" : "border-[3px] border-black/40 bg-white dark:bg-dropdown xl:rounded-[15px] lg:rounded-[13px] md:rounded-[11px] sm:rounded-[13px]")}>
                {isModal && <X className="absolute xl:h-7 xl:w-7 lg:h-[26px] lg:w-[26px] md:h-[24px] md:w-[24px] sm:h-[22px] sm:w-[22px] h-[20px] w-[20px] xl:right-4 lg:right-[14px] sm:right-[14px] right-[20px] xl:top-4 lg:top-[14px] md:top-[14px] top-[12px] cursor-pointer text-black hover:text-black/85 dark:text-white/85 dark:hover:text-white/75" onClick={isModal ? () => router.back() : undefined} />}

                <Link href="/" className="flex justify-center font-poppins font-semibold xl:text-3xl lg:text-[28px] md:text-[26px] sm:text-[24px] text-[22px] xl:mt-9 sm:mt-8 mt-7">
                    <h1 className="text-black dark:text-white">Movie</h1>
                    <h1 className="text-trails-red dark:text-blue1 lg:ml-2 md:ml-[6px] ml-[4px]">Trails</h1>
                </Link>

                <form
                    onSubmit={(e) => handleLogin(e.nativeEvent as SubmitEvent)}
                    className="flex flex-col items-center w-fit h-fit xl:gap-8 lg:gap-[30px] md:gap-[28px] sm:gap-[26px] gap-[24px] xl:mt-[37px] lg:mt-[29px] md:mt-[23px] sm:mt-[25px] mt-[21px]"
                >
                    <div className="relative grid lg:gap-[5px] md:gap-[4px] gap-[5px] xl:w-[414px] lg:w-[384px] md:w-[334px] sm:w-[330px] w-[70vw] h-fit font-inter ">
                        <Label htmlFor="username" className="font-medium xl:text-lg lg:text-base text-[14px] text-black dark:text-white">Username</Label>
                        <Input
                            ref={userNameRef}
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter Username"
                            className={cn("w-full xl:h-[45px] lg:h-[43px] md:h-[39px] h-[37px]  lg:px-4 px-3 lg:rounded-lg md:rounded-md xl:text-base md:text-[15px] sm:text-[14px] text-[13px] tracking-wide bg-light-dropdown-input dark:bg-login-input text-black dark:text-white/85 placeholder:text-light-input-font border border-light-stroke dark:border-white/30 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0", isModal ? "bg-light-dropdown-input" : "bg-light-dropdown")}
                            required
                        />
                    </div>

                    <div className="relative grid lg:gap-[5px] md:gap-[4px] gap-[5px] xl:w-[414px] lg:w-[384px] md:w-[334px] sm:w-[330px] w-[70vw] h-fit font-inter">
                        <Label htmlFor="password" className="font-medium xl:text-lg lg:text-base text-[14px] text-black dark:text-white">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            placeholder="Enter Password"
                            className={cn("w-full xl:h-[45px] lg:h-[43px] md:h-[39px] h-[37px] lg:px-4 px-3 lg:rounded-lg md:rounded-md xl:text-base md:text-sm sm:text-[13px] text-[12px] tracking-wide bg-light-dropdown-input dark:bg-login-input text-black dark:text-white/85 placeholder:text-light-input-font border border-light-stroke dark:border-white/30 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0", isModal ? "bg-light-dropdown-input" : "bg-light-dropdown")}
                            required
                        />
                        {showPassword ? (
                            <EyeOff
                                onClick={() => setShowPassword(false)}
                                className="absolute xl:w-[18px] xl:h-[18px] lg:w-[17px] lg:h-[17px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] w-[16px] h-[16px] xl:top-[45.5px] lg:top-[42px] md:top-[36.5px] sm:top-[38px] top-[37px] lg:right-3 md:right-[11px] sm:right-[10.5px] right-[12px] cursor-pointer dark:text-white/85"
                            />
                        ) : (
                            <Eye
                                onClick={() => setShowPassword(true)}
                                className="absolute xl:w-[18px] xl:h-[18px] lg:w-[17px] lg:h-[17px] md:w-[16px] md:h-[16px] sm:w-[14px] sm:h-[14px] w-[16px] h-[16px] xl:top-[45.5px] lg:top-[42px] md:top-[36.5px] sm:top-[38px] top-[37px] lg:right-3 md:right-[11px] sm:right-[10.5px] right-[12px] cursor-pointer dark:text-white/85"
                            />
                        )}
                        <span className="absolute w-[1px] xl:h-[43px] lg:h-[39px] md:h-[37px] sm:h-[34px] h-[35px] bg-light-stroke dark:bg-white/30 xl:top-[34px] lg:top-[31px] md:top-[26px] sm:top-[28px] top-[27px] xl:right-[41px] lg:right-[39px] md:right-[37px] sm:right-[35px] right-[39px]"></span>
                    </div>


                    {error && <div className="flex items-center h-fit xl:-mt-[14px] md:-mt-[12px] sm:-mt-[10px] -mt-[12px] self-start md:gap-[6px] sm:gap-[4px] gap-[5px]">
                        <CircleAlert className="lg:h-4 lg:w-4 md:h-[14px] md:w-[14px] sm:h-[12px] sm:w-[12px] h-[15px] w-[15px] text-red-600" />
                        <p className="text-red-500 lg:text-base md:text-sm sm:text-xs text-[14px]">{error}</p>
                    </div>}

                    <Button
                        type="submit"
                        disabled={pending}
                        className="xl:w-[122px] xl:h-[39px] lg:w-[116px] lg:h-[37px] md:w-[96px] md:h-[35px] sm:h-[33px] w-[100px] h-[33px] md:mt-3 mt-[12px] rounded-full font-poppins xl:text-base lg:text-[15px] md:text-[14px] sm:text-[15px] text-[14px] lg:font-semibold md:font-medium font-semibold sm:tracking-normal tracking-wide text-white dark:text-black self-end bg-black dark:bg-white hover:bg-black/85 dark:hover:bg-white/85 flex items-center justify-center"
                    >
                        {pending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}