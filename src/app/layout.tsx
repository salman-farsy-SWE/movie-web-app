import type { Metadata } from "next";
import { Akshar, Inter, Poppins, Monda } from "next/font/google";
import "@/app/globals.css";
import ThemeWrapper from "@/providers/ThemeWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

import { getCurrentUser } from "@/actions/auth";
import { RouteProgressBar } from "@/components/navigation/RouteProgressBar";
import { ToastContainer } from "@/components/ui/ToastContainer";

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL.trim();
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }
  return "https://movie-trails.vercel.app";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Movie Trails | Watch, Discover & Track Movies",
    template: "%s | Movie Trails",
  },
  description:
    "Discover watch movies, TV shows trailers. Explore genres, trending and top rated. build your custom collections and track your entertainment.",
  keywords: [
    "movies",
    "tv shows",
    "streaming",
    "watchlist",
    "trailers",
    "reviews",
    "tmdb",
  ],
  authors: [{ name: "Movie Trails" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Movie Trails",
    title: "Movie Trails | Watch, Discover & Track Movies",
    description:
      "Discover watch movies, TV shows trailers. Explore genres, trending and top rated. build your custom collections and track your entertainment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Trails | Watch, Discover & Track Movies",
    description:
      "Discover watch movies, TV shows trailers. Explore genres, trending and top rated. build your custom collections and track your entertainment.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const akshar = Akshar({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-akshar",
});

const monda = Monda({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-monda",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppins.variable} ${inter.variable} ${akshar.variable} ${monda.variable} flow-root overflow-hidden bg-white dark:bg-dark min-h-screen text-foreground antialiased`}
      >
        <ThemeWrapper>
          <AuthProvider initialUser={user}>
            <RouteProgressBar />
            {children}
            <ToastContainer />
          </AuthProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
