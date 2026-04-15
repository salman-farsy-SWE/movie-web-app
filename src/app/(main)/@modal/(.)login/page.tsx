"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginPage from "@/app/(auth)/login/page";

export default function LoginModal() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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