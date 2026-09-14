import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Login",
    description: "Log in to your Movie Trails account to manage your watchlist, ratings, and custom lists.",
    openGraph: {
        title: "Login | Movie Trails",
        description: "Log in to your Movie Trails account to manage your watchlist, ratings, and custom lists.",
        type: "website",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Login | Movie Trails",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Login | Movie Trails",
        description: "Log in to your Movie Trails account to manage your watchlist, ratings, and custom lists.",
        images: ["/twitter-image"],
    },
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const user = await getCurrentUser();

    if (user) {
        const params = await searchParams;
        const redirectParam = typeof params.redirect === "string" ? params.redirect : undefined;
        const returnToParam = typeof params.returnTo === "string" ? params.returnTo : undefined;
        const fromParam = typeof params.from === "string" ? params.from : undefined;

        let returnUrl = redirectParam || returnToParam || fromParam;

        if (!returnUrl) {
            try {
                const headerList = await headers();
                const referer = headerList.get("referer");
                if (referer) {
                    const parsedUrl = new URL(referer);
                    if (
                        parsedUrl.pathname !== "/login" &&
                        !parsedUrl.pathname.startsWith("/login") &&
                        !parsedUrl.pathname.startsWith("/api/")
                    ) {
                        returnUrl = parsedUrl.pathname + parsedUrl.search;
                    }
                }
            } catch {}
        }

        if (!returnUrl) {
            try {
                const cookieStore = await cookies();
                const cookieUrl = cookieStore.get("last_app_url")?.value;
                if (cookieUrl) {
                    const decoded = decodeURIComponent(cookieUrl);
                    if (
                        decoded.startsWith("/") &&
                        !decoded.startsWith("//") &&
                        decoded !== "/login" &&
                        !decoded.startsWith("/login?") &&
                        !decoded.startsWith("/api/")
                    ) {
                        returnUrl = decoded;
                    }
                }
            } catch {}
        }

        // Validate safe return URL (relative, not protocol-relative, not /login)
        if (
            returnUrl &&
            returnUrl.startsWith("/") &&
            !returnUrl.startsWith("//") &&
            !returnUrl.startsWith("/login")
        ) {
            redirect(returnUrl);
        } else {
            redirect("/");
        }
    }

    return <LoginForm />;
}