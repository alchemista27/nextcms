"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MenuFormSchema, MenuItemFormSchema } from "@/lib/validations/sprint6";
import { revalidatePath } from "next/cache";

export async function saveMenuAction(id: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    location: formData.get("location") as string || undefined,
  };

  const parsed = MenuFormSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  let menuId = id;
  if (id) {
    await prisma.menu.update({ where: { id }, data });
  } else {
    menuId = crypto.randomUUID();
    await prisma.menu.create({ data: { ...data, id: menuId } });
  }

  revalidatePath("/admin/menus");
  return { success: true, id: menuId };
}

export async function deleteMenuAction(id: string) {
  await requireAuth(["ADMIN"]);
  await prisma.menu.delete({ where: { id } });
  revalidatePath("/admin/menus");
}

export async function saveMenuItemAction(id: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData = {
    label: formData.get("label") as string,
    url: formData.get("url") as string || undefined,
    target: formData.get("target") as string || "_self",
    type: formData.get("type") as any || "CUSTOM",
    referenceId: formData.get("referenceId") as string || undefined,
    order: formData.get("order") as string,
    menuId: formData.get("menuId") as string,
    parentId: formData.get("parentId") as string || undefined,
  };

  const parsed = MenuItemFormSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  if (id) {
    await prisma.menuItem.update({ where: { id }, data });
  } else {
    await prisma.menuItem.create({ data: { ...data, id: crypto.randomUUID() } });
  }

  revalidatePath("/admin/menus");
  return { success: true };
}

export async function deleteMenuItemAction(id: string) {
  await requireAuth(["ADMIN"]);
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin/menus");
}
