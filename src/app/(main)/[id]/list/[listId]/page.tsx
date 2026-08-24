import { UserCollectionPage } from "@/components/UserCollectionPage";
import { slugify } from "@/lib/utils";

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