import { getDashboardStats, getRecentPosts, getChartData, getActivityLog } from "@/actions/dashboard";
import { Metadata } from "next";
import { requireAuth } from "@/lib/auth-guard";
import StatsCards from "@/components/admin/dashboard/stats-cards";
import RecentPosts from "@/components/admin/dashboard/recent-posts";
import QuickDraft from "@/components/admin/dashboard/quick-draft";
import ContentChart from "@/components/admin/dashboard/content-chart";
import ActivityLog from "@/components/admin/dashboard/activity-log";

export const metadata: Metadata = {
  title: "Dashboard - NextCMS Admin",
};

export default async function DashboardPage() {
  const session = await requireAuth();

  const [statsRes, recentPostsRes, chartDataRes, activityRes] = await Promise.all([
    getDashboardStats(),
    getRecentPosts(),
    getChartData(),
    getActivityLog(),
  ]);

  const stats = statsRes.success ? statsRes.data : { posts: 0, pages: 0, media: 0, users: 0 };
  const recentPosts = recentPostsRes.success ? recentPostsRes.data : [];
  const chartData = chartDataRes.success ? chartDataRes.data : [];
  const activities = activityRes.success ? activityRes.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {session?.user?.name || "Admin"}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here is what is happening with your site today.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <ContentChart data={chartData} />
          <RecentPosts posts={recentPosts} />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <QuickDraft />
          <ActivityLog activities={activities} />
        </div>
      </div>
    </div>
  );
}
