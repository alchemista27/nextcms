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

    // Use a transaction to delete old items and insert new ones
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing items for this menu
      await tx.menuItem.deleteMany({
        where: { menuId },
      });

      // 2. We need to handle parent IDs. Since we're inserting new items, the old UUIDs might not be valid 
      // if we're creating them fresh. However, if the client passes consistent IDs (even temporary ones), 
      // we can map them. The best way is to insert them in a way that respects hierarchy or just use the IDs 
      // provided by the client if they are valid UUIDs.
      // But we can also insert them one by one or allow Prisma to handle the relations.
      
      // We will assume the client generates valid CUIDs or UUIDs for new items and maintains the parentId relations correctly.
      
      for (const item of items) {
        await tx.menuItem.create({
          data: {
            id: item.id, // Ensure client passes stable IDs
            menuId: menuId,
            parentId: item.parentId,
            label: item.label,
            url: item.url,
            type: item.type,
            referenceId: item.referenceId,
            target: item.target,
            cssClass: item.cssClass,
            order: item.order,
          },
        });
      }
    });

    revalidatePath("/admin/menus");
    return { success: true };
  } catch (error) {
    console.error("Failed to save menu items:", error);
    return { success: false, error: "Failed to save menu items" };
  }
}
