import { getRevisions } from "@/actions/revision";
import { notFound } from "next/navigation";
import RevisionClient from "./revision-client";
import { getCurrentUser } from "@/lib/auth-guard";

interface RevisionsPageProps {
  params: { entityType: string; entityId: string };
}

export default async function RevisionsPage({ params }: RevisionsPageProps) {
  const { entityType, entityId } = params;
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const res = await getRevisions(entityType, entityId);
  if (!res.success || !res.data) {
    notFound();
  }

  const revisions = res.data.map((r: any) => ({
    id: r.id,
    title: r.title,
    content: r.content || "",
    createdAt: r.createdAt.toISOString(),
    author: r.author,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href={`/admin/${entityType}s/${entityId}/edit`} className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back to Editor
          </a>
          <h1 className="text-lg font-semibold text-gray-900">
            Revision History
          </h1>
        </div>
      </div>
      
      <RevisionClient 
        revisions={revisions} 
        entityType={entityType} 
        entityId={entityId} 
        authorId={user.id} 
      />
    </div>
  );
}
