import { z } from "zod";

export const PageStatusEnum = z.enum(["DRAFT", "PUBLISHED", "TRASH"]);

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().optional(),
  status: PageStatusEnum.default("DRAFT"),
  template: z.string().default("default"),
  menuOrder: z.number().int().default(0),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  publishedAt: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

export type PageInput = z.infer<typeof pageSchema>;
