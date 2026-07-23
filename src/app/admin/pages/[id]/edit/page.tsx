import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPageById, getPages } from "@/actions/page";
import PageEditorClient from "../../page-editor-client";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Page - NextCMS Admin",
};

interface EditPagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPagePage({ params }: EditPagePageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  
  const resolvedParams = await params;

  const [pageResult, pagesResult] = await Promise.all([
    getPageById(resolvedParams.id),
    getPages(),
  ]);

  if (!pageResult.success || !pageResult.data) {
    redirect("/admin/pages");
  }

  return (
    <PageEditorClient
      page={pageResult.data}
      authorId={session.user.id}
      allPages={pagesResult.success ? (pagesResult.data as any[]) : []}
    />
  );
}
