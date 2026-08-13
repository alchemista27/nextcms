import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MenuForm } from "../../MenuForm";
import { notFound } from "next/navigation";

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth(["ADMIN"]);
  const { id } = await params;
  const menu = await prisma.menu.findUnique({ where: { id } });
  if (!menu) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Menu</h1>
      <MenuForm initialData={menu} />
    </div>
  );
}
