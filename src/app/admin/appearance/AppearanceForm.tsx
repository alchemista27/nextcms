"use client";

import { useState } from "react";
import { saveAppearanceAction } from "./actions";
import { MediaPicker } from "@/components/admin/media-picker";
import type { Media } from "@prisma/client";

interface AppearanceFormProps {
  sectionKey: string;
  title: string;
  initialData: Record<string, any>;
  fields: { key: string; label: string; type: "text" | "textarea" | "image" }[];
}

function ImageField({ name, initialUrl }: { name: string; initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-4">
        {url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={url} alt="Preview" className="w-16 h-16 object-contain bg-surface border border-border rounded" />
        ) : (
          <div className="w-16 h-16 bg-bg border border-border rounded flex items-center justify-center text-text-secondary">
            <span className="material-icons-outlined text-2xl">image</span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input type="hidden" name={name} value={url} />
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="px-3 py-1.5 bg-surface border border-border text-text-primary text-sm rounded hover:bg-bg transition"
          >
            Choose Image
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="text-xs text-danger hover:underline text-left"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      
      {isPickerOpen && (
        <MediaPicker
          onSelect={(media: Media) => {
            setUrl(media.url);
            setIsPickerOpen(false);
          }}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}

export function AppearanceForm({ sectionKey, title, initialData, fields }: AppearanceFormProps) {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setSuccess(false);
    setError(null);

    const data: Record<string, any> = {};
    fields.forEach((f) => {
      data[f.key] = formData.get(f.key) as string;
    });

    const result = await saveAppearanceAction(sectionKey, data);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="bg-surface border border-border rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-lg text-text-primary mb-4 pb-2 border-b border-border">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {fields.map((field) => (
          <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-text-primary mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.key}
                defaultValue={initialData[field.key] || ""}
                rows={3}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y"
              />
            ) : field.type === "image" ? (
              <ImageField 
                name={field.key} 
                initialUrl={initialData[field.key] || ""} 
              />
            ) : (
              <input
                type="text"
                name={field.key}
                defaultValue={initialData[field.key] || ""}
                className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Configuration"}
        </button>
        {success && <span className="text-sm text-[#065F46] flex items-center gap-1"><span className="material-icons-outlined text-[18px]">check_circle</span> Saved successfully</span>}
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    </form>
  );
}
