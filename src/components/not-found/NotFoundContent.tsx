"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="font-akshar font-bold text-7xl sm:text-8xl md:text-9xl text-trails-red dark:text-blue1 mb-2 select-none tracking-tight">
        404
      </span>

      <h1 className="font-akshar text-2xl sm:text-3xl md:text-4xl font-semibold text-black dark:text-white mb-2">
        Page Not Found
      </h1>

      <p className="font-poppins text-sm sm:text-base text-black/60 dark:text-white/60 max-w-md mb-8">
        The page you are looking for doesn&apos;t exist, has been removed, or the URL is incorrect.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="h-10 sm:h-11 px-5 rounded-lg bg-trails-red hover:bg-trails-red/90 text-white font-poppins font-medium text-sm inline-flex items-center gap-2 transition-all duration-150 active:scale-95 shadow-xs cursor-pointer select-none"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoBack}
          className="h-10 sm:h-11 px-4 rounded-lg border-black/15 dark:border-white/15 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white font-poppins font-medium text-sm inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </Button>
      </div>
    </div>
  );
}
