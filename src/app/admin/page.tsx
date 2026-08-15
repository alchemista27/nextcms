import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export default async function DashboardOverview() {
  const user = await requireAuth();

  const [postCount, teamCount, galleryCount, userCount] = await Promise.all([
    prisma.post.count(),
    prisma.teamMember.count(),
    prisma.galleryImage.count(),
    prisma.cmsUser.count(),
  ]);

  const recentPosts = await prisma.post.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { author: { include: { sharedUser: true } } }
  });

  const recentActivity = await prisma.post.findMany({
    take: 4,
    orderBy: { updatedAt: 'desc' },
    include: { author: { include: { sharedUser: true } } }
  });

  // Calculate posts per month for the last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const postsLast6Months = await prisma.post.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Initialize the last 6 months
  const monthsData: { label: string, month: number, year: number, count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthsData.push({
      label: monthNames[d.getMonth()],
      month: d.getMonth(),
      year: d.getFullYear(),
      count: 0
    });
  }

  // Count posts per month
  let maxCount = 0;
  postsLast6Months.forEach(post => {
    const pDate = new Date(post.createdAt);
    const m = monthsData.find(md => md.month === pDate.getMonth() && md.year === pDate.getFullYear());
    if (m) {
      m.count++;
      if (m.count > maxCount) maxCount = m.count;
    }
  });

  // Action for Quick Draft
  async function saveDraft(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    if (!title) return;
    
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!slug) slug = 'draft-' + Date.now();
    
    // Check slug uniqueness
    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now()}`;

    await prisma.post.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug,
        content,
        status: "DRAFT",
        authorId: user.id
      }
    });

    revalidatePath("/admin");
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back, {user.name || "Admin"}!</h1>
        <p className="text-text-secondary text-sm">Here's what's happening with your site today.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#EFF6FF] text-[#3B82F6]">
            <span className="material-icons-outlined text-2xl">article</span>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-text-secondary mb-1">Total Posts</div>
            <div className="text-2xl font-bold text-text-primary">{postCount}</div>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F0FDF4] text-[#10B981]">
            <span className="material-icons-outlined text-2xl">group</span>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-text-secondary mb-1">Team Members</div>
            <div className="text-2xl font-bold text-text-primary">{teamCount}</div>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FAF5FF] text-[#A855F7]">
            <span className="material-icons-outlined text-2xl">perm_media</span>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-text-secondary mb-1">Media Files</div>
            <div className="text-2xl font-bold text-text-primary">{galleryCount}</div>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FFF7ED] text-[#F97316]">
            <span className="material-icons-outlined text-2xl">people</span>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-text-secondary mb-1">Registered Users</div>
            <div className="text-2xl font-bold text-text-primary">{userCount}</div>
          </div>
        </div>
      </div>

      {/* 2-COL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COL */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-semibold text-text-primary">Recent Posts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Title</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Status</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Author</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-5 py-3 text-sm font-medium text-text-primary border-b border-border">{post.title}</td>
                      <td className="px-5 py-3 text-sm border-b border-border">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          post.status === 'PUBLISHED' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-bg text-text-secondary'
                        }`}>
                          {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-text-primary border-b border-border">{post.author?.sharedUser?.fullName || 'Unknown'}</td>
                      <td className="px-5 py-3 text-sm text-text-primary border-b border-border">{new Date(post.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentPosts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-text-secondary">No recent posts.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-semibold text-text-primary">Content Overview (Posts per Month)</h2>
            </div>
            <div className="p-5">
              <div className="h-[200px] flex items-end justify-between gap-2.5 pt-5">
                {monthsData.map((data, idx) => {
                  const height = maxCount === 0 ? 0 : Math.max(5, (data.count / maxCount) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-xs font-semibold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity mb-1">{data.count}</div>
                      <div className="w-full bg-primary-light rounded-t group-hover:bg-primary transition-colors" style={{ height: `${height}%` }}></div>
                      <div className="text-xs text-text-secondary">{data.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-semibold text-text-primary">Quick Draft</h2>
            </div>
            <form action={saveDraft} className="p-5 flex flex-col gap-4">
              <input name="title" required type="text" className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary" placeholder="Title" />
              <textarea name="content" required className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary min-h-[100px] resize-y" placeholder="What's on your mind?"></textarea>
              <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors self-start">Save Draft</button>
            </form>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
            </div>
            <div className="p-5">
              <div className="relative pl-5 before:content-[''] before:absolute before:left-[5px] before:top-0 before:bottom-0 before:w-[2px] before:bg-border flex flex-col gap-5">
                {recentActivity.map((post, idx) => (
                  <div key={post.id} className="relative pl-[15px]">
                    <div className={`absolute left-[-20px] top-[2px] w-3 h-3 rounded-full bg-surface border-2 z-10 ${idx === 0 ? 'border-primary' : 'border-border'}`}></div>
                    <div className="text-sm text-text-primary">
                      <strong>{post.author?.sharedUser?.fullName || 'User'}</strong> {post.createdAt === post.updatedAt ? 'created' : 'updated'} <Link href={`/admin/posts/${post.id}/edit`} className="text-primary hover:underline">{post.title}</Link>
                      <span className="block text-xs text-text-secondary mt-1">{new Date(post.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-sm text-text-secondary">No recent activity.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
