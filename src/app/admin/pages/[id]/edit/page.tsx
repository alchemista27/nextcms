import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPageById, getPages } from "@/actions/page";
import { getRevisionCount } from "@/actions/revision";
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
  const id = resolvedParams.id;

  const [pageResult, allPagesResult, revisionCount] = await Promise.all([
    getPageById(id),
    getPages(),
    getRevisionCount("page", id),
  ]);

  if (!pageResult.success || !pageResult.data) {
    redirect("/admin/pages");
  }

  return (
    <PageEditorClient
      page={pageResult.data as any}
      authorId={session.user.id}
      allPages={allPagesResult.success ? (allPagesResult.data as any[]) : []}
      revisionCount={typeof revisionCount === 'number' ? revisionCount : 0}
    />
  );
}
