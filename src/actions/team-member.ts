"use server";

import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { teamMemberSchema } from "@/lib/validators/team-member";

export async function getTeamMembers() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  return await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getTeamMemberById(id: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  return await prisma.teamMember.findUnique({
    where: { id },
  });
}

export async function createTeamMember(data: any) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const validated = teamMemberSchema.parse(data);
    const result = await prisma.teamMember.create({
      data: {
        name: validated.name,
        position: validated.position,
        bio: validated.bio || null,
        photoUrl: validated.photoUrl || null,
        order: validated.order,
      },
    });
    revalidatePath("/admin/team");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create team member" };
  }
}

export async function updateTeamMember(id: string, data: any) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    const validated = teamMemberSchema.parse(data);
    const result = await prisma.teamMember.update({
      where: { id },
      data: {
        name: validated.name,
        position: validated.position,
        bio: validated.bio || null,
        photoUrl: validated.photoUrl || null,
        order: validated.order,
      },
    });
    revalidatePath("/admin/team");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update team member" };
  }
}

export async function deleteTeamMember(id: string) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  try {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete team member" };
  }
}
