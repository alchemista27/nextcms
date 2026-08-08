import { z } from "zod";

export const galleryImageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  url: z.string().url("Must be a valid image URL").or(z.literal("")),
  category: z.string().optional().nullable(),
});
