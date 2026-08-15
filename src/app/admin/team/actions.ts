"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TeamMemberFormSchema } from "@/lib/validations/sprint5";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function saveTeamMemberAction(id: string | null, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData = {
    name: formData.get("name") as string,
    slug: (formData.get("slug") as string) || generateSlug(formData.get("name") as string),
    position: formData.get("position") as string,
    bio: formData.get("bio") as string || undefined,
    photoUrl: formData.get("photoUrl") as string || undefined,
    order: formData.get("order") as string,
    isActive: formData.get("isActive") === "true",
  };

  const parsed = TeamMemberFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  // Check slug uniqueness
  const existingSlug = await prisma.teamMember.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });
  if (existingSlug && existingSlug.id !== id) {
    return { error: "Slug is already taken." };
  }

  if (id) {
    await prisma.teamMember.update({ where: { id }, data });
  } else {
    await prisma.teamMember.create({ data: { ...data, id: crypto.randomUUID() } });
  }

  revalidatePath('/', 'layout');
  revalidatePath("/admin/team");
  return { success: true };
}

export async function deleteTeamMemberAction(id: string) {
  await requireAuth(["ADMIN"]);
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath("/admin/team");
}
