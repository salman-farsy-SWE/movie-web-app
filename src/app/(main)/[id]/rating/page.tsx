import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
    title: "My Ratings",
    description: "View and manage your movie and TV show ratings on Movie Trails.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "My Ratings | Movie Trails",
        description: "View and manage your movie and TV show ratings on Movie Trails.",
        type: "website",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "My Ratings | Movie Trails",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "My Ratings | Movie Trails",
        description: "View and manage your movie and TV show ratings on Movie Trails.",
        images: ["/twitter-image"],
    },
};

export default async function RatingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const formattedParam = slugify(id);

    return (
        <UserCollectionPage
            type="rating"
            param={formattedParam}
        />
    );
}