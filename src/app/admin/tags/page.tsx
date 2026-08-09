import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TagForm } from "./TagForm";
import { deleteTagAction } from "./actions";

export default async function TagsPage() {
  await requireAuth(["ADMIN"]);

  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Tags</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - Add New */}
        <div className="md:col-span-1">
          <div className="bg-surface border border-border rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Tag</h2>
            <TagForm />
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg/50">
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">search</span>
                <input type="text" placeholder="Search tags..." className="pl-9 pr-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border w-8"><input type="checkbox" className="accent-primary" /></th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Name</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Slug</th>
                    <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-center">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tags.map(tag => (
                    <tr key={tag.id} className="hover:bg-bg/50 group">
                      <td className="px-5 py-3 border-b border-border">
                        <input type="checkbox" className="accent-primary" />
                      </td>
                      <td className="px-5 py-3 border-b border-border">
                        <div className="font-medium text-text-primary flex items-center gap-2">
                          {tag.name}
                        </div>
                        <div className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="text-primary hover:underline">Edit</button>
                          <span className="text-border">|</span>
                          <form action={deleteTagAction.bind(null, tag.id)} className="inline">
                            <button className="text-danger hover:underline">Delete</button>
                          </form>
                          <span className="text-border">|</span>
                          <button className="text-text-secondary hover:underline">View</button>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-text-secondary border-b border-border">
                        {tag.slug}
                      </td>
                      <td className="px-5 py-3 text-sm text-center border-b border-border">
                        <span className="text-primary hover:underline cursor-pointer">{tag._count.posts}</span>
                      </td>
                    </tr>
                  ))}
                  {tags.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-text-secondary border-b border-border">
                        No tags found.
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
