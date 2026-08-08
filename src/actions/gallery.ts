"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { galleryImageSchema } from "@/lib/validators/gallery";

export async function getGalleryImages(category?: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  return await prisma.galleryImage.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getGalleryImageById(id: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  return await prisma.galleryImage.findUnique({
    where: { id },
  });
}

export async function createGalleryImage(data: any) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const validated = galleryImageSchema.parse(data);
    const result = await prisma.galleryImage.create({
      data: {
        title: validated.title,
        description: validated.description || null,
        url: validated.url || "",
        category: validated.category || null,
      },
    });
    revalidatePath("/admin/gallery");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create gallery image" };
  }
}

export async function updateGalleryImage(id: string, data: any) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const validated = galleryImageSchema.parse(data);
    const result = await prisma.galleryImage.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description || null,
        url: validated.url || "",
        category: validated.category || null,
      },
    });
    revalidatePath("/admin/gallery");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update gallery image" };
  }
}

export async function deleteGalleryImage(id: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete gallery image" };
  }
}
