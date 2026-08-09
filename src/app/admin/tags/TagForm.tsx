"use client";

import { useState, useRef } from "react";
import { saveTagAction } from "./actions";

export function TagForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const slugInput = formRef.current?.elements.namedItem("slug") as HTMLInputElement;
    if (slugInput && !slugInput.value && name) {
      slugInput.value = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await saveTagAction(null, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
    setPending(false);
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
        <input 
          type="text" 
          name="name" 
          required 
          onChange={handleNameChange}
          className="w-full p-2 border border-border rounded-lg bg-bg focus:ring-1 focus:ring-primary outline-none" 
        />
        <p className="text-xs text-text-secondary mt-1">The name is how it appears on your site.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">Slug</label>
        <input 
          type="text" 
          name="slug" 
          required 
          className="w-full p-2 border border-border rounded-lg bg-bg focus:ring-1 focus:ring-primary outline-none" 
        />
        <p className="text-xs text-text-secondary mt-1">The "slug" is the URL-friendly version of the name.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={pending}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium self-start disabled:opacity-70"
      >
        {pending ? "Saving..." : "Add New Tag"}
      </button>
    </form>
  );
}
