import { z } from "zod";

export const PostStatusEnum = z.enum(["DRAFT", "PUBLISHED", "PENDING", "TRASH"]);

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: PostStatusEnum.default("DRAFT"),
  featuredImage: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional().default([]),
  tagIds: z.array(z.string()).optional().default([]),
  newTagNames: z.array(z.string()).optional().default([]),
});

export type PostInput = z.infer<typeof postSchema>;
