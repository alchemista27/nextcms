"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveTeamMemberAction } from "./actions";
import { MediaPicker } from "@/components/admin/media-picker";
import type { TeamMember } from "@prisma/client";

interface TeamFormProps {
  initialData?: Partial<TeamMember>;
}

export function TeamForm({ initialData }: TeamFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || "");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const formRef = useRef<HTMLFormElement>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (slugEdited) return;
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slugInput = formRef.current?.elements.namedItem("slug") as HTMLInputElement;
    if (slugInput) slugInput.value = slug;
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("photoUrl", photoUrl);
    const result = await saveTeamMemberAction(initialData?.id || null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/admin/team");
    }
  }

  return (
    <>
      <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Fields */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="name"
                required
                defaultValue={initialData?.name || ""}
                onChange={handleNameChange}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Budi Santoso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Slug <span className="text-danger">*</span></label>
              <input
                type="text"
                name="slug"
                required
                defaultValue={initialData?.slug || ""}
                onChange={() => setSlugEdited(true)}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none font-mono"
                placeholder="e.g. budi-santoso"
              />
              <p className="text-xs text-text-secondary mt-1">Used in public URL: /team/slug</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Position / Title <span className="text-danger">*</span></label>
              <input
                type="text"
                name="position"
                required
                defaultValue={initialData?.position || ""}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Kepala Sekolah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Bio</label>
              <textarea
                name="bio"
                defaultValue={initialData?.bio || ""}
                rows={5}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y"
                placeholder="Brief biography..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Actions */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Actions</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select
                name="isActive"
                defaultValue={initialData?.isActive === false ? "false" : "true"}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">Order</label>
              <input
                type="number"
                name="order"
                defaultValue={initialData?.order ?? 0}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none"
              />
              <p className="text-xs text-text-secondary mt-1">Lower number = appears first</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50"
            >
              {pending ? "Saving..." : isEdit ? "Update Member" : "Add Member"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/team")}
              className="w-full mt-2 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg transition font-medium text-sm"
            >
              Cancel
            </button>
          </div>

          {/* Photo */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Photo</h3>
            <div
              onClick={() => setShowMediaPicker(true)}
              className="border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition flex items-center justify-center min-h-[140px] bg-bg"
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Preview" className="w-full h-auto object-cover" />
              ) : (
                <div className="flex flex-col items-center text-text-secondary p-6">
                  <span className="material-icons-outlined text-4xl mb-2">person</span>
                  <span className="text-sm">Click to select photo</span>
                </div>
              )}
            </div>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="text-xs text-danger mt-2 hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker
          onSelect={(media) => {
            setPhotoUrl(media.url);
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
