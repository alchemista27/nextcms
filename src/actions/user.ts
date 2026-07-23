"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { createUserSchema, updateUserSchema, updateProfileSchema } from "@/lib/validators/user";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function getUsers(page = 1, limit = 10, search = "", role = "") {
  await requireRole(["ADMIN"]);
  
  try {
    const where: Prisma.UserWhereInput = {
      ...(search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
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
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    // Exclude passwords
    const safeUsers = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    return {
      success: true,
      data: safeUsers,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getUserById(id: string) {
  const session = await requireAuth();
  
  // Can only fetch if ADMIN or if fetching self
  if (session.user.role !== "ADMIN" && session.user.id !== id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return { success: false, error: "User not found" };
    
    const { password, ...rest } = user;
    return { success: true, data: rest };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function createUser(data: unknown) {
  await requireRole(["ADMIN"]);
  
  try {
    const validatedData = createUserSchema.parse(data);
    
    const existing = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existing) return { success: false, error: "Email already in use" };

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        bio: validatedData.bio,
        avatar: validatedData.avatar,
      }
    });

    revalidatePath("/admin/users");
    const { password, ...rest } = user;
    return { success: true, data: rest };
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return { success: false, error: error.message || "Failed to create user" };
  }
}

export async function updateUser(id: string, data: unknown) {
  const session = await requireAuth();
  
  try {
    let updateData: any = {};
    
    // If admin updating anyone
    if (session.user.role === "ADMIN") {
      const validatedData = updateUserSchema.parse(data);
      updateData = { ...validatedData };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      } else {
        delete updateData.password;
      }
    } 
    // If user updating themselves
    else if (session.user.id === id) {
      const validatedData = updateProfileSchema.parse(data);
      updateData = { ...validatedData };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      } else {
        delete updateData.password;
      }
    } 
    else {
      return { success: false, error: "Unauthorized" };
    }

    // Check email uniqueness if email changed
    if (updateData.email) {
      const existing = await prisma.user.findUnique({ where: { email: updateData.email } });
      if (existing && existing.id !== id) {
        return { success: false, error: "Email already in use" };
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/admin/users");
    if (session.user.id === id) {
      revalidatePath("/admin/profile");
    }
    
    const { password, ...rest } = user;
    return { success: true, data: rest };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  const session = await requireRole(["ADMIN"]);
  
  if (session.user.id === id) {
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
  const session = await requireRole(["ADMIN"]);
  
  if (ids.includes(session.user.id)) {
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
