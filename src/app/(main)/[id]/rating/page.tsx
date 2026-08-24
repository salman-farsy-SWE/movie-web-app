import { UserCollectionPage } from "@/components/UserCollectionPage";
import { slugify } from "@/lib/utils";

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