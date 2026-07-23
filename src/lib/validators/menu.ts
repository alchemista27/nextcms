import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string().min(1, "Menu name is required"),
  location: z.string().nullable().optional(),
});

export const updateMenuSchema = createMenuSchema;

export const menuItemSchema = z.object({
  id: z.string().optional(),
  menuId: z.string(),
  parentId: z.string().nullable().optional(),
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  type: z.string(),
  referenceId: z.string().nullable().optional(),
  target: z.string().nullable().optional(),
  cssClass: z.string().nullable().optional(),
  order: z.number().int(),
});

export const saveMenuItemsSchema = z.object({
  menuId: z.string(),
  items: z.array(menuItemSchema),
});
