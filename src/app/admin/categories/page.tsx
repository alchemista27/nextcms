import { getCategories } from "@/actions/category";
import CategoryManager from "./category-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - NextCMS Admin",
};

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage categories for your posts.
        </p>
      </div>

      <CategoryManager initialCategories={categories || []} />
    </div>
  );
}
