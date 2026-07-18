"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/actions/category";
import { CategoryInput } from "@/lib/validators/category";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

type CategoryData = any; // Simplifying for now, represents the category with _count

export default function CategoryManager({ initialCategories }: { initialCategories: CategoryData[] }) {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<CategoryInput>({
    name: "",
    slug: "",
    description: "",
    parentId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Helper to build hierarchy
  const buildHierarchy = (items: CategoryData[], parentId: string | null = null, depth = 0): CategoryData[] => {
    let result: CategoryData[] = [];
    for (const item of items) {
      if (item.parentId === parentId) {
        result.push({ ...item, depth });
        result = result.concat(buildHierarchy(items, item.id, depth + 1));
      }
    }
    return result;
  };

  const hierarchicalCategories = buildHierarchy(categories);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === generateSlug(prev.name) || prev.slug === "" ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const action = editingId ? updateCategory(editingId, form) : createCategory(form);
      const res = await action;
      
      if (!res.success) {
        setError(res.error || "Something went wrong");
      } else {
        setSuccess(editingId ? "Category updated!" : "Category created!");
        if (!editingId) {
          setForm({ name: "", slug: "", description: "", parentId: "" });
          // In a real app we might refetch or optimistic update. We rely on router revalidate.
          window.location.reload(); 
        } else {
          setEditingId(null);
          setForm({ name: "", slug: "", description: "", parentId: "" });
          window.location.reload();
        }
      }
    });
  };

  const handleEdit = (cat: CategoryData) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (!res.success) {
        alert(res.error || "Failed to delete");
      } else {
        window.location.reload();
      }
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", parentId: "" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Form Column (40%) */}
      <div className="w-full lg:w-2/5">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-20">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded text-sm">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={handleNameChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#00704A] focus:border-[#00704A]"
              />
              <p className="text-xs text-gray-500 mt-1">The name is how it appears on your site.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                required
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#00704A] focus:border-[#00704A]"
              />
              <p className="text-xs text-gray-500 mt-1">
                The &quot;slug&quot; is the URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select
                value={form.parentId || ""}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#00704A] focus:border-[#00704A]"
              >
                <option value="">None</option>
                {hierarchicalCategories.map((cat) => (
                  <option key={cat.id} value={cat.id} disabled={cat.id === editingId}>
                    {"\u2014 ".repeat(cat.depth)}{cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#00704A] focus:border-[#00704A]"
              />
              <p className="text-xs text-gray-500 mt-1">
                The description is not prominent by default; however, some themes may show it.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-[#00704A] hover:bg-[#1E3932] text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingId ? "Update Category" : "Add New Category"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Table Column (60%) */}
      <div className="w-full lg:w-3/5">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <input
              type="text"
              placeholder="Search categories..."
              className="p-1.5 border border-gray-300 rounded text-sm w-64 focus:outline-none focus:ring-[#00704A] focus:border-[#00704A]"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-3 font-medium w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Slug</th>
                  <th className="p-3 font-medium text-center">Count</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {hierarchicalCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No categories found.</td>
                  </tr>
                ) : (
                  hierarchicalCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 group">
                      <td className="p-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="p-3 font-medium text-[#00704A]">
                        <div className="flex flex-col">
                          <span>
                            {"\u2014 ".repeat(cat.depth)}{cat.name}
                          </span>
                          <div className="flex space-x-2 text-xs font-normal mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">Edit</button>
                            <span className="text-gray-300">|</span>
                            {cat.slug !== "uncategorized" ? (
                              <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline disabled:opacity-50" disabled={isPending}>
                                Delete
                              </button>
                            ) : (
                              <span className="text-gray-400 cursor-not-allowed">Delete</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500 max-w-[200px] truncate">
                        {cat.description || "—"}
                      </td>
                      <td className="p-3 text-gray-500">{cat.slug}</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {cat._count?.posts || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
