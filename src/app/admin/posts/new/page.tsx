import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCategories } from "@/actions/category";
import { getTags } from "@/actions/tag";
import PostEditorClient from "../post-editor-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Post - NextCMS Admin",
};

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [categoriesResult, tagsResult] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <PostEditorClient
      post={null}
      authorId={session.user.id}
      allCategories={categoriesResult.success ? (categoriesResult.data as any[]) : []}
      allTags={tagsResult.success ? (tagsResult.data as any[]) : []}
    />
  );
}
