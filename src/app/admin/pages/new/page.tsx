import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPages } from "@/actions/page";
import PageEditorClient from "../page-editor-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Page - NextCMS Admin",
};

export default async function NewPagePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const pagesResult = await getPages();

  return (
    <PageEditorClient
      page={null}
      authorId={session.user.id}
      allPages={pagesResult.success ? (pagesResult.data as any[]) : []}
    />
  );
}
