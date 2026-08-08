"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGalleryImage, updateGalleryImage } from "@/actions/gallery";
import { toast } from "sonner";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function GalleryFormClient({
  initialData,
  isEdit = false,
}: {
  initialData?: any;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    url: initialData?.url || "",
    category: initialData?.category || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast.error("Title and URL are required.");
      return;
    }

    const payload = {
      ...formData,
    };

    let res;
    if (isEdit && initialData) {
      res = await updateGalleryImage(initialData.id, payload);
    } else {
      res = await createGalleryImage(payload);
    }

    if (res.success) {
      toast.success(`Gallery image ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/gallery");
    } else {
      toast.error(res.error || "An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/gallery"
          className="p-2 text-gray-500 hover:text-[#454545] hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowBackIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#454545]">
          {isEdit ? "Edit Gallery Image" : "Add Gallery Image"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E3E8E7] rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Image URL *</label>
            <div className="flex gap-4 items-start">
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="flex-1 px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
                placeholder="https://..."
                required
              />
              {formData.url && (
                <div className="w-16 h-16 rounded border border-[#E3E8E7] overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              placeholder="e.g. Facilities, Events, Classrooms"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              rows={4}
            />
          </div>

        </div>

        <div className="flex gap-4 pt-4 border-t border-[#E3E8E7]">
          <button
            type="submit"
            className="px-6 py-2 bg-[#0f7f6d] text-white rounded font-medium hover:bg-[#0f7f6d]/90 transition-colors"
          >
            {isEdit ? "Update Image" : "Save Image"}
          </button>
          <Link
            href="/admin/gallery"
            className="px-6 py-2 border border-[#E3E8E7] text-[#454545] rounded font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
