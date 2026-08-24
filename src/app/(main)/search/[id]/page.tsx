import { MediaPage } from "@/components/MediaPage";
import { slugify } from "@/lib/utils";

export default async function SearchkPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const formattedParam = slugify(id);

    return <MediaPage type="search" param={formattedParam} />;

}