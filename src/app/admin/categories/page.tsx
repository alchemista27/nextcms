import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { CategoryForm } from "./CategoryForm";
import { deleteCategoryAction } from "./actions";

export default async function CategoriesPage() {
  await requireAuth(["ADMIN"]);

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: 'desc' }
  });

  // Build hierarchy for display (simple 1-level indent for this demo)
  const rootCategories = categories.filter(c => !c.parentId);
  
  const displayCategories: typeof categories = [];
  
  for (const root of rootCategories) {
    displayCategories.push(root);
    const children = categories.filter(c => c.parentId === root.id);
    displayCategories.push(...children);
  }

  // Any orphans (parents were deleted? though prisma shouldn't allow it without cascading)
  const displayedIds = new Set(displayCategories.map(c => c.id));
  const orphans = categories.filter(c => !displayedIds.has(c.id));
  displayCategories.push(...orphans);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Add New */}
        <div className="md:col-span-1">
          <div className="bg-surface border border-border rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Category</h2>
            <CategoryForm categories={rootCategories} />
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg/50">
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">search</span>
                <input type="text" placeholder="Search categories..." className="pl-9 pr-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border w-8"><input type="checkbox" className="accent-primary" /></th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Name</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Description</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Slug</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-center">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayCategories.map(category => (
                    <tr key={category.id} className="hover:bg-bg/50 group">
                      <td className="px-5 py-3 border-b border-border">
                        <input type="checkbox" className="accent-primary" />
                      </td>
                      <td className="px-5 py-3 border-b border-border">
                        <div className="font-medium text-text-primary flex items-center gap-2">
                          {category.parentId && <span className="text-text-secondary">—</span>}
                          {category.name}
                        </div>
                        <div className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="text-primary hover:underline">Edit</button>
                          <span className="text-border">|</span>
                          <form action={deleteCategoryAction.bind(null, category.id)} className="inline">
                            <button className="text-danger hover:underline">Delete</button>
                          </form>
                          <span className="text-border">|</span>
                          <button className="text-text-secondary hover:underline">View</button>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-text-secondary border-b border-border max-w-[200px] truncate">
                        {category.description || "—"}
                      </td>
                      <td className="px-5 py-3 text-sm text-text-secondary border-b border-border">
                        {category.slug}
                      </td>
                      <td className="px-5 py-3 text-sm text-center border-b border-border">
                        <span className="text-primary hover:underline cursor-pointer">{category._count.posts}</span>
                      </td>
                    </tr>
                  ))}
                  {displayCategories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-text-secondary border-b border-border">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
