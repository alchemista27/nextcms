import { getCurrentUser } from "@/lib/auth-guard";
import { getCategories } from "@/actions/category";
import { getTags } from "@/actions/tag";
import PostEditorClient from "../post-editor-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Post - NextCMS Admin",
};

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [categoriesResult, tagsResult] = await Promise.all([
    getCategories(),
    getTags(),
  ]);

  return (
    <PostEditorClient
      post={null}
      authorId={user.id}
      allCategories={categoriesResult.success ? (categoriesResult.data as any[]) : []}
      allTags={tagsResult.success ? (tagsResult.data as any[]) : []}
    />
  );
}
