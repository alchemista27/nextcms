"use server";

import prisma from "@/lib/prisma";
import { tagSchema, TagInput } from "@/lib/validators/tag";
import { revalidatePath } from "next/cache";

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: tags };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { success: false, error: "Failed to fetch tags" };
  }
}

export async function createTag(data: TagInput) {
  try {
    const validated = tagSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const { name, slug, description } = validated.data;

    const existing = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existing) {
      return { success: false, error: "Slug already exists. Please use a different one." };
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath("/admin/tags");
    return { success: true, data: tag };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

export async function updateTag(id: string, data: TagInput) {
  try {
    const validated = tagSchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const { name, slug, description } = validated.data;

    const existing = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== id) {
      return { success: false, error: "Slug already exists" };
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath("/admin/tags");
    return { success: true, data: tag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({
      where: { id },
    });

    revalidatePath("/admin/tags");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}
