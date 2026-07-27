import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCategories } from "@/actions/category";
import { getTags } from "@/actions/tag";
import { getPostById } from "@/actions/post";
import { getRevisionCount } from "@/actions/revision";
import PostEditorClient from "../../post-editor-client";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPostById(id);
  return {
    title: result.success ? `Edit: ${result.data?.title} - NextCMS Admin` : "Edit Post - NextCMS Admin",
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [postResult, categoriesResult, tagsResult, revisionCount] = await Promise.all([
    getPostById(id),
    getCategories(),
    getTags(),
    getRevisionCount("post", id),
  ]);

  if (!postResult.success || !postResult.data) {
    notFound();
  }

  return (
    <PostEditorClient
      post={postResult.data as any}
      authorId={session.user.id}
      allCategories={categoriesResult.success ? (categoriesResult.data as any[]) : []}
      allTags={tagsResult.success ? (tagsResult.data as any[]) : []}
      revisionCount={typeof revisionCount === 'number' ? revisionCount : 0}
    />
  );
}
