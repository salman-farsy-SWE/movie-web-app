import type { Metadata } from "next";
import { getCurrentUser } from "@/actions/auth";
import { ProfileSection } from "@/components/user-collection/ProfileSection";
import { slugify } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getCurrentUser();

  const username =
    user?.username ||
    user?.name ||
    (!isNaN(Number(id))
      ? "User"
      : decodeURIComponent(id)
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()));

  const title = `${username}'s Profile`;
  const description = "Manage your profile, account settings, and collections on Movie Trails.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${title} | Movie Trails`,
      description,
      type: "profile",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${title} | Movie Trails`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Movie Trails`,
      description,
      images: ["/twitter-image"],
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const formattedParam = slugify(id);

  return (
    <section className="container-1440 mt-[72px]">
      <div className="flex justify-between lg:items-center items-start xl:mt-[110px] lg:mt-[100px] md:mt-[90px] sm:mt-[83px] mt-[78px] xl:px-0 px-2">
        <h1 className="font-akshar xl:text-[28px] lg:text-[27px] md:text-[25px] sm:text-[23px] text-[21px] font-medium text-black dark:text-white capitalize">
          profile
        </h1>
      </div>

      <ProfileSection param={formattedParam} />
    </section>
  );
}