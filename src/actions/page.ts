"use server";

import prisma from "@/lib/prisma";
import { pageSchema, PageInput } from "@/lib/validators/page";
import { revalidatePath } from "next/cache";
import { PageStatus } from "@prisma/client";

interface GetPagesParams {
  status?: string;
  search?: string;
}

export async function getPages({ status, search }: GetPagesParams = {}) {
  try {
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as PageStatus;
    }
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [pages, statusCounts] = await Promise.all([
      prisma.page.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          parent: { select: { id: true, title: true } },
        },
        orderBy: [{ menuOrder: "asc" }, { title: "asc" }],
      }),
      prisma.page.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const counts = {
      ALL: 0,
      DRAFT: 0,
      PUBLISHED: 0,
      TRASH: 0,
    } as Record<string, number>;

    for (const row of statusCounts) {
      counts[row.status] = row._count._all;
      counts.ALL += row._count._all;
    }

    return {
      success: true,
      data: pages,
      counts,
    };
  } catch (error) {
    console.error("Error fetching pages:", error);
    return { success: false, error: "Failed to fetch pages" };
  }
}

export async function getPageById(id: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (!page) return { success: false, error: "Page not found" };
    return { success: true, data: page };
  } catch (error) {
    console.error("Error fetching page:", error);
    return { success: false, error: "Failed to fetch page" };
  }
}

export async function createPage(data: PageInput, authorId: string) {
  try {
    const validated = pageSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data: " + validated.error.issues.map(i => i.message).join(", ") };
    }

    const { title, slug, content, status, template, menuOrder, metaTitle, metaDescription, ogImage, publishedAt, parentId } = validated.data;

    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        status: status as PageStatus,
        template,
        menuOrder,
        metaTitle,
        metaDescription,
        ogImage,
        publishedAt: status === "PUBLISHED" ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        authorId,
        parentId: parentId || null,
      },
    });

    await prisma.revision.create({
      data: {
        entityType: "page",
        entityId: page.id,
        title: page.title,
        content: page.content || "",
        authorId,
        metadata: { status: page.status },
      },
    });

    revalidatePath("/admin/pages");
    return { success: true, data: page };
  } catch (error) {
    console.error("Error creating page:", error);
    return { success: false, error: "Failed to create page" };
  }
}

export async function updatePage(id: string, data: PageInput, authorId: string) {
  try {
    const validated = pageSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data: " + validated.error.issues.map(i => i.message).join(", ") };
    }

    const { title, slug, content, status, template, menuOrder, metaTitle, metaDescription, ogImage, publishedAt, parentId } = validated.data;

    const existing = await prisma.page.findFirst({ where: { slug, id: { not: id } } });
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }
    
    if (parentId === id) {
       return { success: false, error: "A page cannot be its own parent" };
    }

    const currentPage = await prisma.page.findUnique({ where: { id } });

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        status: status as PageStatus,
        template,
        menuOrder,
        metaTitle,
        metaDescription,
        ogImage,
        publishedAt: status === "PUBLISHED"
          ? (currentPage?.publishedAt || (publishedAt ? new Date(publishedAt) : new Date()))
          : status === "DRAFT"
          ? null
          : undefined,
        parentId: parentId || null,
      },
    });

    await prisma.revision.create({
      data: {
        entityType: "page",
        entityId: page.id,
        title: page.title,
        content: page.content || "",
        authorId,
        metadata: { status: page.status },
      },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${id}/edit`);
    return { success: true, data: page };
  } catch (error) {
    console.error("Error updating page:", error);
    return { success: false, error: "Failed to update page" };
  }
}

export async function bulkAction(ids: string[], action: "publish" | "trash" | "delete") {
  try {
    if (action === "publish") {
      await prisma.page.updateMany({
        where: { id: { in: ids } },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    } else if (action === "trash") {
      await prisma.page.updateMany({
        where: { id: { in: ids } },
        data: { status: "TRASH" },
      });
    } else if (action === "delete") {
      await prisma.page.deleteMany({
        where: { id: { in: ids } },
      });
    }
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (error) {
    console.error("Bulk action error:", error);
    return { success: false, error: "Bulk action failed" };
  }
}
