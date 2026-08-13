"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { SettingsFormSchema } from "@/lib/validations/sprint6";
import { revalidatePath } from "next/cache";

export async function saveSettingsAction(formData: FormData) {
  await requireAuth(["ADMIN"]);

  const rawData: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$ACTION")) {
      rawData[key] = value;
    }
  });

  const parsed = SettingsFormSchema.safeParse(rawData);
  if (!parsed.success) return { error: "Invalid data format." };

  const data = parsed.data;
  
  // Upsert all settings
  const promises = Object.entries(data).map(([key, value]) =>
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
