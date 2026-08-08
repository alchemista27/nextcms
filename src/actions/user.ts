"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { createUserSchema, updateUserSchema, updateProfileSchema } from "@/lib/validators/user";
import { Prisma } from "@prisma/client";

export async function getUsers(page = 1, limit = 10, search = "", role = "") {
  await requireRole(["ADMIN"]);
  
  try {
    const where: Prisma.UserWhereInput = {
      ...(search ? {
        OR: [
          { sharedUser: { full_name: { contains: search, mode: "insensitive" } } },
          { sharedUser: { email: { contains: search, mode: "insensitive" } } }
        ]
      } : {}),
      ...(role && role !== "ALL" ? { role: role as any } : {})
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { posts: true }
          },
          sharedUser: {
            select: { full_name: true, email: true }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    // Map sharedUser data to name and email for the frontend
    const mappedUsers = users.map(u => {
      const { sharedUser, ...rest } = u;
      return {
        ...rest,
        name: sharedUser?.full_name || "Unknown",
        email: sharedUser?.email || "Unknown"
      };
    });

    return {
      success: true,
      data: mappedUsers,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getUserById(id: string) {
  const currentUser = await requireAuth();
  
  // Can only fetch if ADMIN or if fetching self
  if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        sharedUser: { select: { full_name: true, email: true } }
      }
    });
    if (!user) return { success: false, error: "User not found" };
    
    const { sharedUser, ...rest } = user;
    return { success: true, data: { ...rest, name: sharedUser?.full_name || "Unknown", email: sharedUser?.email || "Unknown" } };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function createUser(data: unknown) {
  await requireRole(["ADMIN"]);
  
  try {
    const validatedData = createUserSchema.parse(data);
    
    const shared = await prisma.sharedUser.findUnique({ where: { email: validatedData.email } });
    if (!shared) return { success: false, error: "User must be registered in SIM first" };

    const existing = await prisma.user.findUnique({ where: { id: shared.id } });
    if (existing) return { success: false, error: "User already has a CMS role" };

    // In this pivot, users should already exist in Supabase Auth,
    // so creating a user here might just mean assigning a role to an existing auth user
    // if we know their ID. For now we will just create the profile if needed.
    const user = await prisma.user.create({
      data: {
        id: shared.id,
        role: validatedData.role,
        bio: validatedData.bio,
        avatar: validatedData.avatar,
      }
    });

    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return { success: false, error: error.message || "Failed to create user" };
  }
}

export async function updateUser(id: string, data: unknown) {
  const currentUser = await requireAuth();
  
  try {
    let updateData: any = {};
    
    // If admin updating anyone
    if (currentUser.role === "ADMIN") {
      const validatedData = updateUserSchema.parse(data);
      updateData = { ...validatedData };
      delete updateData.password;
    } 
    // If user updating themselves
    else if (currentUser.id === id) {
      const validatedData = updateProfileSchema.parse(data);
      updateData = { ...validatedData };
      delete updateData.password;
    } 
    else {
      return { success: false, error: "Unauthorized" };
    }

    // Name and email are managed by SIM, so we ignore them in CMS update
    delete updateData.name;
    delete updateData.email;

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/admin/users");
    if (currentUser.id === id) {
      revalidatePath("/admin/profile");
    }
    
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  const currentUser = await requireRole(["ADMIN"]);
  
  if (currentUser.id === id) {
    return { success: false, error: "Cannot delete your own account" };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function bulkActionUsers(ids: string[], action: string, value?: string) {
  const currentUser = await requireRole(["ADMIN"]);
  
  if (ids.includes(currentUser.id)) {
    return { success: false, error: "Cannot perform bulk actions on your own account" };
  }

  try {
    if (action === "delete") {
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    } else if (action === "changeRole" && value) {
      await prisma.user.updateMany({
        where: { id: { in: ids } },
        data: { role: value as any }
      });
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed bulk action:", error);
    return { success: false, error: "Failed to perform bulk action" };
  }
}
