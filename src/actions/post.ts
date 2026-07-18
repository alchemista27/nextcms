"use server";

import prisma from "@/lib/prisma";
import { postSchema, PostInput } from "@/lib/validators/post";
import { revalidatePath } from "next/cache";
import { PostStatus } from "@prisma/client";

interface GetPostsParams {
  status?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export async function getPosts({ status, search, page = 1, perPage = 20 }: GetPostsParams = {}) {
  try {
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status as PostStatus;
    }
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const skip = (page - 1) * perPage;

    const [posts, total, statusCounts] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: perPage,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          categories: { select: { id: true, name: true } },
          tags: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.post.count({ where }),
      prisma.post.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const counts = {
      ALL: 0,
      DRAFT: 0,
      PUBLISHED: 0,
      PENDING: 0,
      TRASH: 0,
    } as Record<string, number>;

    for (const row of statusCounts) {
      counts[row.status] = row._count._all;
      counts.ALL += row._count._all;
    }

    return {
      success: true,
      data: posts,
      total,
      totalPages: Math.ceil(total / perPage),
      counts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        categories: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!post) return { success: false, error: "Post not found" };
    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, error: "Failed to fetch post" };
  }
}

async function upsertNewTags(newTagNames: string[]) {
  const tags = [];
  for (const name of newTagNames) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tags.push(tag);
  }
  return tags;
}

export async function createPost(data: PostInput, authorId: string) {
  try {
    const validated = postSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data: " + validated.error.issues.map(i => i.message).join(", ") };
    }

    const { title, slug, content, excerpt, status, featuredImage, metaTitle, metaDescription, ogImage, publishedAt, categoryIds, tagIds, newTagNames } = validated.data;

    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }

    // Upsert new tags
    const createdTags = newTagNames && newTagNames.length > 0
      ? await upsertNewTags(newTagNames)
      : [];

    const allTagIds = [...(tagIds || []), ...createdTags.map(t => t.id)];

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        status: status as PostStatus,
        featuredImage,
        metaTitle,
        metaDescription,
        ogImage,
        publishedAt: status === "PUBLISHED" ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        authorId,
        categories: categoryIds && categoryIds.length > 0
          ? { connect: categoryIds.map(id => ({ id })) }
          : undefined,
        tags: allTagIds.length > 0
          ? { connect: allTagIds.map(id => ({ id })) }
          : undefined,
      },
    });

    // Create initial revision
    await prisma.revision.create({
      data: {
        entityType: "post",
        entityId: post.id,
        title: post.title,
        content: post.content || "",
        authorId,
        metadata: { status: post.status },
      },
    });

    revalidatePath("/admin/posts");
    return { success: true, data: post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function updatePost(id: string, data: PostInput, authorId: string) {
  try {
    const validated = postSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: "Invalid data: " + validated.error.issues.map(i => i.message).join(", ") };
    }

    const { title, slug, content, excerpt, status, featuredImage, metaTitle, metaDescription, ogImage, publishedAt, categoryIds, tagIds, newTagNames } = validated.data;

    // Check slug uniqueness (excluding current post)
    const existing = await prisma.post.findFirst({ where: { slug, id: { not: id } } });
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }

    // Upsert new tags
    const createdTags = newTagNames && newTagNames.length > 0
      ? await upsertNewTags(newTagNames)
      : [];

    const allTagIds = [...(tagIds || []), ...createdTags.map(t => t.id)];

    // Get current post to determine if publishedAt should be set
    const currentPost = await prisma.post.findUnique({ where: { id } });

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        status: status as PostStatus,
        featuredImage,
        metaTitle,
        metaDescription,
        ogImage,
        publishedAt: status === "PUBLISHED"
          ? (currentPost?.publishedAt || (publishedAt ? new Date(publishedAt) : new Date()))
          : status === "DRAFT" || status === "PENDING"
          ? null
          : undefined,
        categories: {
          set: (categoryIds || []).map(id => ({ id })),
        },
        tags: {
          set: allTagIds.map(id => ({ id })),
        },
      },
    });

    // Create revision
    await prisma.revision.create({
      data: {
        entityType: "post",
        entityId: post.id,
        title: post.title,
        content: post.content || "",
        authorId,
        metadata: { status: post.status },
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${id}/edit`);
    return { success: true, data: post };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

export async function trashPost(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { status: "TRASH" },
    });
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to move post to trash" };
  }
}

export async function restorePost(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { status: "DRAFT" },
    });
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to restore post" };
  }
}

export async function permanentDeletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete post permanently" };
  }
}

export async function bulkAction(ids: string[], action: "publish" | "trash" | "delete") {
  try {
    if (action === "publish") {
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    } else if (action === "trash") {
      await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "TRASH" },
      });
    } else if (action === "delete") {
      await prisma.post.deleteMany({
        where: { id: { in: ids } },
      });
    }
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    console.error("Bulk action error:", error);
    return { success: false, error: "Bulk action failed" };
  }
}
