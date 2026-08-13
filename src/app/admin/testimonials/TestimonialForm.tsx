"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveTestimonialAction } from "./actions";
import { MediaPicker } from "@/components/admin/media-picker";
import type { Testimonial } from "@prisma/client";

interface TestimonialFormProps {
  initialData?: Partial<Testimonial>;
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || "");
  const [rating, setRating] = useState(initialData?.rating ?? 5);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("photoUrl", photoUrl);
    formData.set("rating", String(rating));
    const result = await saveTestimonialAction(initialData?.id || null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/admin/testimonials");
    }
  }

  return (
    <>
      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name <span className="text-danger">*</span></label>
              <input type="text" name="name" required defaultValue={initialData?.name || ""}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Ibu Sari" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Role / Title</label>
              <input type="text" name="role" defaultValue={initialData?.role || ""}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Orang Tua Siswa" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Testimonial Content <span className="text-danger">*</span></label>
              <textarea name="content" required defaultValue={initialData?.content || ""} rows={5}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y"
                placeholder="What did they say about the school?" />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`material-icons-outlined text-2xl transition-colors ${star <= rating ? "text-yellow-400" : "text-border"}`}
                  >
                    star
                  </button>
                ))}
                <span className="text-sm text-text-secondary ml-2">{rating}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Photo */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Photo</h3>
            <div onClick={() => setShowMediaPicker(true)}
              className="border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition flex items-center justify-center min-h-[120px] bg-bg">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Preview" className="w-full h-auto" />
              ) : (
                <div className="flex flex-col items-center text-text-secondary p-6">
                  <span className="material-icons-outlined text-4xl mb-2">person</span>
                  <span className="text-sm">Select photo</span>
                </div>
              )}
            </div>
            {photoUrl && <button type="button" onClick={() => setPhotoUrl("")} className="text-xs text-danger mt-2 hover:underline">Remove</button>}
          </div>

          {/* Settings */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border">Settings</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select name="isActive" defaultValue={initialData?.isActive === false ? "false" : "true"}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none">
                <option value="true">Active (Visible)</option>
                <option value="false">Inactive (Hidden)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">Order</label>
              <input type="number" name="order" defaultValue={initialData?.order ?? 0}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>}
            <button type="submit" disabled={pending}
              className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50">
              {pending ? "Saving..." : isEdit ? "Update Testimonial" : "Add Testimonial"}
            </button>
            <button type="button" onClick={() => router.push("/admin/testimonials")}
              className="w-full mt-2 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg transition font-medium text-sm">
              Cancel
            </button>
          </div>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker onSelect={(m) => { setPhotoUrl(m.url); setShowMediaPicker(false); }} onClose={() => setShowMediaPicker(false)} />
      )}
    </>
  );
}
