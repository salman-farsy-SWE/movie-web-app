import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Watchlist",
    description: "Track movies and TV shows you want to watch on Movie Trails.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Watchlist | Movie Trails",
        description: "Track movies and TV shows you want to watch on Movie Trails.",
        type: "website",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Watchlist | Movie Trails",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Watchlist | Movie Trails",
        description: "Track movies and TV shows you want to watch on Movie Trails.",
        images: ["/twitter-image"],
    },
};

export default async function WatchlistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const formattedParam = slugify(id);


    return (
        <UserCollectionPage
            type="watchlist"
            param={formattedParam}
        />
    );
}