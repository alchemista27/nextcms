import prisma from "@/lib/prisma";
import SchoolProfileArchive from "@/components/themes/school-profile/blog-archive";
import { getAppearanceSettings } from "@/actions/appearance";
import { getMenuByLocation } from "@/actions/menu";

export const metadata = {
  title: "News & Events | SMaRT School",
  description: "Stay up-to-date with the latest news, events, and announcements from SMaRT School.",
};

export default async function BlogPage() {
  const { data: appearance } = await getAppearanceSettings();
  const theme = appearance?.active_theme || "school-profile";
  const settings = (theme === "school-profile" ? appearance?.theme_school_profile : {}) as any;

  // Fetch posts
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { id: true, avatar: true, sharedUser: { select: { full_name: true } } } },
      categories: { select: { name: true, slug: true } },
    }
  });

  const mappedPosts = posts.map((p: any) => {
    const { author, ...rest } = p;
    return {
      ...rest,
      author: {
        id: author.id,
        avatar: author.avatar,
        name: author.sharedUser?.full_name || "Unknown"
      }
    };
  });

  // Fetch primary menu
  const primaryMenuRes = await getMenuByLocation("HEADER");
  const primaryMenu = primaryMenuRes.success ? primaryMenuRes.data : null;

  return (
    <SchoolProfileArchive 
      settings={settings} 
      posts={mappedPosts as any} 
      primaryMenu={primaryMenu}
    />
  );
}
