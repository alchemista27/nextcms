"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { GalleryAlbumFormSchema, GalleryImageFormSchema } from "@/lib/validations/sprint5";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ── Album Actions ──────────────────────────────────────────

export async function saveAlbumAction(id: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    slug: (formData.get("slug") as string) || generateSlug(formData.get("name") as string),
    description: formData.get("description") as string || undefined,
    coverImage: formData.get("coverImage") as string || undefined,
    order: formData.get("order") as string,
  };

  const parsed = GalleryAlbumFormSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  const existingSlug = await prisma.galleryAlbum.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (existingSlug && existingSlug.id !== id) return { error: "Slug is already taken." };

  if (id) {
    await prisma.galleryAlbum.update({ where: { id }, data });
  } else {
    await prisma.galleryAlbum.create({ data: { ...data, id: crypto.randomUUID() } });
  }

  revalidatePath('/', 'layout');
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteAlbumAction(id: string) {
  await requireAuth(["ADMIN"]);
  await prisma.galleryAlbum.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath("/admin/gallery");
}

// ── Image Actions ──────────────────────────────────────────

export async function saveGalleryImageAction(id: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData = {
    title: formData.get("title") as string || undefined,
    description: formData.get("description") as string || undefined,
    url: formData.get("url") as string,
    albumId: formData.get("albumId") as string || null,
    order: formData.get("order") as string,
  };

  const parsed = GalleryImageFormSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  if (id) {
    await prisma.galleryImage.update({ where: { id }, data: { title: data.title, description: data.description, url: data.url, albumId: data.albumId, order: data.order } });
  } else {
    await prisma.galleryImage.create({ data: { id: crypto.randomUUID(), title: data.title, description: data.description, url: data.url, albumId: data.albumId, order: data.order } });
  }

  revalidatePath('/', 'layout');
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryImageAction(id: string) {
  await requireAuth(["ADMIN"]);
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath("/admin/gallery");
}
