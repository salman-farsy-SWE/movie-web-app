import { redirect } from "next/navigation";

export default async function UserScopedListPage({
  params,
}: {
  params: Promise<{ id: string; listId: string }>;
}) {
  const { listId } = await params;
  redirect(`/list/${listId}`);
}