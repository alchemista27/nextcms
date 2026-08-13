import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteMenuItemAction } from "../actions";
import { MenuItemsManager } from "./MenuItemsManager";

export default async function MenuItemsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth(["ADMIN"]);
  const { id } = await params;
  
  const menu = await prisma.menu.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!menu) notFound();

  // For this MVP, we just list them flatly or allow simple management.
  // MenuItemsManager is a client component that manages the state (show edit form etc.)
  
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-text-secondary text-sm">
        <Link href="/admin/menus" className="hover:text-primary transition">Menus</Link>
        <span className="material-icons-outlined text-sm">chevron_right</span>
        <span className="text-text-primary font-medium">{menu.name}</span>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manage Items: {menu.name}</h1>
          <p className="text-text-secondary text-sm mt-1">{menu.items.length} items</p>
        </div>
      </div>

      <MenuItemsManager menuId={menu.id} items={menu.items} />
    </div>
  );
}
