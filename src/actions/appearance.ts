"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import { appearanceSchema, type AppearanceInput } from "@/lib/validators/appearance";

export async function getAppearanceSettings() {
  try {
    const settings = await prisma.appearance.findMany();
    
    // Transform array of {key, value} to a key-value object
    const formattedSettings = settings.reduce((acc: Record<string, any>, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    return { data: formattedSettings as AppearanceInput };
  } catch (error) {
    console.error("Failed to fetch appearance settings:", error);
    return { error: "Failed to fetch appearance settings" };
  }
}

export async function updateAppearanceSettings(data: AppearanceInput) {
  try {
    await requireRole(["ADMIN", "CONTRIBUTOR"]);
    
    const validatedData = appearanceSchema.parse(data);
    
    // Convert object to array of {key, value} and upsert
    const updates = Object.entries(validatedData).map(([key, value]) => {
      return prisma.appearance.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      });
    });
    
    await prisma.$transaction(updates);
    
    revalidatePath("/");
    revalidatePath("/admin/appearance");
    
    return { success: true };
  } catch (error: any) {
    console.error("Update appearance error:", error);
    return { error: error.message || "Failed to update appearance settings" };
  }
}
