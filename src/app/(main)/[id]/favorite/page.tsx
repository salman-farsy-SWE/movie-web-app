import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Favorites",
    description: "Your personal collection of favorite movies and TV shows on Movie Trails.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Favorites | Movie Trails",
        description: "Your personal collection of favorite movies and TV shows on Movie Trails.",
        type: "website",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Favorites | Movie Trails",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Favorites | Movie Trails",
        description: "Your personal collection of favorite movies and TV shows on Movie Trails.",
        images: ["/twitter-image"],
    },
};

export default async function FavoritePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const formattedParam = slugify(id);


    return (
        <UserCollectionPage
            type="favorite"
            param={formattedParam}
        />
    );
}