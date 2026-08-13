"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveAlbumAction } from "@/app/admin/gallery/actions";
import { MediaPicker } from "@/components/admin/media-picker";
import type { GalleryAlbum } from "@prisma/client";

export function AlbumForm({ initialData }: { initialData?: Partial<GalleryAlbum> }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const formRef = useRef<HTMLFormElement>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (slugEdited) return;
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const slugInput = formRef.current?.elements.namedItem("slug") as HTMLInputElement;
    if (slugInput) slugInput.value = slug;
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("coverImage", coverImage);
    const result = await saveAlbumAction(initialData?.id || null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/admin/gallery");
    }
  }

  return (
    <>
      <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Album Name <span className="text-danger">*</span></label>
            <input type="text" name="name" required defaultValue={initialData?.name || ""} onChange={handleNameChange}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Kegiatan 2024" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Slug <span className="text-danger">*</span></label>
            <input type="text" name="slug" required defaultValue={initialData?.slug || ""} onChange={() => setSlugEdited(true)}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea name="description" defaultValue={initialData?.description || ""} rows={4}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Order</label>
            <input type="number" name="order" defaultValue={initialData?.order ?? 0}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Cover Image</h3>
            <div onClick={() => setShowMediaPicker(true)}
              className="border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition flex items-center justify-center min-h-[140px] bg-bg">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="Cover" className="w-full h-auto" />
              ) : (
                <div className="flex flex-col items-center text-text-secondary p-6">
                  <span className="material-icons-outlined text-4xl mb-2">add_photo_alternate</span>
                  <span className="text-sm">Select cover image</span>
                </div>
              )}
            </div>
            {coverImage && (
              <button type="button" onClick={() => setCoverImage("")} className="text-xs text-danger mt-2 hover:underline">Remove</button>
            )}
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}
            <button type="submit" disabled={pending} className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50">
              {pending ? "Saving..." : isEdit ? "Update Album" : "Create Album"}
            </button>
            <button type="button" onClick={() => router.push("/admin/gallery")} className="w-full mt-2 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg transition font-medium text-sm">Cancel</button>
          </div>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker onSelect={(m) => { setCoverImage(m.url); setShowMediaPicker(false); }} onClose={() => setShowMediaPicker(false)} />
      )}
    </>
  );
}
