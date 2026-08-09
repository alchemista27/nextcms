import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens").max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().optional().nullable(),
});

export const TagFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens").max(50),
});
