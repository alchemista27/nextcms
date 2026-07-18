"use server";

import prisma from "@/lib/prisma";
import { categorySchema, CategoryInput } from "@/lib/validators/category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function createCategory(data: CategoryInput) {
  try {
    const validated = categorySchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const { name, slug, description, parentId } = validated.data;

    // Check unique slug
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return { success: false, error: "Slug already exists. Please use a different one." };
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  try {
    const validated = categorySchema.safeParse(data);
    
    if (!validated.success) {
      return { success: false, error: "Invalid data provided" };
    }

    const { name, slug, description, parentId } = validated.data;

    // Prevent self-referential parent
    if (id === parentId) {
      return { success: false, error: "Category cannot be its own parent" };
    }

    // Check unique slug if changed
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== id) {
      return { success: false, error: "Slug already exists" };
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if it's the default uncategorized category
    const category = await prisma.category.findUnique({ where: { id } });
    if (category?.slug === "uncategorized") {
      return { success: false, error: "Cannot delete the default category" };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
