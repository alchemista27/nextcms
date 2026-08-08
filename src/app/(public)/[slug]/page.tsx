import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SchoolProfileSinglePost from "@/components/themes/school-profile/single-post";
import { SchoolProfileHeader, SchoolProfileFooter } from "@/components/themes/school-profile/shared";
import { getMenuByLocation } from "@/actions/menu";
import { getAppearanceSettings } from "@/actions/appearance";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((item) => ({ slug: item.slug }));
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, metaTitle: true, metaDescription: true, ogImage: true, excerpt: true },
  });

  if (post) {
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      openGraph: { title: post.metaTitle || post.title, images: post.ogImage ? [post.ogImage] : [] },
    };
  }

  return { title: "Not Found" };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  // Fetch active theme settings
  const { data: appearance } = await getAppearanceSettings();
  const theme = appearance?.active_theme || "school-profile";
  const settings = (theme === "school-profile" ? appearance?.theme_school_profile : {}) as any;

  // Fetch primary menu
  const primaryMenuRes = await getMenuByLocation("HEADER");
  const primaryMenu = primaryMenuRes.success ? primaryMenuRes.data : null;

  // Try post first
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, avatar: true, sharedUser: { select: { full_name: true } } } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  if (post) {
    const { author, ...rest } = post;
    const mappedPost = {
      ...rest,
      author: {
        id: author.id,
        avatar: author.avatar,
        name: author.sharedUser?.full_name || "Unknown"
      }
    };

    if (theme === "school-profile") {
      return <SchoolProfileSinglePost settings={settings} post={mappedPost as any} primaryMenu={primaryMenu} />;
    }
    // Fallback if not school-profile (though currently it's the only one)
    return <div className="p-10 text-center">Post found but theme not supported.</div>;
  }

  notFound();
}
