"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { PostFormSchema } from "@/lib/validations/post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePostAction(postId: string) {
  await requireAuth();

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/admin/posts");
}

export async function savePostAction(postId: string | null, formData: FormData) {
  const user = await requireAuth();

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    status: formData.get("status") as any,
    featuredImage: formData.get("featuredImage") as string,
    metaTitle: formData.get("metaTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    ogImage: formData.get("ogImage") as string,
  };

  const parsed = PostFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Additional check if slug is unique
  const existingWithSlug = await prisma.post.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });

  if (existingWithSlug && existingWithSlug.id !== postId) {
    return { error: "Slug is already taken." };
  }

  const postData = {
    title: data.title,
    slug: data.slug,
    content: data.content || null,
    excerpt: data.excerpt || null,
    status: data.status,
    featuredImage: data.featuredImage || null,
    metaTitle: data.metaTitle || null,
    metaDescription: data.metaDescription || null,
    ogImage: data.ogImage || null,
    publishedAt: data.status === "PUBLISHED" ? new Date() : null,
  };

  if (postId) {
    // Update
    await prisma.post.update({
      where: { id: postId },
      data: postData,
    });
  } else {
    // Create
    const newId = crypto.randomUUID();
    await prisma.post.create({
      data: {
        ...postData,
        id: newId,
        authorId: user.id,
      },
    });
  }

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
