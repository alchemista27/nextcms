import Link from "next/link";
import { formatDate } from "@/lib/utils";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface RecentPostsProps {
  posts: any[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Published</span>;
      case "DRAFT": return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
      case "PENDING": return <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      default: return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Posts</h3>
        <Link href="/admin/posts" className="text-sm font-medium text-[#00704A] hover:underline flex items-center gap-1">
          View All <ArrowForwardIosIcon style={{ fontSize: 10 }} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 group">
                  <td className="px-5 py-3">
                    <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-gray-900 group-hover:text-[#00704A] transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{getStatusBadge(post.status)}</td>
                  <td className="px-5 py-3 text-gray-600">{post.author?.name || "Unknown"}</td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(post.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
