import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  order: z.number().int().default(0),
});
