import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
    title: "My Lists",
    description: "Organize and manage your custom movie and TV show lists on Movie Trails.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "My Lists | Movie Trails",
        description: "Organize and manage your custom movie and TV show lists on Movie Trails.",
        type: "website",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "My Lists | Movie Trails",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "My Lists | Movie Trails",
        description: "Organize and manage your custom movie and TV show lists on Movie Trails.",
        images: ["/twitter-image"],
    },
};

export default async function ListsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const formattedParam = slugify(id);


    return (
        <UserCollectionPage
            type="list"
            param={formattedParam}
        />
    );
}