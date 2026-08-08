"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTestimonial, updateTestimonial } from "@/actions/testimonial";
import { toast } from "sonner";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function TestimonialFormClient({
  initialData,
  isEdit = false,
}: {
  initialData?: any;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    content: initialData?.content || "",
    avatarUrl: initialData?.avatarUrl || "",
    isPublished: initialData?.isPublished ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.content) {
      toast.error("Name, Role, and Content are required.");
      return;
    }

    const payload = {
      ...formData,
    };

    let res;
    if (isEdit && initialData) {
      res = await updateTestimonial(initialData.id, payload);
    } else {
      res = await createTestimonial(payload);
    }

    if (res.success) {
      toast.success(`Testimonial ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/testimonials");
    } else {
      toast.error(res.error || "An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/testimonials"
          className="p-2 text-gray-500 hover:text-[#454545] hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowBackIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#454545]">
          {isEdit ? "Edit Testimonial" : "Add Testimonial"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#E3E8E7] rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Role / Position *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              placeholder="e.g. Alumni 2020, Parent of Student"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Content / Quote *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Avatar URL</label>
            <div className="flex gap-4 items-start">
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="flex-1 px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
                placeholder="https://..."
              />
              {formData.avatarUrl && (
                <div className="w-16 h-16 rounded-full border border-[#E3E8E7] overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Provide a valid image URL for the avatar.</p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-[#E3E8E7] text-[#0f7f6d] focus:ring-[#0f7f6d]"
              />
              <span className="text-sm font-semibold text-[#454545]">Published</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">If unchecked, this testimonial won&apos;t appear on the public site.</p>
          </div>

        </div>

        <div className="flex gap-4 pt-4 border-t border-[#E3E8E7]">
          <button
            type="submit"
            className="px-6 py-2 bg-[#0f7f6d] text-white rounded font-medium hover:bg-[#0f7f6d]/90 transition-colors"
          >
            {isEdit ? "Update Testimonial" : "Save Testimonial"}
          </button>
          <Link
            href="/admin/testimonials"
            className="px-6 py-2 border border-[#E3E8E7] text-[#454545] rounded font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
