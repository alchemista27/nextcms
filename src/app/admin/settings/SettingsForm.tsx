"use client";

import { useState } from "react";
import { saveSettingsAction } from "./actions";

interface SettingsFormProps {
  initialData: Record<string, string>;
  fields: { key: string; label: string; type?: "text" | "textarea" | "email" | "url" | "tel"; placeholder?: string; description?: string }[];
}

export function SettingsForm({ initialData, fields }: SettingsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(false);

    const result = await saveSettingsAction(formData);
    
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
