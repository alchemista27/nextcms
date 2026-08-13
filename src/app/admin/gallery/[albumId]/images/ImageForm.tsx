"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGalleryImageAction } from "@/app/admin/gallery/actions";
import { MediaPicker } from "@/components/admin/media-picker";
import type { GalleryImage } from "@prisma/client";

interface ImageFormProps {
  albumId: string;
  initialData?: Partial<GalleryImage>;
}

export function ImageForm({ albumId, initialData }: ImageFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.url || "");
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("url", imageUrl);
    formData.set("albumId", albumId);
    const result = await saveGalleryImageAction(initialData?.id || null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push(`/admin/gallery/${albumId}`);
    }
  }

  return (
    <>
      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Image <span className="text-danger">*</span></label>
            <div
              onClick={() => setShowMediaPicker(true)}
              className="border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition flex items-center justify-center min-h-[200px] bg-bg"
            >
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
              ) : (
                <div className="flex flex-col items-center text-text-secondary p-10">
                  <span className="material-icons-outlined text-5xl mb-3">add_photo_alternate</span>
                  <span className="text-sm">Click to select from Media Library</span>
                </div>
              )}
            </div>
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl("")} className="text-xs text-danger mt-2 hover:underline">Remove image</button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
            <input type="text" name="title" defaultValue={initialData?.title || ""}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Image title (optional)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea name="description" defaultValue={initialData?.description || ""} rows={3}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y" placeholder="Image description (optional)" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Order</label>
            <input type="number" name="order" defaultValue={initialData?.order ?? 0}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm h-fit">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}
          <button type="submit" disabled={pending || !imageUrl}
            className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50">
            {pending ? "Saving..." : isEdit ? "Update Image" : "Add to Album"}
          </button>
          <button type="button" onClick={() => router.push(`/admin/gallery/${albumId}`)}
            className="w-full mt-2 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg transition font-medium text-sm">
            Cancel
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker onSelect={(m) => { setImageUrl(m.url); setShowMediaPicker(false); }} onClose={() => setShowMediaPicker(false)} />
      )}
    </>
  );
}
