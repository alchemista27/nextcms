"use client";

import { useState } from "react";
import { saveMenuItemAction } from "./actions";
import type { MenuItem } from "@prisma/client";

interface MenuItemFormProps {
  menuId: string;
  initialData?: Partial<MenuItem>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MenuItemForm({ menuId, initialData, onSuccess, onCancel }: MenuItemFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [type, setType] = useState(initialData?.type || "CUSTOM");

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("menuId", menuId);
    
    const result = await saveMenuItemAction(initialData?.id || null, formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      setPending(false);
      onSuccess?.();
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Label <span className="text-danger">*</span></label>
        <input type="text" name="label" required defaultValue={initialData?.label || ""}
          className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Home" />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Type</label>
        <select name="type" value={type} onChange={(e) => setType(e.target.value as any)}
          className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none">
          <option value="CUSTOM">Custom Link</option>
          <option value="PAGE">Page</option>
          <option value="POST">Post</option>
          <option value="CATEGORY">Category</option>
        </select>
      </div>

      {type === "CUSTOM" && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">URL</label>
          <input type="text" name="url" defaultValue={initialData?.url || ""}
            className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. /about or https://..." />
        </div>
      )}

      {type !== "CUSTOM" && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Reference ID</label>
          <input type="text" name="referenceId" defaultValue={initialData?.referenceId || ""}
            className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Enter ID of the selected entity" />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Target</label>
        <select name="target" defaultValue={initialData?.target || "_self"}
          className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none">
          <option value="_self">Same Window (_self)</option>
          <option value="_blank">New Window (_blank)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Order</label>
        <input type="number" name="order" defaultValue={initialData?.order ?? 0}
          className="w-full p-2.5 border border-border rounded-lg bg-bg text-sm focus:ring-1 focus:ring-primary outline-none" />
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-bg transition text-sm">Cancel</button>
        )}
        <button type="submit" disabled={pending} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm disabled:opacity-50">
          {pending ? "Saving..." : initialData?.id ? "Update Item" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
