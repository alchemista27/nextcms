import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";

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
            <div className="text-xs font-medium text-success flex items-center gap-1 mt-1">
              <span className="material-icons-outlined text-[14px]">trending_up</span> +12%
            </div>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F0FDF4] text-[#10B981]">
            <span className="material-icons-outlined text-2xl">group</span>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-text-secondary mb-1">Team Members</div>
            <div className="text-2xl font-bold text-text-primary">{teamCount}</div>
            <div className="text-xs font-medium text-success flex items-center gap-1 mt-1">
              <span className="material-icons-outlined text-[14px]">trending_up</span> +2%
            </div>
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
                {/* Mock Chart */}
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full bg-primary-light rounded-t group-hover:bg-primary transition-colors" style={{ height: '30%' }}></div>
                  <div className="text-xs text-text-secondary">Feb</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full bg-primary-light rounded-t group-hover:bg-primary transition-colors" style={{ height: '50%' }}></div>
                  <div className="text-xs text-text-secondary">Mar</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full bg-primary-light rounded-t group-hover:bg-primary transition-colors" style={{ height: '20%' }}></div>
                  <div className="text-xs text-text-secondary">Apr</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full bg-primary-light rounded-t group-hover:bg-primary transition-colors" style={{ height: '80%' }}></div>
                  <div className="text-xs text-text-secondary">May</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full bg-primary-light rounded-t group-hover:bg-primary transition-colors" style={{ height: '60%' }}></div>
                  <div className="text-xs text-text-secondary">Jun</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full bg-primary rounded-t transition-colors" style={{ height: '100%' }}></div>
                  <div className="text-xs text-text-secondary">Jul</div>
                </div>
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
            <div className="p-5 flex flex-col gap-4">
              <input type="text" className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary" placeholder="Title" />
              <textarea className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary min-h-[100px] resize-y" placeholder="What's on your mind?"></textarea>
              <button className="bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors self-start">Save Draft</button>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-base font-semibold text-text-primary">Recent Activity</h2>
            </div>
            <div className="p-5">
              <div className="relative pl-5 before:content-[''] before:absolute before:left-[5px] before:top-0 before:bottom-0 before:w-[2px] before:bg-border flex flex-col gap-5">
                <div className="relative pl-[15px]">
                  <div className="absolute left-[-20px] top-[2px] w-3 h-3 rounded-full bg-surface border-2 border-primary z-10"></div>
                  <div className="text-sm text-text-primary">
                    <strong>Admin User</strong> published <a href="#" className="text-primary hover:underline">Hello World</a>
                    <span className="block text-xs text-text-secondary mt-1">2 hours ago</span>
                  </div>
                </div>
                <div className="relative pl-[15px]">
                  <div className="absolute left-[-20px] top-[2px] w-3 h-3 rounded-full bg-surface border-2 border-info z-10"></div>
                  <div className="text-sm text-text-primary">
                    <strong>Jane Doe</strong> updated <a href="#" className="text-primary hover:underline">About Page</a>
                    <span className="block text-xs text-text-secondary mt-1">5 hours ago</span>
                  </div>
                </div>
                <div className="relative pl-[15px]">
                  <div className="absolute left-[-20px] top-[2px] w-3 h-3 rounded-full bg-surface border-2 border-success z-10"></div>
                  <div className="text-sm text-text-primary">
                    <strong>Admin User</strong> uploaded 3 new media files
                    <span className="block text-xs text-text-secondary mt-1">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
