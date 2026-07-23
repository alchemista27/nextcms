import { z } from "zod";

export const mediaUpdateSchema = z.object({
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
});

export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;
