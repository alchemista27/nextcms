import { z } from "zod";
import type { PostStatus } from "@prisma/client";

export const PostFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens").max(255),
  content: z.string().optional(),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "PENDING", "TRASH"] as const),
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(255).optional(),
  ogImage: z.string().optional(),
  // For categories and tags, we expect comma-separated strings or arrays of IDs
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});
