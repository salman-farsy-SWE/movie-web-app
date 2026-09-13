import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { headers } from "next/headers";
import { slugify } from "@/lib/utils";

export default async function UserCollectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    let returnUrl = "";
    try {
      const headerList = await headers();
      returnUrl = headerList.get("x-url") || headerList.get("x-pathname") || "";
    } catch {}

    if (
      returnUrl &&
      returnUrl.startsWith("/") &&
      !returnUrl.startsWith("//") &&
      returnUrl !== "/login" &&
      !returnUrl.startsWith("/login?")
    ) {
      redirect(`/login?redirect=${encodeURIComponent(returnUrl)}`);
    } else {
      redirect("/login");
    }
  }

  const { id } = await params;
  const rawId = decodeURIComponent(id || "").trim().toLowerCase();
  const slugParam = slugify(id).toLowerCase();

  // Validate that the route's `[id]` matches the current authenticated user
  const validIdentifiers = new Set<string>();

  if (user.id !== undefined && user.id !== null) {
    validIdentifiers.add(String(user.id).toLowerCase());
    validIdentifiers.add(slugify(user.id).toLowerCase());
  }

  if (user.username) {
    validIdentifiers.add(user.username.trim().toLowerCase());
    validIdentifiers.add(slugify(user.username).toLowerCase());
  }

  if (user.name) {
    validIdentifiers.add(user.name.trim().toLowerCase());
    validIdentifiers.add(slugify(user.name).toLowerCase());
  }

  const isMatch = validIdentifiers.has(rawId) || validIdentifiers.has(slugParam);

  if (!isMatch) {
    notFound();
  }

  return <>{children}</>;
}

