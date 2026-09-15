"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[calc(100vh-180px)] pt-[72px] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-trails-red/10 dark:bg-trails-red/20 border border-trails-red/20 dark:border-trails-red/30 flex items-center justify-center mb-6 text-trails-red shadow-lg">
        <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
      </div>

      <h1 className="font-akshar text-2xl sm:text-3xl md:text-4xl font-semibold text-black dark:text-white mb-2 tracking-tight">
        Something went wrong
      </h1>

      <p className="font-poppins text-sm sm:text-base text-black/60 dark:text-white/60 max-w-md mb-8">
        An unexpected error occurred while loading this page. Please try again or return to the home page.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={() => reset()}
          className="h-10 sm:h-11 px-5 rounded-lg bg-trails-red hover:bg-trails-red/90 text-white font-poppins font-medium text-sm inline-flex items-center gap-2 transition-all duration-150 active:scale-95 shadow-sm cursor-pointer select-none"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>

        <Link
          href="/"
          className="h-10 sm:h-11 px-5 rounded-lg border border-black/15 dark:border-white/15 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white font-poppins font-medium text-sm inline-flex items-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer select-none"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

