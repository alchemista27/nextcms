"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteFileFromDisk } from "@/lib/upload";
import { MediaUpdateInput, mediaUpdateSchema } from "@/lib/validators/media";

export async function getMedia(page = 1, perPage = 20, search = "") {
  try {
    const skip = (page - 1) * perPage;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: "insensitive" } },
        { alt: { contains: search, mode: "insensitive" } },
      ];
    }
    
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: perPage,
        include: {
          uploadedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.media.count({ where }),
    ]);
    
    return {
      success: true,
      data: media,
      total,
      totalPages: Math.ceil(total / perPage),
    };
  } catch (error) {
    console.error("Error fetching media:", error);
    return { success: false, error: "Failed to fetch media" };
  }
}

export async function updateMedia(id: string, data: MediaUpdateInput) {
  try {
    const validated = mediaUpdateSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data" };
    }
    
    const media = await prisma.media.update({
      where: { id },
      data: validated.data,
    });
    
    revalidatePath("/admin/media");
    return { success: true, data: media };
  } catch (error) {
    console.error("Error updating media:", error);
    return { success: false, error: "Failed to update media" };
  }
}

export async function deleteMedia(id: string) {
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { success: false, error: "Media not found" };
    }
    
    await deleteFileFromDisk(media.url);
    
    await prisma.media.delete({ where: { id } });
    
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Error deleting media:", error);
    return { success: false, error: "Failed to delete media" };
  }
}
