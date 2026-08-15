"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { SettingsFormSchema } from "@/lib/validations/sprint6";
import { revalidatePath } from "next/cache";

export async function saveSettingsAction(data: Record<string, string>) {
  await requireAuth(["ADMIN"]);

  const parsed = SettingsFormSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid data format." };

  const validData = parsed.data;
  
  // Upsert all settings
  const promises = Object.entries(validData).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );

  await Promise.all(promises);

  revalidatePath("/", "layout");
  return { success: true };
}
