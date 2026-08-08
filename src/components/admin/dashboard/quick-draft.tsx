"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/actions/post";
import { useRouter } from "next/navigation";

export default function QuickDraft({ authorId }: { authorId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      // Basic slug generation for draft
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      const res = await createPost({
        title,
        slug,
        content: `<p>${content}</p>`,
        status: "DRAFT",
        categoryIds: [],
        tagIds: [],
        newTagNames: [],
      }, authorId);

      if (res.success) {
        setSuccess(true);
        setTitle("");
        setContent("");
        router.refresh();
      } else {
        setError(res.error || "Failed to save draft");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Draft</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-[#0f7f6d] text-sm bg-green-50 p-2 rounded">Draft saved successfully!</div>}
        
        <div>
          <label className="sr-only">Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            required
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0f7f6d]"
          />
        </div>
        
        <div>
          <label className="sr-only">Content</label>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            rows={4}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] resize-none"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="px-4 py-2 bg-[#0f7f6d] hover:bg-[#454545] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
