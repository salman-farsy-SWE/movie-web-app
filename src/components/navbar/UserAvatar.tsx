"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  user: {
    name?: string;
    username?: string;
    image?: string;
    id?: number | string;
  } | null;
  className?: string;
  sizeClassName?: string;
  textSizeClassName?: string;
}

export function UserAvatar({
  user,
  className,
  sizeClassName = "xl:w-[38px] xl:h-[38px] lg:w-[36px] lg:h-[36px] md:w-[34px] md:h-[34px] sm:w-[32px] sm:h-[32px] w-[30px] h-[30px]",
  textSizeClassName = "xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px]",
}: UserAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const displayName = user?.name || user?.username || "";
  const initial = displayName.trim().charAt(0).toUpperCase();

  const showImage = Boolean(user?.image && user.image !== failedImageUrl);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none shadow-sm",
        sizeClassName,
        className
      )}
    >
      {showImage ? (
        <Image
          src={user!.image!}
          alt={displayName || "User avatar"}
          fill
          sizes="(max-width: 700px) 30px, (max-width: 900px) 32px, (max-width: 1060px) 34px, (max-width: 1200px) 36px, 38px"
          className="object-cover rounded-full"
          onError={() => setFailedImageUrl(user?.image || null)}
        />
      ) : initial ? (
        <span
          className={cn(
            "w-full h-full flex items-center justify-center bg-gradient-to-br from-trails-red via-red-500 to-rose-600 dark:from-trails-blue dark:via-blue1 dark:to-indigo-500 text-white font-semibold font-inter tracking-wide shadow-inner",
            textSizeClassName
          )}
        >
          {initial}
        </span>
      ) : (
        <span className="w-full h-full flex items-center justify-center bg-zinc-700 text-white/80">
          <User className="w-1/2 h-1/2" />
        </span>
      )}
    </div>
  );
}

