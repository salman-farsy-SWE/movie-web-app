import { redirect } from "next/navigation";

export default async function ListsRedirectPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = await params;
  redirect(`/list/${listId}`);
}

