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