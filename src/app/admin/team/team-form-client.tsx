"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeamMember, updateTeamMember } from "@/actions/team-member";
import { toast } from "sonner";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function TeamFormClient({
  initialData,
  isEdit = false,
}: {
  initialData?: any;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    position: initialData?.position || "",
    bio: initialData?.bio || "",
    photoUrl: initialData?.photoUrl || "",
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position) {
      toast.error("Name and position are required.");
      return;
    }

    const payload = {
      ...formData,
      order: Number(formData.order) || 0,
    };

    let res;
    if (isEdit && initialData) {
      res = await updateTeamMember(initialData.id, payload);
    } else {
      res = await createTeamMember(payload);
    }

    if (res.success) {
      toast.success(`Team member ${isEdit ? "updated" : "created"} successfully`);
      router.push("/admin/team");
    } else {
      toast.error(res.error || "An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/team"
          className="p-2 text-gray-500 hover:text-[#454545] hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowBackIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#454545]">
          {isEdit ? "Edit Team Member" : "Add Team Member"}
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
            <label className="block text-sm font-semibold text-[#454545] mb-1">Position *</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Photo URL</label>
            <div className="flex gap-4 items-start">
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="flex-1 px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
                placeholder="https://..."
              />
              {formData.photoUrl && (
                <div className="w-16 h-16 rounded border border-[#E3E8E7] overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Provide a valid image URL for the member&apos;s photo.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#454545] mb-1">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
              className="w-32 px-4 py-2 border border-[#E3E8E7] rounded focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-[#E3E8E7]">
          <button
            type="submit"
            className="px-6 py-2 bg-[#0f7f6d] text-white rounded font-medium hover:bg-[#0f7f6d]/90 transition-colors"
          >
            {isEdit ? "Update Member" : "Save Member"}
          </button>
          <Link
            href="/admin/team"
            className="px-6 py-2 border border-[#E3E8E7] text-[#454545] rounded font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
