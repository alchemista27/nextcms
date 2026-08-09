import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { PostForm } from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!post) {
    notFound();
  }

  // RBAC: Contributors can only edit their own posts
  if (user.role === "CONTRIBUTOR" && post.authorId !== user.id) {
    redirect("/admin/posts");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Post</h1>
      </div>
      <PostForm initialData={post} />
    </div>
  );
}
