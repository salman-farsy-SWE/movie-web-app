"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { ChevronLeft, CircleAlert, Eye, EyeOff, Forward, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage({ isModal = false }: { isModal?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const { pending } = useFormStatus();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
            isModal ? "bg-transparent" : "bg-white"
        )}>
            {!isModal && (
                <div
                    onClick={() => {
                        if (window.history.length > 1) {
                            router.back();
                        } else {
                            router.push("/");
                        }
                    }}
                    className="flex items-center absolute top-[60px] gap-1 container-1440 text-black/85 hover:text-black cursor-pointer select-none transition-colors duration-75"
                >
                    <ChevronLeft className="h-7 w-7" />
                    <span className="font-akshar text-2xl font-medium">Back</span>
                </div>
            )}

            <div className={cn("relative w-[631px] h-[459px] flex flex-col items-center", isModal ? "bg-light-dropdown rounded-[15px]" : "bg-white")}>
                {isModal && <X className="absolute h-7 w-7 right-3 top-2 cursor-pointer" onClick={isModal ? () => router.back() : undefined} />}

                <Link href="/" className="flex justify-center font-poppins font-semibold text-3xl mt-9">
                    <h1 className="text-black">Movie</h1>
                    <h1 className="text-trails-red ml-1">Trails</h1>
                </Link>

                <form
                    onSubmit={(e) => handleLogin(e.nativeEvent as SubmitEvent)}
                    className="flex flex-col items-center w-fit h-fit gap-6 mt-[37px]"
                >
                    <div className="grid gap-2 w-[414px] h-fit font-inter ">
                        <Label htmlFor="username" className="font-medium text-lg text-black">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter Username"
                            className={cn("w-full h-[45px] px-4 rounded-lg text-base font-light tracking-wide bg-light-dropdown-input text-black placeholder:text-light-input-font border border-light-stroke shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0", isModal ? "bg-light-dropdown-input" : "bg-light-dropdown")}
                            required
                        />
                    </div>

                    <div className="relative grid gap-2 w-[414px] h-fit font-inter">
                        <Label htmlFor="password" className="font-inter font-medium text-lg text-black">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            placeholder="Enter Password"
                            className={cn("w-full h-[45px] px-4 rounded-lg text-base font-light tracking-wide bg-light-dropdown-input text-black placeholder:text-light-input-font border border-light-stroke shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0", isModal ? "bg-light-dropdown-input" : "bg-light-dropdown")}
                            required
                        />
                        {showPassword ? (
                            <EyeOff
                                onClick={() => setShowPassword(false)}
                                className="absolute w-[18px] h-[18px] top-[50px] right-3 cursor-pointer"
                            />
                        ) : (
                            <Eye
                                onClick={() => setShowPassword(true)}
                                className="absolute w-[18px] h-[18px] top-[50px] right-3 cursor-pointer"
                            />
                        )}
                        <span className="absolute w-[1px] h-[45px] bg-light-stroke top-9 right-[41px]"></span>
                    </div>


                    {error && <div className="flex items-center -mt-[14px] self-start gap-1">
                        <CircleAlert className="h-4 w-4 text-red-800" />
                        <p className="text-red-500 text-base align-middle">{error}</p>
                    </div>}

                    <Button
                        type="submit"
                        disabled={pending}
                        className="w-[122px] h-[35px] mt-3 rounded-full font-poppins text-base font-semibold text-white self-end bg-black hover:bg-black/85"
                    >
                        {pending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}