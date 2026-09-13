import type { Metadata } from "next";
import { UserCollectionPage } from "@/components/user-collection/UserCollectionPage";
import { slugify } from "@/lib/utils";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string; listId: string }>;
}): Promise<Metadata> {
    const { listId } = await params;
    const cleanTitle = decodeURIComponent(listId)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        title: `${cleanTitle} - Custom List`,
        description: "View curated movies and TV shows in this custom list on Movie Trails.",
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function ListPage({
    params,
}: {
    params: Promise<{ id: string, listId: string }>;
}) {
    const { id, listId } = await params;

    const formattedParam = slugify(id);
    const formattedParam2 = slugify(listId);

    return (
        <UserCollectionPage
            type="list"
            param={formattedParam}
            param2={formattedParam2}  
        />
    );
}