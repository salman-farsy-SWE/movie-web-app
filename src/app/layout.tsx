import type { Metadata } from "next";
import { Akshar, Inter, Poppins } from "next/font/google";
import "@/app/globals.css";
import ThemeWrapper from "@/providers/ThemeWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

import { getCurrentUser } from "@/actions/auth";
import { RouteProgressBar } from "@/components/navigation/RouteProgressBar";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { getBaseUrl } from "@/lib/utils";

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Movie Trails | Watch Trailers, Discover Movies & Track TV Shows",
    template: "%s | Movie Trails",
  },
  description:
    "Discover trending movies, watch trailers, explore top-rated TV shows, create custom watchlists, and track your favorite cinema entertainment with Movie Trails.",
  keywords: [
    "movies",
    "tv shows",
    "watch movies",
    "watch tv shows",
    "watch tv series",
    "watch movie trailers",
    "watch trailers",
    "trending movies",
    "top rated movies",
    "popular tv series",
    "popular tv shows",
    "movie recommendations",
    "popular movies",
    "custom movie watchlist",
    "movie ratings and reviews",
    "tv shows ratings and reviews",
    "tmdb movies",
    "stream trailers online",
    "movie genres",
    "actor filmography",
    "entertainment movies and tv shows",
    "best movies of all time",
    "upcoming movies and tv shows",
  ],
  authors: [{ name: "Movie Trails", url: siteUrl }],
  creator: "Movie Trails",
  publisher: "Movie Trails",
  applicationName: "Movie Trails",
  category: "entertainment",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Movie Trails",
    title: "Movie Trails | Watch Trailers, Discover Movies & Track TV Shows",
    description:
      "Discover trending movies, watch high-definition trailers, explore top-rated TV shows, create custom watchlists, and track your entertainment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movie Trails | Watch Trailers, Discover Movies & Track TV Shows",
    description:
      "Discover trending movies, watch high-definition trailers, explore top-rated TV shows, create custom watchlists, and track your entertainment.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Movie Trails",
    alternateName: ["MovieTrails", "Movie Trails App"],
    url: siteUrl,
    description:
      "Discover trending movies, watch high-definition trailers, explore top-rated TV shows, create custom watchlists, and track your favorite cinema entertainment.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} ${akshar.variable} flow-root overflow-hidden bg-white dark:bg-dark min-h-screen text-foreground antialiased`}
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
