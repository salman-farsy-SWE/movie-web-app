"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { isProtectedRoute } from "@/lib/auth-routes";

function LoginModalContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const isProtected = isProtectedRoute(pathname);

  useEffect(() => {
    if (isProtected) {
      const query = searchParams?.toString();
      const returnUrl = query ? `${pathname}?${query}` : pathname;
      window.location.replace(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [isProtected, pathname, searchParams]);


  useEffect(() => {
    if (isProtected) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")
      ) {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, isProtected]);

  if (isAuthenticated || user || isProtected) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => router.back()}
    >
      <div
        className="w-full max-w-[480px] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <LoginForm isModal={true} />
      </div>
    </div>
  );
}

export default function LoginModal() {
  return (
    <Suspense fallback={null}>
      <LoginModalContent />
    </Suspense>
  );
}