import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "EDITOR", "AUTHOR", "SUBSCRIBER"]),
  bio: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "EDITOR", "AUTHOR", "SUBSCRIBER"]),
  bio: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  bio: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});
