"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TagFormSchema } from "@/lib/validations/taxonomy";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function saveTagAction(tagId: string | null, formData: FormData) {
  await requireAuth(["ADMIN", "CONTRIBUTOR"]);

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };

  const parsed = TagFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Check if slug is unique
  const existingWithSlug = await prisma.tag.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });

  if (existingWithSlug && existingWithSlug.id !== tagId) {
    return { error: "Slug is already taken." };
  }

  if (tagId) {
    // Update
    await prisma.tag.update({
      where: { id: tagId },
      data,
    });
  } else {
    // Create
    const newId = crypto.randomUUID();
    await prisma.tag.create({
      data: {
        ...data,
        id: newId,
      },
    });
  }

  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTagAction(tagId: string) {
  await requireAuth(["ADMIN"]);

  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    include: { _count: { select: { posts: true } } },
  });

  if (!tag) {
    throw new Error("Tag not found.");
  }

  if (tag._count.posts > 0) {
    throw new Error("Cannot delete tag because it is used by posts.");
  }

  await prisma.tag.delete({
    where: { id: tagId },
  });

  revalidatePath("/admin/tags");
}
