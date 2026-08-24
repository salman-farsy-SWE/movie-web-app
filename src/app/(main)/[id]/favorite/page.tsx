import { UserCollectionPage } from "@/components/UserCollectionPage";
import { slugify } from "@/lib/utils";

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