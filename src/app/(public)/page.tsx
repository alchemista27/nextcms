import { getAppearanceSettings } from "@/actions/appearance";
import { getPosts } from "@/actions/post";
import { getMenuByLocation } from "@/actions/menu";
import SchoolProfileTheme from "@/components/themes/school-profile/theme-renderer";

export const metadata = {
  title: "Home - NextCMS",
};

export const dynamic = "force-dynamic";

export default async function PublicHomePage() {
  const { data: appearance } = await getAppearanceSettings();
  
  const activeTheme = appearance?.active_theme || "school-profile";

  // Fetch recent posts for the news section
  const { data: posts = [] } = await getPosts({ status: "PUBLISHED", page: 1, perPage: 3 });

  // Fetch primary menu
  const { data: primaryMenu } = await getMenuByLocation("HEADER") || await getMenuByLocation("Primary Menu");

  if (activeTheme === "school-profile") {
    return <SchoolProfileTheme settings={appearance?.theme_school_profile} recentPosts={posts} primaryMenu={primaryMenu} />;
  }

  // Fallback for other themes (Company Profile, News Portal, etc.)
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to NextCMS</h1>
        <p className="text-xl text-gray-600">The theme &quot;{activeTheme}&quot; is currently under construction.</p>
      </div>
    </div>
  );
}
