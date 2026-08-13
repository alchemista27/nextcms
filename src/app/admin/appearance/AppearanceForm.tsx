"use client";

import { useState } from "react";
import { saveAppearanceAction } from "./actions";

interface AppearanceFormProps {
  sectionKey: string;
  title: string;
  initialData: Record<string, any>;
  fields: { key: string; label: string; type: "text" | "textarea" }[];
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
