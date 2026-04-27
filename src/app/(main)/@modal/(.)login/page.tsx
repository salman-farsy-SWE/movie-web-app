"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginPage from "@/app/(auth)/login/page";

export default function LoginModal() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);

    const originalOverflowX = document.body.style.overflowX;
    const originalOverflowY = document.body.style.overflowY;

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "scroll";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflowX = originalOverflowX;
      document.body.style.overflowY = originalOverflowY;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-light-screen-shadow/60 backdrop-blur-sm"
      onClick={() => router.back()}
    >
      <div
        className="animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <LoginPage isModal={true} />
      </div>
    </div>
  );
}