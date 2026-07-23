import { z } from "zod";

export const generalSettingsSchema = z.object({
  site_title: z.string().min(1, "Site Title is required"),
  site_tagline: z.string().optional(),
  site_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  admin_email: z.string().email("Invalid email").optional().or(z.literal("")),
  language: z.string().optional(),
  timezone: z.string().optional(),
  date_format: z.string().optional(),
  time_format: z.string().optional(),
  posts_per_page: z.string().regex(/^\d+$/, "Must be a number").optional(),
  registration_open: z.string().optional(), // "true" or "false"
  default_role: z.enum(["SUBSCRIBER", "AUTHOR", "EDITOR"]).optional(),
});
