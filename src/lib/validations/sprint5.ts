import { z } from "zod";

export const TeamMemberFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens").max(100),
  position: z.string().min(1, "Position is required").max(100),
  bio: z.string().max(1000).optional(),
  photoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const GalleryAlbumFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens").max(100),
  description: z.string().max(500).optional(),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
});

export const GalleryImageFormSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  url: z.string().url("Image URL is required"),
  albumId: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
});

export const TestimonialFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().max(100).optional(),
  content: z.string().min(1, "Content is required").max(1000),
  photoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
