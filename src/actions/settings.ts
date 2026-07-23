"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function getSettings(keys: string[]) {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: keys } },
    });
    
    // Convert array of objects to key-value map
    const result = keys.reduce((acc, key) => {
      const setting = settings.find(s => s.key === key);
      acc[key] = setting ? setting.value : null;
      return acc;
    }, {} as Record<string, string | null>);
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

export async function saveSettings(data: Record<string, string>) {
  await requireRole(["ADMIN"]);
  
  try {
    await prisma.$transaction(
      Object.entries(data).map(([key, value]) => 
        prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    
    revalidatePath("/", "layout"); // Revalidate everything
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}
