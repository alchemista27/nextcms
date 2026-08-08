import { getPosts } from "@/actions/post";
import { getCurrentUser } from "@/lib/auth-guard";
import PostListClient from "./post-list-client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Posts - NextCMS Admin",
};

interface PostsPageProps {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const status = params.status || "ALL";
  const search = params.search || "";
  const page = parseInt(params.page || "1");

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const result = await getPosts({ status, search, page, perPage: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
        <a
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 bg-[#0f7f6d] hover:bg-[#454545] text-white text-sm font-medium rounded-md transition-colors"
        >
          + Add New Post
        </a>
      </div>

      <PostListClient
        initialPosts={result.success ? result.data || [] : []}
        total={result.success ? result.total || 0 : 0}
        totalPages={result.success ? result.totalPages || 1 : 1}
        counts={result.success ? result.counts || {} : {}}
        currentStatus={status}
        currentSearch={search}
        currentPage={page}
      />
    </div>
  );
}
