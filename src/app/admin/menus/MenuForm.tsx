"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveMenuAction } from "./actions";

export function MenuForm({ initialData }: { initialData?: { id: string; name: string; location: string | null } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await saveMenuAction(initialData?.id || null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else if (result?.id) {
      router.push(`/admin/menus/${result.id}`);
    } else {
      router.push("/admin/menus");
    }
  }

  return (
    <form action={handleSubmit} className="bg-surface border border-border rounded-xl p-5 shadow-sm max-w-xl flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Name <span className="text-danger">*</span></label>
        <input type="text" name="name" required defaultValue={initialData?.name || ""}
          className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Main Navigation" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Location</label>
        <select name="location" defaultValue={initialData?.location || ""}
          className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none">
          <option value="">None (Custom Menu)</option>
          <option value="header">Header</option>
          <option value="footer_1">Footer Column 1</option>
          <option value="footer_2">Footer Column 2</option>
        </select>
        <p className="text-xs text-text-secondary mt-1">Where this menu appears in the theme.</p>
      </div>
      {error && <div className="text-sm text-danger">{error}</div>}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button type="submit" disabled={pending} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50">
          {pending ? "Saving..." : initialData ? "Update Menu" : "Create Menu"}
        </button>
        <button type="button" onClick={() => router.push("/admin/menus")} className="px-5 py-2 border border-border text-text-primary rounded-lg hover:bg-bg transition font-medium text-sm">Cancel</button>
      </div>
    </form>
  );
}
