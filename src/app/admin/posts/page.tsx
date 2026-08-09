import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { deletePostAction } from "./actions";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAuth();

  const resolvedSearchParams = await searchParams;
  const filterStatus = resolvedSearchParams.status;

  const whereClause = filterStatus && filterStatus !== "ALL"
    ? { status: filterStatus as any }
    : {};

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { author: { include: { sharedUser: true } } },
  });

  const allCount = await prisma.post.count();
  const publishedCount = await prisma.post.count({ where: { status: "PUBLISHED" } });
  const draftCount = await prisma.post.count({ where: { status: "DRAFT" } });
  const pendingCount = await prisma.post.count({ where: { status: "PENDING" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium">
          Add New Post
        </Link>
      </div>

      <div className="flex gap-6 mb-6 text-sm border-b border-border">
        <Link href="/admin/posts" className={`py-2 border-b-2 ${!filterStatus || filterStatus === 'ALL' ? 'border-primary text-primary font-medium' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          All <span className="text-xs ml-1 opacity-70">({allCount})</span>
        </Link>
        <Link href="/admin/posts?status=PUBLISHED" className={`py-2 border-b-2 ${filterStatus === 'PUBLISHED' ? 'border-primary text-primary font-medium' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Published <span className="text-xs ml-1 opacity-70">({publishedCount})</span>
        </Link>
        <Link href="/admin/posts?status=DRAFT" className={`py-2 border-b-2 ${filterStatus === 'DRAFT' ? 'border-primary text-primary font-medium' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Draft <span className="text-xs ml-1 opacity-70">({draftCount})</span>
        </Link>
        <Link href="/admin/posts?status=PENDING" className={`py-2 border-b-2 ${filterStatus === 'PENDING' ? 'border-primary text-primary font-medium' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Pending <span className="text-xs ml-1 opacity-70">({pendingCount})</span>
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg border-b border-border text-text-secondary text-sm">
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-bg/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-text-primary mb-1">{post.title}</div>
                  <div className="text-xs text-text-secondary">{post.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {post.author.sharedUser?.fullName || post.author.sharedUser?.email || "Unknown"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    post.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                    post.status === "DRAFT" ? "bg-gray-100 text-gray-700" :
                    post.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-primary hover:underline text-sm mr-4">
                    Edit
                  </Link>
                  <form action={deletePostAction.bind(null, post.id)} className="inline-block">
                    <button type="submit" className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
