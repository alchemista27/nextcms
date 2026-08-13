import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { deleteMenuAction } from "./actions";

export default async function MenusPage() {
  await requireAuth(["ADMIN"]);

  const menus = await prisma.menu.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Menus</h1>
          <p className="text-text-secondary text-sm mt-1">{menus.length} menus total</p>
        </div>
        <Link
          href="/admin/menus/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
        >
          <span className="material-icons-outlined text-[18px]">add</span>
          Add Menu
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg/50">
              <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Name</th>
              <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Location</th>
              <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-center">Items</th>
              <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="hover:bg-bg/50">
                <td className="px-5 py-3 border-b border-border font-medium text-text-primary">{menu.name}</td>
                <td className="px-5 py-3 border-b border-border text-sm text-text-secondary">{menu.location || "None"}</td>
                <td className="px-5 py-3 border-b border-border text-center text-sm text-text-secondary">{menu._count.items}</td>
                <td className="px-5 py-3 border-b border-border text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/menus/${menu.id}`}
                      className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-bg text-text-primary transition"
                    >
                      Manage Items
                    </Link>
                    <Link
                      href={`/admin/menus/${menu.id}/edit`}
                      className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-bg text-text-primary transition"
                    >
                      Settings
                    </Link>
                    <form action={deleteMenuAction.bind(null, menu.id)}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs border border-danger/30 rounded-md hover:bg-danger/5 text-danger transition"
                        onClick={(e) => { if (!confirm(`Delete ${menu.name}?`)) e.preventDefault(); }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-text-secondary">
                  No menus found. <Link href="/admin/menus/new" className="text-primary hover:underline">Create one</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
