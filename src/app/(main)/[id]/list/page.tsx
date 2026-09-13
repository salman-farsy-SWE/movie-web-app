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