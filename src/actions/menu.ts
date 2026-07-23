"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import { createMenuSchema, updateMenuSchema, saveMenuItemsSchema } from "@/lib/validators/menu";

export async function getMenus() {
  await requireRole(["ADMIN"]);
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { name: "asc" },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });
    return { success: true, data: menus };
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    return { success: false, error: "Failed to fetch menus" };
  }
}

export async function getMenuById(id: string) {
  await requireRole(["ADMIN"]);
  try {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });
    if (!menu) return { success: false, error: "Menu not found" };
    return { success: true, data: menu };
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return { success: false, error: "Failed to fetch menu" };
  }
}

export async function createMenu(data: unknown) {
  await requireRole(["ADMIN"]);
  try {
    const validatedData = createMenuSchema.parse(data);

    // If location is provided, clear it from other menus
    if (validatedData.location) {
      await prisma.menu.updateMany({
        where: { location: validatedData.location },
        data: { location: null },
      });
    }

    const menu = await prisma.menu.create({
      data: {
        name: validatedData.name,
        location: validatedData.location,
      },
    });

    revalidatePath("/admin/menus");
    return { success: true, data: menu };
  } catch (error) {
    console.error("Failed to create menu:", error);
    return { success: false, error: "Failed to create menu" };
  }
}

export async function updateMenu(id: string, data: unknown) {
  await requireRole(["ADMIN"]);
  try {
    const validatedData = updateMenuSchema.parse(data);

    // If location is provided, clear it from other menus
    if (validatedData.location) {
      await prisma.menu.updateMany({
        where: { 
          location: validatedData.location,
          id: { not: id }
        },
        data: { location: null },
      });
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        name: validatedData.name,
        location: validatedData.location,
      },
    });

    revalidatePath("/admin/menus");
    return { success: true, data: menu };
  } catch (error) {
    console.error("Failed to update menu:", error);
    return { success: false, error: "Failed to update menu" };
  }
}

export async function deleteMenu(id: string) {
  await requireRole(["ADMIN"]);
  try {
    await prisma.menu.delete({
      where: { id },
    });
    revalidatePath("/admin/menus");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete menu:", error);
    return { success: false, error: "Failed to delete menu" };
  }
}

export async function saveMenuItems(menuId: string, itemsData: unknown) {
  await requireRole(["ADMIN"]);
  try {
    const { items } = saveMenuItemsSchema.parse({ menuId, items: itemsData });

    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing items for this menu
      await tx.menuItem.deleteMany({
        where: { menuId },
      });

      // 2. Insert all items WITHOUT parentId first (to avoid FK constraint issues)
      for (const item of items) {
        await tx.menuItem.create({
          data: {
            id: item.id,
            menuId: menuId,
            parentId: null, // Will be set in step 3
            label: item.label,
            url: item.url || "/",
            type: item.type as any,
            referenceId: item.referenceId,
            target: item.target || "_self",
            order: item.order,
          },
        });
      }

      // 3. Now update parentIds for items that have a parent
      for (const item of items) {
        if (item.parentId) {
          await tx.menuItem.update({
            where: { id: item.id },
            data: { parentId: item.parentId },
          });
        }
      }
    });

    revalidatePath("/admin/menus");
    return { success: true };
  } catch (error) {
    console.error("Failed to save menu items:", error);
    return { success: false, error: "Failed to save menu items" };
  }
}
