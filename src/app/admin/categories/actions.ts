"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { CategoryFormSchema } from "@/lib/validations/taxonomy";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function saveCategoryAction(categoryId: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]); // Only admins can manage categories

  const rawData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    parentId: (formData.get("parentId") as string) || null,
  };

  const parsed = CategoryFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Check if slug is unique
  const existingWithSlug = await prisma.category.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });

  if (existingWithSlug && existingWithSlug.id !== categoryId) {
    return { error: "Slug is already taken." };
  }

  if (categoryId) {
    // Update
    await prisma.category.update({
      where: { id: categoryId },
      data,
    });
  } else {
    // Create
    const newId = crypto.randomUUID();
    await prisma.category.create({
      data: {
        ...data,
        id: newId,
      },
    });
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAuth(["ADMIN"]);

  // We should check if there are posts or children using this category
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { posts: true } } },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (category._count.posts > 0) {
    throw new Error("Cannot delete category because it is used by posts.");
  }

  const childrenCount = await prisma.category.count({
    where: { parentId: categoryId },
  });

  if (childrenCount > 0) {
    throw new Error("Cannot delete category because it has subcategories.");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath("/admin/categories");
}
