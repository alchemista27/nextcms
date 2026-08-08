"use client";

import { useState } from "react";
import { diffWords } from "diff";
import { restoreRevision } from "@/actions/revision";
import { useRouter } from "next/navigation";
import HistoryIcon from "@mui/icons-material/History";

interface Revision {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string | null;
  };
}

interface RevisionClientProps {
  revisions: Revision[];
  entityType: string;
  entityId: string;
  authorId: string;
}

function renderDiff(oldText: string, newText: string) {
  const changes = diffWords(oldText || "", newText || "");
  return changes.map((part, i) => (
    <span
      key={i}
      className={
        part.added
          ? "bg-green-100 text-green-800"
          : part.removed
          ? "bg-red-100 text-red-800 line-through"
          : ""
      }
    >
      {part.value}
    </span>
  ));
}

export default function RevisionClient({ revisions, entityType, entityId, authorId }: RevisionClientProps) {
  const router = useRouter();
  const [selectedRevisionIndex, setSelectedRevisionIndex] = useState<number>(0);
  const [isRestoring, setIsRestoring] = useState(false);

  if (revisions.length === 0) {
    return <div className="p-8 text-center text-gray-500">No revisions found.</div>;
  }

  const current = revisions[selectedRevisionIndex];
  const previous = revisions[selectedRevisionIndex + 1] || null;

  const handleRestore = async () => {
    if (!confirm("Are you sure you want to restore this revision? The current version will be saved as a new revision.")) {
      return;
    }
    
    setIsRestoring(true);
    const res = await restoreRevision(current.id, authorId);
    setIsRestoring(false);

    if (res.success) {
      router.push(`/admin/${entityType}s/${entityId}/edit`);
    } else {
      alert(res.error || "Failed to restore");
    }
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Timeline Sidebar (35%) */}
      <div className="w-[35%] flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Timeline</h3>
            <span className="text-xs text-gray-500">{revisions.length} Revisions</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
            {revisions.map((rev, idx) => {
              const isActive = idx === selectedRevisionIndex;
              const date = new Date(rev.createdAt);
              
              return (
                <div
                  key={rev.id}
                  onClick={() => setSelectedRevisionIndex(idx)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isActive ? "bg-[#f0f9f4] border-l-4 border-l-[#0f7f6d]" : "hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {rev.author?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={rev.author.avatar} alt={rev.author.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0f7f6d] text-white text-[10px] font-medium">
                            {rev.author?.name ? rev.author.name.charAt(0).toUpperCase() : "?"}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{rev.author?.name || "Unknown"}</span>
                    </div>
                    {idx === 0 && (
                      <span className="text-[10px] uppercase font-bold text-[#0f7f6d] bg-green-100 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diff View (65%) */}
      <div className="w-[65%] flex-shrink-0 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Revision from {new Date(current.createdAt).toLocaleString()}
            </h2>
            {previous ? (
              <p className="text-sm text-gray-500 mt-1">
                Comparing with previous version from {new Date(previous.createdAt).toLocaleString()}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">This is the original version.</p>
            )}
          </div>
          
          <button
            onClick={handleRestore}
            disabled={isRestoring || selectedRevisionIndex === 0}
            className="flex items-center gap-2 bg-[#0f7f6d] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#454545] transition-colors disabled:opacity-50"
          >
            <HistoryIcon fontSize="small" />
            {isRestoring ? "Restoring..." : "Restore This Revision"}
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Title</h3>
          </div>
          <div className="p-4 text-lg break-words">
            {previous ? renderDiff(previous.title, current.title) : current.title}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Content</h3>
          </div>
          <div className="p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto break-words">
            {previous ? renderDiff(previous.content, current.content) : current.content}
          </div>
        </div>
      </div>
    </div>
  );
}
