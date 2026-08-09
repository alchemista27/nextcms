"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function deleteMediaAction(mediaId: string) {
  const user = await requireAuth();

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error("Media not found.");
  }

  if (user.role !== "ADMIN" && media.uploadedById !== user.id) {
    throw new Error("Unauthorized to delete this media.");
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(media.filename);
  } catch (error) {
    console.error("Failed to delete from Cloudinary", error);
    // Proceed to delete from DB anyway if Cloudinary fails for some reason
  }

  await prisma.media.delete({
    where: { id: mediaId },
  });

  revalidatePath("/admin/media");
}

export async function updateMediaMetaAction(mediaId: string, formData: FormData) {
  const user = await requireAuth();

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error("Media not found.");
  }

  if (user.role !== "ADMIN" && media.uploadedById !== user.id) {
    throw new Error("Unauthorized to update this media.");
  }

  const alt = formData.get("alt") as string;
  const caption = formData.get("caption") as string;

  await prisma.media.update({
    where: { id: mediaId },
    data: { alt, caption },
  });

  revalidatePath("/admin/media");
}

export async function getMediaAction() {
  const user = await requireAuth();
  const whereClause = user.role === "ADMIN" ? {} : { uploadedById: user.id };
  
  return await prisma.media.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
}
