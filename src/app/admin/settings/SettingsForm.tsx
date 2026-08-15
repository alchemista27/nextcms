"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Media } from "@prisma/client";
import { saveSettingsAction } from "./actions";

const MediaPicker = dynamic(() => import("@/components/admin/media-picker").then(m => m.MediaPicker), { ssr: false });

interface SettingsFormProps {
  initialData: Record<string, string>;
  fields: { key: string; label: string; type?: "text" | "textarea" | "email" | "url" | "tel" | "image"; placeholder?: string; description?: string }[];
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

export function SettingsForm({ initialData, fields }: SettingsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(false);

    const data: Record<string, string> = {};
    fields.forEach((f) => {
      data[f.key] = (formData.get(f.key) as string) || "";
    });

    const result = await saveSettingsAction(data);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="bg-surface border border-border rounded-xl p-5 md:p-8 shadow-sm flex flex-col gap-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-text-primary mb-1">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.key}
              defaultValue={initialData[field.key] || ""}
              rows={4}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none resize-y"
              placeholder={field.placeholder}
            />
          ) : field.type === "image" ? (
            <ImageField 
              name={field.key} 
              initialUrl={initialData[field.key] || ""} 
            />
          ) : (
            <input
              type={field.type || "text"}
              name={field.key}
              defaultValue={initialData[field.key] || ""}
              className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder={field.placeholder}
            />
          )}
          {field.description && (
            <p className="text-xs text-text-secondary mt-1">{field.description}</p>
          )}
        </div>
      ))}

      <div className="pt-4 border-t border-border flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Settings"}
        </button>
        {success && <span className="text-sm text-[#065F46] flex items-center gap-1"><span className="material-icons-outlined text-[18px]">check_circle</span> Saved successfully</span>}
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    </form>
  );
}
