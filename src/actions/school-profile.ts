"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function getSchoolProfileSettings() {
  try {
    const row = await prisma.appearance.findUnique({
      where: { key: "theme_school_profile" },
    });
    return { data: (row?.value as any) || {} };
  } catch (error) {
    return { error: "Failed to fetch school profile settings" };
  }
}

export async function updateSchoolProfileSection(
  section: string,
  data: Record<string, any>
) {
  try {
    await requireRole(["ADMIN", "EDITOR"]);

    const current = await prisma.appearance.findUnique({
      where: { key: "theme_school_profile" },
    });
    const existing = (current?.value as any) || {};

    const updated = { ...existing, [section]: data };

    await prisma.appearance.upsert({
      where: { key: "theme_school_profile" },
      update: { value: updated },
      create: { key: "theme_school_profile", value: updated },
    });

    revalidatePath("/");
    revalidatePath("/admin/theme/school-profile");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update" };
  }
}
