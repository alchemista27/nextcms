import { z } from "zod";

export const SettingsFormSchema = z.record(z.string(), z.string());

export const MenuFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  location: z.string().max(50).optional().nullable(),
});

export const MenuItemFormSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  url: z.string().max(500).optional().nullable(),
  target: z.enum(["_self", "_blank"]).default("_self"),
  type: z.enum(["CUSTOM", "PAGE", "POST", "CATEGORY"]).default("CUSTOM"),
  referenceId: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  menuId: z.string(),
  parentId: z.string().optional().nullable(),
});
