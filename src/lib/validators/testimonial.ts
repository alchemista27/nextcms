import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role/Position is required"),
  content: z.string().min(1, "Content is required"),
  avatarUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  isPublished: z.boolean().default(true),
});
